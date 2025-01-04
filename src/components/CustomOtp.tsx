import React from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const CustomOtp = () => {
  return (
    <div className="flex justify-center items-center w-full max-w-md mx-auto text-white">

      <InputOTP maxLength={4} className="gap-32 border-[#D1D1D1]">
        <InputOTPGroup>
          <InputOTPSlot 
            className="w-14 h-14 border-2 rounded-lg bg-transparent text-xl focus:border-purple-500 transition-colors"
            index={0} 
          />
          <InputOTPSlot 
            className="w-14 h-14 border-2 rounded-lg bg-transparent text-xl focus:border-purple-500 transition-colors"
            index={1} 
          />
          <InputOTPSlot 
            className="w-14 h-14 border-2 border-gray-600 rounded-lg bg-transparent text-xl focus:border-purple-500 transition-colors"
            index={2} 
          />
          <InputOTPSlot 
            className="w-14 h-14 border-2 border-gray-600 rounded-lg bg-transparent text-xl focus:border-purple-500 transition-colors"
            index={3} 
          />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

export default CustomOtp;