import { closeModal, modalStateObservable } from "@/lib/store/modal-store";
import { useEffect, useState } from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";

export default function Modal() {
  const [modalState, setModalState] = useState({ open: false, title: '', description: '', view: <></>, payload: {} });

  useEffect(() => {
    const subscription = modalStateObservable.subscribe(setModalState);
    return () => {
      subscription.unsubscribe();
      closeModal();
    }
  }, []);

  return (
    <Dialog open={modalState.open} onOpenChange={open => setModalState({ ...modalState, open })}>
      <DialogContent className="p-0 gap-0">
        <CardHeader>
          <CardTitle>{modalState.title}</CardTitle>
          <CardDescription>
            {modalState.description}
          </CardDescription>
        </CardHeader>
        <CardContent>

          {modalState.view}
        </CardContent>
      </DialogContent>
    </Dialog>
  )
}