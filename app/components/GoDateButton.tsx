"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function GoDateButton() {
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);

    const options = [
        { value: "Jan", label: 31 },
        { value: "Feb", label: 28 },
        { value: "Mar", label: 31 },
        { value: "Apr", label: 30 },
        { value: "May", label: 31 },
        { value: "Jun", label: 30 },
        { value: "Jul", label: 31 },
        { value: "Aug", label: 31 },
        { value: "Sep", label: 30 },
        { value: "Oct", label: 31 },
        { value: "Nov", label: 30 },
        { value: "Dec", label: 31 },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            setIsScrolled(scrollPercentage > 15);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    return (
        <motion.div 
            className="fixed z-50 flex items-center gap-2 bg-white"
            initial={false}
            animate={{
                top: isScrolled ? 0 : "2rem",
                right: isScrolled ? 0 : "50%",
                transform: isScrolled ? "translateX(0)" : "translateX(50%)",
                padding: "0.5rem",
                borderLeft: isScrolled ? "1px solid black" : "none",
                borderBottom: isScrolled ? "1px solid black" : "none"
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
        >
            <select
                className="h-8 px-2 border border-black focus:outline-none"
                value={selectedMonth}
                onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setSelectedDay("");
                }}
            >
                <option value="" disabled>Select Month</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.value}
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
                    { length: options.find(option => option.value === selectedMonth)?.label || 0 }, 
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
        </motion.div>
    );
}