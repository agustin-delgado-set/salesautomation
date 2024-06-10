import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import NewAccountForm from "./new-account-form";
import OTPCheckpointForm from "./otp-checkpoint-form";

export default function NewAccountModal() {
  const [tab, setTab] = useState("load-account")
  const [checkpoint, setCheckpoint] = useState(null)

  const onTabChange = (value: string) => {
    setTab(value);
  }

  return (
    <Tabs defaultValue="load-account" value={tab} onValueChange={onTabChange}>
      <TabsContent value="load-account">
        <NewAccountForm setCheckpoint={setCheckpoint} setTab={setTab} />
      </TabsContent>
      <TabsContent value="checkpoint">
        <OTPCheckpointForm checkpoint={checkpoint} setTab={setTab} />
      </TabsContent>
    </Tabs>
  )
}