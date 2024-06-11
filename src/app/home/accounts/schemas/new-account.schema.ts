"use client"

import { z } from "zod"

export const newAccountSchema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
})

export const cookiesNewAccountSchema = z.object({
  li_at: z.string().min(1, "li_at is required"),
  li_a: z.string()
})

export type NewAccount = z.infer<typeof newAccountSchema>