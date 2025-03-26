// Ce service simulerait l'intégration avec une API OCR pour analyser les tickets
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

// Fonction simulée pour l'OCR
export async function processTicketImage(imageData: string): Promise<TicketData> {
  // Dans une implémentation réelle, nous enverrions l'image à une API OCR
  // et traiterions la réponse

  // Simulation d'un délai de traitement
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Retourne des données simulées
  return {
    store: "Giant",
    date: "18/03/2025",
    location: "Paris, France",
    total: 23.8,
    points: 90,
    items: [
      {
        name: "Kinder Bueno",
        category: "Barres chocolaté",
        price: 3.49,
        quantity: 1,
      },
      {
        name: "Oasis Tropical",
        category: "Boissons",
        price: 7.88,
        quantity: 6,
      },
      {
        name: "Avocat",
        category: "Fruits & Légumes",
        price: 12.43,
        quantity: 9,
      },
    ],
  }
}

