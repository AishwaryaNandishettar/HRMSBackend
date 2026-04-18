# 📸 RENDER ENVIRONMENT VARIABLES - VISUAL STEP-BY-STEP GUIDE

## 🎯 YOUR GOAL
Set 5 environment variables in Render dashboard to fix the 502 error.

---

## 🔍 STEP-BY-STEP WITH DESCRIPTIONS

### STEP 1: LOGIN TO RENDER
1. Open browser
2. Go to: **https://dashboard.render.com/**
3. Login with your account

**What you'll see:**
- A dashboard with list of your services
- You should see **"HRMS-Backend"** or similar service name

---

### STEP 2: OPEN YOUR BACKEND SERVICE
1. **Click** on your backend service name (e.g., "HRMS-Backend")

**What you'll see:**
- Service details page opens
- Top shows: Service name, status (Live/Building/Failed)
- Left sidebar shows multiple tabs

---

### STEP 3: FIND ENVIRONMENT TAB
**Look at the LEFT SIDEBAR**, you'll see these tabs:
- ⚙️ Settings
- 🌍 **Environment** ← CLICK THIS ONE
- 📊 Metrics
- 📝 Logs
- 🔧 Shell
- 📅 Events

**Click on "Environment" tab**

---

### STEP 4: ENVIRONMENT VARIABLES PAGE

**What you'll see:**
- Page title: "Environment Variables"
- Description text about environment variables
- A list of existing variables (might be empty or have PORT variable)
- A button: **"Add Environment Variable"** (blue button)

---

### STEP 5: ADD FIRST VARIABLE (MONGODB_URI)

1. **Click** the blue button: **"Add Environment Variable"**

**What appears:**
- Two input fields appear:
  - **Key** (left field)
  - **Value** (right field)

2. **In the "Key" field**, type:
```
MONGODB_URI
```

3. **In the "Value" field**, copy-paste EXACTLY:
```
mongodb+srv://hrms_user:yWkztlbtsW7RGube@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
```

**IMPORTANT:**
- ❌ Do NOT add quotes around the value
- ❌ Do NOT add angle brackets < >
- ✅ Just paste the connection string as-is

4. **Don't click Save yet!** Add all variables first.

---

### STEP 6: ADD SECOND VARIABLE (SPRING_MAIL_USERNAME)

1. **Click** "Add Environment Variable" button again

2. **In the "Key" field**, type:
```
SPRING_MAIL_USERNAME
```

3. **In the "Value" field**, type:
```
aishushettar95@gmail.com
```

---

### STEP 7: ADD THIRD VARIABLE (SPRING_MAIL_PASSWORD)

1. **Click** "Add Environment Variable" button again

2. **In the "Key" field**, type:
```
SPRING_MAIL_PASSWORD
```

3. **In the "Value" field**, type:
```
bbfskhrhtnujkokk
```

---

### STEP 8: ADD FOURTH VARIABLE (JWT_SECRET)

1. **Click** "Add Environment Variable" button again

2. **In the "Key" field**, type:
```
JWT_SECRET
```

3. **In the "Value" field**, type:
```
MyFixedSecretKey123456
```

---

### STEP 9: CHECK IF PORT EXISTS

**Scroll through your environment variables list**

**If you see a variable named "PORT":**
- ✅ Good! Leave it as is (value should be 8080 or 10000)
- ⏭️ Skip to Step 10

**If you DON'T see "PORT" variable:**
1. Click "Add Environment Variable"
2. Key: `PORT`
3. Value: `8080`

---

### STEP 10: SAVE ALL VARIABLES

**At the bottom of the page**, you'll see a button:
- **"Save Changes"** (blue button)

**Click "Save Changes"**

**What happens:**
- Page shows "Saving..." message
- Then shows "Saved successfully" or similar
- Your service will automatically start redeploying

---

### STEP 11: VERIFY YOUR VARIABLES

**After saving, you should see this list:**

```
Key                      | Value
-------------------------|----------------------------------
MONGODB_URI              | mongodb+srv://hrms_user:yWkz...
SPRING_MAIL_USERNAME     | aishushettar95@gmail.com
SPRING_MAIL_PASSWORD     | bbfskhrhtnujkokk
JWT_SECRET               | MyFixedSecretKey123456
PORT                     | 8080
```

