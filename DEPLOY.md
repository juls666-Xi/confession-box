# 🚀 Deploy Confession Box Backend to Render

## Quick Start (5 minutes)

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Account

1. Go to **[https://render.com](https://render.com)**
2. Click **Get Started for Free**
3. Sign in with **GitHub** (recommended) or email

### Step 3: Create Web Service

1. Click **New +** → **Web Service**
2. Click **Connect a repository**
3. Find and select `juls666/confession-box`
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `confession-box-api` |
| **Region** | Choose closest to you (e.g., Oregon, Frankfurt) |
| **Branch** | `main` |
| **Root Directory** | _(leave blank)_ |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | **Free** |

### Step 4: Add Environment Variables

In the Render dashboard, click **Environment** tab → **Add Environment Variable**:

```
Key: MONGODB_URI
Value: mongodb+srv://sfxcsjuliusjordan_db_user:QHzaNUeln5TI54Ew@cluster0.ij7otch.mongodb.net/confession-box?retryWrites=true&w=majority
```

```
Key: NODE_ENV
Value: production
```

### Step 5: Configure MongoDB Atlas

1. Go to **[MongoDB Atlas](https://cloud.mongodb.com/)**
2. Log in to your account
3. Click **Network Access** (left sidebar)
4. Click **+ ADD IP ADDRESS**
5. Select **Allow Access from Anywhere** or enter `0.0.0.0/0`
6. Click **Confirm**

⚠️ **Wait 1-2 minutes** for the whitelist to apply.

### Step 6: Deploy!

1. Click **Create Web Service** at the bottom
2. Render will build and deploy (~2-5 minutes)
3. Once deployed, copy your URL (e.g., `https://confession-box-api-xyz.onrender.com`)

### Step 7: Test Your API

```bash
# Replace YOUR-URL with your actual Render URL
curl https://YOUR-URL.onrender.com/api/health
curl https://YOUR-URL.onrender.com/api/confessions
```

You should see:
```json
{"status":"OK","timestamp":"2026-03-29T..."}
```

---

## Update Frontend to Use Backend

### Option A: Quick Update (Edit in GitHub)

1. Go to your GitHub repo: `https://github.com/juls666/confession-box`
2. Click `index.html`
3. Click the **pencil icon** (edit)
4. Find line ~1028:
   ```javascript
   const API_URL = ''; // Leave empty for same-origin...
   ```
5. Change to:
   ```javascript
   const API_URL = 'https://confession-box-api-xyz.onrender.com';
   ```
6. Scroll down → **Commit changes**

### Option B: Local Update

```bash
# In index.html, find and replace:
# Change this line (~1028):
const API_URL = '';

# To your Render URL:
const API_URL = 'https://confession-box-api-xyz.onrender.com';

# Then commit and push:
git add .
git commit -m "Update API URL for production"
git push origin main
```

---

## Verify Everything Works

1. **GitHub Pages**: https://juls666-xi.github.io/confession-box/
2. **Backend API**: https://confession-box-api-xyz.onrender.com/api/health
3. **Test**: Post a confession on the frontend → should appear in the database

---

## Troubleshooting

### "Cannot connect to MongoDB"
- Make sure you added `0.0.0.0/0` to MongoDB Atlas Network Access
- Wait 1-2 minutes after adding the IP whitelist

### "API returns 404"
- Check that your Render service is running (not suspended)
- Free tier services sleep after 15 minutes of inactivity (first request wakes it up)

### "Confessions not appearing"
- Open browser console (F12)
- Check for CORS or network errors
- Verify `API_URL` is set correctly in `index.html`

---

## Useful Links

- **Render Dashboard**: https://dashboard.render.com/
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **GitHub Pages**: https://juls666-xi.github.io/confession-box/

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| **Render** | 750 hours/month, sleeps after 15 min idle |
| **MongoDB Atlas** | 512 MB storage, shared RAM |

For a small confession app, this should be sufficient! 🎉
