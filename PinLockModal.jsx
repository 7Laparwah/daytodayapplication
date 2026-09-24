import React, { useState } from 'react';
import { Lock, Fingerprint } from 'lucide-react';
import { api } from '../services/api';

export default function PinLockModal({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError('');
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const verifyPin = async (inputPin) => {
    const res = await api.loginWithPin(inputPin);
    if (res.success) {
      onUnlock();
    } else {
      setError(res.message || 'Incorrect PIN');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPin('');
    }
  };

  const handleBiometric = () => {
    if (window.PublicKeyCredential) {
      // Simulate biometric unlock trigger
      onUnlock();
    } else {
      setError('Biometrics not supported on this device');
    }
  };

  return (
    <div className="pin-screen">
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ 
          width: 60, height: 60, borderRadius: '50%', background: 'rgba(245, 179, 1, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
          color: '#f5b301'
        }}>
          <Lock size={30} />
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, marginBottom: 6 }}>DayToDay Security</h2>
        <p style={{ fontSize: 13, color: '#94a3b8' }}>Enter your 4-digit security PIN to unlock</p>
      </div>

      <div className={`pin-dots ${isShaking ? 'shake' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
        ))}
      </div>

      {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button key={num} className="key-btn" onClick={() => handleKeyPress(num.toString())}>
            {num}
          </button>
        ))}
        <button className="key-btn" style={{ fontSize: 14 }} onClick={handleBiometric}>
          <Fingerprint size={24} color="#f5b301" />
        </button>
        <button className="key-btn" onClick={() => handleKeyPress('0')}>
          0
        </button>
        <button className="key-btn" style={{ fontSize: 16 }} onClick={handleDelete}>
          ⌫
        </button>
      </div>
    </div>
  );
}
