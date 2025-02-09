const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Define the status types more explicitly
type Status = 'active' | 'empty' | 'inactive';

interface ActivityCalendarProps {
  activityData: Status[][][]; // 3D array: months > weeks > days
  months: string[];
  startMonthIndex: number;
  visibleMonths: string[];
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activityData,
  months,
  startMonthIndex,
  visibleMonths,
  handlePrevMonth,
  handleNextMonth
}) => {
  return (
    <div className="relative">
      <button 
        className={`absolute left-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-2xl
          ${startMonthIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handlePrevMonth}
        disabled={startMonthIndex === 0}
      >
        ←
      </button>
      <button 
        className={`absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-2xl
          ${startMonthIndex >= months.length - 4 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleNextMonth}
        disabled={startMonthIndex >= months.length - 4}
      >
        →
      </button>

      <div className="px-8">
        <div className="flex gap-8 transition-all duration-300 justify-center">
          {visibleMonths.map((month, monthIndex) => (
            <div key={month} className="flex flex-col">
              <div className="flex gap-2 mb-2">
                {weekDays.map((day, index) => (
                  <div key={index} className="w-[10px] text-center">
                    <span className="text-gray-400 text-[10px]">{day}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-[3px]">
                {activityData[monthIndex]?.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex gap-2">
                    {week.map((status, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`
                          h-[10px] w-[10px] rounded-[1px]
                          ${status === 'active' ? 'bg-purple-500' : 
                            status === 'empty' ? 'bg-transparent' : 'bg-[#282C34]'}
                        `}
                        title={status !== 'empty' ? 
                          `${visibleMonths[monthIndex]} ${weekDays[dayIndex]}`
                          : ''}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-base text-center mt-4">
                {visibleMonths[monthIndex]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityCalendar;
