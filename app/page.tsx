"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserSettings } from "@/lib/contexts/UserSettingsContext";
import CalendarComponent from "./components/CalendarComponent";
import GoDateButton from "./components/GoDateButton";

export default function Home() {
    const router = useRouter();
    const { isSetupComplete, isInitialized } = useUserSettings();

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
        <div className="flex h-full w-full"> 
            <GoDateButton />
            <CalendarComponent />        
        </div>
    );
}
