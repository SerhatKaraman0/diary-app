"use client";
import React, { useState } from "react";
import DayCard from "./DayCard";
import DayModal from "./DayModal";
import { fakeData } from "@/lib/assets/fakeData";

const daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CalendarComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  let totalDayIndex = 1;

  const handleDayClick = (day: number, month: number) => {
    const date = new Date(new Date().getFullYear(), month, day);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex h-screen w-full bg-white">
        <div className="grid grid-cols-10 w-full h-full overflow-y-auto no-scrollbar">
          {daysOfMonths.flatMap((days, monthIndex) =>
            Array.from({ length: days }, (_, dayIndex) => (
              <DayCard
                scrollId={`${months[monthIndex]}-${dayIndex+1}`}
                key={`${monthIndex}-${dayIndex}`}
                month={months[monthIndex]}
                day={`${dayIndex + 1}`}
                totalDayIndex={totalDayIndex++}
                className="square"
                onClick={() => handleDayClick(dayIndex + 1, monthIndex)}
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
      />
    </>
  );
}

export const CalendarComp = React.memo(CalendarComponent);