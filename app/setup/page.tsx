"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useUserSettings } from "@/lib/contexts/UserSettingsContext";
import { UserSettings, Habit } from "@/lib/types";
import { X, ArrowLeft } from "lucide-react";

type Step = 1 | 2 | 3;

const daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const HABIT_COLORS = [
    "#EF4444", // red
    "#F97316", // orange
    "#EAB308", // yellow
    "#22C55E", // green
    "#06B6D4", // cyan
    "#3B82F6", // blue
    "#6366F1", // indigo
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#F43F5E", // rose
];

function CalendarBackground() {
    const calculateTotalDayIndex = (monthIndex: number, dayIndex: number): number => {
        let total = 0;
        for (let i = 0; i < monthIndex; i++) {
            total += daysOfMonths[i];
        }
        return total + dayIndex + 1;
    };

    return (
        <div className="absolute inset-0 flex h-screen w-full bg-white pointer-events-none">
            <div className="grid grid-cols-10 w-full h-full overflow-hidden">
                {daysOfMonths.flatMap((days, monthIndex) =>
                    Array.from({ length: days }, (_, dayIndex) => (
                        <div key={`${monthIndex}-${dayIndex}`} className="relative square pointer-events-none">
                            <div className="absolute inset-0 border-r border-b border-black p-4">
                                <p className="absolute top-0 left-0 pl-2 text-red-400 text-3xl">{dayIndex + 1}</p>
                                <p className="absolute bottom-0 left-0 pl-2 text-xl">{months[monthIndex]}</p>
                                <p className="absolute bottom-0 right-0 pr-2 text-slate-600 text-lg">
                                    {calculateTotalDayIndex(monthIndex, dayIndex)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default function SetupPage() {
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

    // Get used colors from existing habits
    const usedColors = new Set(habits.map((h) => h.color));

    // Only reset color selection when habits array changes (not on every render)
    useEffect(() => {
        if (habits.length === 0) {
            setSelectedColorIndex(0);
            return;
        }
        
        // Only auto-select if current selection is used
        const currentColor = HABIT_COLORS[selectedColorIndex];
        if (usedColors.has(currentColor)) {
            // Current selection is used, find first available
            const firstAvailable = HABIT_COLORS.findIndex(
                (color) => !usedColors.has(color)
            );
            if (firstAvailable !== -1) {
                setSelectedColorIndex(firstAvailable);
            }
        }
    }, [habits.length]); // Only depend on habits.length, not selectedColorIndex

    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (isSetupComplete && !testMode) {
        return null;
    }

    function validateStep(step: Step): boolean {
        const newErrors: typeof errors = {};

        if (step === 1) {
            if (!name.trim()) {
                newErrors.name = "Name is required";
            }
        } else if (step === 2) {
            if (!notificationTime) {
                newErrors.notificationTime = "Notification time is required";
            }
        } else if (step === 3) {
            if (habits.length === 0) {
                newErrors.habits = "At least one habit is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handlePreviousStep() {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as Step);
        }
    }

    function handleNextStep() {
        if (!validateStep(currentStep)) {
            return;
        }

        if (currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as Step);
        } else {
            handleSubmit();
        }
    }

    function handleAddHabit() {
        const trimmed = habitInput.trim();
        if (!trimmed) {
            return;
        }

        if (habits.length >= 10) {
            setErrors((prev) => ({
                ...prev,
                habits: "Maximum 10 habits allowed",
            }));
            return;
        }

        if (habits.some((h) => h.name.toLowerCase() === trimmed.toLowerCase())) {
            setErrors((prev) => ({
                ...prev,
                habits: "This habit already exists",
            }));
            return;
        }

        const selectedColor = HABIT_COLORS[selectedColorIndex];
        if (usedColors.has(selectedColor)) {
            setErrors((prev) => ({
                ...prev,
                habits: "This color is already used by another habit",
            }));
            return;
        }

        const newHabit: Habit = {
            name: trimmed,
            color: selectedColor,
        };

        setHabits([...habits, newHabit]);
        setHabitInput("");
        
        // Find next available color
        const nextAvailableIndex = HABIT_COLORS.findIndex(
            (color) => !usedColors.has(color) && color !== selectedColor
        );
        setSelectedColorIndex(nextAvailableIndex !== -1 ? nextAvailableIndex : 0);
        
        setErrors((prev) => {
            const { habits: _, ...rest } = prev;
            return rest;
        });
    }

    function handleRemoveHabit(index: number) {
        setHabits(habits.filter((_, i) => i !== index));
        if (errors.habits && habits.length > 1) {
            setErrors((prev) => {
                const { habits: _, ...rest } = prev;
                return rest;
            });
        }
    }

    function handleUpdateHabitColor(index: number, color: string) {
        // Check if color is used by another habit
        const isColorUsed = habits.some((h, i) => i !== index && h.color === color);
        if (isColorUsed) {
            return; // Don't allow using the same color
        }
        setHabits(habits.map((habit, i) => (i === index ? { ...habit, color } : habit)));
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            if (currentStep === 3 && habitInput.trim()) {
                handleAddHabit();
            } else if (currentStep !== 3) {
                handleNextStep();
            }
        }
    }

    function handleSubmit() {
        if (!validateStep(3)) {
            return;
        }

        const userSettings: UserSettings = {
            name: name.trim(),
            notificationTime,
            habits,
            setupComplete: true,
        };

        updateSettings(userSettings);
        if (testMode) {
            router.push("/setup?test=true");
        } else {
            router.push("/");
        }
    }

    function isStepValid(step: Step): boolean {
        if (step === 1) {
            return name.trim().length > 0;
        } else if (step === 2) {
            return notificationTime.length > 0;
        } else if (step === 3) {
            return habits.length > 0;
        }
        return false;
    }

    function renderStepContent() {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 w-full"
                    >
                        <label htmlFor="name" className="block text-sm font-medium">
                            Your Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (errors.name) {
                                    setErrors((prev) => ({ ...prev, name: undefined }));
                                }
                            }}
                            onKeyDown={handleKeyDown}
                            className="w-full h-10 px-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Enter your name"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 w-full"
                    >
                        <label htmlFor="notificationTime" className="block text-sm font-medium">
                            Notification Time
                        </label>
                        <input
                            id="notificationTime"
                            type="time"
                            value={notificationTime}
                            onChange={(e) => {
                                setNotificationTime(e.target.value);
                                if (errors.notificationTime) {
                                    setErrors((prev) => ({ ...prev, notificationTime: undefined }));
                                }
                            }}
                            onKeyDown={handleKeyDown}
                            className="w-full h-10 px-3 border border-black focus:outline-none focus:ring-2 focus:ring-black"
                            autoFocus
                        />
                        {errors.notificationTime && (
                            <p className="text-sm text-destructive">{errors.notificationTime}</p>
                        )}
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 w-full"
                    >
                        <label htmlFor="habits" className="block text-sm font-medium">
                            Habits to Track
                        </label>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    id="habits"
                                    type="text"
                                    value={habitInput}
                                    onChange={(e) => setHabitInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={habits.length >= 10}
                                    className="flex-1 h-10 px-3 border border-black focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder={
                                        habits.length >= 10
                                            ? "Maximum 10 habits reached"
                                            : "Enter a habit"
                                    }
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={handleAddHabit}
                                    disabled={habits.length >= 10 || !habitInput.trim()}
                                    className="h-10 px-4 border border-black bg-white hover:bg-black hover:text-white transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black"
                                >
                                    Add
                                </button>
                            </div>

                            {habitInput.trim() && habits.length < 10 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-2 p-2 border border-black bg-white overflow-hidden"
                                >
                                    <span className="text-xs text-muted-foreground">Color:</span>
                                    <div className="flex gap-1.5 flex-1">
                                        {HABIT_COLORS.map((color, index) => {
                                            const isUsed = usedColors.has(color);
                                            const isSelected = selectedColorIndex === index;
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        if (!isUsed) {
                                                            setSelectedColorIndex(index);
                                                        }
                                                    }}
                                                    disabled={isUsed}
                                                    className={`w-6 h-6 rounded-full border-2 transition-all ${
                                                        isSelected
                                                            ? "border-black scale-110"
                                                            : isUsed
                                                            ? "border-gray-300 opacity-40 cursor-not-allowed"
                                                            : "border-transparent hover:border-gray-400"
                                                    }`}
                                                    style={{ backgroundColor: color }}
                                                    aria-label={`Select color ${index + 1}${isUsed ? " (already used)" : ""}`}
                                                    title={isUsed ? "This color is already used" : ""}
                                                />
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                        {errors.habits && (
                            <p className="text-sm text-destructive">{errors.habits}</p>
                        )}

                        {habits.length > 0 && (
                            <div className="grid grid-cols-5 gap-2 mt-4">
                                <AnimatePresence mode="popLayout">
                                    {habits.map((habit, index) => (
                                        <motion.div
                                            key={`${habit.name}-${index}`}
                                            layout
                                            initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } }}
                                            transition={{ 
                                                duration: 0.3, 
                                                delay: index * 0.03,
                                                layout: { duration: 0.2 }
                                            }}
                                            className="relative flex flex-col items-center justify-center p-2 border border-black bg-white group"
                                        >
                                        <div
                                            className="w-full h-8 mb-1 rounded-sm transition-colors"
                                            style={{ backgroundColor: habit.color }}
                                        />
                                        <span className="text-xs truncate w-full text-center">
                                            {habit.name}
                                        </span>
                                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="relative group/color">
                                                <button
                                                    type="button"
                                                    className="p-0.5 hover:bg-black hover:text-white transition-colors focus:outline-none"
                                                    aria-label={`Change color for ${habit.name}`}
                                                >
                                                    <div
                                                        className="w-3 h-3 rounded-full border border-black"
                                                        style={{ backgroundColor: habit.color }}
                                                    />
                                                </button>
                                                <div className="absolute top-full right-0 mt-1 p-2 bg-white border border-black z-10 hidden group-hover/color:block group-focus-within/color:block">
                                                    <div className="flex gap-1.5">
                                                        {HABIT_COLORS.map((color, colorIndex) => {
                                                            const isColorUsed = habits.some((h, i) => i !== index && h.color === color);
                                                            const isCurrentColor = habit.color === color;
                                                            return (
                                                                <button
                                                                    key={colorIndex}
                                                                    type="button"
                                                                    onClick={() => !isColorUsed && handleUpdateHabitColor(index, color)}
                                                                    disabled={isColorUsed}
                                                                    className={`w-5 h-5 rounded-full border-2 transition-all ${
                                                                        isCurrentColor
                                                                            ? "border-black scale-110"
                                                                            : isColorUsed
                                                                            ? "border-gray-300 opacity-40 cursor-not-allowed"
                                                                            : "border-transparent hover:border-gray-400"
                                                                    }`}
                                                                    style={{ backgroundColor: color }}
                                                                    aria-label={`Change to color ${colorIndex + 1}${isColorUsed ? " (already used)" : ""}`}
                                                                    title={isColorUsed ? "This color is already used" : ""}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveHabit(index)}
                                                className="p-0.5 hover:bg-black hover:text-white transition-colors focus:outline-none"
                                                aria-label={`Remove ${habit.name}`}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {habits.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Add at least one habit to continue
                            </p>
                        )}
                    </motion.div>
                );

            default:
                return null;
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <CalendarBackground />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-background w-full max-w-3xl mx-4 border border-black p-8 flex flex-col max-h-[90vh] shadow-2xl"
            >
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Welcome! Let's get started</h1>
                    <p className="text-sm text-muted-foreground">
                        Step {currentStep} of 3
                    </p>
                    {testMode && (
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            Test Mode: Setup page accessible
                        </p>
                    )}
                </div>

                <div className="flex-1 flex items-center justify-center min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex gap-3">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={handlePreviousStep}
                            className="flex items-center justify-center gap-2 h-12 px-4 border border-black bg-white hover:bg-black hover:text-white transition-colors focus:outline-none"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleNextStep}
                        disabled={!isStepValid(currentStep)}
                        className={`flex-1 h-12 px-4 border border-black bg-white hover:bg-black hover:text-white transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black ${
                            currentStep === 1 ? "" : ""
                        }`}
                    >
                        {currentStep === 3 ? "Complete Setup" : "Continue"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
