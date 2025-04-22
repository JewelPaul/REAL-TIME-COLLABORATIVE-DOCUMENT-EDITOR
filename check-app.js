const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('DocCollab - Real-Time Collaborative Document Editor');
console.log('=================================================');
console.log('Running pre-submission checks...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version').toString().trim();
  console.log(`✅ Node.js is installed (${nodeVersion})`);
} catch (error) {
  console.error('❌ Node.js is not installed or not in PATH');
  process.exit(1);
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version').toString().trim();
  console.log(`✅ npm is installed (${npmVersion})`);
} catch (error) {
  console.error('❌ npm is not installed or not in PATH');
  process.exit(1);
}

// Check if client directory exists
const clientDir = path.join(__dirname, 'client');
if (fs.existsSync(clientDir)) {
  console.log('✅ Client directory exists');
} else {
  console.error('❌ Client directory not found');
  process.exit(1);
}

// Check if server directory exists
const serverDir = path.join(__dirname, 'server');
if (fs.existsSync(serverDir)) {
  console.log('✅ Server directory exists');
} else {
  console.error('❌ Server directory not found');
  process.exit(1);
}

// Check if package.json exists in client directory
const clientPackageJson = path.join(clientDir, 'package.json');
if (fs.existsSync(clientPackageJson)) {
  console.log('✅ Client package.json exists');
} else {
  console.error('❌ Client package.json not found');
  process.exit(1);
}

// Check if package.json exists in server directory
const serverPackageJson = path.join(serverDir, 'package.json');
if (fs.existsSync(serverPackageJson)) {
  console.log('✅ Server package.json exists');
} else {
  console.error('❌ Server package.json not found');
  process.exit(1);
}

// Check if .env file exists in server directory
const serverEnv = path.join(serverDir, '.env');
if (fs.existsSync(serverEnv)) {
  console.log('✅ Server .env file exists');
} else {
  console.error('❌ Server .env file not found');
  process.exit(1);
}

// Check if .env file exists in client directory
const clientEnv = path.join(clientDir, '.env');
if (fs.existsSync(clientEnv)) {
  console.log('✅ Client .env file exists');
} else {
  console.error('❌ Client .env file not found');
  process.exit(1);
}

console.log('\nAll checks passed! Your application is ready for submission.');
console.log('\nTo start the application, run:');
console.log('npm start');
