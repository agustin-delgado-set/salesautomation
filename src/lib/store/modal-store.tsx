import { BehaviorSubject } from 'rxjs';

const initialState = {
  open: false,
  title: '',
  description: '',
  view: <></>,
  payload: {} as any,
};

const modalState$ = new BehaviorSubject(initialState);

export const setModalState = (state: { open: boolean; title: string; description: string; view: JSX.Element; payload?: any }) => {
  modalState$.next({ ...modalState$.getValue(), ...state });
};

export const getModalState = () => {
  return modalState$.getValue();
};

export const closeModal = () => {
  modalState$.next(initialState);
};

export const modalStateObservable = modalState$.asObservable();
