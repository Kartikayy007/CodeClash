import { FieldErrors, UseFormReturn, FieldValues } from "react-hook-form";
import { z } from "zod";
import {
  LoginFormSchema,
  RegisterFormSchema,
  ResetPasswordFormSchema,
  ForgotPasswordFormSchema,
  GetStartedFormSchema,
} from "@/lib/schemas/authSchema";
import { toast } from "@/providers/toast-config";
import { ApiError } from "@/features/auth/types/error.types";
import { isAxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface BaseErrorHandlerProps<T extends FieldValues> {
  errors: FieldErrors<T>;
  form: UseFormReturn<T>;
}

type LoginFormValues = z.infer<typeof LoginFormSchema>;
type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;
type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordFormSchema>;
type GetStartedFormValues = z.infer<typeof GetStartedFormSchema>;

type LoginErrorHandlerProps = BaseErrorHandlerProps<LoginFormValues>;
type RegisterErrorHandlerProps = BaseErrorHandlerProps<RegisterFormValues>;
type ResetPasswordErrorHandlerProps =
  BaseErrorHandlerProps<ResetPasswordFormValues>;
type ForgotPasswordErrorHandlerProps =
  BaseErrorHandlerProps<ForgotPasswordFormValues>;
type GetStartedErrorHandlerProps = BaseErrorHandlerProps<GetStartedFormValues>;

export const handleLoginError = ({ errors, form }: LoginErrorHandlerProps) => {
  if (!form.getValues("email") || !form.getValues("password")) {
    toast.error("Required Fields", "Please fill in all required fields");
    return true;
  }

  if (errors.email) {
    toast.error("Invalid Email", "Enter a valid email address.");
    return true;
  }

  if (errors.password) {
    toast.error("Invalid Credentials", "Please check your email and password");
    return true;
  }
  return false;
};

export const handleRegisterError = ({
  errors,
  form,
}: RegisterErrorHandlerProps) => {
  if (
    !form.getValues("email") ||
    !form.getValues("username") ||
    !form.getValues("password")
  ) {
    toast.error("Required Fields", "Please fill in all required fields");
    return true;
  }

  if (errors.email) {
    toast.error("Invalid Email", "Enter a valid email address.");
    return true;
  }

  if (errors.username) {
    toast.error("Invalid Username", "Username must be at least 3 characters");
    return true;
  }

  if (errors.password) {
    toast.error("Invalid Password", "Password must meet all requirements");
    return true;
  }

  if (!form.getValues("terms")) {
    toast.error("Terms Required", "Please accept the Terms & Conditions");
    return true;
  }
  return false;
};

export const handleResetPasswordError = ({
  errors,
  form,
}: ResetPasswordErrorHandlerProps) => {
  if (!form.getValues("Newpassword") || !form.getValues("confirmPassword")) {
    toast.error("Required Fields", "Please fill in both password fields");
    return true;
  }

  if (form.getValues("Newpassword") !== form.getValues("confirmPassword")) {
    toast.error("Password Mismatch", "Passwords do not match");
    return true;
  }

  if (errors.Newpassword) {
    toast.error("Invalid Password", "Password must meet all requirements");
    return true;
  }
  return false;
};

export const handleGetStartedError = ({
  errors,
  form,
}: GetStartedErrorHandlerProps) => {
  if (!form.getValues("email")) {
    toast.error("Required Fields", "Please fill in all required fields");
    return true;
  }

  if (errors.email) {
    toast.error("Invalid Email", "Enter a valid email address.");
    return true;
  }

  return false;
};

export const handleForgotPasswordError = ({
  errors,
  form,
}: ForgotPasswordErrorHandlerProps) => {
  if (!form.getValues("email")) {
    toast.error("Required Fields", "Please fill in the email field");
    return true;
  }

  if (errors.email) {
    toast.error("Invalid Email", "Enter a valid email address.");
    return true;
  }

  return false;
};

const handleNetworkError = () => {
  if (!navigator.onLine) {
    toast.error("No Internet Connection", "Please check your internet");
    return true;
  }
  return false;
};

export const handleApiError = (
  error: ApiError,
  type: string,
  router: AppRouterInstance,
) => {
  if (!navigator.onLine || (isAxiosError(error) && !error.response)) {
    handleNetworkError();
    return;
  }

  switch (type) {
    case "login": {
      const message = error.message;
      switch (message) {
        case "User not found":
          toast.error("Account Not Found", "No account exists with this email");
          router.push("/register");
          break;
        case "Invalid password":
          toast.error("Incorrect Password", "Retry or reset your password.");
          break;
        case "Password not set":
          toast.error("Password Required", "Please set your password first");
          break;
        default:
          toast.error("Login Failed", message || "Unable to login");
      }
      break;
    }

    case "register": {
      const message = error.message;
      switch (message) {
        case "Email already exists":
          toast.error(
            "Email already registered",
            "Kindly log in or use another email.",
          );
          break;
        case "Validation failed":
          toast.error("Invalid Details", "Please check your information");
          break;
        default:
          toast.error("Registration Failed", message || "Unable to register");
      }
      break;
    }

    case "reset-password": {
      const message = error.message;
      switch (message) {
        case "Invalid token":
          toast.error("Invalid Link", "Reset link is expired or invalid");
          break;
        case "Token expired":
          toast.error("Link Expired", "Please request a new reset link");
          break;
        default:
          toast.error("Reset Failed", message || "Unable to reset password");
      }
      break;
    }

    case "forgot-password": {
      const message = error.error;
      switch (message) {
        case "User not found":
          toast.error("Account Not Found", "No account with this email");
          router.push("/register");
          break;
        case "Too many requests":
          toast.error("Too Many Attempts", "Please wait before trying again");
          break;
        default:
          toast.error("Request Failed", message || "Unable to process request");
      }
      break;
    }

    default:
      toast.error("Error", error.message);
  }
};
