<<<<<<< HEAD
import {
  ResetPasswordHandlerProps,
  LoginHandlerProps,
  ForgotPasswordHandlerProps,
  GetStartedHandlerProps,
  RegisterHandlerProps
=======
import { 
  ResetPasswordHandlerProps,
  LoginHandlerProps,
  RegisterHandlerProps,
  ForgotPasswordHandlerProps,
  GetStartedHandlerProps
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
} from '../types/auth.types'
import { toast } from '@/providers/toast-config'
import { login } from '@/features/auth/thunks/loginThunk'
import { register } from '@/features/auth/thunks/registerThunk'
import { resetPassword } from '@/features/auth/thunks/resetPasswordThunk'
import { resetPasswordWithToken } from '@/features/auth/thunks/resetPasswordWithTokenThunk'
import { checkEmail } from '@/features/auth/thunks/checkEmailThunk'
<<<<<<< HEAD
import router from 'next/router'
=======


>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)

export const handleResetPassword = async ({
  values,
  token,
  dispatch,
<<<<<<< HEAD
  setIsSubmitting,
<<<<<<< HEAD
}: ResetPasswordHandlerProps) => {
  if (!values.Newpassword || !values.confirmPassword) {
    toast.error('Password Required', 'Please enter a new password')
    return false
  }
=======
  router,
  setIsSubmitting,
  form
=======
>>>>>>> 70784f3 (implemented handeling for otp, removed unused import, fixed types)
}: ResetPasswordHandlerProps) => {
  if (!token) {
    toast.error('Invalid Token', 'Password reset link is invalid')
    return false
  }

  setIsSubmitting(true)
  if (!values.Newpassword) {
    toast.error('Password Required', 'Please enter a new password')
    return false
  }

>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
  if (values.Newpassword !== values.confirmPassword) {
    toast.error('Password Mismatch', 'Passwords do not match')
    return false
  }
<<<<<<< HEAD
  if (!token) {
    toast.error('Link Expired', 'Password reset link is invalid')
    return false
  }
  
  setIsSubmitting(true)

=======
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)

  const result = await dispatch(resetPasswordWithToken({
    token,
    password: values.Newpassword
  })).unwrap()

  if (result.success) {
    toast.success('Password Reset Successful', 'You can now login with your new password')
    router.push('/login')
    return true
  }
  return false
}

export const handleLogin = async ({
  values,
  dispatch,
  router,
  form,
  setIsSubmitting
}: LoginHandlerProps) => {
  if (!values.email || !values.password) {
    toast.error('Required Fields', 'Please fill in all required fields')
    return false
  }

  setIsSubmitting(true)
  const result = await dispatch(login({
    email: values.email,
    password: values.password
  })).unwrap()

<<<<<<< HEAD

=======
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
  if (result.success) {
    const rememberMe = form.getValues('rememberMe')
    if (rememberMe) {
      sessionStorage.setItem('rememberMe', 'true')
      sessionStorage.setItem('userEmail', values.email)
    } else {
      sessionStorage.removeItem('rememberMe')
      sessionStorage.removeItem('userEmail')
    }
<<<<<<< HEAD

    toast.success('Login Successful', 'Welcome back!')
    router.push('/dashboard')
=======
    
    toast.success('Login Successful', 'Welcome back!')
    router.push('/home')
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
    return true
  }
  return false
}

export const handleRegister = async ({
  values,
  dispatch,
<<<<<<< HEAD
  setIsSubmitting,
  router
}: RegisterHandlerProps) => {

  console.log(values.terms)

=======
  router,
  setIsSubmitting
}: RegisterHandlerProps) => {
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
  if (!values.email || !values.username || !values.password) {
    toast.error('Required Fields', 'Please fill in all required fields')
    return false
  }
<<<<<<< HEAD
  
  if (values.terms === false) {
    toast.error('Terms & Conditions', 'Please accept the terms and conditions')
    return false
  }

  
=======
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)

  setIsSubmitting(true)
  const result = await dispatch(register({
    email: values.email,
    username: values.username,
    password: values.password
  })).unwrap()

<<<<<<< HEAD

=======
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
  if (result.success) {
    localStorage.setItem('registrationEmail', values.email)
    document.cookie = `registrationEmail=${values.email}; path=/;`
    document.cookie = `isRegistering=true; path=/;`
<<<<<<< HEAD

=======
    
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
    toast.success('Registration Successful', 'Please verify your email')
    router.push('/verify')
    return true
  }
  return false
}

export const handleForgotPassword = async ({
  values,
  dispatch,
  setIsSubmitting,
  setResetLinkSent,
  setTimeLeft,
  onResetLinkSent
}: ForgotPasswordHandlerProps) => {
  if (!values.email) {
    toast.error('Required Field', 'Please enter your email address')
    return false
  }

  setIsSubmitting(true)
  const result = await dispatch(resetPassword({ email: values.email })).unwrap()

  if (result.success) {
<<<<<<< HEAD
<<<<<<< HEAD
    toast.success('Reset Link Sent', 'Please check your email for the reset link')
=======
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
=======
    toast.success('Reset Link Sent', 'Please check your email for the reset link')
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
    setResetLinkSent?.(true)
    setTimeLeft?.(30)
    onResetLinkSent?.(values.email)
    return true
  }
  return false
}

export const handleGetStarted = async ({
  values,
  dispatch,
  router,
  setIsSubmitting
}: GetStartedHandlerProps) => {
<<<<<<< HEAD
  console.log(values.email)
=======
>>>>>>> 0e26516 (Add error handling and submission logic for authentication forms)
  if (!values.email) {
    toast.error('Required Field', 'Please enter your email address')
    return false
  }

  setIsSubmitting(true)
  const result = await dispatch(checkEmail({ email: values.email })).unwrap()

  if (result.success) {
    localStorage.setItem('enteredEmail', values.email)
    switch (result.data?.flow) {
      case 1:
        router.push('/register')
        break
      case 2:
      case 3:
        router.push('/login')
        break
    }
    return true
  }
  return false
}