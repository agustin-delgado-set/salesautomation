import { AdaptedAccount } from "@/app/home/accounts/adapters/accounts-adapter";
import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

interface AccountsState {
  accounts: AdaptedAccount[];
  loadingAccounts: boolean;
  selectedAccount: string;
}

const initialState: AccountsState = {
  accounts: [],
  selectedAccount: "",
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
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    }
  },
});

const selectAccounts = (state: { accounts: { accounts: any; }; }) => state.accounts.accounts;
const selectLoadingAccounts = (state: { accounts: { loadingAccounts: any; }; }) => state.accounts.loadingAccounts;
const selectSelectedAccount = (state: { accounts: { selectedAccount: any; }; }) => state.accounts.selectedAccount;

export const selectAccountsData = createSelector([selectAccounts, selectLoadingAccounts, selectSelectedAccount], (accounts, loadingAccounts, selectedAccount) => ({
  accounts,
  loadingAccounts,
  selectedAccount
}));

export const { setAccounts, addAccount, deleteStateAccount, updateStateAccount, setSelectedAccount } = accountsSlice.actions;
export default accountsSlice.reducer;