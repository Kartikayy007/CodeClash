'use client'

import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FieldErrors } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/providers/toast-config"
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
import { AuthFormSchema } from '@/lib/utils';

const CustomOtp = () => {
  const [timeLeft, setTimeLeft] = useState(3);
  const [isDisabled, setIsDisabled] = useState(true);

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

  const handleResend = () => {
    setTimeLeft(30);
    setIsDisabled(true);
  };

  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      pin: "",
    },
  })

  const onSubmit = (data: z.infer<typeof AuthFormSchema>) => {
    try {
      const result = AuthFormSchema.safeParse(data);
      if (!result.success) {
        result.error.errors.forEach((error) => {
          toast.error(
            'Invalid OTP',
            error.message || 'Please enter a valid OTP'
          );
        });
        return;
      }
      console.log(result.data);
    } catch (err: unknown) {
      const error = err as Error;
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
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <div className="flex justify-center items-center w-full max-w-md mx-auto text-white">

              <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS} {...field}>
                <InputOTPGroup className='flex gap-4 sm:gap-12 focus:border-purple-500 border-[#D1D1D1]'>
                  <InputOTPSlot
                    className="w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg bg-transparent text-2xl sm:text-3xl focus:border-purple-500 transition-colors"
                    index={0}
                  />
                  <InputOTPSlot
                    className="w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg bg-transparent text-2xl sm:text-3xl focus:border-purple-500 transition-colors"
                    index={1}
                  />
                  <InputOTPSlot
                    className="w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg bg-transparent text-2xl sm:text-3xl focus:border-purple-500 transition-colors"
                    index={2}
                  />
                  <InputOTPSlot
                    className="w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg bg-transparent text-2xl sm:text-3xl focus:border-purple-500 transition-colors"
                    index={3}
                  />
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
              <span className="text-[#E7E7E7] ">
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