**If you see all 5 variables:** ✅ Perfect!

---

### STEP 12: MONITOR DEPLOYMENT

1. **Click "Logs" tab** in the left sidebar

**What you'll see:**
- Live log output scrolling
- Build process starting
- Maven downloading dependencies
- Application starting

**Wait for these SUCCESS messages:**
```
✅ BUILD SUCCESSFUL
✅ Started HmrsBackendApplication
✅ Tomcat started on port 8080
```

**This takes 5-10 minutes**

---

### STEP 13: CHECK SERVICE STATUS

1. **Click "Settings" tab** or go back to service overview

**Look at the top of the page:**
- Status badge should change from "Building" → "Live" (green)

**If status is "Live":**
- ✅ Your backend is running!
- Copy your service URL (looks like: `https://hrms-backend-xxxx.onrender.com`)

---

### STEP 14: TEST YOUR BACKEND

1. **Open a new browser tab**
2. **Paste your Render URL** (e.g., `https://hrms-backend-xxxx.onrender.com`)
3. **Press Enter**

**Expected result:**
- You should see a response (not 502 error)
- Might see: "Welcome to HRMS Backend" or "Whitelabel Error Page" (both are OK - means backend is running)

**If you still see 502:**
- Go to Logs tab
- Copy the error message
- Send it to me

---

## 🎨 VISUAL LAYOUT REFERENCE

```
┌─────────────────────────────────────────────────────────┐
│  Render Dashboard                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐                                       │
│  │ HRMS-Backend │  ← Click this                         │
│  │ Live         │                                        │
│  └──────────────┘                                       │
│                                                          │
└─────────────────────────────────────────────────────────┘

After clicking service:

┌─────────────────────────────────────────────────────────┐
│  HRMS-Backend                                    [Live]  │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│  Settings    │  Service Details                          │
│  Environment │← Click this                               │
│  Metrics     │                                           │
│  Logs        │                                           │
│  Shell       │                                           │
│  Events      │                                           │
│              │                                           │
└──────────────┴──────────────────────────────────────────┘

Environment Variables Page:

┌─────────────────────────────────────────────────────────┐
│  Environment Variables                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Add Environment Variable] ← Click this button         │
│                                                          │
│  Key: [________________]  Value: [__________________]   │
│                                                          │
│  Key: [________________]  Value: [__________________]   │
│                                                          │
│                                                          │
│                              [Save Changes] ← Click last │
└─────────────────────────────────────────────────────────┘
```

---

## 🚨 TROUBLESHOOTING

### "I can't find the Environment tab"
- Make sure you clicked on your service name first
- Look at the LEFT sidebar (not top menu)
- It's between "Settings" and "Metrics"

### "Add Environment Variable button is not working"
- Try refreshing the page
- Make sure you're logged in
- Try a different browser

### "Save Changes button is grayed out"
- Make sure you filled both Key and Value fields
- Check if there are any error messages in red

### "After saving, service shows 'Failed' status"
- Click "Logs" tab
- Look for error messages in red
- Copy the error and send to me

---

## ⏱️ HOW LONG DOES THIS TAKE?

- **Adding variables**: 2-3 minutes
- **Saving**: 10 seconds
- **Redeployment**: 5-10 minutes
- **Total**: ~15 minutes

---

## ✅ SUCCESS CHECKLIST

- [ ] Logged into Render dashboard
- [ ] Clicked on HRMS-Backend service
- [ ] Found Environment tab in left sidebar
- [ ] Added MONGODB_URI variable
- [ ] Added SPRING_MAIL_USERNAME variable
- [ ] Added SPRING_MAIL_PASSWORD variable
- [ ] Added JWT_SECRET variable
- [ ] Verified PORT variable exists
- [ ] Clicked "Save Changes"
- [ ] Watched Logs for successful deployment
- [ ] Service status shows "Live"
- [ ] Tested backend URL in browser
- [ ] No 502 error!

---

**Follow this guide step-by-step and you'll fix the 502 error! 🎉**
