import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { closeModal, modalStateObservable } from "@/lib/store/modal-store";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalState.title}</DialogTitle>
          <DialogDescription className="!mb-2">{modalState.description}</DialogDescription>
          {modalState.view}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}