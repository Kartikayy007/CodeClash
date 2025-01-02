"use client"

import React from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import LabelButton from './ui/LabelButton'
import CustomInput from './CustomInput'

const formSchema = z.object({
  email: z.string().email(),
})

const AuthForm = ({ type }: { type: string }) => {

  console.log(type)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }


  return (
    <section>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
        <CustomInput 
          form={form}
          name="email"
          label="Email"
          placeholder={type === 'get-started' ? 'Enter your email' : 'Enter your email address'}
        />

          <LabelButton type="submit" variant="filled">
            Get Started
          </LabelButton>
        </form>
      </Form>
    </section>
  )
}

export default AuthForm
