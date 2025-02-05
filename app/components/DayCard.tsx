"use client"; 

interface Props extends React.PropsWithChildren {
    className?: string;
    isActive?: boolean;
    onClick?: () => void;
    day?: string;
    month?: string;
    totalDayIndex?: number;
    key?: string;
  }
  const DayCard: React.FC<Props> = ({
    onClick,
    children,
    className = "",
    totalDayIndex,
    day,
    month,
    isActive = false,
  }) => {
    const isLeftmostCell = day ? Number(day) % 10 === 1 : false;
    return (
      <div
        className={`relative border-r border-b ${isLeftmostCell ? 'border-l' : ''}  border-black p-4 min-h-[120px] hover:bg-green-500 transition-colors ${className}`}
      >
        <p className="absolute top-0 left-0 pl-2">{day}</p>
        <p className="absolute bottom-0 left-0 pl-2">{month}</p>
        <p className="absolute  bottom-0 right-0 pr-2">{totalDayIndex}</p>
      </div>
    );
  };

  export default DayCard;