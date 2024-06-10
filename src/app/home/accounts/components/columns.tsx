"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"
import { AdaptedAccount } from "../adapters/accounts-adapter"
import { accountTypes, statuses, subscriptions } from "../adapters/data-adapter"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns: ColumnDef<AdaptedAccount>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Account" />,
    cell: ({ row }) => {
      const initials = row.original.name.split(" ").map((name) => name[0]).join("")
      const fullName = row.original.name
      const accountType = accountTypes.find((type) => type.value === row.original.type) || { label: row.original.type }
      return (
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-sm text-muted-foreground">{accountType.label}</p>
          </div>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.original.sources[0].status)

      if (!status) return null
      return (
        <div className="flex items-center">
          <Badge variant="outline" className={`${status.color}`}>{status.label}</Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    accessorKey: "subscription",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subscription" />,
    cell: ({ row }) => {
      const subscription = subscriptions.find((subscription) => subscription.value === row.getValue("subscription"))

      if (!subscription) return null
      return (
        <div className="flex items-center">
          <span>{subscription.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id))
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]