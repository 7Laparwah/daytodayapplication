import React from 'react';
import { Home, PieChart, Plus, User } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, onOpenAddModal }) {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <Home size={22} />
        <span>Home</span>
      </button>

      <button className="nav-fab" title="Add Transaction" onClick={onOpenAddModal}>
        <Plus size={28} />
      </button>

      <button 
        className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
        onClick={() => setActiveTab('analytics')}
      >
        <PieChart size={22} />
        <span>Analytics</span>
      </button>

      <button 
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <User size={22} />
        <span>Profile</span>
      </button>
    </nav>
  );
}
