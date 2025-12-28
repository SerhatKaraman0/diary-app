"use client"; 
import { motion } from "motion/react"
import { DayData } from "@/lib/types"

interface Props extends React.PropsWithChildren {
  className?: string;
  isActive?: boolean;
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
  const isLeftmostCell = totalDayIndex ? totalDayIndex % 10 === 1 : false;
  const isTopRow = totalDayIndex ? totalDayIndex <= 10 : false;
  
  return (
    <div className={`relative ${className}`}>
      <motion.div
        id={scrollId}
        onClick={onClick}
        className={`absolute inset-0 border-r border-b ${isLeftmostCell ? 'border-l' : ''} ${isTopRow ? 'border-t' : ''} border-black p-4 hover:bg-green-500 transition-colors cursor-pointer overflow-hidden`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {dayData?.doodle && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img 
              src={dayData.doodle} 
              alt="Doodle preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <p className="absolute top-0 left-0 pl-2 text-red-400 text-3xl z-10">{day}</p>
        <p className="absolute bottom-0 left-0 pl-2 text-xl z-10">{month}</p>
        <p className="absolute bottom-0 right-0 pr-2 text-slate-600 text-lg z-10">#{totalDayIndex}</p>
      </motion.div>
    </div>
  );
};

export default DayCard;