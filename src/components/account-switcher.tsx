"use client"

import { AdaptedAccount } from "@/app/home/accounts/adapters/accounts-adapter"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { RotateCw } from "lucide-react"
import { Skeleton } from "./ui/skeleton"

interface AccountSwitcherProps {
  isCollapsed: boolean
  accounts: AdaptedAccount[],
  loading: boolean
}

export function AccountSwitcher({ isCollapsed, accounts, loading }: AccountSwitcherProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>("")

  const account = accounts.find((account) => account.accountId === selectedAccount)

  const handleSelectAccount = (accountId: string) => {
    localStorage.setItem("selectedAccount", accountId)
    setSelectedAccount(accountId)
  }

  useEffect(() => {
    const savedAccount = localStorage.getItem("selectedAccount")
    if (savedAccount) setSelectedAccount(savedAccount)
  }, [])

  return (
    <Select disabled={loading} value={selectedAccount} onValueChange={handleSelectAccount}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
          "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          {loading ? <Skeleton className="w-7 h-7 rounded-full" /> : !isCollapsed ? (
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs">{account ? account.name.split(" ").map((name) => name[0]).join("") : accounts[0]?.name.split(" ").map((name) => name[0]).join("")}</AvatarFallback>
            </Avatar>
          )
            :
            <span>
              {account ? account.name.split(" ").map((name) => name[0]).join("") : accounts[0]?.name.split(" ").map((name) => name[0]).join("")}
            </span>
          }
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {loading ? <Skeleton className="w-28 h-5 rounded-sm" /> : account ? account.name : accounts[0]?.name}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem disabled={account.sources[0].status === "STOPPED" || account.sources[0].status === "CREDENTIALS"} key={account.accountId} value={account.accountId}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              <Avatar className="hidden h-7 w-7 sm:flex">
                <AvatarFallback className="text-xs">{account.name.split(" ").map((name) => name[0]).join("")}</AvatarFallback>
              </Avatar>
              {account.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}