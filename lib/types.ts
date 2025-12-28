export interface Note {
    $id: string;
    position: string;
    colors: string;
    body: string;
}

export interface Habit {
    name: string;
    color: string;
}

export interface UserSettings {
    name: string;
    notificationTime: string;
    habits: Habit[];
    setupComplete: boolean;
}

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'foggy' | 'snowy' | 'stormy';
export type HealthCategory = 'well' | 'stomach-problem' | 'cold-cough' | 'headache' | 'brain-fog' | 'hangover' | 'other';
export type AnxietyLevel = 'none' | 'low' | 'medium' | 'high' | 'severe';
export type DreamCategory = 'funny-weird' | 'happy' | 'boring' | 'sad' | 'frustrating' | 'scary' | 'dont-remember';

export interface DayData {
    date: string;
    doodle?: string;
    weather?: WeatherType;
    rating?: number;
    health?: HealthCategory;
    anxiety?: {
        level: AnxietyLevel;
        details?: string;
    };
    dream?: {
        category: DreamCategory;
        details?: string;
    };
    highlight?: string;
    steps?: number;
}