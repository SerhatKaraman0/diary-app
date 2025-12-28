import { HealthCategory, AnxietyLevel, DreamCategory, WeatherType } from './types';

export const HEALTH_COLORS: Record<HealthCategory, string> = {
    'well': '#10b981',
    'stomach-problem': '#f59e0b',
    'cold-cough': '#8b5cf6',
    'headache': '#ef4444',
    'brain-fog': '#6b7280',
    'hangover': '#f97316',
    'other': '#64748b'
};

export const ANXIETY_COLORS: Record<AnxietyLevel, string> = {
    'none': '#10b981',
    'low': '#84cc16',
    'medium': '#eab308',
    'high': '#f97316',
    'severe': '#dc2626'
};

export const DREAM_COLORS: Record<DreamCategory, string> = {
    'funny-weird': '#a855f7',
    'happy': '#fbbf24',
    'boring': '#9ca3af',
    'sad': '#3b82f6',
    'frustrating': '#f97316',
    'scary': '#1f2937',
    'dont-remember': '#d1d5db'
};

export const RATING_COLORS = [
    '#dc2626', // 0 - red
    '#ef4444', // 1
    '#f97316', // 2 - orange
    '#fb923c', // 3
    '#fbbf24', // 4 - yellow
    '#facc15', // 5
    '#a3e635', // 6 - lime
    '#84cc16', // 7
    '#22c55e', // 8 - green
    '#16a34a', // 9
    '#15803d'  // 10 - dark green
];

export const WEATHER_ICONS: Record<WeatherType, string> = {
    'sunny': '☀️',
    'cloudy': '☁️',
    'rainy': '🌧️',
    'foggy': '🌫️',
    'snowy': '❄️',
    'stormy': '⛈️'
};
