# Frontend Update Instructions

After deploying your backend to Render/Railway, update `index.html`:

## Find and Replace

1. Open `index.html`
2. Find this line (around line 760):
```javascript
const API_URL = window.location.origin; // For production, change to your backend URL
```

3. Replace with your Render URL:
```javascript
const API_URL = 'https://confession-box-api-xyz.onrender.com'; // Your Render backend URL
```

## Then Update All Fetch Calls

Replace all fetch calls to use `API_URL`:

### Find:
```javascript
fetch('/api/confessions', {
```

### Replace with:
```javascript
fetch(`${API_URL}/api/confessions`, {
```

---

## Quick Update Script

Run this to automatically update all API endpoints:

```bash
# After getting your Render URL
sed -i "s|const API_URL = window.location.origin|const API_URL = 'https://YOUR-RENDER-URL.onrender.com'|g" index.html
```

Then update the fetch calls:

```bash
sed -i "s|fetch('/api|fetch(\`\${API_URL}/api|g" index.html
```

---

## Verify

After updating:
1. Commit changes
2. Push to GitHub
3. GitHub Pages will auto-update
4. Test the live site
