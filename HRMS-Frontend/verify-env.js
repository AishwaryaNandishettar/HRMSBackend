/**
 * Environment Variable Verification Script
 * Run this to verify your .env file is correctly configured
 * 
 * Usage: node verify-env.js
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🔍 Verifying HRMS Frontend Environment Configuration...\n');

// Check if .env exists in root
const envPath = join(__dirname, '.env');
const srcEnvPath = join(__dirname, 'src', '.env');

console.log('📁 Checking .env file locations:');
console.log(`   Root .env (${envPath}): ${existsSync(envPath) ? '✅ EXISTS' : '❌ NOT FOUND'}`);
console.log(`   src/.env (${srcEnvPath}): ${existsSync(srcEnvPath) ? '⚠️  SHOULD NOT EXIST' : '✅ CORRECTLY ABSENT'}`);

if (!existsSync(envPath)) {
  console.log('\n❌ ERROR: .env file not found in root directory!');
  console.log('   Create a .env file in HRMS-Frontend/ directory\n');
  process.exit(1);
}

if (existsSync(srcEnvPath)) {
  console.log('\n⚠️  WARNING: .env file found in src/ directory!');
  console.log('   Vite will NOT read this file. Please delete it.\n');
}

// Read and parse .env file
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    if (key) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

console.log('\n📋 Environment Variables Found:');

// Check required variables
const requiredVars = [
  'VITE_API_BASE_URL',
  'VITE_TURN_USERNAME',
  'VITE_TURN_CREDENTIAL'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = envVars[varName];
  if (value) {
    // Mask sensitive values
    let displayValue = value;
    if (varName.includes('CREDENTIAL') || varName.includes('PASSWORD')) {
      displayValue = '***' + value.slice(-4);
    }
    console.log(`   ✅ ${varName} = ${displayValue}`);
  } else {
    console.log(`   ❌ ${varName} = NOT SET`);
    allPresent = false;
  }
});

// Validate API URL
console.log('\n🔗 API URL Validation:');
const apiUrl = envVars['VITE_API_BASE_URL'];
if (apiUrl) {
  if (apiUrl.startsWith('http://localhost')) {
    console.log('   ⚠️  Using localhost - OK for development');
  } else if (apiUrl.startsWith('https://')) {
    console.log('   ✅ Using HTTPS - Good for production');
    if (apiUrl.includes('ngrok')) {
      console.log('   ⚠️  Using ngrok URL - Remember these expire!');
    }
  } else if (apiUrl.startsWith('http://')) {
    console.log('   ⚠️  Using HTTP (not HTTPS) - May cause issues in production');
  } else {
    console.log('   ❌ Invalid URL format');
  }
} else {
  console.log('   ❌ API URL not configured');
}

// Final summary
console.log('\n' + '='.repeat(60));
if (allPresent && existsSync(envPath) && !existsSync(srcEnvPath)) {
  console.log('✅ Configuration looks good!');
  console.log('\nNext steps:');
  console.log('1. Commit your changes (if .env is in .gitignore)');
  console.log('2. Set these variables in Vercel Dashboard:');
  console.log('   - Go to Project Settings → Environment Variables');
  console.log('   - Add all VITE_* variables');
  console.log('3. Redeploy your application');
} else {
  console.log('❌ Configuration has issues - please fix them before deploying');
}
console.log('='.repeat(60) + '\n');
