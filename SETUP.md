# Ghana Post Application - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install All Dependencies

Open PowerShell/Command Prompt in the `post` directory and run:

```powershell
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

Or use the convenience script:
```powershell
npm run install-all
```

### Step 2: Start the Backend Server

In one terminal window, navigate to the `server` folder:

```powershell
cd server
npm start
```

You should see: `Server is running on port 5000`

### Step 3: Start the Frontend Application

In another terminal window, navigate to the `client` folder:

```powershell
cd client
npm start
```

The React app will automatically open at `http://localhost:3000`

### Step 4: Test the Application

#### User Flow:
1. Start at the delivery status page
2. Click "Continue to Update Address"
3. Fill in the form with test data:
   - Name: John Mensah
   - Phone: +233 500 123 456
   - Email: john@example.com
   - Address: 123 Main Street
   - City: Accra
   - Region: Greater Accra
   - Postal Code: GA-001-1234
4. Click "Update Now"
5. Fill in payment details:
   - Cardholder: John Mensah
   - Card: 4111111111111111 (test card)
   - Expiry: 12/25
   - CVV: 123
6. Click "Submit Payment"
7. See success message

#### Admin Dashboard:
1. Click "Admin" in the top right
2. Login with:
   - Username: `admin`
   - Password: `ghanapost2024`
3. View all submissions
4. Search/filter submissions
5. Click "View" to see details
6. Export to CSV
7. Update status
8. Delete submissions

## 📁 File Structure

```
post/
├── client/                 # React App
│   ├── src/
│   │   ├── components/     # Navbar, StepIndicator
│   │   ├── pages/          # All 3-step pages + Admin
│   │   ├── styles/         # Ghana Post CSS theme
│   │   ├── utils/          # API and validation functions
│   │   └── App.js          # Main App
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── server/                 # Node.js/Express Backend
│   ├── server.js           # All API endpoints
│   ├── submissions.db      # SQLite database (auto-created)
│   ├── .env                # Environment config
│   └── package.json
│
├── README.md               # Full documentation
├── SETUP.md               # This file
└── package.json           # Root package.json
```

## 🔗 Useful URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin

## 🧪 Test Credentials

- Admin Username: `admin`
- Admin Password: `ghanapost2024`

## 🎨 Ghana Post Branding

- Primary Color: #C40E2E (Ghana Red)
- Secondary Color: #FFFFFF (White)
- Accent: #DAA520 (Gold)

## 🔄 Running Both Servers Together

If you have `concurrently` installed, you can run:

```powershell
npm run dev
```

This will start both backend and frontend in one terminal.

## 🛠 Troubleshooting

### Port 5000 Already in Use
- Change `PORT` in `server/.env` to another port (e.g., 5001)
- Update `REACT_APP_API_URL` in `client/.env` accordingly

### Port 3000 Already in Use
- The React app will ask to use another port

### Database Issues
- Delete `server/submissions.db` to reset
- It will be recreated on next server start

### CORS Errors
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `client/.env`

### Dependencies Not Installing
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## 📊 API Endpoints Reference

### Public
- `POST /api/submissions` - Submit form

### Admin (Requires JWT Token)
- `POST /api/admin/login` - Get auth token
- `GET /api/submissions` - All submissions
- `GET /api/submissions/search` - Search submissions
- `GET /api/submissions/:id` - Single submission
- `PATCH /api/submissions/:id/status` - Update status
- `DELETE /api/submissions/:id` - Delete
- `GET /api/submissions/export/csv` - Download CSV

## ✨ Features Implemented

✅ 3-Step User Flow
✅ Professional Ghana Post Design
✅ Responsive Mobile-Friendly Interface
✅ Form Validation (Address & Payment)
✅ Card Number Validation (Luhn Algorithm)
✅ SQLite Database
✅ JWT Authentication
✅ Admin Dashboard
✅ Search & Filter Submissions
✅ Export to CSV
✅ Status Management
✅ IP & User Agent Logging
✅ Environment Variables
✅ CORS Enabled
✅ Complete Documentation

## 🎯 Next Steps

1. Modify admin password in `server/.env`
2. Change JWT secret for production
3. Add HTTPS in production
4. Deploy to a hosting service (Heroku, Vercel, etc.)
5. Use PostgreSQL instead of SQLite for production
6. Add proper error handling and logging
7. Implement email notifications
8. Add rate limiting for security

## 📝 Notes

- Test card numbers work with any future expiry date
- CVV validation accepts 3-4 digits
- All submissions are stored in the SQLite database
- Admin can view, edit, and delete submissions
- CSV export includes all submission data
- Session expires after 24 hours

Enjoy using Ghana Post Application! 🎉
