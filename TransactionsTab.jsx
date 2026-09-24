import React, { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, Trash2, AlertCircle } from 'lucide-react';

export default function TransactionsTab({ 
  transactions, 
  stats, 
  budget, 
  onDelete, 
  onOpenAddModal, 
  onOpenPayNow 
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Food', 'Travel', 'Bills', 'Salary', 'Entertainment', 'General'];

  const filteredTxs = transactions.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || t.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      {/* Balance Card */}
      <div className="balance-card">
        <div className="balance-label">Total Net Balance</div>
        <div className="balance-amount">
          ₹{stats.netBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <div className="income-expense-row">
          <div className="ie-item">
            <div className="ie-icon income">
              <ArrowDownLeft size={20} />
            </div>
            <div className="ie-details">
              <div className="label">Income</div>
              <div className="val income">+₹{stats.totalIncome.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div className="ie-item">
            <div className="ie-icon expense">
              <ArrowUpRight size={20} />
            </div>
            <div className="ie-details">
              <div className="label">Expenses</div>
              <div className="val expense">-₹{stats.totalExpense.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Budget Card */}
      {budget && (
        <div className="budget-card">
          <div className="budget-header">
            <span>Monthly Goal & Budget</span>
            <span style={{ color: budget.isAlert80 ? '#ef4444' : '#f5b301' }}>
              {budget.percentageUsed}% Used
            </span>
          </div>
          <div className="progress-bar-bg">
            <div 
              className={`progress-bar-fill ${budget.isAlert80 ? 'alert' : ''}`}
              style={{ width: `${Math.min(100, budget.percentageUsed)}%` }}
            />
          </div>
          <div className="budget-footer">
            <span>Spent: ₹{budget.spent.toLocaleString('en-IN')}</span>
            <span>Limit: ₹{budget.monthlyLimit.toLocaleString('en-IN')}</span>
          </div>
          {budget.isAlert80 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontSize: 11.5, marginTop: 8 }}>
              <AlertCircle size={14} /> Alert: You have reached 80%+ of your monthly budget limit!
            </div>
          )}
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="quick-actions">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`action-pill ${selectedCategory === cat ? 'primary' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Transaction List */}
      <div className="transactions-section">
        <div className="section-header">
          <div className="section-title">Recent Transactions ({filteredTxs.length})</div>
        </div>

        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredTxs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: 13.5 }}>
            No transactions found. Click '+' to add one!
          </div>
        ) : (
          filteredTxs.map((tx) => (
            <div key={tx.id} className="tx-card">
              <div className="tx-left">
                <div className="tx-cat-icon">
                  {tx.category ? tx.category.charAt(0).toUpperCase() : 'T'}
                </div>
                <div className="tx-info">
                  <div className="title">{tx.title}</div>
                  <div className="sub">
                    {tx.category} • {tx.paymentMode || 'UPI'} • {new Date(tx.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="tx-right">
                <div className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                </div>
                <div className="tx-actions">
                  <button className="btn-del" onClick={() => onDelete(tx.id)} title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
