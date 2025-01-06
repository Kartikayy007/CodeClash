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
import { useRouter } from 'next/navigation';

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
      username: "",
      Newpassword: "",
      confirmPassword: "",
      terms: false,
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
    if (type === 'register') {

      if (!form.getValues('email') && !form.getValues('username') && !form.getValues('password')) {
        toast.error(
          'Required Fields',
          'Please fill in all required fields'
        );
        return;
      }

      if (errors.email) {
        toast.error(
          'Invalid Email',
          errors.email.message || 'Please enter a valid email address'
        );
        return;
      }

      if (!form.getValues('terms')) {
        toast.error(
          'Terms Required',
          'Please accept the Terms and Conditions to continue'
        );
        return;
      }
  
      if (errors.username) {
        toast.error(
          'Invalid Username',
          'Username must be at least 3 characters'
        );
        return;
      }
  
      if (errors.password) {
        toast.error(
          'Invalid Password',
          'Password must meet all requirements'
        );
        return;
      }
    }

    if (type === 'login' && (!form.getValues('email') || !form.getValues('password'))) {
      toast.error(
        'Fields Cant be Empty',
        'Please fill in all required fields'
      );
      return;
    }

    if (type === 'register' && (!form.getValues('email') || !form.getValues('username') || !form.getValues('password'))) {
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

    if (errors.email) {
      toast.error(
        'Invalid email',
        errors.email.message || 'Enter a valid email address.'
      );
      return;
    }
    if (errors.username) {
      toast.error(
        'Invalid Username',
        errors.username.message || 'Username is required.'
      );
      return;
    }
    if (errors.password) {
      toast.error(
        'Invalid Password',
        'Password must be at least 8 characters, include uppercase, number, and special character'
      );
      return;
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
                type="text"
              />
              <CustomInput
                name="username"
                label="Username"
                control={form.control}
                placeholder=""
                type="text"
              />
              <div className="relative">
                <CustomInput
                  name="password"
                  label="Password"
                  control={form.control}
                  placeholder=""
                  type="password"
                  showStrengthChecker={true}
                />
                <PasswordStrengthChecker
                  password={form.watch('password')}
                  isFocused={true} 
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
                  password={form.watch('password')}
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