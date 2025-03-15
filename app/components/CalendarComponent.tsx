"use client";
import React, { useState } from "react";
import DayCard from "./DayCard";
import DayModal from "./DayModal";


const daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CalendarComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState({ day: '', month: '' });

  let totalDayIndex = 1;

  const handleDayCardClick = (day, month) => {
    console.log(`DayCard clicked: ${day} ${month}`);
    setSelectedDay({ day, month });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex h-screen w-full bg-white">
        <div className="grid grid-cols-10 gap-0 w-full h-full overflow-y-auto no-scrollbar">
          {daysOfMonths.flatMap((days, monthIndex) =>
            Array.from({ length: days }, (_, dayIndex) => (
              <DayCard
                scrollId={`${months[monthIndex]}-${dayIndex+1}`}
                key={`${monthIndex}-${dayIndex}`}
                month={months[monthIndex]}
                day={`${dayIndex + 1}`}
                totalDayIndex={totalDayIndex++}
                className="square"
                onClick={() => handleDayCardClick(`${dayIndex + 1}`, months[monthIndex])}
                style={{
                  width: 'calc(100vw / 10)',
                  height: 'calc(100vw / 10)',
                  maxWidth: '100px',
                  maxHeight: '100px',
                }}
              />
            ))
          )}
        </div>
      </div>
      {isModalOpen && (
        <>
          {console.log('Rendering DayModal')}
          <DayModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
    </>
  );
}

export const CalendarComp = React.memo(CalendarComponent);