import { useState, useEffect } from 'react';

export interface Record {
  id: string;
  timestamp: string;
  symptoms: string[];
  severity: number;
  activity: string;
  durationSeconds: number | null;
  memo: string;
}

const STORAGE_KEY = 'heartlog_records_v2';

export const useRecords = () => {
  const [records, setRecords] = useState<Record[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecords(JSON.parse(stored).records || []);
      }
    } catch (e) {
      console.error('Failed to load records', e);
    }
  }, []);

  const saveRecords = (newRecords: Record[]) => {
    setRecords(newRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, records: newRecords }));
  };

  const addRecord = (record: Record) => {
    const updated = [record, ...records];
    saveRecords(updated);
    
    // Sync to Google Sheets if configured
    const sheetUrl = localStorage.getItem('heartlog_sheet_url');
    if (sheetUrl) {
      fetch(sheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', ...record, date: new Date().toLocaleDateString() }),
      }).catch(console.error);
    }
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter((r) => r.id !== id);
    saveRecords(updated);
  };

  return { records, addRecord, deleteRecord };
};
