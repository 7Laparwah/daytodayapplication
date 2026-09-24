# DayToDay - Full-Stack Smart Expense & Budget Tracker

A modern, fast, and feature-rich full-stack personal finance web application built with **React.js 18 (Vite)** on the frontend and **Node.js (Express)** on the backend.

---

## 🌟 Features
- 🔒 **PIN Lock & Biometric Unlock**: 4-digit PIN security (`1331` default) with fingerprint authentication.
- 💳 **Transactions Dashboard**: Income vs Expense tracking, search, category filters, and live stats.
- 🎯 **Monthly Budget Goal**: Spending progress bar with automatic 80% limit alerts.
- 📲 **Pay Now & UPI Generator**: NPCI-compliant UPI payment deep links for GPay, PhonePe, Paytm, and BHIM.
- 🎙️ **Smart AI Voice Assistant**: Natural language expense logging using Gemini AI API / local NLP parser.
- 📊 **Analytics & Charts**: Interactive Category Spending Pie Chart & Monthly Financial Flow Bar Chart powered by Chart.js.
- 📂 **Export & Backup**: Download transaction statements in Excel (`.xlsx`), CSV (`.csv`), or PDF format.
- 🟢 **Offline-First Resilience**: Full offline operation with `localStorage` backup when server/network is unreachable.

---

## 🚀 Quick Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/daytoday-fullstack.git
cd daytoday-fullstack
```

### 2. Install dependencies
Run npm install in both `server` and `client` directories:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Start the application

**Run Node.js Express Backend**:
```bash
cd server
npm start
# Server starts at http://localhost:5000
```

**Run React Vite Frontend**:
```bash
cd client
npm run dev
# App opens at http://localhost:3000
```
