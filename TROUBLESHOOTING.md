# HRMS Login Troubleshooting Guide

## 🔍 Debug Tool Available

I've created a debug page to help you identify the issue:

**Access it at:** `https://your-vercel-app.vercel.app/debug-login`

This page will:
- ✅ Check if environment variables are loaded
- ✅ Test backend connection
- ✅ Test login API call
- ✅ Show detailed logs and responses
- ✅ Check localStorage data

---

## Common Issues & Solutions

### Issue 1: Environment Variables Not Set in Vercel

**Symptoms:**
- Login button does nothing
- Console shows: `undefined/api/auth/login`
- Debug page shows: `VITE_API_BASE_URL: ❌ NOT SET`

**Solution:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   ```
   VITE_API_BASE_URL = https://trowel-eldercare-scouting.ngrok-free.dev
   VITE_TURN_USERNAME = 51e40078dfabc57d54164c2f
   VITE_TURN_CREDENTIAL = KJnavaquyonnUlkx
   ```
5. **Important:** Select "Production", "Preview", and "Development" for each variable
6. Click **Save**
7. Go to **Deployments** tab
8. Click **Redeploy** (must redeploy after adding env vars!)

---

### Issue 2: ngrok URL Expired

**Symptoms:**
- Connection timeout
- Backend not reachable
- Debug page shows: `❌ Connection timeout - Backend not responding`

**Solution:**

ngrok free URLs expire after a few hours. You need to:

**Option A: Get a new ngrok URL**
1. On your backend server, restart ngrok:
   ```bash
   ngrok http 8082
   ```
2. Copy the new HTTPS URL (e.g., `https://new-url.ngrok-free.dev`)
3. Update in Vercel:
   - Go to Settings → Environment Variables
   - Edit `VITE_API_BASE_URL`
   - Paste the new ngrok URL
   - Save and **Redeploy**

**Option B: Use ngrok paid plan** (Recommended for production)
- Get a static domain that doesn't expire
- https://ngrok.com/pricing

**Option C: Deploy backend permanently**
- Deploy to Render.com, Railway, or Heroku
- Use that permanent URL instead of ngrok

---

### Issue 3: CORS Error

**Symptoms:**
- Console shows: `Access to fetch has been blocked by CORS policy`
- Network tab shows failed requests with CORS error

**Solution:**

Your backend CORS is already configured to allow:
- `https://*.vercel.app`
- `https://*.ngrok-free.dev`

But if you still get CORS errors:

1. **Check if your Vercel domain matches the pattern:**
   - Should be: `https://something.vercel.app`
   - If it's a custom domain, you need to add it to CORS config

2. **Update backend CORS if needed:**
   
   Edit `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/security/CorsConfig.java`:
   
   ```java
   config.setAllowedOriginPatterns(List.of(
       "https://*.ngrok-free.dev",
       "https://*.ngrok.io",
       "https://*.vercel.app",
       "https://your-custom-domain.com"  // Add your custom domain
   ));
   ```

3. **Restart your backend** after making changes

---

### Issue 4: Backend Not Running

**Symptoms:**
- Connection refused
- Debug page shows: `❌ Connection failed`
- Network tab shows no response

**Solution:**

1. **Check if backend is running:**
   ```bash
   cd HRMS-Backend
   ./mvnw spring-boot:run
   ```

2. **Check backend logs** for errors

3. **Test backend directly:**
   - Open: `https://your-ngrok-url.ngrok-free.dev/api/auth/login`
   - Should see some response (not 404)

4. **Check ngrok is running:**
   ```bash
   ngrok http 8082
   ```

---

### Issue 5: Invalid Credentials

**Symptoms:**
- Login fails with "Invalid credentials"
- Backend responds with 401 status

**Solution:**

1. **Verify user exists in database:**
   - Check MongoDB for the user
   - Ensure email and password are correct

2. **Create a test user:**
   - Use your backend's register endpoint
   - Or add directly to MongoDB

3. **Check password encoding:**
   - Backend should use BCrypt
   - Password in DB should be hashed

---

### Issue 6: Vercel Build Cache Issue

**Symptoms:**
- Environment variables are set but still not working
- Old code is running

**Solution:**

1. Go to Vercel Dashboard
2. Go to **Deployments** tab
3. Click on latest deployment
4. Click **Redeploy**
5. **Important:** Select "Redeploy from scratch" (not "Use existing build cache")

---

## Step-by-Step Debugging Process

### Step 1: Use the Debug Page

1. Go to: `https://your-app.vercel.app/debug-login`
2. Click **"Run All Tests"**
3. Check the logs for errors

### Step 2: Check Browser Console

1. Open your app
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Try to login
5. Look for error messages

### Step 3: Check Network Tab

1. Press **F12** to open DevTools
2. Go to **Network** tab
3. Try to login
4. Look for the login request:
   - Should be: `POST https://your-backend/api/auth/login`
   - Check status code (should be 200)
   - Click on the request to see details
   - Check "Response" tab for error messages

### Step 4: Check Backend Logs

1. Look at your backend console/logs
2. Should see: `Login attempt for email: ...`
3. Check for any error messages

### Step 5: Verify Environment Variables

**In Vercel:**
```bash
# Check if variables are set
vercel env ls
```

**In Browser Console:**
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
// Should print: https://trowel-eldercare-scouting.ngrok-free.dev
```

---

## Quick Checklist

Before asking for help, verify:

- [ ] Environment variables are set in Vercel Dashboard
- [ ] Redeployed after setting environment variables
- [ ] Backend is running
- [ ] ngrok is running (if using ngrok)
- [ ] ngrok URL hasn't expired
- [ ] CORS is configured correctly
- [ ] User credentials are correct
- [ ] Browser console shows no errors
- [ ] Network tab shows requests are being sent

---

## Testing Locally

To test if the issue is with Vercel or your code:

1. **Run frontend locally:**
   ```bash
   cd HRMS-Frontend
   npm install
   npm run dev
   ```

2. **Update local .env:**
   ```env
   VITE_API_BASE_URL=https://your-ngrok-url.ngrok-free.dev
   VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
   VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
   ```

3. **Test login locally:**
   - Open: http://localhost:5173
   - Try to login
   - If it works locally but not on Vercel, the issue is with Vercel configuration

---

## Getting More Help

If you're still stuck, provide:

1. **Screenshot of debug page** (`/debug-login`)
2. **Browser console errors** (F12 → Console)
3. **Network tab screenshot** (F12 → Network)
4. **Backend logs** (if accessible)
5. **Vercel deployment logs**

---

## Permanent Solution

For production, you should:

1. **Deploy backend permanently:**
   - Use Render.com, Railway, or AWS
   - Get a permanent URL

2. **Use environment-specific URLs:**
   ```env
   # Production
   VITE_API_BASE_URL=https://api.yourcompany.com
   
   # Development
   VITE_API_BASE_URL=http://localhost:8082
   ```

3. **Set up proper CORS:**
   - Only allow your production domain
   - Don't use wildcards in production

4. **Use HTTPS everywhere:**
   - Both frontend and backend should use HTTPS
   - Get SSL certificates (free with Vercel/Render)

---

## Contact

If you need more help, share:
- Debug page results
- Console errors
- Network tab screenshot
