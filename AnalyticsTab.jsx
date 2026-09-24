import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsTab({ transactions, stats }) {
  // Category breakdown calculation
  const categoryTotals = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      const cat = t.category || 'General';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(t.amount || 0);
    });

  const doughnutData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#f5b301',
          '#ef4444',
          '#38bdf8',
          '#a855f7',
          '#22c55e',
          '#ec4899',
          '#64748b'
        ],
        borderWidth: 1,
        borderColor: '#151a24'
      }
    ]
  };

  const barData = {
    labels: ['Total Income', 'Total Expenses', 'Net Balance'],
    datasets: [
      {
        label: 'Financial Flow (₹)',
        data: [stats.totalIncome, stats.totalExpense, Math.max(0, stats.netBalance)],
        backgroundColor: ['#22c55e', '#ef4444', '#f5b301'],
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } }
      }
    }
  };

  return (
    <div style={{ padding: '0 18px 24px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, margin: '16px 0 12px', color: '#f5b301', display: 'flex', alignItems: 'center', gap: 8 }}>
        <PieIcon size={22} /> Analytics & Reports
      </h2>

      {/* Doughnut Chart Card */}
      <div className="budget-card" style={{ marginBottom: 16 }}>
        <div className="budget-header" style={{ marginBottom: 14 }}>
          <span>Expenses by Category</span>
        </div>
        {Object.keys(categoryTotals).length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: '#94a3b8', fontSize: 13 }}>
            No expense data available to display chart.
          </div>
        ) : (
          <div style={{ maxHeight: 260, display: 'flex', justifyContent: 'center' }}>
            <Doughnut data={doughnutData} options={options} />
          </div>
        )}
      </div>

      {/* Bar Chart Card */}
      <div className="budget-card">
        <div className="budget-header" style={{ marginBottom: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={16} color="#38bdf8" /> Income vs Expense Summary
          </span>
        </div>
        <div style={{ maxHeight: 260 }}>
          <Bar data={barData} options={options} />
        </div>
      </div>
    </div>
  );
}
