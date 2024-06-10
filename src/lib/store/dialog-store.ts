import { BehaviorSubject } from "rxjs";

const initialState = {
  open: false,
  title: "",
  description: "",
  onConfirm: () => { },
};

const dialogState$ = new BehaviorSubject(initialState);

export const setDialogState = (state: { open: boolean; title: string; description: string; onConfirm: () => void; }) => {
  dialogState$.next(state);
}

export const getDialogState = () => {
  return dialogState$.getValue();
}

export const closeDialog = () => {
  dialogState$.next(initialState);
}

export const dialogStateObservable = dialogState$.asObservable();
