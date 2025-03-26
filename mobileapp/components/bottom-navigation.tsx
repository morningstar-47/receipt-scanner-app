"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Gift, ShoppingCart, User } from "lucide-react"

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="bottom-nav">
      <Link
        href="/"
        className={`flex flex-col items-center text-xs ${pathname === "/" ? "text-primary" : "text-muted-foreground"}`}
      >
        <Home size={24} />
        <span>Home</span>
      </Link>

      <Link
        href="/offres"
        className={`flex flex-col items-center text-xs ${pathname === "/offres" ? "text-primary" : "text-muted-foreground"}`}
      >
        <Gift size={24} />
        <span>Offres</span>
      </Link>

      <Link href="/scanner" className="relative">
        <div className="scan-button">
          <div className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="4" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="4" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </Link>

      <Link
        href="/echanges"
        className={`flex flex-col items-center text-xs ${pathname === "/echanges" ? "text-primary" : "text-muted-foreground"}`}
      >
        <ShoppingCart size={24} />
        <span>Échanges</span>
      </Link>

      <Link
        href="/profil"
        className={`flex flex-col items-center text-xs ${pathname === "/profil" ? "text-primary" : "text-muted-foreground"}`}
      >
        <User size={24} />
        <span>Profil</span>
      </Link>
    </div>
  )
}

