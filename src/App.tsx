import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Organizations } from './pages/Organizations';
import { Samples } from './pages/Samples';
import { Automation } from './pages/Automation';
import { BatchProcessing } from './pages/BatchProcessing';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { LRM } from './pages/LRM';
import { MessagingProvider } from './components/MessagingContext';
import { MessagingPanel } from './components/MessagingPanel';
export function App() {
  return <MessagingProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/organizations" element={<Organizations />} />
              <Route path="/samples" element={<Samples />} />
              <Route path="/automation" element={<Automation />} />
              <Route path="/batch-processing" element={<BatchProcessing />} />
              <Route path="/lrm" element={<LRM />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <MessagingPanel />
        </div>
      </Router>
    </MessagingProvider>;
}