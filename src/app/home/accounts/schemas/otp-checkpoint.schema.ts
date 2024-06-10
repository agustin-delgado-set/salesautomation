import { z } from "zod";

export const otpCheckpointSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

export type OTPCheckpoint = z.infer<typeof otpCheckpointSchema>