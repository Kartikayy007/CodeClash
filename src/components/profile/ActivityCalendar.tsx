import React from 'react';
import ActivityCalendarComponent from 'react-activity-calendar';
import { Tooltip } from '@mui/material';

interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ActivityCalendarProps {
  activityData: ActivityDay[];
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
  const defaultData: ActivityDay[] = [{
    date: new Date().toISOString().split('T')[0],
    count: 0,
    level: 0
  }];

  const displayData = activityData.length > 0 ? activityData : defaultData;

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
        <ActivityCalendarComponent
          data={displayData}
          theme={{
            light: ['#1E1B2E', 'rgba(200, 121, 235, 0.25)', 'rgba(200, 121, 235, 0.5)', 'rgba(200, 121, 235, 0.75)', 'rgba(200, 121, 235, 1)'],
            dark: ['#1E1B2E', 'rgba(200, 121, 235, 0.25)', 'rgba(200, 121, 235, 0.5)', 'rgba(200, 121, 235, 0.75)', 'rgba(200, 121, 235, 1)']
          }}
          labels={{
            months: months,
            weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            totalCount: '{{count}} matches in one year',
            legend: {
              less: 'Less',
              more: 'More'
            }
          }}
          hideTotalCount
          hideColorLegend
          showWeekdayLabels
          renderBlock={(block, activity) => (
            <Tooltip
              title={`${activity.count} matches on ${activity.date}`}
              placement="top"
              arrow
            >
              {block}
            </Tooltip>
          )}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px'
          }}
        />
      </div>
    </div>
  );
};

export default ActivityCalendar;
