import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Download, ChevronRight, Github } from 'lucide-react';
import { Record } from '../hooks/useRecords';

interface SettingsProps {
  records: Record[];
}

export default function Settings({ records }: SettingsProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const savedUrl = localStorage.getItem('heartlog_sheet_url');
    if (savedUrl) setUrl(savedUrl);
  }, []);

  const saveUrl = () => {
    if (!url.trim()) {
      localStorage.removeItem('heartlog_sheet_url');
      toast.success('설정이 초기화되었습니다.');
      return;
    }
    
    // Simple URL validation
    try {
      new URL(url);
      localStorage.setItem('heartlog_sheet_url', url);
      toast.success('구글 시트 URL이 저장되었습니다.');
    } catch {
      toast.error('올바른 URL을 입력해주세요.');
    }
  };

  const exportData = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
      const a = document.createElement('a');
      a.href = dataStr;
      a.download = `heartlog_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('백업 파일이 다운로드되었습니다.');
    } catch (e) {
      toast.error('데이터 내보내기에 실패했습니다.');
    }
  };

  return (
    <div className="container px-6 py-8 pb-32 max-w-lg mx-auto min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">설정</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">☁️</span>
          <h3 className="text-lg font-bold text-gray-800">구글 시트 연동</h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          Apps Script 웹 앱 URL을 입력하면<br/>기록이 자동으로 스프레드시트에 저장됩니다.
        </p>
        
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://script.google.com/..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all mb-4"
        />
        
        <button
          onClick={saveUrl}
          className="w-full py-3.5 bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-gray-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Save size={16} />
          저장하기
        </button>
      </div>

      <button
        onClick={exportData}
        className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between group active:scale-[0.98] transition-all mb-8"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Download size={20} />
          </div>
          <span className="font-bold text-gray-700">데이터 백업 (JSON)</span>
        </div>
        <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
      </button>

      <div className="text-center space-y-2 py-8">
        <p className="text-xs text-gray-400 font-medium">Heart Log v2.0</p>
        <p className="text-xs text-gray-300">Designed for You</p>
      </div>
    </div>
  );
}
