import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const Resetpass = ({ isOpen, onClose }) => {

  const [oldpassword, setoldpassword] = useState("");
  const [newpass, setnewpass] = useState("");


  if (!isOpen) return null;

  const handlepass = () => {
    console.log( "oldpass:", oldpassword, "newpass:", newpass);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-500 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        className="bg-white p-6 rounded-lg shadow-lg flex flex-col"
        style={{ width: "25vw", height: "48vh" }}
      >
        
        <div className="flex justify-between items-center mt-5  mb-9">
          <h2 className="text-3xl font-semibold">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <CloseIcon fontSize="large" />
          </button>
        </div>

      
        <div className="mb-[40px] mt-5">
          <input
            id="oldpassword"
            type="password"
            value={oldpassword}
            onChange={(e) => setoldpassword(e.target.value)}
            placeholder="Old Password"
            className="w-full p-2 border border-gray-300 rounded-lg text-xl"
          />
        </div>

       
        <div className="mb-[10px]">
          <input
            type="password"
            id="newpass"
            value={newpass}
            onChange={(e) => setnewpass(e.target.value)}
            placeholder="New Password"
            className="w-full p-8 border border-gray-300 rounded-lg text-xl"
          />
        </div>
        <div>
            <a className="text-[#006666] text-xl" href="www.google.com">Forget Password? </a>
        </div>

        
        <div className="flex space-x-2 mt-[50px]">
          <button
            onClick={handlepass}
            className="flex-1 text-white py-4 rounded-lg text-xl bg-[#006666]"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resetpass;
