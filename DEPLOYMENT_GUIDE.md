# Ghana Post Application - Deployment Guide

## Overview
This guide walks you through deploying the Ghana Post application to production with:
- **Backend API**: Render.com (Node.js + SQLite)
- **Frontend**: Vercel (React)

## Part 1: Prepare for Deployment

### Backend Preparation
1. Backend is already configured with environment variables
2. SQLite database (submissions.db) is included
3. All dependencies are listed in `server/package.json`

### Frontend Preparation
1. Frontend is a React app with all dependencies in `client/package.json`
2. Proxy is configured to connect to backend API

---

## Part 2: Deploy Backend to Render

### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Click "Sign Up" (use GitHub for easy deployment)
3. Verify email

### Step 2: Create Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository or paste Git URL
3. Configure:
   - **Name**: `ghana-post-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (0.5 CPU, 512 MB RAM - sufficient for testing)

### Step 3: Add Environment Variables
In Render dashboard, go to **Environment**:
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secure-random-key-here-min-32-chars
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
```

### Step 4: Deploy
- Click "Deploy"
- Wait for build to complete (2-3 minutes)
- Note the URL (e.g., `https://ghana-post-api.onrender.com`)

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Select your GitHub repository
3. Configure:
   - **Framework**: React
   - **Root Directory**: `./client`

### Step 3: Environment Variables
Before deploying, add environment variable in Vercel:
- **Variable Name**: `REACT_APP_API_URL`
- **Value**: `https://your-deployed-backend.onrender.com` (from Step 2.4)

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment (1-2 minutes)
3. Your site is live! (e.g., `https://ghana-post.vercel.app`)

---

## Part 4: Update Frontend to Use Production Backend

If you want to update your local code to use the production backend:

### Update `client/package.json`
Change the proxy line to your production backend:
```json
"proxy": "https://your-deployed-backend.onrender.com"
```

OR directly update `client/src/utils/api.js` to use environment variable:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

---

## Part 5: Custom Domain (Optional)

### For Vercel Frontend:
1. Go to Vercel Project Settings → Domains
2. Add your domain name
3. Follow DNS configuration instructions

### For Render Backend:
1. Go to Render Service Settings → Custom Domain
2. Add domain and follow DNS setup

---

## Part 6: Database Considerations

### Current Setup (SQLite - Free Tier):
- SQLite database stored locally on Render
- **Limitation**: Data resets when service spins down on free tier
- **Solution for Production**: Upgrade to paid Render plan or switch to PostgreSQL

### To Use PostgreSQL (Recommended for Production):
1. In Render, create a PostgreSQL database
2. Update `server.js` to use PostgreSQL instead of SQLite
3. Add database connection string to environment variables

---

## Part 7: Testing Your Deployment

### Test Backend API:
```
GET: https://your-backend.onrender.com/api/submissions
(Will return 401 without auth token - this is correct)
```

### Test Frontend:
1. Visit your Vercel frontend URL
2. Fill out the form
3. Verify data appears in admin dashboard

### Test Admin Login:
1. Navigate to `/admin/login`
2. Login with configured admin credentials
3. View submissions

---

## Part 8: Security Checklist

- [ ] Change JWT_SECRET to a random 32+ character string
- [ ] Change ADMIN_PASSWORD to a strong password
- [ ] Enable HTTPS (Render and Vercel do this automatically)
- [ ] Add rate limiting to API
- [ ] Set CORS properly for your frontend domain
- [ ] Use environment variables for all secrets
- [ ] Review database backup strategy

---

## Troubleshooting

### Backend won't start:
- Check Render logs: Dashboard → Service → Logs
- Verify environment variables are set
- Ensure all dependencies are in package.json

### Frontend can't reach backend:
- Check REACT_APP_API_URL in Vercel
- Verify CORS is enabled in server.js
- Check browser console for network errors

### Database issues:
- SQLite works on free tier but data may reset
- For persistent data, upgrade to Paid Render plan

---

## Quick Reference

| Component | Platform | Free? | URL Pattern |
|-----------|----------|-------|------------|
| Backend | Render | Yes | `*.onrender.com` |
| Frontend | Vercel | Yes | `*.vercel.app` |
| Database | SQLite (Included) | Yes | Local on Render |
| Domain | Custom | No | `yourdom.com` |

---

## Next Steps

1. Create Render account at render.com
2. Create Vercel account at vercel.com
3. Follow steps 2-4 above
4. Test your deployed application
5. Add custom domain if desired
6. Monitor logs for errors

Good luck! 🚀
