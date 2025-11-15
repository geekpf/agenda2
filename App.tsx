
import React, { useState } from 'react';
import AdminView from './pages/admin/AdminView';
import ClientView from './pages/client/ClientView';
import { Header } from './components/Header';

export type AppView = 'client' | 'admin';

function App() {
  const [view, setView] = useState<AppView>('client');

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header currentView={view} setView={setView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {view === 'client' ? <ClientView /> : <AdminView />}
      </main>
    </div>
  );
}

export default App;
