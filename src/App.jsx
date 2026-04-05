import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { RefreshCw, Terminal, ShieldCheck } from 'lucide-react';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import GamesList from './pages/Games/GamesList';
import CreateGame from './pages/Games/CreateGame';
import EditGame from './pages/Games/EditGame';
import DeclareResult from './pages/Results/DeclareResult';
import ResultHistory from './pages/Results/ResultHistory';
import UsersList from './pages/Users/UsersList';
import UserDetail from './pages/Users/UserDetail';
import AllBets from './pages/Bets/AllBets';
import Withdrawals from './pages/Wallet/Withdrawals';
import Deposits from './pages/Wallet/Deposits';
import Transactions from './pages/Wallet/Transactions';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import AdminLogs from './pages/AdminLogs';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F8FAFC] flex-col font-inter" style={{ minWidth: '1200px' }}>
      <div className="relative p-10 bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex flex-col items-center">
         <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full animate-pulse"></div>
         <div className="relative p-6 bg-slate-900 rounded-3xl border border-slate-700 shadow-xl rotate-12 mb-8">
            <RefreshCw className="animate-spin text-indigo-400" size={48} strokeWidth={2.5} />
         </div>
         <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-2">Authenticating Node Instance</p>
         <div className="flex items-center gap-2 opacity-30 mt-2">
            <ShieldCheck size={12} className="text-indigo-600" />
            <span className="text-[8px] font-black tracking-tighter uppercase">Protocol_Secure_ECC_v4</span>
         </div>
      </div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-inter" style={{ minWidth: '1200px' }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col h-screen overflow-x-auto overflow-y-auto bg-[#F8FAFC] relative transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Background Subtle Tech Accents */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-5 scroll-reveal">
           <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full"></div>
           <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-slate-500/10 blur-[100px] rounded-full"></div>
        </div>
        <main className="flex-1 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" 
           toastOptions={{
             style: {
               background: '#1e293b',
               color: '#fff',
               borderRadius: '12px',
               fontSize: '11px',
               fontWeight: 'bold',
               letterSpacing: '0.1em',
               textTransform: 'uppercase',
               border: '1px solid #334155'
             }
           }} 
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Games */}
                  <Route path="/games" element={<GamesList />} />
                  <Route path="/games/create" element={<CreateGame />} />
                  <Route path="/games/edit/:id" element={<EditGame />} />
                  
                  {/* Results */}
                  <Route path="/declare-result" element={<DeclareResult />} />
                  <Route path="/results/history" element={<ResultHistory />} />
                  
                  {/* Users */}
                  <Route path="/users" element={<UsersList />} />
                  <Route path="/users/:id" element={<UserDetail />} />
                  
                  {/* Bets */}
                  <Route path="/bets" element={<AllBets />} />
                  
                  {/* Wallet */}
                  <Route path="/wallet/withdrawals" element={<Withdrawals />} />
                  <Route path="/wallet/deposits" element={<Deposits />} />
                  <Route path="/wallet/transactions" element={<Transactions />} />
                  
                  {/* System */}
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin-logs" element={<AdminLogs />} />
                  
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
