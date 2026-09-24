import express from 'express';
import { readDB, writeDB } from '../db.js';

const router = express.Router();

// GET all transactions with optional category & date filtering + search
router.get('/', (req, res) => {
  const db = readDB();
  let transactions = db.transactions || [];
  
  const { category, type, search, startDate, endDate } = req.query;

  if (category && category !== 'All') {
    transactions = transactions.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }

  if (type && type !== 'all') {
    transactions = transactions.filter(t => t.type === type);
  }

  if (search) {
    const q = search.toLowerCase();
    transactions = transactions.filter(t => 
      t.title.toLowerCase().includes(q) || 
      (t.note && t.note.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q))
    );
  }

  // Sort latest first
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Compute stats
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = totalIncome - totalExpense;

  res.json({
    success: true,
    data: transactions,
    stats: {
      totalIncome,
      totalExpense,
      netBalance,
      count: transactions.length
    }
  });
});

// POST add transaction
router.post('/', (req, res) => {
  const { title, amount, type, category, paymentMode, date, note } = req.body;

  if (!title || !amount || !type) {
    return res.status(400).json({ success: false, message: 'Title, amount, and type are required' });
  }

  const db = readDB();
  const newTx = {
    id: 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    title: title.trim(),
    amount: parseFloat(amount),
    type: type === 'income' ? 'income' : 'expense',
    category: category || 'General',
    paymentMode: paymentMode || 'UPI',
    date: date || new Date().toISOString(),
    note: note ? note.trim() : ''
  };

  db.transactions.unshift(newTx);
  writeDB(db);

  res.status(201).json({ success: true, transaction: newTx });
});

// PUT update transaction
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  const index = db.transactions.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  db.transactions[index] = {
    ...db.transactions[index],
    ...req.body,
    amount: req.body.amount ? parseFloat(req.body.amount) : db.transactions[index].amount
  };

  writeDB(db);
  res.json({ success: true, transaction: db.transactions[index] });
});

// DELETE transaction
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const initialLength = db.transactions.length;
  db.transactions = db.transactions.filter(t => t.id !== id);

  if (db.transactions.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Transaction not found' });
  }

  writeDB(db);
  res.json({ success: true, message: 'Transaction deleted successfully' });
});

export default router;
