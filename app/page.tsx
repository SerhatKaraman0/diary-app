"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserSettings } from "@/lib/contexts/UserSettingsContext";
import { Habit } from "@/lib/types";
import CalendarComponent from "./components/CalendarComponent";
import TopBar from "./components/TopBar";

export default function Home() {
    const router = useRouter();
    const { isSetupComplete, isInitialized } = useUserSettings();
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

    useEffect(() => {
        if (isInitialized && !isSetupComplete) {
            router.push("/setup");
        }
    }, [isInitialized, isSetupComplete, router]);

    if (!isInitialized) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!isSetupComplete) {
        return null;
    }

    return (
        <div className="flex flex-col h-screen w-full">
            <TopBar selectedHabit={selectedHabit} onHabitChange={setSelectedHabit} />
            <div className="flex-1 pt-16 overflow-hidden">
                <CalendarComponent selectedHabit={selectedHabit} />
            </div>
        </div>
    );
}
