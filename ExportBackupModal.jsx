import React from 'react';
import { X, FileSpreadsheet, FileText, Download, UploadCloud } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export default function ExportBackupModal({ isOpen, onClose, transactions }) {
  if (!isOpen) return null;

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'PaymentMode', 'Date', 'Note'];
    const rows = transactions.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.category,
      t.paymentMode || 'UPI',
      t.date,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DayToDay_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    XLSX.writeFile(workbook, `DayToDay_Transactions_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('DayToDay Expense Tracker Statement', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    let y = 38;
    transactions.forEach((t, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${i + 1}. ${t.title} | ₹${t.amount} | ${t.type.toUpperCase()} | ${t.category} | ${new Date(t.date).toLocaleDateString()}`, 14, y);
      y += 8;
    });

    doc.save(`DayToDay_Statement_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#a855f7' }}>
            <Download size={20} /> Export & Backup Data
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>
          Download your complete financial records or create a local backup copy:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="action-pill" onClick={exportToExcel} style={{ justifyContent: 'flex-start', padding: 14 }}>
            <FileSpreadsheet size={20} color="#22c55e" /> Download Excel Sheet (.xlsx)
          </button>

          <button className="action-pill" onClick={exportToCSV} style={{ justifyContent: 'flex-start', padding: 14 }}>
            <FileText size={20} color="#38bdf8" /> Export CSV Spreadsheet (.csv)
          </button>

          <button className="action-pill" onClick={exportToPDF} style={{ justifyContent: 'flex-start', padding: 14 }}>
            <Download size={20} color="#ef4444" /> Export PDF Summary Statement
          </button>

          <div style={{ marginTop: 12, padding: 12, background: '#1e2636', borderRadius: 10, fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}>
            <UploadCloud size={18} color="#f5b301" /> Live Syncing active with Node.js Express backend API
          </div>
        </div>
      </div>
    </div>
  );
}
