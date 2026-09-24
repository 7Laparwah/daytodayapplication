import React, { useState } from 'react';
import { User, Lock, Bell, DollarSign, ShieldCheck, Moon } from 'lucide-react';
import { api } from '../services/api';

export default function ProfileSettingsTab({ budget, onUpdateBudget }) {
  const [newBudget, setNewBudget] = useState(budget ? budget.monthlyLimit : 25000);
  const [notif, setNotif] = useState(true);
  const [msg, setMsg] = useState('');

  const handleSaveBudget = async () => {
    const res = await api.updateBudget(newBudget);
    if (res.success) {
      onUpdateBudget(newBudget);
      setMsg('Monthly budget updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div style={{ padding: '0 18px 24px' }}>
      <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, margin: '16px 0 12px', color: '#f5b301', display: 'flex', alignItems: 'center', gap: 8 }}>
        <User size={22} /> Profile & Settings
      </h2>

      {/* User Info Card */}
      <div className="balance-card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, #192233 0%, #111520 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 54, height: 54, borderRadius: '50%', background: '#f5b301', color: '#111',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800
          }}>
            D
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Dharm</div>
            <div style={{ fontSize: 12.5, color: '#94a3b8' }}>dharm1331@gmail.com</div>
            <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={14} /> Whitelisted User
            </div>
          </div>
        </div>
      </div>

      {msg && (
        <div style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: 12, borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
          {msg}
        </div>
      )}

      {/* Monthly Budget Setting */}
      <div className="budget-card" style={{ marginBottom: 16 }}>
        <div className="budget-header" style={{ marginBottom: 10 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <DollarSign size={18} color="#f5b301" /> Monthly Budget Goal
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="number"
            className="form-input"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
          />
          <button className="action-pill primary" onClick={handleSaveBudget}>
            Save
          </button>
        </div>
      </div>

      {/* Security & Preferences */}
      <div className="budget-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #262f40' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <Lock size={18} color="#38bdf8" /> 4-Digit Security PIN
          </div>
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>Active (1331)</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #262f40' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <Bell size={18} color="#a855f7" /> Budget Alert Notifications (80% Limit)
          </div>
          <input
            type="checkbox"
            checked={notif}
            onChange={(e) => setNotif(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: '#f5b301' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
            <Moon size={18} color="#f5b301" /> Dark Glassmorphic Theme
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Default</span>
        </div>
      </div>
    </div>
  );
}
