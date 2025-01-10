'use client';

import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LabelButton from '../../../components/ui/LabelButton';
import CustomInput from '../../../components/CustomInput';
import { AuthFormSchema } from '@/lib/schemas/authSchema';
import { toast } from '@/providers/toast-config';
import CustomCheckbox from '@/components/ui/CustomCheckbox';
import Link from 'next/link';
import PasswordStrengthChecker from './PasswordStrengthChecker';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { register } from '@/features/auth/thunks/registerThunk';
import { useRouter } from 'next/navigation';
import { login } from '@/features/auth/thunks/loginThunk';
import { resetPassword } from '@/features/auth/thunks/resetPasswordThunk';
import { resetPasswordWithToken } from '@/features/auth/thunks/resetPasswordWithTokenThunk';
import { checkEmail } from '@/features/auth/thunks/checkEmailThunk';
import { ApiError } from '@/types/error.types';
import GetStartedForm from './forms/GetStartedForm';
import LoginForm from './forms/LoginForm';
import RegisterForm from './forms/RegisterForm';
import ResetPasswordForm from './forms/ResetPasswordForm';
import ForgotPasswordForm from './forms/ForgotPasswordForm';

interface AuthFormProps {
  type: string;
  token?: string;
  onResetLinkSent?: (email: string) => void;
}

