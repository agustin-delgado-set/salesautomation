"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { deleteStateAccount, setSelectedAccount } from "@/lib/features/accounts/accounts-slice"
import { useAppDispatch } from "@/lib/hooks"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"
import { deleteAccount } from "../api/unipile"
import { deleteSupabaseAccount } from "../api/supabase"
import { setModalState } from "../../../../lib/store/modal-store"
import NewAccountModal from "./new-account-modal"
import { AdaptedAccount } from "../adapters/accounts-adapter"
import { closeDialog, setDialogState } from "@/lib/store/dialog-store"

interface DataTableRowActionsProps<TData> { row: Row<TData> }

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const dispatch = useAppDispatch()

  const handleDeleteAccount = async () => {
    setDialogState({
      open: true,
      title: 'Delete account',
      description: 'Are you sure you want to delete this account? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const selectedAccount = localStorage.getItem('selectedAccount')

          dispatch(setSelectedAccount(''))
          dispatch(deleteStateAccount((row.original as { accountId: string }).accountId))
          if (selectedAccount === (row.original as { accountId: string }).accountId) localStorage.removeItem('selectedAccount')

          closeDialog()

          await deleteAccount((row.original as { accountId: string }).accountId)
          deleteSupabaseAccount((row.original as { accountId: string }).accountId)
        } catch (err) {
          console.error(err)
        }
      }
    })
  }

  const handleReconnectAccount = () => {
    setModalState({
      open: true,
      title: `Let's reconnect your LinkedIn account`,
      description: 'You can reconnect your LinkedIn account by entering your LinkedIn email and password or copying your LinkedIn session cookie.',
      view: <NewAccountModal />,
      payload: { reconnect: true, accountId: (row.original as { accountId: string }).accountId },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted relative"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem disabled={(row.original as AdaptedAccount).sources[0].status === "OK"} onClick={handleReconnectAccount}>Reconnect</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteAccount}>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}