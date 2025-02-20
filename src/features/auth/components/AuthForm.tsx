'use client';

import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { FieldErrors, useForm, UseFormReturn, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { AuthFormSchema, RegisterFormSchema, LoginFormSchema, GetStartedFormSchema, ResetPasswordFormSchema, ForgotPasswordFormSchema } from '@/lib/schemas/authSchema';
import { toast } from '@/providers/toast-config';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { ApiError } from '@/features/auth/types/error.types';
import GetStartedForm from './forms/GetStartedForm';
import LoginForm from './forms/LoginForm';
import RegisterForm from './forms/RegisterForm';
import ResetPasswordForm from './forms/ResetPasswordForm';
import ForgotPasswordForm from './forms/ForgotPasswordForm';
import {
  handleResetPasswordError,
  handleLoginError,
  handleRegisterError,
  handleApiError,
  handleGetStartedError,
  handleForgotPasswordError
} from '../handlers/errorHandlers'
import {
  handleResetPassword,
  handleLogin,
  handleRegister,
  handleForgotPassword,
  handleGetStarted
} from '../handlers/submitHandlers'
import { useRouter } from 'next/navigation';
import { AuthFormType } from '../types/auth.types';

interface AuthFormProps {
  type: AuthFormType;
  token?: string;
  onResetLinkSent?: (email: string) => void;
}

// Create type for all possible form types
type FormData = 
  | z.infer<typeof ResetPasswordFormSchema>
  | z.infer<typeof LoginFormSchema>
  | z.infer<typeof RegisterFormSchema>
  | z.infer<typeof GetStartedFormSchema>
  | z.infer<typeof ForgotPasswordFormSchema>;

// Get correct schema based on type
const getSchema = (type: string) => {
  switch(type) {
    case 'reset-password':
      return ResetPasswordFormSchema;
    case 'login':
      return LoginFormSchema;
    case 'register':
      return RegisterFormSchema;
    case 'get-started':
      return GetStartedFormSchema;
    case 'forgot-password':
      return ForgotPasswordFormSchema;
    default:
      return AuthFormSchema;
  }
};

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

  // Use FormData type for form
  const form = useForm<FormData>({
    resolver: zodResolver(getSchema(type)),
    defaultValues: {
      email: '',  
      ...(type === 'reset-password' ? {
        Newpassword: '',
        confirmPassword: ''
      } : type === 'register' ? {
        username: '',
        password: '',
        terms: false
      } : type === 'login' ? {
        password: '',
        rememberMe: false
      } : {})
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

  const onSubmit = async (values: FormData) => {
    try {
      if (type === 'reset-password') {
        await handleResetPassword({ 
          values: values as z.infer<typeof ResetPasswordFormSchema>, 
          token, 
          dispatch, 
          setIsSubmitting, 
          form: form as UseFormReturn<z.infer<typeof ResetPasswordFormSchema>>
        })
      } else if (type === 'login') {
        await handleLogin({ 
          values: values as z.infer<typeof LoginFormSchema>, 
          dispatch, 
          setIsSubmitting, 
          form: form as UseFormReturn<z.infer<typeof LoginFormSchema>>, 
          router 
        })
      } else if (type === 'register') {
        await handleRegister({ 
          values: values as z.infer<typeof RegisterFormSchema>, 
          dispatch, 
          setIsSubmitting, 
          router 
        })
      } else if (type === 'forgot-password') {
        await handleForgotPassword({
          values: values as z.infer<typeof ForgotPasswordFormSchema>,
          dispatch,
          setIsSubmitting,
          setResetLinkSent,
          setTimeLeft,
          onResetLinkSent
        })
      } else if (type === 'get-started') {
        await handleGetStarted({ 
          values: values as z.infer<typeof GetStartedFormSchema>, 
          dispatch, 
          setIsSubmitting, 
          router 
        })
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      handleApiError(apiError, type, router);
    } finally {
      setIsSubmitting(false);
    }
  }

  const onError = (errors: FieldErrors<FormData>) => {
    if (type === 'reset-password') {
      handleResetPasswordError({ 
        errors: errors as FieldErrors<z.infer<typeof ResetPasswordFormSchema>>, 
        form: form as UseFormReturn<z.infer<typeof ResetPasswordFormSchema>> 
      })
      return
    }
  
    if (type === 'login') {
      handleLoginError({ 
        errors: errors as FieldErrors<z.infer<typeof LoginFormSchema>>, 
        form: form as UseFormReturn<z.infer<typeof LoginFormSchema>> 
      })
      return
    }
  
    if (type === 'register') {
      handleRegisterError({ 
        errors: errors as FieldErrors<z.infer<typeof RegisterFormSchema>>, 
        form: form as UseFormReturn<z.infer<typeof RegisterFormSchema>> 
      })
      return
    }

    if (type === 'get-started') {
      handleGetStartedError({
        errors: errors as FieldErrors<z.infer<typeof GetStartedFormSchema>>,
        form: form as UseFormReturn<z.infer<typeof GetStartedFormSchema>>
      })
      return
    }
  
    if (type === 'forgot-password') {
      handleForgotPasswordError({
        errors: errors as FieldErrors<z.infer<typeof ForgotPasswordFormSchema>>,
        form: form as UseFormReturn<z.infer<typeof ForgotPasswordFormSchema>>
      })
      return
    }
  
    if (type === 'forgot-password' && !form.getValues('email')) {
      toast.error('Fields Cant be Empty', 'Please fill in all required fields')
      return
    }
  }

  return (
    <section className="w-full mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-6 sm:space-y-8"
        >
          {type === 'get-started' && (
            <GetStartedForm
              control={form.control as Control<z.infer<typeof GetStartedFormSchema>>}
              isSubmitting={isSubmitting}
            />
          )}

          {type === 'login' && (
            <LoginForm
              control={form.control}
              isSubmitting={isSubmitting}
              password=''
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