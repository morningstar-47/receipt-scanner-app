import BottomNavigation from "@/components/bottom-navigation"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Offres() {
  return (
    <main className="pb-24">
      <div className="p-4">
        <div className="relative mb-4">
          <Input placeholder="Trouver un article ou une offre" className="h-14 pl-12 pr-4 rounded-full bg-white" />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" className="flex items-center gap-2 rounded-full">
            <SlidersHorizontal size={16} />
            <span>Filtres</span>
          </Button>

          <Button variant="outline" className="flex items-center gap-2 rounded-full">
            <span>Trier</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Rien que pour vous !</h2>
            <button className="text-sm text-gray-500">Voir tout</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=150&width=200"
                    alt="Président"
                    width={200}
                    height={150}
                    className="w-full h-40 object-contain"
                  />
                  <button className="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 4V20M4 12H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <div className="points-badge inline-block mb-2">+10 pts</div>
                  <h3 className="text-lg font-semibold">Président</h3>
                  <p className="text-sm text-gray-500">Beurre Demi-sel - gastronomique</p>
                  <div className="text-xs text-gray-400 mt-2">Jusqu'au 10/04/25</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Mes produits</h2>
            <button className="text-sm text-gray-500">Voir tout</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=150&width=200"
                    alt="Produit"
                    width={200}
                    height={150}
                    className="w-full h-40 object-contain"
                  />
                  <button className="absolute top-2 right-2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 4V20M4 12H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <div className="points-badge inline-block mb-2">+10 pts</div>
                  <h3 className="text-lg font-semibold">{item === 1 ? "L'ORÉAL" : "Signal"}</h3>
                  <p className="text-sm text-gray-500">
                    {item === 1 ? "Elseve - Total Repair 5" : "Protection carie - 75"}
                  </p>
                  <div className="text-xs text-gray-400 mt-2">Jusqu'au 10/04/25</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}

