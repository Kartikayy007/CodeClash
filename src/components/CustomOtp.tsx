'use client'

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/providers/toast-config"
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '@/features/auth/thunks/verifyOtpThunk';
import { RootState, AppDispatch } from '@/store/store';
import LabelButton from './ui/LabelButton';
import {
  Form,
  FormField,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { cn } from "@/lib/utils";
import { resendOtp } from '@/features/auth/thunks/resendOtpThunk';
import { useRouter } from 'next/navigation';
import { OtpError } from '@/types/error.types';

const OTPFormSchema = z.object({
  pin: z.string().min(4, "Please enter a valid 4-digit OTP").max(4)
});

type OTPFormValues = z.infer<typeof OTPFormSchema>;

const CustomOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.auth); 
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    if (timeLeft === 0) {
      setIsDisabled(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = async () => {
    try {
      const email = localStorage.getItem('registrationEmail');
      if (!email) {
        toast.error('Error', 'Email not found. Please register again.');
        return;
      }

      const result = await dispatch(resendOtp({ email })).unwrap();
      
      if (result.success) {
        setTimeLeft(30);
        setIsDisabled(true);
        toast.success('Success', 'OTP sent to your email');
      }
    } catch (error: unknown) {
      const otpError = error as OtpError;
      toast.error(
        'Failed to resend OTP',
        otpError.response?.data?.message || otpError.message || 'Please try again later'
      );
    }
  };

  const onSubmit = async (values: OTPFormValues) => {
    try {
      const email = localStorage.getItem('registrationEmail');
      if (!email) {
        toast.error('Error', 'Email not found. Please register again.');
        return;
      }

      const result = await dispatch(verifyOtp({ 
        email,
        otp: values.pin 
      })).unwrap();

      if (result.success) {
        toast.success('Success', 'Email verified successfully');
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      const otpError = error as OtpError;
      toast.error(
        'Verification Failed',
        otpError.response?.data?.message || otpError.message || 'Please try again'
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <InputOTP
              maxLength={4}
              value={field.value}
              onChange={field.onChange}
              render={({ slots }) => (
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              )}
            />
          )}
        />
        
        <div className="space-y-4">
          <LabelButton 
            type="submit"
            variant="filled"
            disabled={loading}
          >
            Verify OTP
          </LabelButton>
          
          <div className="flex items-center gap-2 text-[#D1D1D1] text-base">
            {isDisabled ? (
              <span className="text-[#E7E7E7]">
                Resend OTP IN {timeLeft}s
              </span>
            ) : (
              <>
                <span>
                  Didnt receive the OTP?{' '}
                </span>
                <button
                  onClick={handleResend}
                  type="button"
                  className="text-[#C879EB] hover:opacity-80 transition-opacity"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CustomOtp;