import React from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const reminders = [
    {
        time: '06:45',
        title: 'Biochemistry',
        subject: 'Chemistry',
    },
    {
        time: '20:15',
        title: 'Revision Class',
        subject: 'Physics',
    },
];

const Reminders = () => {
    return (
        
        <div className='w-[25%]'>
            <h2 className="text-xl pl-6 mb-4 mt-[14px] text-gray-800">Upcoming Reminders</h2>
            <div className="bg-[#F7F8F8] p-6 rounded-lg ml-[10px] w-[100]% h-[90%]">
            <div className="space-y-4">
                {reminders.map((reminder, index) => (
                    <div key={index} className=" h-20 flex items-center bg-[#D9DEDE] rounded-lg pr-2 shadow-sm">
                        <div className="flex  items-center justify-center w-20 h-20 bg-[#738484] text-white rounded-lg rounded-r-none flex-col">
                            <NotificationsNoneOutlinedIcon fontSize="large" />
                            <p className="text-sm ">{reminder.time}</p>
                        </div>
                        <div className="flex flex-col flex-grow pl-4">
                            <p className="text-xl text-gray-800">{reminder.title}</p>
                            <p className="text-sm text-gray-600">{reminder.subject}</p>
                        </div>
                        <MoreVertIcon className="text-gray-500" />
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default Reminders;
