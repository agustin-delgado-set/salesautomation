'use client'

import { addAccount, deleteStateAccount, setAccounts } from "@/lib/features/accounts/accounts-slice";
import { useAppDispatch } from "@/lib/hooks";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import accountsAdapter from "../adapters/accounts-adapter";
import { checkAccountIsLinkedToUser, getAccounts, listenSupabaseChanges } from "../api/supabase";
import { getAccountsByIds } from "../api/unipile";

export default function useGetAccounts() {
  const dispatch = useAppDispatch()
  const { user } = useUser()

  const userEmail = user?.primaryEmailAddress?.emailAddress ?? ""

  const getUserAccounts = async () => {
    if (!userEmail) return

    try {
      const accountsFromSupabase = await getAccounts(userEmail)
      const accountsIds = accountsFromSupabase.map((account: any) => account.account_id)

      const result = await getAccountsByIds(accountsIds)

      if (result.length === 0) return dispatch(setAccounts([]))

      const linkedinAccounts = result.filter((account: any) => account.type === "LINKEDIN")
      const adaptedAccounts = accountsAdapter(linkedinAccounts)

      localStorage.setItem('accountsAmount', adaptedAccounts.length.toString())

      dispatch(setAccounts(adaptedAccounts))
    } catch (err) {
      console.error(err)
    }
  }

  const updateUserAccounts = async (accountId: string) => {
    if (!accountId) return

    const accountIsLinkedToUser = await checkAccountIsLinkedToUser(userEmail, accountId)
    console.log(accountIsLinkedToUser)
    if (!accountIsLinkedToUser) return

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
    (async () => {
      await getUserAccounts();
      const subscription = listenSupabaseChanges('accounts', updateUserAccounts);

      return () => subscription.unsubscribe();
    })();
  }, [userEmail]);
}