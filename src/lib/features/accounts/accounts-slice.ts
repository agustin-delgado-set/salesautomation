import { AdaptedAccount } from "@/app/home/accounts/adapters/accounts-adapter";
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

interface AccountsState {
  accounts: AdaptedAccount[];
  loadingAccounts: boolean;
}

const initialState: AccountsState = {
  accounts: [],
  loadingAccounts: true,
};

export const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
      state.loadingAccounts = false;
    },
    addAccount: (state, action) => {
      state.accounts?.push(action.payload[0]);
    },
    deleteStateAccount: (state, action) => {
      state.accounts = state.accounts.filter((account) => account.accountId !== action.payload);
    },
    updateStateAccount: (state, action) => {
      state.accounts = state.accounts.map((account) => {
        if (account.accountId === action.payload[0].accountId) {
          return action.payload[0];
        }
        return account;
      });
    },
  },
});

const selectAccounts = (state: { accounts: { accounts: any; }; }) => state.accounts.accounts;
const selectLoadingAccounts = (state: { accounts: { loadingAccounts: any; }; }) => state.accounts.loadingAccounts;

export const selectAccountsData = createSelector([selectAccounts, selectLoadingAccounts], (accounts, loadingAccounts) => ({
  accounts,
  loadingAccounts
}));

export const { setAccounts, addAccount, deleteStateAccount, updateStateAccount } = accountsSlice.actions;
export default accountsSlice.reducer;