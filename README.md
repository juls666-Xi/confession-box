# SafeSpace Confessions - Deployment Guide

## Backend Deployment to Render (Free)

### Step 1: Create Render Account
1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub (recommended) or email

### Step 2: Create a New Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository (`juls666/confession-box`)
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `confession-box-api` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | (leave blank) |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | `Free` |

### Step 3: Add Environment Variables
In Render dashboard, go to **Environment** tab and add:

```
MONGODB_URI=mongodb+srv://sfxcsjuliusjordan_db_user:QHzaNUeln5TI54Ew@cluster0.ij7otch.mongodb.net/confession-box?retryWrites=true&w=majority
PORT=3000
NODE_ENV=production
```

### Step 4: Deploy
1. Click **Create Web Service**
2. Wait for deployment (~2-5 minutes)
3. Copy your service URL (e.g., `https://confession-box-api-xyz.onrender.com`)

### Step 5: Update Frontend
Update `index.html` with your Render backend URL (see `FRONTEND_UPDATE.md`)

### Step 6: MongoDB Atlas Whitelist
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. **Network Access** → **Add IP Address**
3. Add `0.0.0.0/0` (Allow from anywhere)
4. Confirm

---

## Alternative: Deploy to Railway

### Step 1: Create Railway Account
1. Go to [https://railway.app](https://railway.app)
2. Sign in with GitHub

### Step 2: Deploy
1. Click **New Project** → **Deploy from GitHub repo**
2. Select `juls666/confession-box`
3. Add environment variable `MONGODB_URI` in Railway dashboard
4. Railway auto-detects and deploys Node.js apps

---

## Testing

After deployment, test your API:
```bash
curl https://your-render-url.onrender.com/api/health
curl https://your-render-url.onrender.com/api/confessions
```
