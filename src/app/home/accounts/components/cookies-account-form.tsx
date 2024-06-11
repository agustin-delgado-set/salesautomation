import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { errors } from "@/lib/errors/errors";
import { closeModal, getModalState } from "@/lib/store/modal-store";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addAccount } from "../api/supabase";
import { connectLinkedinAccountWithCookies } from "../api/unipile";
import { cookiesNewAccountSchema } from "../schemas/new-account.schema";

export default function CookiesAccountForm() {
  const { payload } = getModalState()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof cookiesNewAccountSchema>>({
    resolver: zodResolver(cookiesNewAccountSchema),
    defaultValues: {
      li_at: "",
      li_a: "",
    },
  })

  async function onSubmit(values: z.infer<typeof cookiesNewAccountSchema>) {
    setLoading(true)

    try {
      const result = await connectLinkedinAccountWithCookies(values.li_at, values.li_a)
      console.log(result)

      if (result.object === "AccountCreated" || result.object === "AccountReconnected") {
        const userEmail = user?.primaryEmailAddress?.emailAddress ?? ""

        await addAccount(userEmail, result.account_id)

        toast(`Account ${payload?.reconnect ? "reconnected" : "connected"} successfully`, { description: "You can now start using your LinkedIn account" })
        return closeModal()
      }

      return toast("Failed to connect account", { description: errors[result.type as keyof typeof errors] })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Popover>
      <PopoverContent className="w-80 text-sm">
        <p>1. Open LinkedIn in a new tab or click <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="underline">here</a></p>
        <p>2. Log in to your account.</p>
        <p>3. Open your browser's developer console (F12 for Chrome and Firefox, option + command + I for Safari) then go to the "application" or "storage" tab.</p>
        <p>4. Open the cookies folder and click on the one called "https://www.linkedin.com".</p>
        <p>5. Copy the values for "li_at" into the field below, then click on the connect button</p>
      </PopoverContent>
      <div className="flex flex-col gap-4 mt-6">
        <p className="text-sm">Copy your LinkedIn cookies. <PopoverTrigger asChild><button className="underline cursor-pointer">How to find them?</button></PopoverTrigger></p>
        <p className="text-sm">Your cookies need to be collected in the same browser as this page.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="li_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>li_at value </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your li_at value" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the li_at cookie value from LinkedIn
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="li_a"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>li_a value (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your li_a value" {...field} />
                  </FormControl>
                  <FormDescription>
                    If your account has Recruiter or Sales Navigator subscription, copy the li_a too.
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
      </div>
    </Popover>
  )
}