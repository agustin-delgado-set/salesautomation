import { setAccounts, addAccount, updateStateAccount, deleteStateAccount } from "@/lib/features/accounts/accounts-slice";
import { useAppDispatch } from "@/lib/hooks";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import accountsAdapter from "../adapters/accounts-adapter";
import { getAccounts, listenSupabaseChanges } from "../api/supabase";
import { getAccountsByIds } from "../api/unipile";

export default function useGetAccounts() {
  const dispatch = useAppDispatch()
  const { user } = useUser()

  const userEmail = user?.primaryEmailAddress?.emailAddress ?? ""

  const getUserAccounts = async () => {
    try {
      const accountsFromSupabase = await getAccounts(userEmail)
      const accountsIds = accountsFromSupabase.map((account: any) => account.account_id)

      const result = await getAccountsByIds(accountsIds)

      if (result.length === 0) return

      const linkedinAccounts = result.filter((account: any) => account.type === "LINKEDIN")
      const adaptedAccounts = accountsAdapter(linkedinAccounts)

      localStorage.setItem('accountsAmount', adaptedAccounts.length.toString())

      dispatch(setAccounts(adaptedAccounts))

    } catch (err) {
      console.error(err)
    }
  }

  const updateUserAccounts = async (accountId: string) => {
    try {
      const result = await getAccountsByIds([accountId])
      const adaptedAccount = accountsAdapter(result)

      dispatch(deleteStateAccount(accountId))
      dispatch(addAccount(adaptedAccount))
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getUserAccounts()
    listenSupabaseChanges('accounts', updateUserAccounts)
  }, [userEmail])
}