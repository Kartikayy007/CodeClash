import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, addMonths, subMonths, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import { useSelector } from 'react-redux';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  const [isPageLoaded, setIsPageLoaded] = useState(false); 


  const sidebarWidth = useSelector((state) => state.sidebar.width);

  const events = {
    '2024-11-01': ['due', 'class'],
    '2024-11-08': ['due'],
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));


  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek.map((day) => (
      <div
        key={day}
        className="p-4 h-16 flex items-center justify-center border-[0.5px] border-[#ADB8B8] bg-[#D9DEDE] text-black font-medium"
      >
        {day}
      </div>
    ));
  };


  const renderMonthView = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'yyyy-MM-dd');
        const isCurrentMonth = isSameMonth(day, monthStart);
        const dayEvents = events[formattedDate] || [];

        days.push(
          <div
            key={day}
            className={`relative p-4 h-[100px] flex items-start justify-end border-[0.5px] border-[#ADB8B8] bg-white`}
          >
            {isCurrentMonth && (
              <>
                <span className="text-gray-800 font-semibold">{format(day, 'd')}</span>


                <div className="absolute bottom-1 left-1 flex space-x-1">
                  {dayEvents.map((eventType, index) => (
                    <span
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        eventType === 'due' ? 'bg-red-500' : 'bg-yellow-400'
                      }`}
                      title={eventType === 'due' ? 'Due Assignment' : 'Scheduled Class'}
                    ></span>
                  ))}
                </div>
              </>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return rows;
  };


  const renderWeekView = () => {
    const startDate = startOfWeek(currentMonth);
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    return (
      <div className="grid grid-cols-7 text-center">
        {days.map((day) => {
          const formattedDate = format(day, 'yyyy-MM-dd');
          const dayEvents = events[formattedDate] || [];

          return (
            <div
              key={day}
              className="relative p-4 h-20 flex items-center justify-center border-[0.5px] bg-white border-[#ADB8B8]"
            >
              <span className="text-gray-800 font-semibold">{format(day, 'E d')}</span>

              <div className="absolute bottom-1 left-1 flex space-x-1">
                {dayEvents.map((eventType, index) => (
                  <span
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      eventType === 'due' ? 'bg-red-500' : 'bg-yellow-400'
                    }`}
                    title={eventType === 'due' ? 'Due Assignment' : 'Scheduled Class'}
                  ></span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  const renderDayView = () => {
    const day = new Date(currentMonth);
    const formattedDate = format(day, 'yyyy-MM-dd');
    const dayEvents = events[formattedDate] || [];

    return (
      <div className="p-4 rounded-lg bg-white border text-center">
        <span className="text-lg font-semibold">{format(day, 'EEEE, MMMM d, yyyy')}</span>
        <div className="mt-4">
          {dayEvents.length > 0 ? (
            dayEvents.map((eventType, index) => (
              <div
                key={index}
                className={`p-2 my-1 rounded-md text-white ${
                  eventType === 'due' ? 'bg-red-500' : 'bg-yellow-400'
                }`}
              >
                {eventType === 'due' ? 'Due Assignment' : 'Scheduled Class'}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No events</div>
          )}
        </div>
      </div>
    );
  };


  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  return (
    <div className={`mt-[1.5rem] max-w-lg  transition-all duration-500 ease-in-out ${isPageLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ marginLeft: sidebarWidth,transition: 'margin-left 0.3s ease,translate 0.3 ease'}}>

      <div className="flex space-x-4 mb-4 ml-[40px]">
        {['month', 'week', 'day'].map((view) => (
          <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`px-3 py-1 rounded-lg font-semibold ${
              currentView === view ? 'bg-[#ADB8B8] text-[#394141]' : 'bg-none text-[#394141]'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>


      <div className="rounded-lg p-4 w-[812px] ml-[28px]">

        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 w-[150px]">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button onClick={prevMonth} className="text-gray-500 px-2 py-0.5 mx-1 my-0.5 bg-[#D9DEDE] rounded-2xl">{'<'}</button>
          <button onClick={nextMonth} className="text-gray-500 px-2 py-0.5 mx-1 my-0.5 bg-[#D9DEDE] rounded-2xl">{'>'}</button>


          <div className="flex items-center justify-end space-x-4 w-[100%]">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="text-gray-600 text-sm">Due Assignment</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span className="text-gray-600 text-sm">Scheduled Class</span>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-7">{renderDaysOfWeek()}</div>


        <div>
          {currentView === 'month' && renderMonthView()}
          {currentView === 'week' && renderWeekView()}
          {currentView === 'day' && renderDayView()}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
