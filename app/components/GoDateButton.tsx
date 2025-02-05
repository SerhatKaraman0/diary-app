"use client";
import React, { useState } from "react";

export default function GoDateButton() {
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

    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedDay, setSelectedDay] = useState("");

    return (
        <>
            <div className="z-10 fixed left-1/2 -translate-x-1/2 flex text-center justify-center items-center w-1/4 h-12 mt-4 bg-white border-2 p-2 border-black text-black">
                <select
                    className="w-72 border-2 border-black p-1"
                    name="month"
                    id="month"
                    onChange={(e) => {
                        setSelectedMonth(e.target.value);
                        setSelectedDay(""); 
                    }}
                    value={selectedMonth}
                >
                    <option value="" disabled>Select Month</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.value}
                        </option>
                    ))}
                </select>
                <select
                    className="w-72 border-2 border-black p-1 ml-2"
                    name="day"
                    id="day"
                    onChange={(e) => setSelectedDay(e.target.value)}
                    value={selectedDay}
                    disabled={!selectedMonth} // Disable day select if no month is selected
                >
                    <option value="" disabled>Select Day</option>
                    {selectedMonth && Array.from({ length: options.find(option => option.value === selectedMonth)?.label || 0 }, (_, dayIndex) => (
                        <option key={dayIndex + 1} value={dayIndex + 1}>
                            {dayIndex + 1}
                        </option>
                    ))}
                </select>
                <button className="ml-2 border-2 border-black px-2 py-0.5 hover:bg-green-600 hover:text-white">GO</button>
            </div>
        </>
    );
}