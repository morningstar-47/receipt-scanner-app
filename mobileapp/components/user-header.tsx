"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import Image from "next/image"
import { getAuthUser } from "@/app/actions/auth"

interface User {
  id: string
  name: string
  email: string
  points: number
  avatar?: string
}

export default function UserHeader() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getAuthUser()
        setUser(userData)
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200">
          <Image
            src={user.avatar || "/placeholder.svg?height=64&width=64"}
            alt="Profile"
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Hello {user.name.split(" ")[0]}</h1>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Vous avez</span>
            <span className="text-primary font-bold">{user.points} points</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <Bell size={24} />
        <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
      </div>
    </div>
  )
}

