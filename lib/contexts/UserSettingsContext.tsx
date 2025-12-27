"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserSettings } from "../types";
import { getUserSettings, saveUserSettings } from "../utils/storage";

interface UserSettingsContextType {
    settings: UserSettings | null;
    updateSettings: (settings: UserSettings) => void;
    isSetupComplete: boolean;
    isInitialized: boolean;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export function UserSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const stored = getUserSettings();
        setSettings(stored);
        setIsInitialized(true);
    }, []);

    function updateSettings(newSettings: UserSettings) {
        setSettings(newSettings);
        saveUserSettings(newSettings);
    }

    const isSetupComplete = settings?.setupComplete ?? false;

    return (
        <UserSettingsContext.Provider
            value={{
                settings,
                updateSettings,
                isSetupComplete,
                isInitialized,
            }}
        >
            {children}
        </UserSettingsContext.Provider>
    );
}

export function useUserSettings() {
    const context = useContext(UserSettingsContext);
    if (context === undefined) {
        throw new Error("useUserSettings must be used within a UserSettingsProvider");
    }
    return context;
}
