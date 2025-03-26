"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { saveTicketData } from "@/app/actions/ocr"
import type { TicketData } from "@/app/actions/ocr"

export default function ScannerResult() {
  const [ticketData, setTicketData] = useState<TicketData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Récupérer les données du ticket depuis sessionStorage
    const storedData = sessionStorage.getItem("ticketData")

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setTicketData(parsedData)
      } catch (err) {
        console.error("Erreur lors de la récupération des données du ticket:", err)
        setError("Impossible de récupérer les données du ticket")
      }
    } else {
      setError("Aucune donnée de ticket disponible")
    }
  }, [])

  const handleValidate = async () => {
    if (!ticketData) return

    setIsLoading(true)
    setError(null)

    try {
      const success = await saveTicketData(ticketData)

      if (success) {
        // Supprimer les données du ticket de sessionStorage
        sessionStorage.removeItem("ticketData")

        // Rediriger vers la page d'accueil
        router.push("/")
      } else {
        throw new Error("Erreur lors de l'enregistrement du ticket")
      }
    } catch (err) {
      console.error("Erreur lors de la validation du ticket:", err)
      setError("Erreur lors de l'enregistrement du ticket. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <Link href="/scanner" className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">Scanner</h1>
          <div className="h-12 w-12"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="bg-red-50 text-red-500 p-6 rounded-xl text-center">
            <h2 className="text-xl font-semibold mb-4">Erreur</h2>
            <p>{error}</p>
            <Button onClick={() => router.push("/scanner")} className="mt-6 bg-primary hover:bg-primary/90">
              Réessayer
            </Button>
          </div>
        </div>
      </main>
    )
  }

  if (!ticketData) {
    return (
      <main className="min-h-screen flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <Link href="/scanner" className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">Scanner</h1>
          <div className="h-12 w-12"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-500">Chargement des données...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Link href="/scanner" className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">Scanner</h1>
        <Link
          href="/scanner/share"
          className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm"
        >
          <Share2 size={20} />
        </Link>
      </div>

      <div className="flex-1 p-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold">Ticket Scanned</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center">
              <Image src="/placeholder.svg?height=60&width=60" alt={ticketData.store} width={60} height={60} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold">{ticketData.store}</h3>
              <div className="text-gray-500">{ticketData.date}</div>
            </div>
            <div className="ml-auto">
              <div className="text-right">
                <div className="text-xl font-bold">{ticketData.location}</div>
                <div className="text-primary font-semibold">
                  {ticketData.total.toFixed(2)}€ (+{ticketData.points} pts)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {ticketData.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-200">
                <div>
                  <div className="text-xl font-semibold">{item.name}</div>
                  <div className="text-gray-500">{item.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold">{item.price.toFixed(2)}€</div>
                  <div className="text-gray-500">x{item.quantity}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              variant="outline"
              className="h-14 text-primary border-primary"
              onClick={() => router.push("/scanner/edit")}
              disabled={isLoading}
            >
              Modifier
            </Button>
            <Button className="h-14 bg-primary hover:bg-primary/90" onClick={handleValidate} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Validation...</span>
                </div>
              ) : (
                "Valider"
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