const AuthForm = ({
  type,
  token,
  onResetLinkSent
}: AuthFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: type === 'reset-password' ? 'test@example.com' : '',
      password: type === 'forgot-password' ? undefined : "",
      username: "",
      Newpassword: "",
      confirmPassword: "",
      terms: false,
    },
    mode: "onChange",
    context: type,
  });

  useEffect(() => {
    if ((type === 'login' || type === 'register')) {
      const savedEmail = localStorage.getItem('enteredEmail');
      if (savedEmail) {
        form.setValue('email', savedEmail);
        localStorage.removeItem('enteredEmail');
      }
    }
  }, [type, form]);

  useEffect(() => {
    if (type === 'login') {
      const rememberedEmail = sessionStorage.getItem('userEmail');
      const rememberMe = sessionStorage.getItem('rememberMe');

      if (rememberedEmail && rememberMe) {
        form.setValue('email', rememberedEmail);
        form.setValue('rememberMe', true);
      }
    }
  }, [type, form]);

  const onSubmit = async (values: z.infer<typeof AuthFormSchema>) => {
    try {
      if (type === 'reset-password') {
        console.log('Resetting password with token:', token);
        if (!token) {
          toast.error('Invalid Token', 'Password reset link is invalid');
          return;
        }

        setIsSubmitting(true);
        if (!values.Newpassword) {
          toast.error('Password Required', 'Please enter a new password');
          return;
        }

        if (values.Newpassword !== values.confirmPassword) {
          toast.error('Password Mismatch', 'Passwords do not match');
          return;
        }

        const result = await dispatch(resetPasswordWithToken({
          token,
          password: values.Newpassword
        })).unwrap();

        if (result.success) {
          toast.success(
            'Password Reset Successful',
            'You can now login with your new password'
          );
          router.push('/login');
        }
      }
      else if (type === 'login') {
        if (!values.email || !values.password) {
          toast.error(
            'Required Fields',
            'Please fill in all required fields'
          );
          return;
        }

        setIsSubmitting(true);
        const loginPayload = {
          email: values.email,
          password: values.password,
        };

        const result = await dispatch(login(loginPayload)).unwrap();

        if (result.success) {
          const rememberMe = form.getValues('rememberMe');
          if (rememberMe) {
            sessionStorage.setItem('rememberMe', 'true');
            sessionStorage.setItem('userEmail', values.email);
          } else {
            sessionStorage.removeItem('rememberMe');
            sessionStorage.removeItem('userEmail');
          }

          toast.success('Login Successful', 'Welcome back!');
          router.push('/home');
        }
      } else if (type === 'register') {
        if (!values.email && !values.username && !values.password) {
          toast.error(
            'Required Fields',
            'Please fill in all required fields'
          );
          return;
        }

        if (!values.username) {
          toast.error('Username Required', 'Please enter a username');
          return;
        }

        if (!values.email) {
          toast.error('Email Required', 'Please enter an email address');
          return;
        }

        if (!values.password) {
          toast.error('Password Required', 'Please enter a password');
          return;
        }

        setIsSubmitting(true);

        const registrationPayload = {
          email: values.email,
          username: values.username,
          password: values.password,
        };

        const result = await dispatch(register(registrationPayload)).unwrap();
        if (result.success) {
          localStorage.setItem('registrationEmail', values.email);

          document.cookie = `registrationEmail=${values.email}; path=/;`;
          document.cookie = `isRegistering=true; path=/;`;

          toast.success(
            'Registration Successful',
            'Please verify your email'
          );
          router.push('/verify');
        }
      } else if (type === 'forgot-password') {
        if (!values.email) {
          toast.error('Required Field', 'Please enter your email address');
          return;
        }

        setIsSubmitting(true);
        console.log('Sending reset password request for:', values.email);

        const result = await dispatch(resetPassword({ email: values.email })).unwrap();

        console.log('Reset password response:', result);

        if (result.success) {
          setResetLinkSent(true);
          setTimeLeft(30);
          onResetLinkSent?.(values.email);
        }
      } else if (type === 'get-started') {
        if (!values.email) {
          toast.error('Required Field', 'Please enter your email address');
          return;
        }

        setIsSubmitting(true);
        const result = await dispatch(checkEmail({ email: values.email })).unwrap();

        if (result.success) {
          localStorage.setItem('enteredEmail', values.email);
          switch (result.data?.flow) {
            case 1:
              router.push('/register');
              break;
            case 2:
              router.push('/login');
              break;
            case 3:
              router.push('/login');
              break;
          }
        }
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(
        'Error',
        apiError.response?.data?.message || apiError.message || 'Something went wrong'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof AuthFormSchema>>) => {
    if (type === 'reset-password') {
      if (!form.getValues('Newpassword') || !form.getValues('confirmPassword')) {
        toast.error(
          'Required Fields',
          'Please fill in both password fields'
        );
        return;
      }

      if (form.getValues('Newpassword') !== form.getValues('confirmPassword')) {
        toast.error(
          'Password Mismatch',
          'Passwords do not match'
        );
        return;
      }

      if (errors.Newpassword) {
        toast.error(
          'Invalid Password',
          'Password must meet all requirements'
        );
        return;
      }
    }

    if (type === 'login') {
      if (errors.password) {
        toast.error(
          'Invalid Password',
          'Password must meet all requirements'
        );
        return;
      }
      if (!form.getValues('email') && !form.getValues('password')) {
        toast.error(
          'Required Fields',
          'Please fill in all required fields'
        );
        return;
      }
      if (!form.getValues('password')) {
        toast.error(
          'Required Fields',
          'Please fill in all required fields'
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
    }

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
            <GetStartedForm
              control={form.control}
              isSubmitting={isSubmitting}
            />
          )}

          {type === 'login' && (
            <LoginForm
              control={form.control}
              isSubmitting={isSubmitting}
            />
          )}

          {type === 'register' && (
            <RegisterForm
              control={form.control}
              isSubmitting={isSubmitting} 
              password={''} 
              />
          )}

          {type === 'reset-password' && (
            <ResetPasswordForm
              control={form.control}
              isSubmitting={isSubmitting} 
              newPassword={''}            
              />
          )}

          {type === 'forgot-password' && (
            <ForgotPasswordForm
              control={form.control}
              isSubmitting={isSubmitting}
              resetLinkSent={resetLinkSent}
              timeLeft={timeLeft}
            />
          )}
        </form>
      </Form>
    </section>
  );
};

export default AuthForm;