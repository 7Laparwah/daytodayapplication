import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET budget details & status
router.get('/', (req, res) => {
  const db = readDB();
  const monthlyLimit = db.budget?.monthlyLimit || 25000;
  
  // Compute current month expenses
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = (db.transactions || [])
    .filter(t => {
      if (t.type !== 'expense') return false;
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const percentageUsed = Math.min(100, Math.round((currentMonthExpenses / monthlyLimit) * 100));
  const isAlert80 = percentageUsed >= 80;
  const isExceeded = currentMonthExpenses > monthlyLimit;

  res.json({
    success: true,
    budget: {
      monthlyLimit,
      spent: currentMonthExpenses,
      remaining: Math.max(0, monthlyLimit - currentMonthExpenses),
      percentageUsed,
      isAlert80,
      isExceeded
    }
  });
});

// POST update budget limit
router.post('/', (req, res) => {
  const { monthlyLimit } = req.body;
  if (!monthlyLimit || isNaN(monthlyLimit) || Number(monthlyLimit) <= 0) {
    return res.status(400).json({ success: false, message: 'Valid monthly limit required' });
  }

  const db = readDB();
  db.budget = {
    ...db.budget,
    monthlyLimit: parseFloat(monthlyLimit)
  };
  writeDB(db);

  res.json({ success: true, monthlyLimit: db.budget.monthlyLimit });
});

export default router;
