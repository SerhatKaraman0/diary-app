"use client";
import DayCard from "./DayCard";

const daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function CalendarComponent() {
  let totalDayIndex = 1;

  return (
    <>
      <div className="flex h-screen w-full bg-white">
        <div className="grid grid-cols-10 gap-0 w-full h-full overflow-y-auto">
          {daysOfMonths.flatMap((days, monthIndex) =>
            Array.from({ length: days }, (_, dayIndex) => (
              <DayCard
                scrollId={`${months[monthIndex]}-${dayIndex+1}`}
                key={`${monthIndex}-${dayIndex}`}
                month={months[monthIndex]}
                day={`${dayIndex + 1}`}
                totalDayIndex={totalDayIndex++}
                className="square"
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}