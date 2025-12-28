"use client";
import { useState } from "react";
import { useUserSettings } from "@/lib/contexts/UserSettingsContext";
import { Habit } from "@/lib/types";
import { motion } from "motion/react";

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
                
                document.querySelectorAll('.month-highlight').forEach(el => {
                    el.classList.remove('month-highlight', 'blink-animation');
                });

                element.classList.add('month-highlight', 'blink-animation');
                
                setTimeout(() => {
                    element.classList.remove('blink-animation');
                }, 2000);
            }
        }
    };

    const habits = settings?.habits || [];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-journal-paper border-b-2 border-gray-600 shadow-sm h-20">
            {/* Progress Bar as Washi Tape */}
            <div className="absolute bottom-0 left-0 right-0 h-[6px] opacity-70 overflow-hidden pointer-events-none">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full"
                    style={{ 
                        background: 'repeating-linear-gradient(45deg, #D4AF37, #D4AF37 10px, #C79B60 10px, #C79B60 20px)'
                    }}
                />
            </div>

            <div className="flex items-center justify-between px-8 py-2 h-full">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <motion.div
                        whileHover={{ rotate: -2, scale: 1.05 }}
                        className="label-maker cursor-default"
                        style={{ transform: 'rotate(-1.5deg)' }}
                    >
                        DIARY <span className="opacity-40 ml-1">2025</span>
                    </motion.div>
                </div>

                {/* Center: Date Selection */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-neutral-50 border-2 border-gray-600 p-1 px-3 shadow-[3px_3px_0px_rgba(0,0,0,0.1)]" 
                         style={{ borderRadius: '6px 12px 8px 10px', transform: 'rotate(0.5deg)' }}>
                        <select
                            className="bg-transparent h-8 font-mono text-xs uppercase tracking-tight focus:outline-none cursor-pointer text-gray-600"
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value);
                                setSelectedDay("");
                            }}
                        >
                            <option value="" disabled>MONTH</option>
                            {months.map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                        
                        <div className="w-[2px] h-4 bg-gray-300" />

                        <select
                            className="bg-transparent h-8 font-mono text-xs uppercase tracking-tight focus:outline-none cursor-pointer text-gray-600"
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            disabled={!selectedMonth}
                        >
                            <option value="" disabled>DAY</option>
                            {selectedMonth && Array.from(
                                { length: daysOfMonths[months.indexOf(selectedMonth)] || 0 }, 
                                (_, dayIndex) => (
                                    <option key={dayIndex + 1} value={dayIndex + 1}>
                                        {dayIndex + 1}
                                    </option>
                                )
                            )}
                        </select>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.05, rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-gray-600 text-journal-paper font-heading text-xs uppercase tracking-widest border-2 border-gray-800 shadow-[4px_4px_0px_rgba(0,0,0,0.1)] transition-all"
                        style={{ transform: 'rotate(-1deg)' }}
                        onClick={handleGoClick}
                    >
                        GO
                    </motion.button>
                </div>

                {/* Right: Habit Switcher */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            className="h-8 w-8 flex items-center justify-center font-bold text-gray-500 hover:text-gray-800 transition-colors"
                            onClick={() => {
                                const currentIndex = selectedHabit 
                                    ? habits.findIndex(h => h.name === selectedHabit.name)
                                    : -1;
                                const prevIndex = currentIndex <= 0 ? habits.length - 1 : currentIndex - 1;
                                onHabitChange(habits[prevIndex] || null);
                            }}
                        >
                            <span className="text-xl">«</span>
                        </motion.button>

                        <motion.div 
                            className="relative h-11 px-8 bg-white border-2 border-gray-600 min-w-[180px] flex items-center justify-center cursor-default select-none shadow-[4px_4px_0px_rgba(0,0,0,0.05)]"
                            style={{ 
                                borderRadius: '12px 18px 10px 14px',
                                transform: 'rotate(1.5deg)'
                            }}
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
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-gray-400"
                                    style={{ backgroundColor: selectedHabit.color }}
                                />
                            )}
                            <span className="handwriting text-lg truncate pt-1 text-gray-700">
                                {selectedHabit?.name || "Life Overview"}
                            </span>
                            
                            {/* Decorative sticker on habit switcher */}
                            <div className="absolute -top-2 -right-2 text-xl rotate-12 opacity-40">✨</div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.8 }}
                            className="h-8 w-8 flex items-center justify-center font-bold text-gray-500 hover:text-gray-800 transition-colors"
                            onClick={() => {
                                const currentIndex = selectedHabit 
                                    ? habits.findIndex(h => h.name === selectedHabit.name)
                                    : -1;
                                const nextIndex = currentIndex >= habits.length - 1 ? -1 : currentIndex + 1;
                                onHabitChange(nextIndex === -1 ? null : habits[nextIndex]);
                            }}
                        >
                            <span className="text-xl">»</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
