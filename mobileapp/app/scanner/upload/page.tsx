"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { processTicketImage } from "@/app/actions/ocr"
import { useRouter } from "next/navigation"

export default function UploadTicket() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanProgress, setScanProgress] = useState<number>(0)
  const [scanStatus, setScanStatus] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide")
      return
    }

    // Vérifier la taille du fichier (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("La taille de l'image ne doit pas dépasser 10MB")
      return
    }

    setIsLoading(true)
    setError(null)
    setScanProgress(0)
    setScanStatus("Lecture du fichier...")

    try {
      // Lire le fichier comme une URL de données
      const reader = new FileReader()
      reader.onload = async (e) => {
        const imageData = e.target?.result as string

        try {
          // Simuler les étapes de traitement pour une meilleure UX
          setScanProgress(10)
          setScanStatus("Préparation de l'image...")
          await new Promise((resolve) => setTimeout(resolve, 500))

          setScanProgress(30)
          setScanStatus("Envoi à l'API OCR...")
          await new Promise((resolve) => setTimeout(resolve, 500))

          setScanProgress(50)
          setScanStatus("Analyse du ticket avec MistralAI...")

          // Envoyer l'image à l'API OCR
          const ticketData = await processTicketImage(imageData)

          setScanProgress(80)
          setScanStatus("Extraction des données...")
          await new Promise((resolve) => setTimeout(resolve, 500))

          if (!ticketData) {
            throw new Error("Erreur lors du traitement de l'image")
          }

          setScanProgress(100)
          setScanStatus("Traitement terminé!")

          // Stocker les données du ticket dans sessionStorage pour les récupérer sur la page de résultat
          sessionStorage.setItem("ticketData", JSON.stringify(ticketData))

          // Rediriger vers la page de résultat
          router.push("/scanner/result")
        } catch (err) {
          console.error("Erreur lors du traitement OCR:", err)
          setError("Erreur lors de l'analyse du ticket. Veuillez réessayer.")
          setIsLoading(false)
        }
      }
      reader.onerror = () => {
        setError("Erreur lors de la lecture du fichier")
        setIsLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error("Erreur lors du traitement du fichier:", err)
      setError("Erreur lors du traitement du fichier")
      setIsLoading(false)
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Link href="/scanner" className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">Importer un ticket</h1>
        <div className="h-12 w-12"></div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-sm flex flex-col items-center">
          {!isLoading ? (
            <>
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Upload size={32} className="text-primary" />
              </div>

              <h2 className="text-xl font-semibold mb-2">Importer une image</h2>
              <p className="text-gray-500 text-center mb-6">
                Sélectionnez une photo de votre ticket de caisse depuis votre galerie
              </p>

              {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 w-full">{error}</div>}

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              <Button className="w-full h-12 bg-primary hover:bg-primary/90" onClick={handleBrowseClick}>
                Parcourir les fichiers
              </Button>

              <p className="text-xs text-gray-400 mt-4 text-center">
                Formats supportés: JPG, PNG, HEIC
                <br />
                Taille maximale: 10 MB
              </p>
            </>
          ) : (
            <div className="py-8 flex flex-col items-center">
              <h2 className="text-xl font-semibold mb-6">{scanStatus}</h2>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>

              <div className="text-sm text-gray-500 mt-2">{scanProgress}%</div>

              <div className="mt-8 text-center text-gray-500">
                Analyse en cours avec MistralAI...
                <br />
                Veuillez patienter pendant que nous traitons votre ticket
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

