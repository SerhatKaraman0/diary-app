"use client"; 
import { motion } from "motion/react"
import { DayData } from "@/lib/types"

interface Props extends React.PropsWithChildren {
  className?: string;
  onClick?: () => void;
  day?: string;
  month?: string;
  totalDayIndex?: number;
  key?: string;
  scrollId?: string;
  dayData?: DayData;
}

const DayCard: React.FC<Props> = ({
  className = "",
  totalDayIndex,
  day,
  month,
  scrollId,
  onClick,
  dayData,
}) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        id={scrollId}
        onClick={onClick}
        className={`absolute inset-0 border-2 border-gray-600 bg-journal-paper p-4 hover:scale-[1.05] transition-all cursor-pointer overflow-hidden scrapbook-card flex flex-col justify-between`}
        style={{
          borderRadius: `${8 + (totalDayIndex || 0) % 5}px ${12 + (totalDayIndex || 0) % 4}px ${10 + (totalDayIndex || 0) % 6}px ${15 + (totalDayIndex || 0) % 3}px`,
          transform: `rotate(${(totalDayIndex || 0) % 2 === 0 ? -0.5 : 0.5}deg)`,
        }}
        whileHover={{ 
          scale: 1.05,
          rotate: (totalDayIndex || 0) % 2 === 0 ? -1 : 1,
          boxShadow: '6px 6px 0px rgba(0,0,0,0.15)'
        }}
        whileTap={{ scale: 0.95 }}
      >
        {dayData?.doodle && (
          <div className="absolute inset-0 opacity-40 pointer-events-none p-2">
            <img 
              src={dayData.doodle} 
              alt="Doodle preview" 
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <div className="flex justify-between items-start z-10">
          <p className="label-maker" style={{ transform: 'rotate(-2deg)' }}>{day}</p>
          <p className="typewriter opacity-60">#{totalDayIndex}</p>
        </div>
        <div className="flex justify-between items-end z-10">
          <p className="handwriting text-sm uppercase tracking-widest">{month}</p>
          {dayData?.mood && (
            <div className="w-4 h-4 rounded-full border border-gray-400" style={{ backgroundColor: dayData.moodColor }} />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DayCard;