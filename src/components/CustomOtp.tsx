'use client'

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FieldErrors } from "react-hook-form"
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

const OTPFormSchema = z.object({
  pin: z.string().min(4, "Please enter a valid 4-digit OTP").max(4)
});

type OTPFormValues = z.infer<typeof OTPFormSchema>;

const CustomOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);
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
    } catch (error: any) {
      toast.error(
        'Failed to resend OTP',
        error.message || 'Please try again later'
      );
    }
  };

  const onSubmit = async (data: OTPFormValues) => {
    console.log('Form submitted with data:', data);

    try {
      const email = localStorage.getItem('registrationEmail');
      console.log('Retrieved email:', email);

      if (!email) {
        toast.error('Error', 'Email not found. Please register again.');
        return;
      }
      console.log(result.data);
    } catch (err: unknown) {
      const error = err as Error;

      const otpData = {
        email,
        otp: data.pin
      };
      console.log('Sending OTP data:', otpData);

      const resultAction = await dispatch(verifyOtp(otpData));
      
      if (verifyOtp.fulfilled.match(resultAction)) {
        const response = resultAction.payload;
        console.log('Success response:', response);

        if (response.success) {
          if (response.data?.tokens) {
            localStorage.setItem('token', response.data.tokens.accessToken);
            localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
            localStorage.removeItem('registrationEmail');
          }
          toast.success('Success', 'OTP verified successfully');
          router.push('/dashboard');
        }
      } else if (verifyOtp.rejected.match(resultAction)) {
        console.error('Error response:', resultAction.payload);
        toast.error(
          'Verification Failed',
          resultAction.payload as string || 'Invalid OTP'
        );
      }
    } catch (error) {
      console.error('Error during verification:', error);
      toast.error(
        'Error',
        error.message || 'Something went wrong, please try again'
      );
    }
  }

  const onError = (errors: FieldErrors<z.infer<typeof AuthFormSchema>>) => {
    if (errors.pin) {
      toast.error(
        'Invalid OTP',
        'Please enter a valid OTP'
      );
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <div className="flex justify-center items-center w-full max-w-md mx-auto text-white">
              <InputOTP 
                maxLength={4} 
                pattern={REGEXP_ONLY_DIGITS} 
                {...field}
                value={field.value}
                onChange={(value) => {
                  console.log('OTP value changed:', value);
                  field.onChange(value);
                  
                  // Automatically submit when 4 digits are entered
                  if (value.length === 4) {
                    form.handleSubmit(onSubmit)();
                  }
                }}
              >
                <InputOTPGroup className='flex gap-4 sm:gap-12 focus:border-purple-500 border-[#D1D1D1]'>
                  {[0, 1, 2, 3].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg",
                        "bg-transparent text-2xl sm:text-3xl",
                        "focus:border-purple-500 transition-colors"
                      )}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}
        />

        <div className="flex flex-col items-center gap-4">
          <LabelButton type="submit" variant="filled" className='mt-8'>
            Verify
          </LabelButton>

          <div className="flex items-center gap-2 text-[#D1D1D1] text-base">
            {isDisabled ? (
              <span className="text-[#E7E7E7]">
                Resend OTP IN {timeLeft}s
              </span>
            ) : 
            <>
            <span className="text-[#D1D1D1] text-base">
              Didn&apos;t receive the OTP?{' '}
            </span>
            <button
              onClick={handleResend}
              type="button"
              className="text-[#C879EB] hover:opacity-80 transition-opacity"
            >
              Resend OTP
            </button>
            </>
          }
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CustomOtp;