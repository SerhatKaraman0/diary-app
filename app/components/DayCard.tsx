"use client"; 

interface Props extends React.PropsWithChildren {
    className?: string;
    isActive?: boolean;
    onClick?: () => void;
    date?: number;
    key?: number;
    weekly?: boolean;
  }
  const DayCard: React.FC<Props> = ({
    onClick,
    children,
    className = "",
    date,
    weekly,
    isActive = false,
  }) => {
    const isLeftmostCell = (date && date % 7 === 1);
    return (
      <div
        className={`border-r border-b ${isLeftmostCell ? 'border-l' : ''} ${weekly ? 'border-l' : ''} border-black p-4 min-h-[120px] hover:bg-gray-50 transition-colors`}
      >
        <p>{date}</p>
      </div>
    );
  };

  export default DayCard;