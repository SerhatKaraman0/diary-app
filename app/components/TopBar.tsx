"use client";

import { useState } from "react";
import { useUserSettings } from "@/lib/contexts/UserSettingsContext";
import { Habit } from "@/lib/types";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

interface TopBarProps {
    selectedHabit: Habit | null;
    onHabitChange: (habit: Habit | null) => void;
}

export default function TopBar({ selectedHabit, onHabitChange }: TopBarProps) {
    const { settings } = useUserSettings();
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");

    const getCurrentDayOfYear = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const currentDay = getCurrentDayOfYear();
    const progressPercentage = (currentDay / 365) * 100;

    const handleGoClick = () => {
        if (selectedMonth) {
            const elementId = selectedDay 
                ? `${selectedMonth}-${selectedDay}`
                : `${selectedMonth}-1`;
            
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: "center"
                });
                
                // Remove any existing highlights
                document.querySelectorAll('.month-highlight').forEach(el => {
                    el.classList.remove('month-highlight', 'blink-animation');
                });

                // Add highlight to the selected day/month
                element.classList.add('month-highlight', 'blink-animation');
                
                setTimeout(() => {
                    element.classList.remove('blink-animation');
                }, 2000);
            }
        }
    };

    const habits = settings?.habits || [];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black">
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div 
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
            <div className="flex items-center justify-between px-4 py-3 h-16">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <h1 className="text-xl font-bold">HabitTracker</h1>
                </div>

                {/* Center: Date Selection */}
                <div className="flex items-center gap-2">
                    <select
                        className="h-8 px-2 border border-black focus:outline-none"
                        value={selectedMonth}
                        onChange={(e) => {
                            setSelectedMonth(e.target.value);
                            setSelectedDay("");
                        }}
                    >
                        <option value="" disabled>Select Month</option>
                        {months.map((month, index) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        className="h-8 px-2 border border-black focus:outline-none"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                        disabled={!selectedMonth}
                    >
                        <option value="" disabled>Select Day</option>
                        {selectedMonth && Array.from(
                            { length: daysOfMonths[months.indexOf(selectedMonth)] || 0 }, 
                            (_, dayIndex) => (
                                <option key={dayIndex + 1} value={dayIndex + 1}>
                                    {dayIndex + 1}
                                </option>
                            )
                        )}
                    </select>

                    <button 
                        className="h-8 px-4 border border-black bg-white hover:bg-black hover:text-white transition-colors focus:outline-none"
                        onClick={handleGoClick}
                    >
                        GO
                    </button>
                </div>

                {/* Right: Habit Switcher */}
                <div className="flex items-center gap-2">
                    <button
                        className="h-8 w-8 border border-black bg-white hover:bg-black hover:text-white transition-colors focus:outline-none flex items-center justify-center"
                        onClick={() => {
                            const currentIndex = selectedHabit 
                                ? habits.findIndex(h => h.name === selectedHabit.name)
                                : -1;
                            const prevIndex = currentIndex <= 0 ? habits.length - 1 : currentIndex - 1;
                            onHabitChange(habits[prevIndex] || null);
                        }}
                    >
                        ←
                    </button>
                    <div 
                        className="relative h-8 px-8 border border-black bg-white w-[180px] flex items-center justify-center cursor-default select-none"
                        onWheel={(e) => {
                            e.preventDefault();
                            const currentIndex = selectedHabit 
                                ? habits.findIndex(h => h.name === selectedHabit.name)
                                : -1;
                            
                            if (e.deltaY > 0) {
                                const nextIndex = currentIndex >= habits.length - 1 ? -1 : currentIndex + 1;
                                onHabitChange(nextIndex === -1 ? null : habits[nextIndex]);
                            } else {
                                const prevIndex = currentIndex <= 0 ? habits.length - 1 : currentIndex - 1;
                                onHabitChange(habits[prevIndex] || null);
                            }
                        }}
                    >
                        {selectedHabit && (
                            <div
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-black"
                                style={{ backgroundColor: selectedHabit.color }}
                            />
                        )}
                        <span className="truncate">{selectedHabit?.name || "All Habits"}</span>
                    </div>
                    <button
                        className="h-8 w-8 border border-black bg-white hover:bg-black hover:text-white transition-colors focus:outline-none flex items-center justify-center"
                        onClick={() => {
                            const currentIndex = selectedHabit 
                                ? habits.findIndex(h => h.name === selectedHabit.name)
                                : -1;
                            const nextIndex = currentIndex >= habits.length - 1 ? -1 : currentIndex + 1;
                            onHabitChange(nextIndex === -1 ? null : habits[nextIndex]);
                        }}
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
}
