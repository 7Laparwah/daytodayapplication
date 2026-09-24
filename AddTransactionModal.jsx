import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

export default function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAdd({
      title,
      amount: parseFloat(amount),
      type,
      category,
      paymentMode,
      note,
      date: new Date().toISOString()
    });

    setTitle('');
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <PlusCircle size={20} /> Add New Entry
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setType('expense')}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-btn ${type === 'income' ? 'active income' : ''}`}
              onClick={() => setType('income')}
            >
              Income
            </button>
          </div>

          <div className="form-group">
            <label className="form-label">Title / Item Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Grocery, Petrol, Dinner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Food">Food & Dining</option>
              <option value="Travel">Travel & Fuel</option>
              <option value="Bills">Bills & Utilities</option>
              <option value="Salary">Salary & Income</option>
              <option value="Entertainment">Entertainment</option>
              <option value="General">General / Others</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="UPI">UPI / GPay / PhonePe</option>
              <option value="Cash">Cash</option>
              <option value="Card">Debit / Credit Card</option>
              <option value="Bank">Bank Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Additional details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
}
