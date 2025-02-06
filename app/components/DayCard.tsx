"use client"; 
import { motion } from "motion/react"

interface Props extends React.PropsWithChildren {
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  day?: string;
  month?: string;
  totalDayIndex?: number;
  key?: string;
  scrollId?: string;
}

const DayCard: React.FC<Props> = ({
  className = "",
  totalDayIndex,
  day,
  month,
  scrollId,
}) => {
  const isLeftmostCell = totalDayIndex ? totalDayIndex % 10 === 1 : false;
  return (
    <motion.div
        id={scrollId}
        className={`relative border-r border-b ${isLeftmostCell ? 'border-l' : ''}  border-black p-4 min-h-[120px] hover:bg-green-500 transition-colors ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <p className="absolute top-0 left-0 pl-2 text-red-400 text-3xl">{day}</p>
        <p className="absolute bottom-0 left-0 pl-2 text-xl">{month}</p>
        <p className="absolute  bottom-0 right-0 pr-2 text-slate-600 text-lg">{totalDayIndex}</p>
      </motion.div>
  );
};

export default DayCard;