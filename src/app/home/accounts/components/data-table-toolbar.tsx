"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { setModalState } from "@/lib/store/modal-store"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Plus, ShoppingCartIcon } from "lucide-react"
import { DataTableViewOptions } from "./data-table-view-options"
import NewAccountModal from "./new-account-modal"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleConnectAccount = () => {
    setModalState({
      open: true,
      title: `Let's add a LinkedIn account`,
      description: 'You can connect your LinkedIn account by entering your LinkedIn email and password or copying your LinkedIn session cookie.',
      view: <NewAccountModal />,
    });
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <Input
            placeholder="Filter accounts..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
          <DataTableViewOptions table={table} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="p-2 h-auto w-auto">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={handleConnectAccount}>
              <Plus className="mr-2 h-4 w-4" />
              Add Linkedin account
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("buy subscription")}>
              <ShoppingCartIcon className="mr-2 h-4 w-4" />
              Buy subscription
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}