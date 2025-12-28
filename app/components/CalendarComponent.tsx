"use client";
import React, { useState, useEffect } from "react";
import DayCard from "./DayCard";
import DayModal from "./DayModal";
import { fakeData } from "@/lib/assets/fakeData";
import { Habit, DayData } from "@/lib/types";
import { saveDayData, getDayData, getAllDayData } from "@/lib/utils/dayDataStorage";

const daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface CalendarComponentProps {
  selectedHabit: Habit | null;
}

export default function CalendarComponent({ selectedHabit }: CalendarComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayDataMap, setDayDataMap] = useState<Record<string, DayData>>({});

  useEffect(() => {
    setDayDataMap(getAllDayData());
  }, []);

  const handleDayClick = (day: number, month: number) => {
    const date = new Date(new Date().getFullYear(), month, day);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleSaveDayData = (data: DayData) => {
    saveDayData(data);
    setDayDataMap(getAllDayData());
  };

  const getDayDataForDate = (day: number, month: number): DayData | undefined => {
    const date = new Date(new Date().getFullYear(), month, day);
    const dateKey = date.toISOString().split('T')[0];
    return dayDataMap[dateKey];
  };

  // Calculate totalDayIndex deterministically
  const calculateTotalDayIndex = (monthIndex: number, dayIndex: number): number => {
    let total = 0;
    for (let i = 0; i < monthIndex; i++) {
      total += daysOfMonths[i];
    }
    return total + dayIndex + 1;
  };

  return (
    <>
      <div className="flex h-full w-full bg-white">
        <div className="grid grid-cols-10 w-full h-full overflow-y-auto no-scrollbar p-4 md:p-6 lg:p-8">
          {daysOfMonths.flatMap((days, monthIndex) =>
            Array.from({ length: days }, (_, dayIndex) => (
              <DayCard
                scrollId={`${months[monthIndex]}-${dayIndex+1}`}
                key={`${monthIndex}-${dayIndex}`}
                month={months[monthIndex]}
                day={`${dayIndex + 1}`}
                totalDayIndex={calculateTotalDayIndex(monthIndex, dayIndex)}
                className="square"
                onClick={() => handleDayClick(dayIndex + 1, monthIndex)}
                dayData={getDayDataForDate(dayIndex + 1, monthIndex)}
              />
            ))
          )}
        </div>
      </div>

      <DayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        notes={fakeData}
        date={selectedDate}
        dayData={selectedDate ? getDayData(selectedDate) : undefined}
        onSave={handleSaveDayData}
      />
    </>
  );
}

export const CalendarComp = React.memo(CalendarComponent);
