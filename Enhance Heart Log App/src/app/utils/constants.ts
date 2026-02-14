import { LucideIcon, Activity, HeartPulse, Wind, Ghost, BookOpen, BedDouble, Info, Smile, Meh, Frown, XCircle } from 'lucide-react';

export const SYMPTOMS = [
  { key: 'palpitation', label: '두근거림', icon: '💓' },
  { key: 'chest_tight', label: '가슴 답답', icon: '😤' },
  { key: 'dizzy', label: '어지러움', icon: '😵‍💫' },
  { key: 'breathless', label: '숨이 참', icon: '😮‍💨' },
  { key: 'chest_pain', label: '가슴 통증', icon: '😖' },
  { key: 'other', label: '기타', icon: '📝' },
];

export const SEVERITIES = [
  { value: 1, emoji: '😊', label: '괜찮아', color: 'bg-teal-200' },
  { value: 2, emoji: '😐', label: '좀 불편해', color: 'bg-yellow-200' },
  { value: 3, emoji: '😣', label: '힘들어', color: 'bg-orange-300' },
  { value: 4, emoji: '😰', label: '많이 힘들어', color: 'bg-red-300' },
];

export const ACTIVITIES = [
  { key: 'rest', label: '휴식 중', icon: '🧘' },
  { key: 'walking', label: '걷는 중', icon: '🚶' },
  { key: 'running', label: '뛰는 중', icon: '🏃' },
  { key: 'exercise', label: '운동 중', icon: '⚽' },
  { key: 'sleeping', label: '잠자는 중', icon: '😴' },
  { key: 'class', label: '수업/일', icon: '📚' },
];

export const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
