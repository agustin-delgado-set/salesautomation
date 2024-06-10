import { configureStore } from '@reduxjs/toolkit'
import accountsReducer from "@/lib/features/accounts/accounts-slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      accounts: accountsReducer,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']