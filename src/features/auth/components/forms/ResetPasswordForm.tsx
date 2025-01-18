// import { Control, useWatch } from 'react-hook-form'
// import CustomInput from '@/components/CustomInput'
// import LabelButton from '@/components/ui/LabelButton'
// import { AuthFormSchema } from '@/lib/schemas/authSchema'
// import { z } from 'zod'
// import PasswordStrengthChecker from '../PasswordStrengthChecker'
// import { useState } from 'react'

// type ResetPasswordFormData = z.infer<typeof AuthFormSchema>

// interface ResetPasswordFormProps {
//   control: Control<ResetPasswordFormData>
//   isSubmitting: boolean
//   newPassword: string
// }

// export default function ResetPasswordForm({ control, isSubmitting }: ResetPasswordFormProps) {
//   const password = useWatch({
//     control,
//     name: 'Newpassword',
//     defaultValue: ''
//   }) as string; 

//   const [isFocused, setIsFocused] = useState(false);

//   return (
//     <div className='w-full space-y-4 sm:space-y-6'>
//       <div className="relative">
//         <div className='hidden'>
//           <CustomInput
//             name="email"
//             label="Email"
//             control={control}
//             placeholder=""
//             type="text"
//           />
//         </div>
//         <CustomInput
//           name="Newpassword"
//           label="New Password"
//           control={control}
//           placeholder=""
//           type="password"
//           showStrengthChecker={true}
//           onFocus={() => setIsFocused(true)}
//           onBlur={() => setIsFocused(false)}
//         />
//         <PasswordStrengthChecker 
//           password={password || ''} 
//           isFocused={isFocused} 
//         />
//       </div>
//       <div className="relative">
//         <CustomInput
//           name="confirmPassword"
//           label="Confirm Password"
//           control={control}
//           placeholder=""
//           type="password"
//         />
//       </div>
//       <LabelButton
//         type="submit"
//         variant="filled"
//         disabled={isSubmitting}
//       >
//         Reset Password
//       </LabelButton>
//     </div>
//   )
// }