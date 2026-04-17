@echo off
REM ========================================
REM MongoDB Migration Script for Windows
REM This script migrates your local MongoDB data to Atlas
REM ========================================

echo.
echo ========================================
echo MongoDB Migration to Atlas
echo ========================================
echo.

REM ========================================
REM CONFIGURATION - FILL IN YOUR PASSWORD!
REM ========================================

set ATLAS_USERNAME=hrmsadmin
set ATLAS_PASSWORD=im75Jf9jb1ntQev2
set ATLAS_CLUSTER=cluster0.aexpf8t.mongodb.net
set DATABASE_NAME=Data_base_hrms

REM Build connection string
set ATLAS_URI=mongodb+srv://%ATLAS_USERNAME%:%ATLAS_PASSWORD%@%ATLAS_CLUSTER%/%DATABASE_NAME%?retryWrites=true^&w=majority
set LOCAL_URI=mongodb://localhost:27017

REM ========================================
REM STEP 1: Check if mongodump exists
REM ========================================

echo Step 1: Checking MongoDB tools...
echo.

where mongodump >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: mongodump is not installed!
    echo.
    echo Please install MongoDB Database Tools:
    echo https://www.mongodb.com/try/download/database-tools
    echo.
    pause
    exit /b 1
)

echo MongoDB tools found!
echo.

REM ========================================
REM STEP 2: Export from local MongoDB
REM ========================================

echo Step 2: Exporting from local MongoDB...
echo Database: %DATABASE_NAME%
echo Location: .\mongodb_backup
echo.

REM Create backup directory
if not exist mongodb_backup mkdir mongodb_backup

REM Export
mongodump --uri="%LOCAL_URI%" --db="%DATABASE_NAME%" --out=.\mongodb_backup

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Export failed!
    echo Make sure your local MongoDB is running.
    echo.
    pause
    exit /b 1
)

echo.
echo Export successful!
echo.

REM ========================================
REM STEP 3: Import to Atlas
REM ========================================

echo Step 3: Importing to MongoDB Atlas...
echo Cluster: %ATLAS_CLUSTER%
echo Database: %DATABASE_NAME%
echo.

REM Check if password was set
if "%ATLAS_PASSWORD%"=="YOUR_PASSWORD_HERE" (
    echo ERROR: You need to set your MongoDB Atlas password!
    echo.
    echo Edit migrate-to-atlas.bat and replace:
    echo   set ATLAS_PASSWORD=YOUR_PASSWORD_HERE
    echo with:
    echo   set ATLAS_PASSWORD=your_actual_password
    echo.
    pause
    exit /b 1
)

REM Import to Atlas
mongorestore --uri="%ATLAS_URI%" ".\mongodb_backup\%DATABASE_NAME%"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Import failed!
    echo.
    echo Possible issues:
    echo   1. Wrong password
    echo   2. Network access not configured
    echo   3. Database user doesn't have permissions
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo MIGRATION COMPLETE!
echo ==========================================
echo.
echo Your data has been migrated to MongoDB Atlas!
echo.
echo Connection String (save this!):
echo %ATLAS_URI%
echo.
echo Next steps:
echo   1. Test connection in MongoDB Compass
echo   2. Deploy backend to Render
echo   3. Use this connection string as MONGODB_URI
echo.
echo ==========================================
echo.
pause
