import React, { useState } from 'react';
import { X, QrCode, ExternalLink, AlertCircle } from 'lucide-react';

export default function PayNowModal({ isOpen, onClose }) {
  const [upiId, setUpiId] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerateUpi = (e) => {
    e.preventDefault();
    setError('');

    if (!upiId || !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. name@upi or 9876543210@paytm)');
      return;
    }

    const cleanId = upiId.trim();
    const cleanName = name.trim() || 'Payee';
    const cleanNote = note.trim() || 'Payment';
    const cleanAm = amount ? parseFloat(amount).toFixed(2) : '';

    let upiUrl = `upi://pay?pa=${encodeURIComponent(cleanId)}&pn=${encodeURIComponent(cleanName)}&cu=INR`;
    if (cleanAm) upiUrl += `&am=${cleanAm}`;
    if (cleanNote) upiUrl += `&tn=${encodeURIComponent(cleanNote)}`;

    setGeneratedUrl(upiUrl);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#38bdf8' }}>
            <QrCode size={20} /> Pay Now via UPI
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ color: '#ef4444', fontSize: 12.5, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleGenerateUpi}>
          <div className="form-group">
            <label className="form-label">Payee UPI ID (VPA)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. merchant@okaxis or 9876543210@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payee Name (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount (₹)</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 250"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Note / Remark</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Tea & Snacks"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn" style={{ background: '#38bdf8', color: '#0f172a' }}>
            Generate UPI Link
          </button>
        </form>

        {generatedUrl && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #262f40', textAlign: 'center' }}>
            <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
              Tap below to launch GPay, PhonePe, Paytm, or BHIM:
            </p>
            <a
              href={generatedUrl}
              className="action-pill primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 20px',
                textDecoration: 'none',
                width: '100%',
                fontSize: 14,
                background: '#22c55e',
                color: '#fff'
              }}
            >
              Pay via UPI App <ExternalLink size={16} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
