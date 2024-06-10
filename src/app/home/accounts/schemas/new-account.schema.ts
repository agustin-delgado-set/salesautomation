"use client"

import { z } from "zod"

export const newAccountSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
})

export type NewAccount = z.infer<typeof newAccountSchema>