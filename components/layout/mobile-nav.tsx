"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ArrowLeftRight, CreditCard, User, MessageCircle, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/transfer",
    icon: ArrowLeftRight,
    label: "Transfer",
  },
  {
    href: "/payments",
    icon: CreditCard,
    label: "Payments",
  },
  {
    href: "/investments",
    icon: TrendingUp,
    label: "Invest",
  },
  {
    href: "/ai-assistant",
    icon: MessageCircle,
    label: "Assistant",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
