"use client"

import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import LabelButton from './ui/LabelButton'
import CustomInput from './CustomInput'
import { AuthFormSchema } from '@/lib/utils'
import toast from 'react-hot-toast';

const AuthForm = ({ type }: { type: string }) => {


  // 1. Define your form.
  const form = useForm<z.infer<typeof AuthFormSchema>>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      email: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof AuthFormSchema>) {
    try {
      const result = AuthFormSchema.parse(values);
      toast.success('Email is valid!');
      alert('ok')
      console.log(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Show first validation error message
        console.log(error)
        toast.error(error.errors[0].message);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  }

  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          {type === 'get-started' && (
            <>
              <CustomInput
                control={form.control}
                name="email"
                label="Email"
                placeholder={''}
              />
              <LabelButton type="submit" variant="filled">
                Get Started
              </LabelButton>
            </>
          )}

        </form>
      </Form>
    </section>
  )
}

export default AuthForm
