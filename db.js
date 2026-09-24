import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default Seed Data
const initialData = {
  budget: {
    monthlyLimit: 25000,
    currency: 'INR'
  },
  userProfile: {
    name: 'Dharm',
    email: 'dharm1331@gmail.com',
    pinLocked: true,
    notificationsEnabled: true
  },
  transactions: [
    {
      id: 'tx-101',
      title: 'Grocery Shopping',
      amount: 1450,
      type: 'expense',
      category: 'Food',
      paymentMode: 'UPI',
      date: new Date().toISOString(),
      note: 'Supermarket monthly essentials'
    },
    {
      id: 'tx-102',
      title: 'Salary Credit',
      amount: 45000,
      type: 'income',
      category: 'Salary',
      paymentMode: 'Bank Transfer',
      date: new Date().toISOString(),
      note: 'Monthly salary credit'
    },
    {
      id: 'tx-103',
      title: 'Electricity Bill',
      amount: 1820,
      type: 'expense',
      category: 'Bills',
      paymentMode: 'UPI',
      date: new Date().toISOString(),
      note: 'Torrent Power Bill'
    },
    {
      id: 'tx-104',
      title: 'Fuel & Gas',
      amount: 500,
      type: 'expense',
      category: 'Travel',
      paymentMode: 'Cash',
      date: new Date().toISOString(),
      note: 'Bike petrol fill'
    }
  ]
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database file if not present
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
}

export function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON DB:', err);
    return initialData;
  }
}

export function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing JSON DB:', err);
    return false;
  }
}
