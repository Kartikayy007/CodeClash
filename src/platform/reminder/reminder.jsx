import React, { useState, useEffect, useRef } from 'react';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Modal from './editModal'; 
import axios from 'axios'; 
import noRem from '../assets/noRem.svg';

const Reminders = () => {
    const [reminders, setReminders] = useState([]); 
    const [popupIndex, setPopupIndex] = useState(null); 
    const [modalType, setModalType] = useState(null); 
    const [modalData, setModalData] = useState({}); 
    const [showModal, setShowModal] = useState(false); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const popupRef = useRef(null);

    useEffect(() => {
        const fetchReminders = async () => {
            setLoading(true);
            try {
                const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/reminder`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setReminders(response.data.reminders);
            } catch (err) {
                setError('Failed to fetch reminders');
                console.error('Error fetching reminders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReminders();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePopupToggle = (index) => {
        setPopupIndex(popupIndex === index ? null : index); 
    };

    const handleModalOpen = (type, index) => {
        setModalType(type);
        setModalData({ index, ...reminders[index] });
        setShowModal(true);
        setPopupIndex(null); 
    };

    const handleModalClose = () => {
        setShowModal(false);
        setModalData({});
    };

    const handleEditSave = async () => {
        setLoading(true); 
        try {
            const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
            const reminderId = reminders[modalData.index]._id; 
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/reminder/${reminderId}`,
                {
                    scheduledTime: modalData.time, 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const updatedReminders = reminders.map((reminder, index) =>
                index === modalData.index ? { ...reminder, time: response.data.time } : reminder
            );
            setReminders(updatedReminders);
            console.log(response)
            handleModalClose();
        } catch (err) {
            setError('Failed to update reminder');
            console.error('Error updating reminder:', err);
        } finally {
            setLoading(false); 
        }
    };

    const handleDeleteConfirm = async () => {
        setLoading(true); 
        try {
            const token = sessionStorage.getItem("authToken") || localStorage.getItem("authToken");
            const reminderId = reminders[modalData.index]._id; 
            await axios.delete(`${process.env.REACT_APP_API_URL}/reminder/${reminderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedReminders = reminders.filter((_, index) => index !== modalData.index);
            setReminders(updatedReminders);
            handleModalClose(); 
        } catch (err) {
            setError('Failed to delete reminder');
            console.error('Error deleting reminder:', err);
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setPopupIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading) {
        return <div>Loading reminders...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        
    <div className={`${isMobile ? 'w-full mt-[80px] p-4' : 'w-[25%]'} py-4 `}>
        <h2 className="text-xl pl-6 h-[7%] mb-4 flex items-center text-gray-800">Upcoming Reminders</h2>
        <div
            className={`bg-[#F7F8F8] p-6 rounded-lg ${isMobile ? 'mx-auto' : 'ml-[10px]'} w-[100%] overflow-y-auto`}
            style={{ height: 'calc(10% + 500px)', maxHeight: '540px' }}
        >
            {reminders.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                    <img src={noRem} alt="" />
                    <h1 className='text-xl font-medium'>No reminders available.</h1>
                    <p className='text-center'>Never miss a beat! Add a reminder to stay on top of your schedule and deadlines.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reminders.length && reminders.map((reminder, index) => (
                        <div

                            key={index}
                            className="h-20 flex items-center bg-[#EEF0F0] rounded-lg pr-2 shadow-sm relative"
                        >
                            <div className="flex items-center justify-center w-20 h-20 bg-[#D9DEDE] text-black rounded-lg rounded-r-none flex-col">
                                <NotificationsNoneOutlinedIcon fontSize="large" />
                                {/* <p className="text-sm">{reminder.scheduledTime}</p> */}
                            </div>
                            <div className="flex flex-col flex-grow pl-4">
                                <p className="text-xl text-gray-800">{reminder.lecture?.title}</p>
                                <p className="text-sm text-gray-600">{reminder.scheduledTime}</p>
                            </div>
                            <div className="relative">
                                <MoreVertIcon
                                    className="text-gray-500 cursor-pointer"
                                    onClick={() => handlePopupToggle(index)}
                                />
                                {popupIndex === index && (
                                    <div ref={popupRef} className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
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
            )}
        </div>
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
                            type="datetime-local"
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
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </Modal>
        )}
    </div>
    
);}
export default Reminders;
