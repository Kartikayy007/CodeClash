import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
import { Control } from 'react-hook-form'
<<<<<<< HEAD
<<<<<<< HEAD
// import { GetStartedFormSchema } from '@/lib/schemas/authSchema'
// import { z } from 'zod'
import { FormData } from '@/types/form.types';

// type GetStartedFormData = z.infer<typeof GetStartedFormSchema>

interface GetStartedFormProps {
  control: Control<FormData>;
  isSubmitting: boolean;
=======
=======
import { AuthFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

type GetstartedFromData = z.infer<typeof AuthFormSchema>
>>>>>>> 70784f3 (implemented handeling for otp, removed unused import, fixed types)

interface GetStartedFormProps {
  control: Control<GetstartedFromData>
  isSubmitting: boolean
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
}

export default function GetStartedForm({ control, isSubmitting }: GetStartedFormProps) {
  return (
<<<<<<< HEAD
    <div className='w-full space-y-4 sm:space-y-6'>
=======
    <>
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
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
<<<<<<< HEAD
    </div>
=======
    </>
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
  )
}