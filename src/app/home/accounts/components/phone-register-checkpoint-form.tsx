import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCw } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { countryPhoneCodes } from "../constants/country-phone-codes";
import { phoneRegisterSchema } from "../schemas/phone-register-checkpoint.schema";
import { solveCheckpoint } from "../api/unipile";
import { toast } from "sonner"
import { errors } from "@/lib/errors/errors";

export default function PhoneRegisterCheckpointForm({ checkpoint, setTab, setCheckpoint }: { checkpoint: any, setTab: Dispatch<SetStateAction<string>>, setCheckpoint: Dispatch<SetStateAction<null>> }) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof phoneRegisterSchema>>({
    resolver: zodResolver(phoneRegisterSchema)
  })

  async function onSubmit(values: z.infer<typeof phoneRegisterSchema>) {
    setLoading(true)

    try {
      const phoneNumber = `(+${values.countryCode.split(" ")[0]})${values.phoneNumber}`
      const result = await solveCheckpoint(checkpoint, phoneNumber)

      console.log(result)
      console.log(phoneNumber, checkpoint)

      if (result.status) return toast("Failed to connect account", { description: errors[result.type as keyof typeof errors] })

      setCheckpoint(result)
      setTab("checkpoint")
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="countryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countryPhoneCodes.map(country => (
                    <SelectItem defaultValue="" value={`${country.code} ${country.country}`} key={country.country}>
                      {country.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                We need your country code to send you a verification code.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input defaultValue="" placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormDescription>
                You will receive a 2FA verification code
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