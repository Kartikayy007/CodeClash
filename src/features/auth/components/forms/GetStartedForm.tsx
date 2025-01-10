import CustomInput from '@/components/CustomInput'
import LabelButton from '@/components/ui/LabelButton'
import { Control } from 'react-hook-form'

interface GetStartedFormProps {
  control: Control<any>
  isSubmitting: boolean
}

export default function GetStartedForm({ control, isSubmitting }: GetStartedFormProps) {
  return (
    <>
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
    </>
  )
}