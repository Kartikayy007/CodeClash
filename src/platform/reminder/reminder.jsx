import React, { useState } from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modal from './editModal'; // Import the Modal component

const remindersData = [
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
    const [reminders, setReminders] = useState(remindersData);
    const [popupIndex, setPopupIndex] = useState(null); // Tracks which reminder's popup is open
    const [modalType, setModalType] = useState(null); // 'edit' or 'delete'
    const [modalData, setModalData] = useState({}); // Tracks data for the modal
    const [showModal, setShowModal] = useState(false); // Tracks if modal is open

    const handlePopupToggle = (index) => {
        setPopupIndex(popupIndex === index ? null : index); // Toggle the popup for the clicked item
    };

    const handleModalOpen = (type, index) => {
        setModalType(type);
        setModalData({ index, ...reminders[index] });
        setShowModal(true);
        setPopupIndex(null); // Close the popup menu
    };

    const handleModalClose = () => {
        setShowModal(false);
        setModalData({});
    };

    const handleEditSave = () => {
        const updatedReminders = reminders.map((reminder, index) =>
            index === modalData.index ? { ...reminder, time: modalData.time } : reminder
        );
        setReminders(updatedReminders);
        handleModalClose();
    };

    const handleDeleteConfirm = () => {
        const updatedReminders = reminders.filter((_, index) => index !== modalData.index);
        setReminders(updatedReminders);
        handleModalClose();
    };

    return (
        <div className="w-[25%] py-4">
            <h2 className="text-xl pl-6 h-[7%] mb-4 flex items-center text-gray-800">Upcoming Reminders</h2>
            <div
                className="bg-[#F7F8F8] p-6 rounded-lg ml-[10px] w-[100%]"
                style={{ height: 'calc(10% + 500px)' }}
            >
                <div className="space-y-4">
                    {reminders.map((reminder, index) => (
                        <div
                            key={index}
                            className="h-20 flex items-center bg-[#D9DEDE] rounded-lg pr-2 shadow-sm relative"
                        >
                            {/* Left Icon Section */}
                            <div className="flex items-center justify-center w-20 h-20 bg-[#738484] text-white rounded-lg rounded-r-none flex-col">
                                <NotificationsNoneOutlinedIcon fontSize="large" />
                                <p className="text-sm">{reminder.time}</p>
                            </div>

                            {/* Reminder Details */}
                            <div className="flex flex-col flex-grow pl-4">
                                <p className="text-xl text-gray-800">{reminder.title}</p>
                                <p className="text-sm text-gray-600">{reminder.subject}</p>
                            </div>

                            {/* Three-dot Button */}
                            <div className="relative">
                                <MoreVertIcon
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => handlePopupToggle(index)}
                                />

                                {/* Popup Menu */}
                                {popupIndex === index && (
                                    <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
                                        <button
                                            onClick={() => handleModalOpen('edit', index)}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg text-gray-700"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleModalOpen('delete', index)}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-lg text-gray-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <Modal
                    title={modalType === 'edit' ? 'Edit Reminder' : 'Delete Reminder'}
                    onClose={handleModalClose}
                >
                    {modalType === 'edit' && (
                        <>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Time
                            </label>
                            <input
                                type="time"
                                className="w-full px-3 py-2 border rounded-md"
                                value={modalData.time}
                                onChange={(e) => setModalData({ ...modalData, time: e.target.value })}
                            />
                            <div className="flex justify-end mt-4">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                    onClick={handleEditSave}
                                >
                                    Save
                                </button>
                            </div>
                        </>
                    )}
                    {modalType === 'delete' && (
                        <>
                            <p className="text-sm text-gray-700 mb-4">
                                Are you sure you want to delete this reminder?
                            </p>
                            <div className="flex justify-end">
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                                    onClick={handleDeleteConfirm}
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default Reminders;
