import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
import { Control } from 'react-hook-form'
// import { GetStartedFormSchema } from '@/lib/schemas/authSchema'
// import { z } from 'zod'
import { FormData } from '@/types/form.types';

// type GetStartedFormData = z.infer<typeof GetStartedFormSchema>

interface GetStartedFormProps {
  control: Control<FormData>;
  isSubmitting: boolean;
}

export default function GetStartedForm({ control, isSubmitting }: GetStartedFormProps) {
  return (
    <div className='w-full space-y-4 sm:space-y-6'>
      <CustomInput
        name="email"
        label="Email"
        control={control}
        placeholder=""
      />
      <LabelButton
        type="submit"
        variant="filled"
        disabled={isSubmitting}
      >
        Get Started
      </LabelButton>
    </div>
  )
}