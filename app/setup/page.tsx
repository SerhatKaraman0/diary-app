"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useUserSettings } from "@/lib/contexts/UserSettingsContext";
import { UserSettings, Habit } from "@/lib/types";
import { X, ArrowLeft } from "lucide-react";

type Step = 1 | 2 | 3;

const HABIT_COLORS = [
    "#FF4953", // bright red
    "#C79B60", // golden brown
    "#D4AF37", // muted gold
    "#2C3E50", // dusk blue
    "#E67E22", // sunset orange
    "#6C553A", // dark brown
    "#CC182B", // deep red
    "#9B7753", // medium brown
    "#4E4A3D", // deep brown-tan
    "#202A22", // very dark
];

function CalendarBackground() {
    return (
        <div className="absolute inset-0 flex h-screen w-full bg-journal-paper pointer-events-none opacity-20">
            <div className="grid grid-cols-10 w-full h-full overflow-hidden">
                {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border-r border-b border-gray-300 relative">
                        <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-gray-400" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function SetupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const testMode = searchParams.get("test") === "true";
    const { updateSettings, isSetupComplete, isInitialized } = useUserSettings();
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [name, setName] = useState("");
    const [notificationTime, setNotificationTime] = useState("");
    const [habits, setHabits] = useState<Habit[]>([]);
    const [habitInput, setHabitInput] = useState("");
    const [selectedColorIndex, setSelectedColorIndex] = useState(0);
    const [errors, setErrors] = useState<{
        name?: string;
        notificationTime?: string;
        habits?: string;
    }>({});

    useEffect(() => {
        if (isInitialized && isSetupComplete && !testMode) {
            router.push("/");
        }
    }, [isInitialized, isSetupComplete, router, testMode]);

    const usedColors = useMemo(() => new Set(habits.map((h) => h.color)), [habits]);

    useEffect(() => {
        if (habits.length === 0) {
            setSelectedColorIndex(0);
            return;
        }
        
        const currentColor = HABIT_COLORS[selectedColorIndex];
        if (usedColors.has(currentColor)) {
            const firstAvailable = HABIT_COLORS.findIndex(
                (color) => !usedColors.has(color)
            );
            if (firstAvailable !== -1) {
                setSelectedColorIndex(firstAvailable);
            }
        }
    }, [habits.length, selectedColorIndex, usedColors]);

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-journal-paper">
                <div className="typewriter animate-pulse">Initializing Journal...</div>
            </div>
        );
    }

    if (isSetupComplete && !testMode) {
        return null;
    }

    function validateStep(step: Step): boolean {
        const newErrors: typeof errors = {};
        if (step === 1) {
            if (!name.trim()) newErrors.name = "What shall we call you?";
        } else if (step === 2) {
            if (!notificationTime) newErrors.notificationTime = "When should I remind you?";
        } else if (step === 3) {
            if (habits.length === 0) newErrors.habits = "Add at least one habit to track!";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handlePreviousStep() {
        if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
    }

    function handleNextStep() {
        if (!validateStep(currentStep)) return;
        if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as Step);
        else handleSubmit();
    }

    function handleAddHabit() {
        const trimmed = habitInput.trim();
        if (!trimmed) return;
        if (habits.length >= 10) {
            setErrors((prev) => ({ ...prev, habits: "Wow, that's a lot of habits! Max 10." }));
            return;
        }
        if (habits.some((h) => h.name.toLowerCase() === trimmed.toLowerCase())) {
            setErrors((prev) => ({ ...prev, habits: "You're already tracking this!" }));
            return;
        }

        const selectedColor = HABIT_COLORS[selectedColorIndex];
        setHabits([...habits, { name: trimmed, color: selectedColor }]);
        setHabitInput("");
        
        const nextAvailableIndex = HABIT_COLORS.findIndex((color) => !usedColors.has(color) && color !== selectedColor);
        setSelectedColorIndex(nextAvailableIndex !== -1 ? nextAvailableIndex : 0);
        setErrors((prev) => {
            const rest = { ...prev };
            delete rest.habits;
            return rest;
        });
    }

    function handleRemoveHabit(idx: number) {
        setHabits(habits.filter((h, i) => i !== idx));
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (currentStep === 3 && habitInput.trim()) handleAddHabit();
            else if (currentStep !== 3) handleNextStep();
        }
    }

    function handleSubmit() {
        if (!validateStep(3)) return;
        const userSettings: UserSettings = {
            name: name.trim(),
            notificationTime,
            habits,
            setupComplete: true,
        };
        updateSettings(userSettings);
        router.push(testMode ? "/setup?test=true" : "/");
    }

    function isStepValid(step: Step): boolean {
        if (step === 1) return name.trim().length > 0;
        if (step === 2) return notificationTime.length > 0;
        if (step === 3) return habits.length > 0;
        return false;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <CalendarBackground />
            <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="relative bg-journal-paper w-full max-w-2xl border-2 border-gray-600 p-12 scrapbook-card overflow-hidden"
                style={{ borderRadius: '20px 30px 18px 25px' }}
            >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 washi-tape rotate-[-1deg] z-10" />
                
                <div className="mb-10 text-center">
                    <h1 className="label-maker mb-4 inline-block" style={{ transform: 'rotate(1deg)' }}>
                        JOURNAL <span className="opacity-50">SETUP</span>
                    </h1>
                    <div className="flex justify-center gap-2 mt-2">
                        {[1, 2, 3].map((s) => (
                            <div 
                                key={s} 
                                className={`w-3 h-3 rounded-full border border-gray-400 transition-colors ${currentStep >= s ? 'bg-journal-heart' : 'bg-white'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="min-h-[250px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 w-full"
                            >
                                <div className="space-y-2">
                                    <label className="typewriter text-xs">Your Signature</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        className="w-full bg-white border-2 border-gray-600 p-4 handwriting text-3xl focus:outline-none focus:ring-4 focus:ring-gray-100 scrapbook-card !p-4"
                                        placeholder="Type your name..."
                                        autoFocus
                                    />
                                    {errors.name && <p className="handwriting text-journal-heart text-sm">{errors.name}</p>}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 w-full"
                            >
                                <div className="space-y-2">
                                    <label className="typewriter text-xs">Daily Reflection Time</label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            value={notificationTime}
                                            onChange={(e) => setNotificationTime(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="w-full bg-white border-2 border-gray-600 p-4 font-heading text-4xl focus:outline-none focus:ring-4 focus:ring-gray-100 scrapbook-card !p-4"
                                            autoFocus
                                        />
                                        <div className="absolute -right-4 -top-4 w-12 h-12 washi-tape rotate-12 opacity-30" />
                                    </div>
                                    {errors.notificationTime && <p className="handwriting text-journal-heart text-sm">{errors.notificationTime}</p>}
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 w-full"
                            >
                                <div className="space-y-4">
                                    <label className="typewriter text-xs">Things to Cultivate</label>
                                    <div className="flex gap-2 relative">
                                        <input
                                            type="text"
                                            value={habitInput}
                                            onChange={(e) => setHabitInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="flex-1 bg-white border-2 border-gray-600 p-3 handwriting text-xl focus:outline-none scrapbook-card !p-3"
                                            placeholder="Add a new habit..."
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleAddHabit}
                                            className="bg-gray-600 text-white px-6 font-heading text-xs uppercase tracking-widest hover:bg-gray-700 transition-colors border-2 border-gray-800"
                                            style={{ borderRadius: '4px 12px 3px 8px' }}
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {HABIT_COLORS.map((color, index) => {
                                            const isUsed = usedColors.has(color);
                                            const isSelected = selectedColorIndex === index;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => !isUsed && setSelectedColorIndex(index)}
                                                    className={`w-6 h-6 rounded-full border-2 transition-all ${isSelected ? 'border-gray-800 scale-125 ring-2 ring-gray-200 ring-offset-1' : 'border-transparent opacity-40'}`}
                                                    style={{ backgroundColor: color }}
                                                    disabled={isUsed}
                                                />
                                            );
                                        })}
                                    </div>

                                    <div className="max-h-[150px] overflow-y-auto pr-2 custom-scrollbar flex flex-wrap gap-2 pt-4">
                                        {habits.map((habit, index) => (
                                            <motion.div
                                                key={index}
                                                layout
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="bg-white border-2 border-gray-600 px-3 py-1 flex items-center gap-2 scrapbook-card !p-1"
                                                style={{ borderRadius: '4px 8px', transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)` }}
                                            >
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                                                <span className="handwriting text-sm">{habit.name}</span>
                                                <button onClick={() => handleRemoveHabit(index)} className="text-gray-400 hover:text-journal-heart transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                    {errors.habits && <p className="handwriting text-journal-heart text-sm">{errors.habits}</p>}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-12 flex gap-4">
                    {currentStep > 1 && (
                        <button
                            onClick={handlePreviousStep}
                            className="flex items-center gap-2 typewriter text-xs hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                    )}
                    <button
                        onClick={handleNextStep}
                        disabled={!isStepValid(currentStep)}
                        className="flex-1 bg-gray-600 text-white p-4 font-heading text-sm uppercase tracking-widest border-2 border-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30"
                        style={{ 
                            borderRadius: '8px 12px 10px 15px',
                            boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
                        }}
                    >
                        {currentStep === 3 ? "Open My Journal" : "Next Step"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default function SetupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-journal-paper">
                <div className="typewriter">Opening Journal...</div>
            </div>
        }>
            <SetupContent />
        </Suspense>
    );
}
