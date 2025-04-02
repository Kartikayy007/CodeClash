import React, { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/providers/toast-config";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp } from "@/features/auth/thunks/verifyOtpThunk";
import { RootState, AppDispatch } from "@/store/store";
import LabelButton from "./ui/LabelButton";
import { Form, FormField } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/utils/utils";
import { resendOtp } from "@/features/auth/thunks/resendOtpThunk";
import { useRouter } from "next/navigation";
import { OtpError } from "@/features/auth/types/error.types";
import axios from "axios";
import { OTPFormSchema } from "@/lib/schemas/authSchema";

type OTPFormValues = z.infer<typeof OTPFormSchema>;

const CustomOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.auth);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);
  const [validationState, setValidationState] = useState<
    "idle" | "validating" | "success" | "error"
  >("idle");
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(-1);
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  useEffect(() => {
    if (timeLeft === 0) {
      setIsDisabled(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (validationState === "error") {
      let index = 0;
      const animationInterval = setInterval(() => {
        if (index < 4) {
          setCurrentAnimationIndex(index);
          index++;
        } else {
          setCurrentAnimationIndex(-1);
          setValidationState("idle");
          form.reset();
          clearInterval(animationInterval);
        }
      }, 250);

      return () => clearInterval(animationInterval);
    } else if (validationState === "success") {
      let index = 0;
      const animationInterval = setInterval(() => {
        if (index < 4) {
          setCurrentAnimationIndex(index);
          index++;
        } else {
          clearInterval(animationInterval);
        }
      }, 200);

      return () => clearInterval(animationInterval);
    }
  }, [validationState, form]);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const handleNetworkError = () => {
    if (!navigator.onLine) {
      toast.error(
        "No Internet Connection",
        "Please check your internet connection",
      );
      return true;
    }
    return false;
  };

  const handleResend = async () => {
    try {
      const email = localStorage.getItem("registrationEmail");
      if (!email) {
        toast.error("Error", "Email not found. Please register again.");
        return;
      }

      const result = await dispatch(resendOtp({ email })).unwrap();

      if (result.success) {
        setTimeLeft(30);
        setIsDisabled(true);
        toast.success("Success", "OTP sent to your email");
      }
    } catch (error: unknown) {
      const otpError = error as OtpError;
      toast.error(
        "Failed to resend OTP",
        otpError.response?.data?.message ||
          otpError.message ||
          "Please try again later",
      );
    }
  };

  const onSubmit = async (data: OTPFormValues) => {
    try {
      setValidationState("idle");
      console.log("data.pin.length", data.pin.length);

      if (data.pin.length < 4) {
        toast.error(
          "Fields Cannot be Empty",
          "Please fill in all required fields",
        );
        return;
      }

      setValidationState("validating");

      const email = localStorage.getItem("registrationEmail");
      if (!email) {
        toast.error("Error", "Email not found. Please register again.");
        router.push("/register");
        return;
      }

      const otpData = {
        email,
        otp: data.pin,
      };

      const resultAction = await dispatch(verifyOtp(otpData));
      if (
        !navigator.onLine ||
        (axios.isAxiosError(resultAction) && !resultAction.response)
      ) {
        handleNetworkError();
        return;
      }

      if (verifyOtp.fulfilled.match(resultAction)) {
        const response = resultAction.payload;

        if (response.success) {
          setValidationState("success");
          if (response.data?.tokens) {
            localStorage.setItem("token", response.data.tokens.accessToken);
            localStorage.setItem(
              "refreshToken",
              response.data.tokens.refreshToken,
            );
            document.cookie = `accessToken=${response.data.tokens.accessToken}; path=/`;
            document.cookie = `refreshToken=${response.data.tokens.refreshToken}; path=/`;
            localStorage.removeItem("registrationEmail");
          }
          toast.success("Success", "OTP verified successfully");
          setTimeout(() => {
            router.push("/dashboard");
          }, 200);
        }
      } else if (verifyOtp.rejected.match(resultAction)) {
        setValidationState("error");
        setTimeout(() => {
          toast.error("Invalid OTP", "Please check and try again later");
        }, 800);
      }
    } catch (error: unknown) {
      setValidationState("error");
      const apiError = error as OtpError;
      console.error(apiError.response?.data?.message);
      setTimeout(() => {
        toast.error("Invalid OTP", "Please check and try again.");
      }, 800);
    }
  };

  const handleChange = (value: string) => {
    form.setValue("pin", value, { shouldValidate: true });

    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    if (value.length === 4) {
      submitTimeoutRef.current = setTimeout(() => {
        form.handleSubmit(onSubmit)();
      }, 500);
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const formValues = form.getValues();
    onSubmit(formValues);
  };

  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <div className="flex justify-center items-center w-full max-w-md mx-auto text-white">
              <InputOTP
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                {...field}
                value={field.value}
                onChange={handleChange}
              >
                <InputOTPGroup className="flex gap-4 sm:gap-12 focus:border-purple-500 border-[#D1D1D1]">
                  {[0, 1, 2, 3].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={cn(
                        "w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg",
                        "bg-transparent text-2xl sm:text-3xl",
                        "transition-all duration-200",
                        validationState === "error" &&
                          currentAnimationIndex >= index &&
                          "border-red-500",
                        validationState === "success" &&
                          currentAnimationIndex >= index &&
                          "border-green-500",
                        "focus:border-purple-500",
                      )}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          )}
        />

        <div className="flex flex-col items-center gap-4">
          <LabelButton
            type="button"
            variant="filled"
            className="w-full max-w-none"
            disabled={loading || validationState === "validating"}
            onClick={handleButtonClick}
          >
            Verify OTP
          </LabelButton>

          <div className="flex items-center gap-2 text-[#D1D1D1] text-base">
            {isDisabled ? (
              <span className="text-[#E7E7E7]">Resend OTP IN {timeLeft}s</span>
            ) : (
              <>
                <span>Didnt receive the OTP? </span>
                <button
                  onClick={handleResend}
                  type="button"
                  className="text-[#C879EB] hover:opacity-80 transition-opacity"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CustomOtp;
