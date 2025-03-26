import BottomNavigation from "@/components/bottom-navigation"
import UserHeader from "@/components/user-header"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="pb-24">
      <UserHeader />

      <div className="grid grid-cols-2 gap-4 p-4">
        <Link href="/offres" className="bg-[#FFF9E6] p-4 rounded-xl flex flex-col items-center justify-between h-48">
          <div className="bg-primary/20 p-3 rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 17.5V6.5H14V17.5H10Z" fill="#e9a517" />
              <path d="M5 12.5V6.5H9V12.5H5Z" fill="#e9a517" />
              <path d="M15 12.5V6.5H19V12.5H15Z" fill="#e9a517" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-center">Pour vous</h3>
          <div className="bg-primary rounded-full p-2">
            <ArrowRight size={16} className="text-white" />
          </div>
        </Link>

        <Link href="/badges" className="bg-[#FFF9E6] p-4 rounded-xl flex flex-col items-center justify-between h-48">
          <div className="bg-primary/20 p-3 rounded-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 15L8.5 17L9.5 13L6.5 10.5L10.5 10L12 6.5L13.5 10L17.5 10.5L14.5 13L15.5 17L12 15Z"
                fill="#e9a517"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-center">Badges</h3>
          <div className="bg-primary rounded-full p-2">
            <ArrowRight size={16} className="text-white" />
          </div>
        </Link>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Statistiques</h2>
          <Link href="/statistiques" className="text-sm text-gray-500">
            Voir tout
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Le plus acheté</h3>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                <Image src="/placeholder.svg?height=50&width=50" alt="Président" width={50} height={50} />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">8x</div>
                <div className="font-semibold">Président</div>
                <div className="text-xs text-gray-500">Beurre Demi-sel</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Le plus visité</h3>
            <div className="flex items-center gap-3">
              <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                <Image src="/placeholder.svg?height=50&width=50" alt="U Express" width={50} height={50} />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">14x</div>
                <div className="font-semibold">U Express</div>
                <div className="text-xs text-gray-500">Paris</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Ticket Récent</h2>
          <Link href="/tickets" className="text-sm text-gray-500">
            Voir tout
          </Link>
        </div>

        <div className="space-y-4">
          {["Giant", "Lotte Mart", "Alfamart"].map((store, index) => (
            <Link
              href={`/tickets/${index}`}
              key={index}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <Image src="/placeholder.svg?height=50&width=50" alt={store} width={50} height={50} />
                </div>
                <div>
                  <div className="font-semibold text-lg">{store}</div>
                  <div className="text-gray-500">18/03/2025</div>
                </div>
              </div>
              <div>
                <ArrowRight size={20} className="text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}

