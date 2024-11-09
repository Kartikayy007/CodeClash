import React from 'react';
import Card from './cards';

const RecentClasses = () => {
    const classes = [
        { className: 'English', studentCount: 45, teacherName: 'Abc Sharma', image: 'path/to/english-image.png' },
        { className: 'Maths', studentCount: 45, teacherName: 'XYZ EFG', image: 'path/to/maths-image.png' },
        { className: 'Science', studentCount: 45, teacherName: 'Abc Mishra', image: 'path/to/science-image.png' },
    ];

    return (
        <div className=" mt-[58px]">
            <h1 className="text-xl mb-4">Recent Classes</h1>
            <div className="flex space-x-4">
                {classes.map((classData, index) => (
                    <Card key={index} {...classData} />
                ))}
            </div>
        </div>
    );
};

export default RecentClasses;
