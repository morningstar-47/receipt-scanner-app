"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { processTicketImage } from "@/app/actions/ocr"
import { useRouter } from "next/navigation"

export default function CameraScanner() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanProgress, setScanProgress] = useState<number>(0)
  const [scanStatus, setScanStatus] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsCameraActive(true)
        }
      } catch (err) {
        console.error("Erreur lors de l'accès à la caméra:", err)
        setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.")
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [])

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return

    setIsLoading(true)
    setError(null)
    setScanProgress(0)
    setScanStatus("Capture de l'image...")

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) {
      setError("Erreur lors de la capture de l'image")
      setIsLoading(false)
      return
    }

    // Définir les dimensions du canvas pour correspondre à la vidéo
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Dessiner l'image de la vidéo sur le canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Obtenir l'image en tant que données URL
    const imageData = canvas.toDataURL("image/jpeg")

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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {error && (
        <div className="absolute top-4 left-0 right-0 bg-red-50 text-red-500 p-3 mx-4 rounded-lg text-sm z-20">
          {error}
        </div>
      )}

      <div className="scan-frame relative overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />

        <div className="scan-corner scan-corner-tl"></div>
        <div className="scan-corner scan-corner-tr"></div>
        <div className="scan-corner scan-corner-bl"></div>
        <div className="scan-corner scan-corner-br"></div>

        <canvas ref={canvasRef} className="hidden" />

        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
            <div className="text-white text-lg font-medium mb-4">{scanStatus}</div>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            <div className="text-white mt-2">{scanProgress}%</div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8">
        <Button
          onClick={captureImage}
          disabled={!isCameraActive || isLoading}
          className={`scan-button w-16 h-16 ${isLoading ? "opacity-70" : ""}`}
        >
          {isLoading ? (
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="6" height="6" rx="1" stroke="white" strokeWidth="2" />
              <rect x="4" y="14" width="6" height="6" rx="1" stroke="white" strokeWidth="2" />
              <rect x="14" y="4" width="6" height="6" rx="1" stroke="white" strokeWidth="2" />
              <rect x="14" y="14" width="6" height="6" rx="1" stroke="white" strokeWidth="2" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  )
}

