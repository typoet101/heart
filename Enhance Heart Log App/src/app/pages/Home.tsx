import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Square } from 'lucide-react';

export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

interface HomeProps {
  onRecordStart: () => void;
  timerRunning: boolean;
  timerElapsed: number;
  onTimerStart: () => void;
  onTimerStop: () => void;
  todayCount: number;
}

export default function Home({
  onRecordStart,
  timerRunning,
  timerElapsed,
  onTimerStart,
  onTimerStop,
  todayCount,
}: HomeProps) {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 pb-32">
      {/* Header */}
      <div className="w-full mb-10 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-sm text-gray-500 font-medium mb-1">
          {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}
        </p>
        <h1 className="text-3xl font-bold text-gray-800 leading-tight">
          오늘 하루,<br />
          <span className="text-red-500">심장 기록 {todayCount}건</span>
        </h1>
      </div>

      {/* Main Heart Button */}
      <div className="relative w-56 h-56 flex items-center justify-center mb-8">
        {/* Pulse Effect */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full bg-red-400 opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute inset-4 rounded-full bg-red-400 opacity-20"
        />

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRecordStart}
          className="relative z-10 w-40 h-40 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-xl shadow-red-200 flex flex-col items-center justify-center text-white"
        >
          <span className="text-5xl drop-shadow-md mb-1">💓</span>
          <span className="text-sm font-bold tracking-tight">기록하기</span>
        </motion.button>
      </div>

      <p className="text-sm text-gray-500 text-center mb-10">
        심장이 두근거리거나 불편하면<br />가운데 버튼을 눌러주세요
      </p>

      {/* Timer Card */}
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-between animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <div>
          <p className="text-xs text-gray-400 font-semibold mb-1">⏱ 증상 지속 시간 측정</p>
          <span className={`text-3xl font-bold tabular-nums tracking-tight ${timerRunning ? 'text-red-500' : 'text-gray-800'}`}>
            {formatTime(Math.floor(timerElapsed / 1000))}
          </span>
        </div>

        {!timerRunning ? (
          <button
            onClick={onTimerStart}
            className="w-14 h-14 rounded-full bg-gray-100 text-red-500 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Play size={24} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={onTimerStop}
            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-200 active:scale-95 transition-transform"
          >
            <Square size={20} fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
}
