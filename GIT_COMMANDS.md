# Quick Git Commands for Deployment

## Windows PowerShell Commands

### 1️⃣ Navigate to your project
```powershell
cd C:\Users\Bad\Desktop\post
```

### 2️⃣ Initialize Git (one time only)
```powershell
git init
```

### 3️⃣ Add all files to Git
```powershell
git add .
```

### 4️⃣ Create first commit
```powershell
git commit -m "Initial commit: Ghana Post application"
```

### 5️⃣ Create GitHub Repository
- Go to https://github.com/new
- Enter Repository name (e.g., `ghana-post`)
- Click "Create repository"
- DO NOT initialize with README, .gitignore, or license
- Click "Create repository"

### 6️⃣ Add remote and push (copy from GitHub - it shows you exactly this)
```powershell
git remote add origin https://github.com/YOUR_USERNAME/ghana-post.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## What Happens After `git push`

✅ Your code appears on GitHub
✅ You can now deploy from GitHub to Render
✅ You can now deploy from GitHub to Vercel

---

## Troubleshooting Git Commands

### If you get "fatal: not a git repository"
```powershell
git init
```

### If you need to check git status
```powershell
git status
```

### If you need to see commit history
```powershell
git log
```

### If you need to update code after deployment
```powershell
git add .
git commit -m "Update message"
git push
```

---

## Next: Deploy on Render & Vercel

After pushing to GitHub, follow the deployment guides:
1. **Backend**: See `DEPLOYMENT_GUIDE.md` (Render deployment)
2. **Frontend**: See `DEPLOYMENT_GUIDE.md` (Vercel deployment)

Both platforms will automatically detect your GitHub repo and deploy it!
