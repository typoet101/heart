import { useState, useRef, useEffect } from 'react';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

import Home from './pages/Home';
import History from './pages/History';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import BottomNav, { TabKey } from './components/BottomNav';
import RecordDrawer from './components/RecordDrawer';
import { useRecords } from './hooks/useRecords';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState<number | null>(null);
  const [timerElapsed, setTimerElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { records, addRecord, deleteRecord } = useRecords();

  // Timer Effect
  useEffect(() => {
    if (timerRunning) {
      const startTime = timerStart || Date.now();
      timerRef.current = setInterval(() => {
        setTimerElapsed(Date.now() - startTime);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timerStart]);

  const handleTimerStart = () => {
    if (!timerRunning) {
      setTimerStart(Date.now() - timerElapsed);
      setTimerRunning(true);
    }
  };

  const handleTimerStop = () => {
    setTimerRunning(false);
  };

  const handleRecordStart = () => {
    setIsDrawerOpen(true);
  };

  const handleSaveRecord = (record: any) => {
    addRecord(record);
    setTimerRunning(false);
    setTimerElapsed(0);
    setTimerStart(null);
    setIsDrawerOpen(false);
  };

  const todayCount = records.filter(
    (r) => new Date(r.timestamp).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-red-100 selection:text-red-900">
      <Toaster position="top-center" toastOptions={{
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: 600,
          color: '#333',
        }
      }} />

      <main className="max-w-lg mx-auto bg-white min-h-screen relative shadow-2xl shadow-gray-200 overflow-hidden">
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-100/50 blur-3xl opacity-60" />
          <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-orange-100/50 blur-3xl opacity-60" />
        </div>

        <div className="relative z-10 pt-6">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Home
                  onRecordStart={handleRecordStart}
                  timerRunning={timerRunning}
                  timerElapsed={timerElapsed}
                  onTimerStart={handleTimerStart}
                  onTimerStop={handleTimerStop}
                  todayCount={todayCount}
                />
              </motion.div>
            )}
            
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <History records={records} onDeleteRecord={deleteRecord} />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Stats records={records} />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Settings records={records} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <RecordDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSave={handleSaveRecord}
          timerElapsed={timerElapsed}
        />
        
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </div>
  );
}
