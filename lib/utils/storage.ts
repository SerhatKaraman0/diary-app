import { UserSettings, Habit } from "../types";

const STORAGE_KEY = "diary-app-user-settings";
const DEFAULT_COLOR = "#3B82F6"; // blue

function migrateHabits(habits: unknown): Habit[] {
    if (!Array.isArray(habits)) {
        return [];
    }

    // Check if it's the old format (string[])
    if (habits.length > 0 && typeof habits[0] === "string") {
        // Migrate from string[] to Habit[]
        return (habits as string[]).map((name) => ({
            name,
            color: DEFAULT_COLOR,
        }));
    }

    // Already in new format (Habit[])
    return habits as Habit[];
}

export function getUserSettings(): UserSettings | null {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return null;
        }
        const parsed = JSON.parse(stored) as UserSettings;
        
        // Migrate old format to new format
        if (parsed.habits && Array.isArray(parsed.habits)) {
            parsed.habits = migrateHabits(parsed.habits);
        }
        
        return parsed;
    } catch (error) {
        console.error("Error reading user settings from localStorage:", error);
        return null;
    }
}

export function saveUserSettings(settings: UserSettings): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error("Error saving user settings to localStorage:", error);
    }
}

export function clearUserSettings(): void {
    if (typeof window === "undefined") {
        return;
    }

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing user settings from localStorage:", error);
    }
}
