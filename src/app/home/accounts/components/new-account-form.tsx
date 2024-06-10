import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { newAccountSchema } from "../schemas/new-account.schema";
import { connectLinkedinAccount, reconnectLinkedinAccount } from "../api/unipile";
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs";
import { addAccount } from "../api/supabase";
import { closeModal, getModalState } from "@/lib/store/modal-store";
import { errors } from "@/lib/errors/errors";

export default function NewAccountForm({ setCheckpoint, setTab }: { setCheckpoint: any, setTab: Dispatch<SetStateAction<string>> }) {
  const { payload } = getModalState()
  const { user } = useUser()

  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof newAccountSchema>>({
    resolver: zodResolver(newAccountSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof newAccountSchema>) {
    if (values.password !== values.confirmPassword) return form.setError("confirmPassword", { type: "manual", message: "Passwords do not match" })

    setLoading(true)

    try {
      let result

      if (payload?.reconnect) {
        result = await reconnectLinkedinAccount(values.email, values.password, payload.accountId)
      } else {
        result = await connectLinkedinAccount(values.email, values.password)
      }
      console.log(result)

      if (result.object === "AccountCreated" || result.object === "AccountReconnected") {
        const userEmail = user?.primaryEmailAddress?.emailAddress ?? ""

        await addAccount(userEmail, result.account_id)

        toast(`Account ${payload?.reconnect ? "reconnected" : "connected"} successfully`, { description: "You can now start using your LinkedIn account" })

        return closeModal()
      }

      setCheckpoint(result)

      if (result?.checkpoint?.type === "OTP" || result?.checkpoint?.type === "2FA") return setTab("checkpoint")

      return toast("Failed to connect account", { description: errors[result.type as keyof typeof errors] })
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="agustin@gmail.com" {...field} />
              </FormControl>
              <FormDescription>
                This is your LinkedIn email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>
                This is your LinkedIn password.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>
                Confirm your LinkedIn password.
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