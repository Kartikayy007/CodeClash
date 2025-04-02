import CustomInput from "@/components/CustomInput";
import LabelButton from "@/components/ui/LabelButton";
import { Control } from "react-hook-form";
import { z } from "zod";
import { GetStartedFormSchema } from "@/lib/schemas/authSchema";
import { AuthFormData } from "../../types/form.types";

interface GetStartedFormProps {
  control: Control<z.infer<typeof GetStartedFormSchema>>;
  isSubmitting: boolean;
}

export default function GetStartedForm({
  control,
  isSubmitting,
}: GetStartedFormProps) {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <CustomInput
        name="email"
        label="Email"
        control={control as Control<AuthFormData>}
        placeholder=""
      />
      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
        className="w-full max-w-none"
      >
        Get Started
      </LabelButton>
    </div>
  );
}
