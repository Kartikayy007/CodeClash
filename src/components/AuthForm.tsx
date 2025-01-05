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

const AuthForm = ({ type }: { type: string }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();

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
    console.log('Form values:', values);
    try {
      // Check terms acceptance for registration
      if (type === 'register' && !values.terms) {
        toast.error(
          'Terms & Conditions Required',
          'Please accept the Terms and Conditions to continue'
        );
        return; // Stop form submission if terms not accepted
      }

      setIsSubmitting(true);
      console.log('Form submitted', { type, values });
      
      if (type === 'register') {
        const registrationPayload = {
          email: values.email,
          password: values.Newpassword,
        };
        
        console.log('Registration payload:', registrationPayload);
        const result = await dispatch(register(registrationPayload)).unwrap();
        console.log('Registration result:', result);
        
        toast.success(
          'Registration Successful',
          'Please verify your email'
        );
      } else if (type === 'login') {
        // Handle login logic here
        console.log('Login payload:', {
          email: values.email,
          password: values.password
        });
      } else if (type === 'reset-password') {
        // Handle password reset logic here
        console.log('Reset password payload:', {
          password: values.Newpassword,
          confirmPassword: values.confirmPassword
        });
      } else if (type === 'forgot-password') {
        // Handle forgot password logic here
        console.log('Forgot password payload:', {
          email: values.email
        });
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(
        'Submission Failed',
        error.message || 'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
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