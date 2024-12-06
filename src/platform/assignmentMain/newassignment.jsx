import React, { useState } from 'react';
import teachassign from "../assets/teachassign.svg";
import { useSelector } from 'react-redux';
import CreateAssignmentModal from '../assignmentSec/createAssignModal';

const Newassignment = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createdClasses = useSelector((state) => state.createdClasses.createdClasses);

  const handleChangeClass = (event) => {
    const selectedClassId = event.target.value;
    const selectedClass = createdClasses.find(classItem => classItem._id === selectedClassId);
    setSelectedClass(selectedClass);
  };

  const handleChangeTitle = (event) => {
    setAssignmentTitle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      <h2 className="text-xl w-[95%] mx-auto">Create New Assignment</h2>
      <div className="bg-[#FAFAFA] border border-[#BCE2DF] p-6 rounded-md mx-auto w-[95%] h-[80%]">
        <div className="flex space-y-4 md:space-y-0 md:space-x-4">
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              
              <div className="flex flex-col">
                <select
                  id="class-select"
                  value={selectedClass ? selectedClass._id : ''}
                  onChange={handleChangeClass}
                  className="rounded-lg w-full p-4 text-xl border border-[#4C5858]"
                >
                  <option value="" disabled>
                    Select Class
                  </option>
                  {createdClasses.map((classItem) => (
                    <option key={classItem._id} value={classItem._id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full md:w-[70%] p-3 bg-[#066769] rounded-md text-white text-xl mt-8"
              >
                Create Assignment
              </button>
            </form>
          </div>
          <div className="w-full md:w-1/3 flex items-center justify-center">
            <img src={teachassign} alt="Teacher Assign Illustration" className="w-2/3 h-auto max-w-[200px]" />
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedClass && (
        <CreateAssignmentModal
          isOpen={isModalOpen}
          onClose={closeModal}
          className={selectedClass.name}
          classCode={selectedClass.code}
          title={assignmentTitle}
        />
      )}
    </div>
  );
};

export default Newassignment;
