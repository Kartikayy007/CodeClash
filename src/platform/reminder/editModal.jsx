import React from 'react';

const Modal = ({ title, children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
            <div className="bg-white w-full h-full md:w-1/2 md:h-auto p-6 relative shadow-lg">

                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    ✖
                </button>

                <div className="w-full h-full flex flex-col justify-center items-center">
                    <h3 className="text-2xl font-semibold mb-4">{title}</h3>
                    <div className="w-full h-full overflow-y-auto">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
