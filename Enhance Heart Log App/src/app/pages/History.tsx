import { motion } from 'motion/react';
import { Trash2, Calendar, Clock, Activity, AlertCircle } from 'lucide-react';
import { Record } from '../hooks/useRecords';
import { SYMPTOMS, SEVERITIES, ACTIVITIES, DAYS_KO } from '../utils/constants';

interface HistoryProps {
  records: Record[];
  onDeleteRecord: (id: string) => void;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${DAYS_KO[date.getDay()]}요일`;
};

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDuration = (sec: number | null) => {
  if (!sec) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}분 ${s}초` : `${s}초`;
};

export default function History({ records, onDeleteRecord }: HistoryProps) {
  return (
    <div className="container px-6 py-8 pb-32 max-w-lg mx-auto min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">나의 기록</h2>

      {records.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
          <span className="text-6xl mb-2">📭</span>
          <p className="text-gray-500 font-medium">아직 기록이 없어요</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => {
            const severity = SEVERITIES.find((s) => s.value === record.severity);
            const activity = ACTIVITIES.find((a) => a.key === record.activity);
            
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group overflow-hidden"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-semibold text-gray-400 mb-1">
                      <Calendar size={12} />
                      <span>{formatDate(record.timestamp)}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <Clock size={12} />
                      <span>{formatTime(record.timestamp)}</span>
                    </div>
                    <div className="mt-1 text-lg font-bold text-gray-800 break-words pr-12">
                      {record.symptoms.map((sKey) => SYMPTOMS.find((s) => s.key === sKey)?.label).join(', ')}
                    </div>
                  </div>
                  
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0
                    ${severity?.color || 'bg-gray-100'}
                  `}>
                    {severity?.emoji}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-semibold text-gray-600 flex items-center gap-1.5">
                    <Activity size={12} />
                    {activity?.label || record.activity}
                  </span>
                  {record.durationSeconds && (
                    <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                      <Clock size={12} />
                      {formatDuration(record.durationSeconds)}
                    </span>
                  )}
                </div>

                {record.memo && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm text-gray-600 leading-relaxed border border-gray-100/50">
                    {record.memo}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (window.confirm('기록을 삭제하시겠습니까?')) {
                      onDeleteRecord(record.id);
                    }
                  }}
                  className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
