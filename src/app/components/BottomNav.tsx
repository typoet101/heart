import { motion } from 'motion/react';
import { Home, History, BarChart2, Settings } from 'lucide-react';

export const TABS = [
  { key: 'home', label: '홈', Icon: Home },
  { key: 'history', label: '기록', Icon: History },
  { key: 'stats', label: '통계', Icon: BarChart2 },
  { key: 'settings', label: '설정', Icon: Settings },
] as const;

export type TabKey = typeof TABS[number]['key'];

interface BottomNavProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-5 bg-gradient-to-t from-white/90 to-transparent pointer-events-none pb-8">
      <nav className="relative max-w-lg mx-auto bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto ring-1 ring-black/5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                if (navigator.vibrate) navigator.vibrate(10);
                onTabChange(tab.key);
              }}
              className="relative flex flex-col items-center justify-center w-14 h-14"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-red-50 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <div className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-red-500' : 'text-gray-400'}`}>
                <tab.Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              <span className={`text-[10px] font-medium mt-1 transition-all duration-200 ${isActive ? 'text-red-500 translate-y-0 opacity-100' : 'text-gray-400 translate-y-1 opacity-0'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
