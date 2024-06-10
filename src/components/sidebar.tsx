"use client";

import useGetAccounts from "@/app/home/accounts/hooks/useGetAccounts";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { selectAccountsData } from "@/lib/features/accounts/accounts-slice";
import { useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import {
  CircleGauge,
  Inbox,
  Megaphone,
  Settings,
  Users
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AccountSwitcher } from "./account-switcher";
import Header from "./header";
import { Nav } from "./nav";

export default function Sidebar({ defaultLayout, defaultCollapsed, children }: { children: React.ReactNode, defaultLayout: number[], defaultCollapsed: boolean }) {
  useGetAccounts()
  const pathname = usePathname()

  const { accounts, loadingAccounts } = useAppSelector(selectAccountsData);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <TooltipProvider>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`}
        className="h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout && defaultLayout[0]}
          collapsedSize={4}
          collapsible={true}
          minSize={10}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`
          }}
          onExpand={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`
          }}
          className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
        >
          <div className={cn("flex h-[52px] items-center justify-center", isCollapsed ? "h-[52px]" : "px-2")}>
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} loading={loadingAccounts} />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Dashboard",
                label: "",
                icon: CircleGauge,
                variant: pathname === "/home/dashboard" ? "default" : "ghost",
                href: "/home/dashboard",
              },
              {
                title: "Campaigns",
                label: "",
                icon: Megaphone,
                variant: pathname === "/home/campaigns" ? "default" : "ghost",
                href: "/home/campaigns",
              },
              {
                title: "Inbox",
                label: "",
                icon: Inbox,
                variant: pathname === "/home/inbox" ? "default" : "ghost",
                href: "/home/inbox",
              },
              {
                title: "Accounts",
                label: "",
                icon: Users,
                variant: pathname === "/home/accounts" ? "default" : "ghost",
                href: "/home/accounts",
              },
              {
                title: "Settings",
                label: "",
                icon: Settings,
                variant: pathname === "/home/settings" ? "default" : "ghost",
                href: "/home/settings",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout && defaultLayout[1]} >
          <Header />
          <Separator />
          <div className="bg-background/95 h-[calc(100%-110px)] p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}