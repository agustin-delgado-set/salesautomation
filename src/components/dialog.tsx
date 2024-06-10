import { useEffect, useState } from "react";
import { Dialog as ShadcnDialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { closeDialog, dialogStateObservable } from "@/lib/store/dialog-store";
import { Button } from "./ui/button";

export default function Dialog() {
  const [dialogState, setDialogState] = useState({ open: false, title: '', description: '', onConfirm: () => { } });

  useEffect(() => {
    const subscription = dialogStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
      closeDialog();
    }
  }, []);

  return (
    <ShadcnDialog open={dialogState.open} onOpenChange={open => setDialogState({ ...dialogState, open })}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogState.title}</DialogTitle>
          <DialogDescription className="!mb-2">{dialogState.description}</DialogDescription>
        </DialogHeader>
        <Button onClick={dialogState.onConfirm} className="ml-auto">Confirm</Button>
      </DialogContent>
    </ShadcnDialog>
  )
}