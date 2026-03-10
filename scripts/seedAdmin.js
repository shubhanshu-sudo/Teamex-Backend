/**
 * Seed a default admin user for first-time login.
 * Run: npm run seed
 *
 * Default credentials:
 *   Email:    admin@teamex.com
 *   Password: Admin@123
 */
require('dotenv').config();
const https = require('https');
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin.model');

const DEFAULT_ADMIN = {
  name: 'Teamex Admin',
  email: 'admin@teamex.com',
  password: 'Admin@123',
  role: 'admin',
};

function getPublicIP() {
  return new Promise((resolve) => {
    const req = https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).ip || 'unknown');
        } catch {
          resolve('unknown');
        }
      });
    });
    req.on('error', () => resolve('unknown'));
    req.setTimeout(5000, () => { req.destroy(); resolve('unknown'); });
  });
}

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('Connected to MongoDB');

    const existing = await Admin.findOne({ email: DEFAULT_ADMIN.email });
    if (existing) {
      console.log('Admin already exists:', DEFAULT_ADMIN.email);
      process.exit(0);
      return;
    }

    await Admin.create(DEFAULT_ADMIN);
    console.log('Default admin created successfully.');
    console.log('');
    console.log('Login with:');
    console.log('  Email:    ', DEFAULT_ADMIN.email);
    console.log('  Password: ', DEFAULT_ADMIN.password);
    console.log('');
  } catch (err) {
    console.error('Seed failed:', err.message);
    console.error('Full error:', err.name, err.code || '');

    const isIPError = /whitelist|IP|address/i.test(err.message);
    if (isIPError) {
      const ip = await getPublicIP();
      console.log('');
      console.log('--- FIX: Add this IP in MongoDB Atlas ---');
      console.log('Your current public IP:', ip);
      console.log('');
      console.log('1. Open https://cloud.mongodb.com');
      console.log('2. Go to Network Access (left sidebar)');
      console.log('3. Click "Add IP Address"');
      console.log('4. Either:');
      console.log('   - Click "Add Current IP Address" and Confirm');
      console.log('   - OR for dev only: choose "Allow Access from Anywhere" (0.0.0.0/0) and Confirm');
      console.log('5. Wait 1 minute, then run: npm run seed');
      console.log('');
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect().catch(() => {});
    console.log('Disconnected from MongoDB');
  }
}

seed();
