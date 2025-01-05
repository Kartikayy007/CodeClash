'use client';

import React from 'react';
import { z } from "zod";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LabelButton from './ui/LabelButton';
import CustomInput from './CustomInput';
import { AuthFormSchema } from '@/lib/utils';
import { toast } from '@/providers/toast-config';
import CustomCheckbox from '@/components/ui/CustomCheckbox';
import Link from 'next/link';
import PasswordStrengthChecker from './PasswordStrengthChecker';

interface AuthError {
  message: string;
  code?: string;
}

const AuthForm = ({ type }: { type: 'login' | 'register' | 'get-started' | 'verify' }) => {

  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
      Newpassword: "",
      confirmPassword: "",
    },
    mode: "onChange"
  });

  const onSubmit = async (values: z.infer<typeof AuthFormSchema>) => {
    try {
      const result = AuthFormSchema.safeParse(values);

      if (!result.success) {
        result.error.errors.forEach(() => {
          toast.error(
            'Validation Error',
            'Please enter a valid email address'
          );
        });
        return;
      }
      console.log(result.data);
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error(authError.message);
      toast.error(
        'Error',
        authError.message || 'Something went wrong'
      );
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof AuthFormSchema>>) => {
    if (errors.email) {
      toast.error(
        'Invalid email',
        'Enter a valid email address.'
      );
    }
    if (errors.confirmPassword?.message === "Passwords don't match") {
      toast.error(
        'Password Mismatch',
        'Passwords do not match. Please try again.'
      );
    }
  };

  return (
    <section className="w-full mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-6 sm:space-y-8"
        >
          {type === 'get-started' && (
            <>
              <CustomInput
                name="email"
                label="Email"
                control={form.control}
                placeholder=""
              />
              <LabelButton type="submit" variant="filled">
                Get Started
              </LabelButton>
            </>
          )}

          {type === 'login' && (
            <>
              <CustomInput
                name="email"
                label="Email"
                control={form.control}
                placeholder=""
              />
              <CustomInput
                name="password"
                label="Password"
                control={form.control}
                placeholder=""
                type="password"
              />

              <div className='flex justify-between items-center sm:items-center text-[#D1D1D1] gap-4 sm:gap-0'>
                <button className='text-base sm:text-lg'>
                  Forgot Password?
                </button>

                <CustomCheckbox
                  name="rememberMe"
                  label="Remember me"
                  control={form.control}
                />
              </div>

              <LabelButton type="submit" variant="filled">
                Login
              </LabelButton>
            </>
          )}

          {type === 'register' && (
            <>
              <CustomInput
                name="email"
                label="Email"
                control={form.control}
                placeholder=""
                type="email"
              />
              <div className="relative">
                <CustomInput
                  name="Newpassword"
                  label="New Password"
                  control={form.control}
                  placeholder=""
                  type="password"
                  showStrengthChecker={true}
                />
              </div>
              <div className="relative">
                <CustomInput
                  name="confirmPassword"
                  label="Confirm Password"
                  control={form.control}
                  placeholder=""
                  type="password"
                  showStrengthChecker={true}
                />
                <PasswordStrengthChecker
                  password={form.watch('password')} isFocused={false} />
              </div>

              <div className='flex items-start sm:items-center gap-2'>
                <CustomCheckbox
                  name="terms"
                  label=""
                  control={form.control}
                />
                <p className="text-white text-sm sm:text-base">
                  I agree to the{' '}
                  <Link href={''} className="text-[#C879EB] font-bold hover:opacity-80 transition-opacity">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link href={''} className="text-[#C879EB] font-bold hover:opacity-80 transition-opacity">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              <LabelButton type="submit" variant="filled">
                Sign Up
              </LabelButton>
            </>
          )}

          {type === 'reset-password' && (
            <>
              <div className="relative">
                <CustomInput
                  name="Newpassword"
                  label="New Password"
                  control={form.control}
                  placeholder=""
                  type="password"
                  showStrengthChecker={true}
                />
              </div>
              <div className="relative">
                <CustomInput
                  name="confirmPassword"
                  label="Confirm Password"
                  control={form.control}
                  placeholder=""
                  type="password"
                  showStrengthChecker={true}
                />
                <PasswordStrengthChecker
                  password={form.watch('password')} isFocused={false} />
              </div>

              <LabelButton type="submit" variant="filled">
                Sent Reset Link
              </LabelButton>
            </>
          )}

          {type === 'forgot-password' && (
            <>
              <CustomInput
                name="email"
                label="Email"
                control={form.control}
                placeholder=""
              />
              <LabelButton type="submit" variant="filled">
                Sent Reset Link
              </LabelButton>
            </>
          )}

        </form>
      </Form>
    </section>
  );
};

export default AuthForm;