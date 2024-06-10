import Sidebar from "@/components/sidebar";
import { cookies } from "next/headers";

export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const layout = cookies().get("react-resizable-panels:layout")
  const collapsed = cookies().get("react-resizable-panels:collapsed")

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <Sidebar
      defaultLayout={defaultLayout}
      defaultCollapsed={defaultCollapsed}
    >
      {children}
    </Sidebar>
  );
}
