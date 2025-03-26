"use server"

import { cookies } from "next/headers"

// Types pour les données de ticket
export interface TicketItem {
  name: string
  category: string
  price: number
  quantity: number
}

export interface TicketData {
  store: string
  date: string
  location: string
  total: number
  points: number
  items: TicketItem[]
}

// Action pour envoyer une image à l'API OCR
export async function processTicketImage(imageData: string): Promise<TicketData | null> {
const cookieStore = cookies()
const token = cookieStore.get("auth_token")?.value
if (!token) {
  throw new Error("Utilisateur non authentifié")
}

try {
  // Appel à votre API OCR
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"}/ocr/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ image: imageData }),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Erreur lors du traitement de l'image")
  }
  
  const data = await response.json()
  console.log(data)
    return data
  } catch (error) {
    console.error("Erreur lors du traitement OCR:", error)
    return null
  }
}

// Action pour valider et enregistrer les données du ticket
export async function saveTicketData(ticketData: TicketData): Promise<boolean> {
  const token = cookies().get("auth_token")?.value

  if (!token) {
    throw new Error("Utilisateur non authentifié")
  }

  try {
    // Appel à votre API pour enregistrer les données du ticket
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Erreur lors de l'enregistrement du ticket")
    }

    return true
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du ticket:", error)
    return false
  }
}

