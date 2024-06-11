import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import NewAccountForm from "./new-account-form";
import OTPCheckpointForm from "./otp-checkpoint-form";
import PhoneRegisterCheckpointForm from "./phone-register-checkpoint-form";
import CookiesAccountForm from "./cookies-account-form";

export default function NewAccountModal() {
  const [tab, setTab] = useState("load-account")
  const [checkpoint, setCheckpoint] = useState(null)

  const onTabChange = (value: string) => {
    setTab(value);
  }

  return (
    <Tabs defaultValue="credentials">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="credentials">Credentials</TabsTrigger>
        <TabsTrigger value="cookies">Cookies</TabsTrigger>
      </TabsList>
      <TabsContent value="credentials">
        <Tabs defaultValue="load-account" value={tab} onValueChange={onTabChange}>
          <TabsContent value="load-account">
            <NewAccountForm setCheckpoint={setCheckpoint} setTab={setTab} />
          </TabsContent>
          <TabsContent value="checkpoint">
            <OTPCheckpointForm checkpoint={checkpoint} setTab={setTab} />
          </TabsContent>
          <TabsContent value="phone-register">
            <PhoneRegisterCheckpointForm setCheckpoint={setCheckpoint} checkpoint={checkpoint} setTab={setTab} />
          </TabsContent>
        </Tabs>
      </TabsContent>
      <TabsContent value="cookies">
        <CookiesAccountForm />
      </TabsContent>
    </Tabs>
  )
}