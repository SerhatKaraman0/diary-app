"use client";
import DayCard from "./DayCard";

export default function WeeklyView() {
    return (
        <>
        <div className="flex h-screen w-1/2 bg-white">
        <div className="grid grid-cols-3 gap-0 w-full h-full" style={{ gridTemplateRows: 'repeat(3, minmax(0, 1fr))' }}>
              {Array.from({ length: 7 }, (_, i) => (
                <DayCard key={i} date={i+1} weekly={true} className="h-52 w-52"/>
              ))}
          </div>
        </div>
      </>
    );
}
  