import { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Check } from 'lucide-react';
import { SYMPTOMS, SEVERITIES, ACTIVITIES } from '../utils/constants';

interface RecordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: any) => void;
  timerElapsed: number;
}

export default function RecordDrawer({ isOpen, onClose, onSave, timerElapsed }: RecordDrawerProps) {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<number | null>(null);
  const [activity, setActivity] = useState<string | null>(null);
  const [memo, setMemo] = useState('');

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSymptoms([]);
      setSeverity(null);
      setActivity(null);
      setMemo('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (symptoms.length === 0) return;
    
    onSave({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      timestamp: new Date().toISOString(),
      symptoms,
      severity: severity || 1,
      activity: activity || 'rest',
      durationSeconds: timerElapsed ? Math.floor(timerElapsed / 1000) : null,
      memo,
    });
  };

  const toggleSymptom = (key: string) => {
    if (navigator.vibrate) navigator.vibrate(5);
    setSymptoms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] fixed bottom-0 left-0 right-0 z-50 max-h-[96vh] outline-none">
          <div className="p-4 bg-white rounded-t-[32px] flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-200 mb-8" />
            
            <div className="max-w-md mx-auto px-4 pb-12">
              <div className="flex justify-between items-center mb-8">
                <Drawer.Title className="text-2xl font-bold text-gray-900">
                  {step === 1 ? '어떤 증상인가요?' : '상세 정보를 알려주세요'}
                </Drawer.Title>
                <button 
                  onClick={onClose}
                  className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {SYMPTOMS.map((s) => {
                        const isSelected = symptoms.includes(s.key);
                        return (
                          <button
                            key={s.key}
                            onClick={() => toggleSymptom(s.key)}
                            className={`
                              relative p-5 rounded-2xl flex flex-col items-center gap-3 transition-all duration-200
                              ${isSelected 
                                ? 'bg-red-500 text-white shadow-lg shadow-red-200 scale-[1.02]' 
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-transparent'}
                            `}
                          >
                            <span className="text-3xl filter drop-shadow-sm">{s.icon}</span>
                            <span className="font-bold text-base">{s.label}</span>
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      disabled={symptoms.length === 0}
                      onClick={() => setStep(2)}
                      className={`
                        w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all mt-4
                        ${symptoms.length > 0 
                          ? 'bg-gray-900 text-white shadow-lg active:scale-[0.98]' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                      `}
                    >
                      다음으로
                      <ChevronRight size={20} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-8"
                  >
                    {/* Severity */}
                    <section>
                      <label className="block text-sm font-bold text-gray-500 mb-3 ml-1">힘든 정도</label>
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {SEVERITIES.map((s) => (
                          <button
                            key={s.value}
                            onClick={() => setSeverity(s.value)}
                            className={`
                              flex-1 min-w-[80px] p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2
                              ${severity === s.value 
                                ? `${s.color} border-transparent scale-105 shadow-md ring-2 ring-offset-2 ring-transparent` 
                                : 'bg-gray-50 border-transparent text-gray-400 opacity-70 hover:opacity-100'}
                            `}
                          >
                            <span className="text-3xl">{s.emoji}</span>
                            <span className={`text-xs font-bold ${severity === s.value ? 'text-gray-900' : 'text-gray-500'}`}>
                              {s.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* Activity */}
                    <section>
                      <label className="block text-sm font-bold text-gray-500 mb-3 ml-1">활동 상태</label>
                      <div className="flex flex-wrap gap-2">
                        {ACTIVITIES.map((a) => (
                          <button
                            key={a.key}
                            onClick={() => setActivity(a.key)}
                            className={`
                              px-4 py-2.5 rounded-xl text-sm font-bold border transition-all duration-200 flex items-center gap-2
                              ${activity === a.key 
                                ? 'bg-gray-800 text-white border-transparent shadow-md' 
                                : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}
                            `}
                          >
                            <span>{a.icon}</span>
                            {a.label}
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* Memo */}
                    <section>
                      <label className="block text-sm font-bold text-gray-500 mb-3 ml-1">메모 (선택)</label>
                      <textarea
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        placeholder="특이사항이 있다면 적어주세요"
                        className="w-full h-28 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                      />
                    </section>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setStep(1)}
                        className="px-6 py-4 rounded-2xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        이전
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-bold text-lg shadow-lg shadow-red-200 hover:bg-red-600 active:scale-[0.98] transition-all"
                      >
                        저장하기
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
