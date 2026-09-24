import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Navigation from './components/Navigation';
import TransactionsTab from './components/TransactionsTab';
import AnalyticsTab from './components/AnalyticsTab';
import ProfileSettingsTab from './components/ProfileSettingsTab';
import AddTransactionModal from './components/AddTransactionModal';
import PayNowModal from './components/PayNowModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import ExportBackupModal from './components/ExportBackupModal';
import PinLockModal from './components/PinLockModal';
import { api } from './services/api';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0, count: 0 });
  const [budget, setBudget] = useState(null);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isPayNowOpen, setIsPayNowOpen] = useState(false);
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Load Data
  const loadData = async () => {
    const txRes = await api.getTransactions();
    if (txRes && txRes.success) {
      setTransactions(txRes.data);
      setStats(txRes.stats);
    }

    const bRes = await api.getBudget();
    if (bRes && bRes.success) {
      setBudget(bRes.budget);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      loadData();
    }
  }, [isUnlocked]);

  const handleAddTransaction = async (txData) => {
    const res = await api.addTransaction(txData);
    if (res.success) {
      loadData();
    }
  };

  const handleDeleteTransaction = async (id) => {
    const res = await api.deleteTransaction(id);
    if (res.success) {
      loadData();
    }
  };

  const handleUpdateBudget = (newLimit) => {
    loadData();
  };

  if (!isUnlocked) {
    return <PinLockModal onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div className="app-container">
      <Header
        onOpenMic={() => setIsMicOpen(true)}
        onOpenPayNow={() => setIsPayNowOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <main style={{ marginTop: 10 }}>
        {activeTab === 'home' && (
          <TransactionsTab
            transactions={transactions}
            stats={stats}
            budget={budget}
            onDelete={handleDeleteTransaction}
            onOpenAddModal={() => setIsAddOpen(true)}
            onOpenPayNow={() => setIsPayNowOpen(true)}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab transactions={transactions} stats={stats} />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsTab budget={budget} onUpdateBudget={handleUpdateBudget} />
        )}
      </main>

      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => setIsAddOpen(true)}
      />

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddTransaction}
      />

      <PayNowModal
        isOpen={isPayNowOpen}
        onClose={() => setIsPayNowOpen(false)}
      />

      <VoiceAssistantModal
        isOpen={isMicOpen}
        onClose={() => setIsMicOpen(false)}
        onAddTransaction={handleAddTransaction}
      />

      <ExportBackupModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        transactions={transactions}
      />
    </div>
  );
}
