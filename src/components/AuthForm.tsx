'use client';

import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LabelButton from './ui/LabelButton';
import CustomInput from './CustomInput';
import { AuthFormSchema } from '@/lib/utils';
import { toast } from '@/providers/toast-config';
import CustomCheckbox from '@/components/ui/CustomCheckbox';

const AuthForm = ({ type }: { type: string }) => {
  
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: ""
    },
    mode: "onSubmit"
  });

  const onSubmit = async (values: z.infer<typeof AuthFormSchema>) => {
    try {
      const result = AuthFormSchema.safeParse(values);
      
      if (!result.success) {
        result.error.errors.forEach((error) => {
          toast.error(
            'Validation Error', 
            'Please enter a valid email address'
          );
        });
        return;
      }
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onError = (errors: any) => {
    if (errors.email) {
      toast.error(
        'Invalid email', 
        'Enter a valid email address.'
      );
    }
  };

  return (
    <section>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit, onError)} 
          className="space-y-8"
        >
          {type === 'get-started' && (
            <>
              <CustomInput
                control={form.control}
                name="email" 
                label="Email"
                placeholder=""
              />
              <LabelButton type="submit" variant="filled">
                Get Started
              </LabelButton>
            </>
          )}

          {type === 'login' && (
            <>
              <CustomInput
                name="email" 
                label="Email"
                control={form.control}
                placeholder=""
              />
              <CustomInput
                name="password" 
                label="Password"
                control={form.control}
                placeholder=""
              />

            <div className='flex justify-between items-center text-[#D1D1D1]'>
              <button className='text-lg'>
                Forgot Password?
              </button>

              <CustomCheckbox 
                name="rememberMe"
                label="Remember me"
                control={form.control}
              />
            </div>

              <LabelButton type="submit" variant="filled">
                Login
              </LabelButton>
            </>
          )}
        </form>
      </Form>
    </section>
  );
};

export default AuthForm;