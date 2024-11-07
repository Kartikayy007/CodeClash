import React, { useState } from 'react';
import { format, addWeeks, subWeeks, startOfWeek, addDays, isToday } from 'date-fns';

const WeekView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); 

    const daysOfWeek = Array.from({ length: 7 }).map((_, i) =>
        addDays(startOfCurrentWeek, i)
    );

    const handleNextWeek = () => {
        setCurrentDate(addWeeks(currentDate, 1));
    };

    const handlePreviousWeek = () => {
        setCurrentDate(subWeeks(currentDate, 1));
    };

    return (
        <div>            <h2 className="text-2xl  mb-4 ml-[21px]">Your Week at a Glance!</h2>

        <div className="week-view-container flex flex-col items-center bg-white p-4 h-fit w-[326px] ml-[22px] border border-teal-200 rounded-lg">
            
            <div className="week-view-header flex items-center justify-between w-full max-w-md p-3">
                <button onClick={handlePreviousWeek} className="text-gray-500 text-2xl">
                    &lt;
                </button>
                
                <div className="text-center">
                    <p className="text-xl">{format(currentDate, 'MMM yyyy')}</p>
                </div>

                <button onClick={handleNextWeek} className="text-gray-500 text-2xl">
                    &gt;
                </button>
            </div>

            <div className="week-view-days flex justify-around items-center mt-4 w-full max-w-md p-2">
                {daysOfWeek.map((day) => (
                    <div key={day} className="text-center">
                        <p className="text-sm font-medium">{format(day, 'EEE')}</p>
                        <p
                            className={`mt-3 text-lg font-medium ${
                                isToday(day)
                                    ? 'bg-[#008080] text-white rounded-full px-2 '
                                    : 'text-gray-700'
                            }`}
                        >
                            {format(day, 'd')}
                        </p>
                    </div>
                ))}
            </div>
        </div></div>
    );
};

export default WeekView;
