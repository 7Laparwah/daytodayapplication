import React from 'react';
import { Wallet, Mic, QrCode, Download } from 'lucide-react';

export default function Header({ onOpenMic, onOpenPayNow, onOpenExport }) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <h1>
          <Wallet size={24} /> DayToDay
        </h1>
        <div className="greeting-sub">Welcome back, Dharm 👋</div>
      </div>
      <div className="header-actions">
        <button className="icon-btn" title="AI Voice Assistant" onClick={onOpenMic}>
          <Mic size={20} color="#f5b301" />
        </button>
        <button className="icon-btn" title="Pay Now / Scan UPI QR" onClick={onOpenPayNow}>
          <QrCode size={20} color="#38bdf8" />
        </button>
        <button className="icon-btn" title="Export & Backup" onClick={onOpenExport}>
          <Download size={20} color="#a855f7" />
        </button>
      </div>
    </header>
  );
}
