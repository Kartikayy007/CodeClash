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
        </form>
      </Form>
    </section>
  );
};

export default AuthForm;