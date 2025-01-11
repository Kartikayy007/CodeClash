import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
import { Control } from 'react-hook-form'
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)
// import { GetStartedFormSchema } from '@/lib/schemas/authSchema'
// import { z } from 'zod'
import { FormData } from '@/types/form.types';

// type GetStartedFormData = z.infer<typeof GetStartedFormSchema>

interface GetStartedFormProps {
  control: Control<FormData>;
  isSubmitting: boolean;
=======
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)
=======
import { AuthFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

type GetstartedFromData = z.infer<typeof AuthFormSchema>
<<<<<<< HEAD
>>>>>>> 70784f3 (implemented handeling for otp, removed unused import, fixed types)

interface GetStartedFormProps {
  control: Control<GetstartedFromData>
  isSubmitting: boolean
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
import { GetStartedFormSchema } from '@/lib/schemas/authSchema'
import { z } from 'zod'

// type GetStartedFormData = z.infer<typeof GetStartedFormSchema>

interface GetStartedFormProps {
  control: Control<z.infer<typeof GetStartedFormSchema>>;
  isSubmitting: boolean;
>>>>>>> 854819a (Refactor authentication forms to use specific schemas, enhance reset password feedback, and improve button component sizing)
=======
=======
>>>>>>> e488d9d (implemented handeling for otp, removed unused import, fixed types)
>>>>>>> 4e70137 (implemented handeling for otp, removed unused import, fixed types)

interface GetStartedFormProps {
  control: Control<GetstartedFromData>
  isSubmitting: boolean
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
}

export default function GetStartedForm({ control, isSubmitting }: GetStartedFormProps) {
  return (
<<<<<<< HEAD
    <div className='w-full space-y-4 sm:space-y-6'>
=======
    <>
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
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
<<<<<<< HEAD
>>>>>>> 34daeff (Refactor authentication components; move to features/auth directory for better organization)
=======
>>>>>>> 92f450a (Refactor authentication components; move to features/auth directory for better organization)
>>>>>>> 35d1a9c (Refactor authentication components; move to features/auth directory for better organization)
  )
}