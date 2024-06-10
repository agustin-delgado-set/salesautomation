import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname()
  const sectionTitle = pathname.split("/")[2].charAt(0).toUpperCase() + pathname.split("/")[2].slice(1)

  return (
    <div className="flex items-center justify-between px-4 py-2 min-h-[52px]">
      <h1 className="text-xl font-bold">{sectionTitle}</h1>
      <UserButton />
    </div>
  )
}