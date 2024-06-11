'use client'

import { selectAccountsData } from "@/lib/features/accounts/accounts-slice";
import { useAppSelector } from "@/lib/hooks";
import { AccountsTable } from "./components/accounts-table";
import { columns } from "./components/columns";
import Modal from "@/components/modal";
import Dialog from "@/components/dialog";

export default function Accounts() {
  const { accounts, loadingAccounts } = useAppSelector(selectAccountsData);
  console.log(accounts, loadingAccounts)
  return (
    <>
      <AccountsTable data={accounts} columns={columns} loading={loadingAccounts} />
      <Modal />
      <Dialog />
    </>
  )
}