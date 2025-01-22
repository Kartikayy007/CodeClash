import { z } from "zod"

export const AuthFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
=======
>>>>>>> 7e7cc14 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  password: z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  username: z.string().min(3, 'Username must be at least 3 characters'),
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
  password: z.string().optional(),
  username: z.string().optional(),
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
=======
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
  password: z.string().optional(),
  username: z.string().optional(),
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
<<<<<<< HEAD
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
=======
>>>>>>> 7e7cc14 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
  Newpassword: z.string().optional(),
  confirmPassword: z.string().optional(),
  terms: z.boolean().optional(),
  rememberMe: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (data.password && (ctx.path[0] === 'login' || ctx.path[0] === 'register')) {
    if (data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters",
        path: ["password"],
      });
    }
  }

  if (ctx.path[0] === 'reset-password') {
    if (!data.Newpassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "New password is required",
        path: ["Newpassword"],
      });
      return;
    }

    if (!data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Confirm password is required",
        path: ["confirmPassword"],
      });
      return;
    }

    if (data.Newpassword.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters",
        path: ["Newpassword"],
      });
    }

    if (data.Newpassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }
  }

  return true;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 70784f3 (implemented handeling for otp, removed unused import, fixed types)
=======
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
=======
>>>>>>> e488d9d (implemented handeling for otp, removed unused import, fixed types)
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)
});

export const OTPFormSchema = z.object({
  pin: z.string().min(4, "Please enter a valid 4-digit OTP").max(4)
<<<<<<< HEAD
});

export const startingShema = z.object({
  email: z.string().email()
})

export const GetStartedFormSchema = z.object({
  email: z.string().email(),
});

export const LoginFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  rememberMe: z.boolean().optional(),
});



export const RegisterFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions"
  })
});

export const ResetPasswordFormSchema = z.object({
  Newpassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).superRefine((data, ctx) => {
  if (!data.Newpassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "New password is required",
      path: ["Newpassword"],
    });
  }

  if (!data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Confirm password is required",
      path: ["confirmPassword"],
    });
  }

  if (data.Newpassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  }
});

export const ForgotPasswordFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 70784f3 (implemented handeling for otp, removed unused import, fixed types)
=======
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
=======
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
<<<<<<< HEAD
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
=======
>>>>>>> e488d9d (implemented handeling for otp, removed unused import, fixed types)
<<<<<<< HEAD
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)
=======
=======
>>>>>>> 7e7cc14 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
>>>>>>> d9063d5 (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
});