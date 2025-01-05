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
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { register } from '@/features/auth/thunks/registerThunk';

interface AuthError {
  message: string;
  code?: string;
}

const AuthForm = ({ type }: { type: 'login' | 'register' | 'get-started' | 'verify' | 'forgot-password' | 'reset-password' }) => {

  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
      password: "",
      Newpassword: "",
      confirmPassword: "",
      terms: false
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
    console.log('Form validation errors:', errors);

    // Check for empty fields first
    if (type === 'login' && (!form.getValues('email') || !form.getValues('password'))) {
      toast.error(
        'Fields Cant be Empty',
        'Please fill in all required fields'
      );
      return;
    }

    if (type === 'register' && (!form.getValues('email') || !form.getValues('Newpassword') || !form.getValues('confirmPassword'))) {
      toast.error(
        'Fields Cant be Empty',
        'Please fill in all required fields'
      );
      return;
    }

    if (type === 'reset-password' && (!form.getValues('Newpassword') || !form.getValues('confirmPassword'))) {
      toast.error(
        'Fields Cant be Empty',
        'Please fill in all required fields'
      );
      return;
    }

    if (type === 'forgot-password' && !form.getValues('email')) {
      toast.error(
        'Fields Cant be Empty',
        'Please fill in all required fields'
      );
      return;
    }
    
    // Original validation errors
    if (errors.email) {
      toast.error(
        'Invalid email',
        errors.email.message || 'Enter a valid email address.'
      );
      return;
    }
    if (errors.Newpassword) {
      toast.error(
        'Invalid Password',
        'Password must be at least 8 characters, include uppercase, number, and special character'
      );
      return;
    }
    if (errors.confirmPassword) {
      toast.error(
        'Password Mismatch',
        errors.confirmPassword.message || 'Passwords do not match. Please try again.'
      );
    }
    if (errors.terms) {
      toast.error(
        'Terms & Conditions Required',
        'Please accept the Terms and Conditions to continue'
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
              <LabelButton 
                type="submit" 
                variant="filled"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Get Started'}
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

              <LabelButton 
                type="submit" 
                variant="filled"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Login'}
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
                  password={form.watch('Newpassword')}
                  isFocused={false} 
                />
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

              <LabelButton 
                type="submit"
                variant="filled"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Sign Up'}
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
                  password={form.watch('Newpassword')}
                  isFocused={false} 
                />
              </div>

              <LabelButton 
                type="submit" 
                variant="filled"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Reset Password'}
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
              <LabelButton 
                type="submit" 
                variant="filled"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Send Reset Link'}
              </LabelButton>
            </>
          )}
        </form>
      </Form>
    </section>
  );
};

export default AuthForm;