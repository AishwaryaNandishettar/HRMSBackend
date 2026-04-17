# HRMS Application Deployment Fix

## Issue Identified
The `.env` file was placed in `HRMS-Frontend/src/.env` instead of `HRMS-Frontend/.env`. Vite only reads environment variables from the root `.env` file, not from the `src` folder.

## What Was Fixed
1. ✅ Moved environment variables to correct location: `HRMS-Frontend/.env`
2. ✅ Removed incorrect file: `HRMS-Frontend/src/.env`
3. ✅ Updated `VITE_API_BASE_URL` to: `https://trowel-eldercare-scouting.ngrok-free.dev`

## Current Configuration

### Frontend (.env)
```env
VITE_API_BASE_URL=https://trowel-eldercare-scouting.ngrok-free.dev
VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
```

### Backend CORS (Already Configured)
- ✅ Allows `https://*.vercel.app`
- ✅ Allows `https://*.ngrok-free.dev`
- ✅ Allows `https://*.ngrok.io`

## Steps to Redeploy on Vercel

### Option 1: Automatic Deployment (Recommended)
1. **Commit and push the changes:**
   ```bash
   cd HRMS-Frontend
   git add .env
   git add -u  # This stages the deleted src/.env file
   git commit -m "Fix: Move .env to correct location for Vite"
   git push origin main
   ```

2. **Vercel will automatically detect the push and redeploy**
   - Go to https://vercel.com/dashboard
   - Check your project's deployments
   - Wait for the build to complete (usually 1-2 minutes)

### Option 2: Manual Deployment via Vercel CLI
1. **Install Vercel CLI (if not already installed):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from the frontend directory:**
   ```bash
   cd HRMS-Frontend
   vercel --prod
   ```

### Option 3: Redeploy from Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your HRMS project
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Click "Redeploy" button
6. Select "Use existing Build Cache" or "Redeploy from scratch"

## Important: Environment Variables on Vercel

**You MUST also set environment variables in Vercel Dashboard:**

1. Go to your project on Vercel
2. Click "Settings" → "Environment Variables"
3. Add these variables:
   - `VITE_API_BASE_URL` = `https://trowel-eldercare-scouting.ngrok-free.dev`
   - `VITE_TURN_USERNAME` = `51e40078dfabc57d54164c2f`
   - `VITE_TURN_CREDENTIAL` = `KJnavaquyonnUlkx`
4. Click "Save"
5. **Redeploy** the application for changes to take effect

## Verification Steps

After deployment:

1. **Open your Vercel app URL**
2. **Open Browser DevTools (F12)**
3. **Go to Console tab**
4. **Try to login**
5. **Check Network tab** for API calls:
   - Should see requests to `https://trowel-eldercare-scouting.ngrok-free.dev`
   - Check if requests are successful (200 status)
   - If you see CORS errors, check backend CORS configuration

## Troubleshooting

### If login still doesn't work:

1. **Check Browser Console for errors:**
   - Press F12 → Console tab
   - Look for error messages

2. **Check Network tab:**
   - Press F12 → Network tab
   - Try to login
   - Look for failed requests (red color)
   - Click on failed request to see error details

3. **Verify Backend is Running:**
   - Open: `https://trowel-eldercare-scouting.ngrok-free.dev/api/auth/login`
   - Should see some response (not 404)

4. **Check CORS Headers:**
   - In Network tab, click on a failed request
   - Check "Response Headers"
   - Should see `Access-Control-Allow-Origin` header

5. **Verify Environment Variables:**
   - In your deployed app, open console and type:
     ```javascript
     console.log(import.meta.env.VITE_API_BASE_URL)
     ```
   - Should print: `https://trowel-eldercare-scouting.ngrok-free.dev`

### Common Issues:

1. **"Cannot read properties of undefined"**
   - Environment variables not set in Vercel
   - Solution: Add them in Vercel Dashboard → Settings → Environment Variables

2. **CORS Error**
   - Backend not allowing your Vercel domain
   - Solution: Already configured to allow `*.vercel.app`

3. **404 Not Found**
   - Wrong API URL
   - Solution: Verify `VITE_API_BASE_URL` is correct

4. **ngrok URL expired**
   - Free ngrok URLs expire after some time
   - Solution: Get a new ngrok URL or use ngrok paid plan for static URLs

## Backend Deployment (If Needed)

If your backend is not deployed yet:

1. **Deploy to Render.com:**
   - Go to https://render.com
   - Create new "Web Service"
   - Connect your GitHub repository
   - Select `HRMS-Backend` folder
   - Build command: `mvn clean package -DskipTests`
   - Start command: `java -jar target/*.jar`
   - Add environment variables (MongoDB URI, email credentials, etc.)

2. **Update Frontend .env with Render URL:**
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

## Notes

- ✅ `.env` files are NOT committed to git (in `.gitignore`)
- ✅ Always set environment variables in Vercel Dashboard
- ✅ Redeploy after changing environment variables
- ✅ ngrok free URLs expire - consider using a permanent backend URL
