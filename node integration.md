
# Backend Integration Guide: Serving Vista Explorer Portal from Node.js

## Overview
This guide explains how to integrate the React-based Vista Explorer Portal into your Node.js backend server so that visiting `http://localhost:5000/` serves the web portal directly.

## Prerequisites
- Node.js backend server running on port 5000
- React portal built and ready for production
- Basic knowledge of Express.js (assumed backend framework)

## Step-by-Step Integration

### Step 1: Build the React Portal for Production

First, you need to build the React application for production deployment:

```bash
# In your portal project directory (where package.json is located)
npm run build
# or if using yarn
yarn build
```

This creates a `dist/` folder with optimized production files.

### Step 2: Copy Built Files to Your Node.js Project

```bash
# Create a public directory in your Node.js project root
mkdir public

# Copy the entire dist folder contents to your Node.js public directory
cp -r /path/to/portal/dist/* /path/to/your/nodejs/project/public/
```

### Step 3: Configure Express.js to Serve Static Files

In your main Node.js server file (usually `app.js`, `server.js`, or `index.js`):

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Your existing API routes
app.use('/api', require('./routes/api')); // Adjust path as needed

// Serve the React app for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Step 4: Update API Base URL in Portal

Since the portal will now be served from the same domain, update the API configuration:

```javascript
// In your portal's src/services/api.ts (before building)
const BASE_URL = '/api'; // Change from ngrok URL to relative path

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Remove ngrok-skip-browser-warning header
  },
});
```

### Step 5: Rebuild and Redeploy

After updating the API configuration:

```bash
# Rebuild the portal
npm run build

# Copy updated files to Node.js public directory
cp -r /path/to/portal/dist/* /path/to/your/nodejs/project/public/
```

### Step 6: Directory Structure

Your Node.js project should look like this:

```
your-nodejs-project/
├── public/
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   ├── index-[hash].css
│   │   └── [other-assets]
│   └── [other-static-files]
├── routes/
│   └── api.js (your API routes)
├── server.js (or app.js)
└── package.json
```

### Step 7: Test the Integration

1. Start your Node.js server:
```bash
node server.js
# or
npm start
```

2. Visit `http://localhost:5000/` in your browser
3. The Vista Explorer Portal should load
4. Navigate through different sections (/categories, /pois, /events) to ensure routing works
5. Test CRUD operations to verify API connectivity

## Alternative Method: Using Express.static with Additional Configuration

If you need more control over static file serving:

```javascript
const express = require('express');
const path = require('path');
const app = express();

// Configure static file serving with options
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d', // Cache static files for 1 day
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// API routes
app.use('/api', require('./routes/api'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

## Troubleshooting

### Issue: 404 errors for portal routes
**Solution**: Ensure the SPA fallback (`app.get('*', ...)`) is placed AFTER all API routes.

### Issue: API calls failing
**Solution**: Verify that:
- API routes are correctly prefixed with `/api`
- CORS is configured if needed
- API base URL in portal is set to `/api`

### Issue: Static files not loading
**Solution**: Check that:
- Files are correctly copied to the public directory
- File paths in index.html match the actual file locations
- Express static middleware is configured correctly

### Issue: Portal shows but functionality doesn't work
**Solution**: 
- Check browser console for JavaScript errors
- Verify API endpoints are responding correctly
- Ensure all required dependencies are included in the build

## Production Considerations

1. **Environment Variables**: Set up proper environment configuration
2. **Security**: Add security middleware (helmet, cors, etc.)
3. **Logging**: Implement proper logging for both API and static file requests
4. **Error Handling**: Add proper error handling for production
5. **Process Management**: Use PM2 or similar for process management

## Automated Build Script (Optional)

Create a script to automate the build and copy process:

```javascript
// scripts/deploy-portal.js
const fs = require('fs-extra');
const { execSync } = require('child_process');
const path = require('path');

const PORTAL_PATH = '/path/to/your/portal';
const PUBLIC_PATH = path.join(__dirname, '..', 'public');

async function deployPortal() {
  try {
    // Build the portal
    console.log('Building portal...');
    execSync('npm run build', { cwd: PORTAL_PATH, stdio: 'inherit' });
    
    // Clear existing public directory
    console.log('Clearing public directory...');
    await fs.emptyDir(PUBLIC_PATH);
    
    // Copy built files
    console.log('Copying files...');
    await fs.copy(path.join(PORTAL_PATH, 'dist'), PUBLIC_PATH);
    
    console.log('Portal deployed successfully!');
  } catch (error) {
    console.error('Deployment failed:', error);
  }
}

deployPortal();
```

Run with: `node scripts/deploy-portal.js`
