import React, { useState } from 'react';
import { X, Mic, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function VoiceAssistantModal({ isOpen, onClose, onAddTransaction }) {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);

  if (!isOpen) return null;

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported on this browser. You can type your command below!');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      handleParseVoiceText(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleParseVoiceText = async (textToParse) => {
    if (!textToParse) return;
    setIsParsing(true);
    const res = await api.parseVoice(textToParse);
    setIsParsing(false);

    if (res.success && res.parsed) {
      setParsedResult(res.parsed);
    }
  };

  const handleConfirmAdd = () => {
    if (parsedResult) {
      onAddTransaction({
        title: parsedResult.title || 'Voice Expense',
        amount: parsedResult.amount || 0,
        type: parsedResult.type || 'expense',
        category: parsedResult.category || 'General',
        paymentMode: parsedResult.paymentMode || 'UPI',
        note: parsedResult.note || `Voice logged: ${transcript}`,
        date: new Date().toISOString()
      });
      setTranscript('');
      setParsedResult(null);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#f5b301' }}>
            <Sparkles size={20} /> Smart AI Voice Assistant
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <button
            className={`nav-fab ${isListening ? 'listening' : ''}`}
            onClick={startSpeechRecognition}
            style={{
              margin: '0 auto',
              width: 70,
              height: 70,
              transform: 'none',
              background: isListening ? '#ef4444' : '#f5b301'
            }}
          >
            <Mic size={32} color="#111" />
          </button>
          <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 12 }}>
            {isListening ? 'Listening... Speak your expense!' : 'Tap mic to speak (e.g. "Spent 150 rupees on lunch")'}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Or type spoken prompt manually:</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Received 5000 salary bonus"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
            <button
              type="button"
              className="action-pill primary"
              onClick={() => handleParseVoiceText(transcript)}
              disabled={isParsing}
            >
              {isParsing ? 'AI Parsing...' : 'Parse'}
            </button>
          </div>
        </div>

        {parsedResult && (
          <div style={{ background: '#1e2636', padding: 16, borderRadius: 12, marginTop: 16 }}>
            <div style={{ fontSize: 12.5, color: '#22c55e', fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle2 size={16} /> Extracted Entry:
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Title: {parsedResult.title}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: parsedResult.type === 'income' ? '#22c55e' : '#ef4444', marginTop: 4 }}>
              Amount: ₹{parsedResult.amount} ({parsedResult.type})
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
              Category: {parsedResult.category} • Mode: {parsedResult.paymentMode}
            </div>

            <button
              type="button"
              className="submit-btn"
              style={{ marginTop: 14 }}
              onClick={handleConfirmAdd}
            >
              Add to Transactions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
