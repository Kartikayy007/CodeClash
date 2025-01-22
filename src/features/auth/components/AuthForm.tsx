'use client';

import React, { useState, useEffect } from 'react';
import { z } from "zod";
<<<<<<< HEAD
<<<<<<< HEAD
import { FieldErrors, useForm, UseFormReturn } from "react-hook-form";
=======
import { FieldErrors, useForm, UseFormReturn, Control } from "react-hook-form";
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { AuthFormSchema, RegisterFormSchema, LoginFormSchema, GetStartedFormSchema, ResetPasswordFormSchema, ForgotPasswordFormSchema } from '@/lib/schemas/authSchema';
import { toast } from '@/providers/toast-config';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
=======
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
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
import { ApiError } from '@/types/error.types';
import GetStartedForm from './forms/GetStartedForm';
import LoginForm from './forms/LoginForm';
import RegisterForm from './forms/RegisterForm';
import ResetPasswordForm from './forms/ResetPasswordForm';
import ForgotPasswordForm from './forms/ForgotPasswordForm';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
import {
  handleResetPasswordError,
  handleLoginError,
  handleRegisterError,
  handleApiError,
  handleGetStartedError,
  handleForgotPasswordError
} from '../handlers/errorHandlers'
import {
=======
import { 
  handleResetPasswordError, 
  handleLoginError, 
  handleRegisterError,
  handleCommonErrors 
} from '../handlers/errorHandlers'
import { 
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
  handleResetPassword,
  handleLogin,
  handleRegister,
  handleForgotPassword,
  handleGetStarted
} from '../handlers/submitHandlers'
<<<<<<< HEAD
import { useRouter } from 'next/navigation';
import { AuthFormType } from '../types/auth.types';
<<<<<<< HEAD

interface AuthFormProps {
  type: AuthFormType;
=======
=======
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)

interface AuthFormProps {
  type: string;
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======

interface AuthFormProps {
  type: AuthFormType;
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  token?: string;
  onResetLinkSent?: (email: string) => void;
}

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
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

<<<<<<< HEAD
=======
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
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

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: type === 'reset-password' ? 'test@example.com' : '',
      password: type === 'forgot-password' ? undefined : "",
      username: "",
      Newpassword: "",
      confirmPassword: "",
      terms: false,
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
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
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
    },
    mode: "onChange",
    context: type,
  });
<<<<<<< HEAD
<<<<<<< HEAD
  
=======

>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
  
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
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

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
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
<<<<<<< HEAD
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
<<<<<<< HEAD

<<<<<<< HEAD
=======
  const onSubmit = async (values: z.infer<typeof AuthFormSchema>) => {
    try {
      if (type === 'reset-password') {
        await handleResetPassword({ values, token, dispatch, router, setIsSubmitting, form })
      } else if (type === 'login') {
        await handleLogin({ values, dispatch, router, form, setIsSubmitting })
      } else if (type === 'register') {
        await handleRegister({ values, dispatch, router, setIsSubmitting })
      } else if (type === 'forgot-password') {
        await handleForgotPassword({ 
          values, 
          dispatch, 
          setIsSubmitting, 
          setResetLinkSent, 
          setTimeLeft, 
          onResetLinkSent 
        })
      } else if (type === 'get-started') {
        await handleGetStarted({ values, dispatch, router, setIsSubmitting })
      }
    } catch (error: unknown) {
      const apiError = error as ApiError
      toast.error(
        'Error',
        apiError.response?.data?.message || apiError.message || 'Something went wrong'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const onError = (errors: FieldErrors<z.infer<typeof AuthFormSchema>>) => {
    if (type === 'reset-password' && handleResetPasswordError({ errors, form })) {
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
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
<<<<<<< HEAD

<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
    if (errors.email) {
      toast.error(
        'Invalid email',
        'Enter a valid email address.'
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
<<<<<<< HEAD
=======
    handleCommonErrors({ errors, form })
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  }
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
=======
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
    handleCommonErrors({ errors, form })
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  }
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)

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
              control={form.control as Control<z.infer<typeof LoginFormSchema>>}
              isSubmitting={isSubmitting}
<<<<<<< HEAD
              password=''
=======
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
            />
          )}

          {type === 'register' && (
            <RegisterForm
<<<<<<< HEAD
              control={form.control}
<<<<<<< HEAD
=======
              control={form.control as Control<z.infer<typeof RegisterFormSchema>>}
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
              isSubmitting={isSubmitting}
              password={''}
            />
=======
              isSubmitting={isSubmitting} 
              password={''} 
              />
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
          )}

          {type === 'reset-password' && (
            <ResetPasswordForm
<<<<<<< HEAD
<<<<<<< HEAD
            control={form.control}
            isSubmitting={isSubmitting}
          />
=======
              control={form.control}
              isSubmitting={isSubmitting} 
              newPassword={''}            
              />
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
            control={form.control as Control<z.infer<typeof ResetPasswordFormSchema>>}
            isSubmitting={isSubmitting}
          />
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
          )}

          {type === 'forgot-password' && (
            <ForgotPasswordForm
              control={form.control as Control<z.infer<typeof ForgotPasswordFormSchema>>}
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