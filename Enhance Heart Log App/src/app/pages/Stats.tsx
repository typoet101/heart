import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Record } from '../hooks/useRecords';
import { SYMPTOMS, DAYS_KO } from '../utils/constants';

interface StatsProps {
  records: Record[];
}

export default function Stats({ records }: StatsProps) {
  const chartData = useMemo(() => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return d;
    });

    return days.map((day) => {
      const count = records.filter((r) => {
        const rd = new Date(r.timestamp);
        return rd.getDate() === day.getDate() && rd.getMonth() === day.getMonth();
      }).length;
      return {
        label: DAYS_KO[day.getDay()],
        date: day.getDate(),
        count,
      };
    });
  }, [records]);

  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  const mostCommonSymptom = useMemo(() => {
    if (records.length === 0) return '-';
    const counts: Record<string, number> = {};
    records.forEach((r) => r.symptoms.forEach((s) => (counts[s] = (counts[s] || 0) + 1)));
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return '-';
    return SYMPTOMS.find((s) => s.key === sorted[0][0])?.label || sorted[0][0];
  }, [records]);

  return (
    <div className="container px-6 py-8 pb-32 max-w-lg mx-auto min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">지난 7일 통계</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-4">일별 기록 수</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                hide 
                domain={[0, 'auto']} 
              />
              <Tooltip 
                cursor={{ fill: '#F3F4F6', radius: 4 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#FF6B6B' : '#E5E7EB'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">기록 요약</h3>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
          <span className="text-gray-500 font-medium">총 기록 수</span>
          <span className="text-xl font-bold text-gray-800">{records.length}건</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
          <span className="text-gray-500 font-medium">가장 흔한 증상</span>
          <span className="text-xl font-bold text-red-500">{mostCommonSymptom}</span>
        </div>
      </div>
    </div>
  );
}
