"use client"

import { useState } from "react"
import BottomNavigation from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { Settings, CreditCard, Bell, LogOut, ShoppingBag, Award } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { logout } from "@/app/actions/auth"
import { useRouter } from "next/navigation"

export default function Profil() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <main className="pb-24">
      <div className="bg-primary/10 p-6 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="Profile"
              width={80}
              height={80}
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Félix Dupont</h1>
            <p className="text-gray-600">felix.dupont@example.com</p>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Points de fidélité</div>
              <div className="text-2xl font-bold text-primary">6 083 points</div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">Échanger</Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">Compte</h2>
          <div className="space-y-2">
            <Link
              href="/profil/settings"
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Settings size={20} />
                </div>
                <span>Paramètres</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/profil/payment"
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <span>Méthodes de paiement</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/profil/notifications"
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <span>Notifications</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Activité</h2>
          <div className="space-y-2">
            <Link href="/profil/orders" className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShoppingBag size={20} />
                </div>
                <span>Mes achats</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link
              href="/profil/rewards"
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Award size={20} />
                </div>
                <span>Mes récompenses</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 text-red-500 border-red-200"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full"></div>
              <span>Déconnexion...</span>
            </div>
          ) : (
            <>
              <LogOut size={18} />
              <span>Déconnexion</span>
            </>
          )}
        </Button>
      </div>

      <BottomNavigation />
    </main>
  )
}

