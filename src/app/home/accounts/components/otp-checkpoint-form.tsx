import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { errors } from "@/lib/errors/errors";
import { closeModal, getModalState } from "@/lib/store/modal-store";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addAccount } from "../api/supabase";
import { solveCheckpoint } from "../api/unipile";
import { otpCheckpointSchema } from "../schemas/otp-checkpoint.schema";

export default function OTPCheckpointForm({ checkpoint, setTab }: { checkpoint: any, setTab: Dispatch<SetStateAction<string>> }) {
  const { payload } = getModalState()
  const { user } = useUser()

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof otpCheckpointSchema>>({
    resolver: zodResolver(otpCheckpointSchema),
    defaultValues: {
      pin: "",
    },
  })

  async function onSubmit(data: z.infer<typeof otpCheckpointSchema>) {
    setLoading(true)

    try {
      const result = await solveCheckpoint(checkpoint, data.pin)
      console.log(result)

      if (result.object === "AccountCreated" || result.object === "AccountReconnected") {
        const userEmail = user?.primaryEmailAddress?.emailAddress ?? ""

        await addAccount(userEmail, result.account_id)

        closeModal()

        return toast(`Account ${payload?.reconnect ? "reconnected" : "connected"} successfully`, { description: "You can now start using your LinkedIn account" })
      }

      console.log(result.type)

      if (result.type === "errors/invalid_checkpoint_solution") setTab("load-account")

      return toast("Failed to connect account", { description: errors[result.type as keyof typeof errors] })
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={loading}
          type="submit"
        >
          {loading && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  )
}