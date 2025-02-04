"use client";
import DayCard from "./DayCard";

export default function MonthlyView() {
  return (
    <>
      <div className="flex h-screen w-3/4 bg-white">
        <div className="grid grid-cols-7 gap-0 w-full h-full" style={{ gridTemplateRows: 'repeat(5, minmax(0, 1fr))' }}>
          {Array.from({ length: 31 }, (_, i) => (
            <DayCard key={i} date={i + 1} />
          ))}
        </div>
      </div>
    </>
  );
}
