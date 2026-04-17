# How to Check Vercel Environment Variables

## Method 1: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Click on your HRMS project
3. Click **Settings** (top menu)
4. Click **Environment Variables** (left sidebar)
5. You should see:
   - `VITE_API_BASE_URL`
   - `VITE_TURN_USERNAME`
   - `VITE_TURN_CREDENTIAL`

**Important:** Each variable should have checkmarks for:
- ✅ Production
- ✅ Preview
- ✅ Development

If any are missing, click **Edit** and select all three environments.

---

## Method 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
cd HRMS-Frontend
vercel link

# List environment variables
vercel env ls

# Pull environment variables to local
vercel env pull .env.local
```

---

## Method 3: Check in Deployed App

1. Deploy this test page or use the debug page at `/debug-login`
2. Open browser console (F12)
3. Type:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_BASE_URL)
   console.log('TURN User:', import.meta.env.VITE_TURN_USERNAME)
   console.log('TURN Cred:', import.meta.env.VITE_TURN_CREDENTIAL ? 'SET' : 'NOT SET')
   ```

If any show `undefined`, the environment variables are not set correctly in Vercel.

---

## Common Mistakes

### ❌ Mistake 1: Not Redeploying After Setting Variables
**Solution:** Always redeploy after adding/changing environment variables

### ❌ Mistake 2: Wrong Environment Selected
**Solution:** Make sure variables are set for "Production" environment

### ❌ Mistake 3: Typo in Variable Name
**Solution:** Must be exactly `VITE_API_BASE_URL` (case-sensitive)

### ❌ Mistake 4: Extra Spaces in Value
**Solution:** 
- ❌ Wrong: ` https://url.com ` (spaces before/after)
- ✅ Correct: `https://url.com` (no spaces)

---

## How to Fix

If variables are missing or wrong:

1. **Add/Edit in Vercel Dashboard:**
   - Settings → Environment Variables
   - Click **Add New** or **Edit**
   - Enter exact values:
     ```
     VITE_API_BASE_URL = https://trowel-eldercare-scouting.ngrok-free.dev
     VITE_TURN_USERNAME = 51e40078dfabc57d54164c2f
     VITE_TURN_CREDENTIAL = KJnavaquyonnUlkx
     ```
   - Select all environments (Production, Preview, Development)
   - Click **Save**

2. **Redeploy:**
   - Go to Deployments tab
   - Click **Redeploy** on latest deployment
   - Wait for build to complete

3. **Verify:**
   - Open your app
   - Go to `/debug-login`
   - Click "Test Env Variables"
   - Should show all variables as ✅ SET
