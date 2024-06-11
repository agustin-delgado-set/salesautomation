"use client"

import { z } from "zod"

export const phoneRegisterSchema = z.object({
  countryCode: z.string({ required_error: "Please select an email to display." }),
  phoneNumber: z.string({ required_error: "Please enter a phone number." }),
})

export type PhoneRegister = z.infer<typeof phoneRegisterSchema>