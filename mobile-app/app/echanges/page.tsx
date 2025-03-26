import BottomNavigation from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"

export default function Echanges() {
  return (
    <main className="pb-24">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Dépensez vos points</h1>
        <div className="text-5xl font-bold text-center mb-8">6083</div>

        <div className="bg-gray-100 rounded-full p-1 flex mb-8">
          <Button className="flex-1 rounded-full bg-primary text-white">Tout</Button>
          <Button variant="ghost" className="flex-1 rounded-full">
            Bientôt
          </Button>
          <Button variant="ghost" className="flex-1 rounded-full">
            En cours
          </Button>
        </div>

        <div className="space-y-4">
          {/* Ici, vous pouvez ajouter les récompenses disponibles */}
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Coupon 5€</h3>
              <p className="text-sm text-gray-500">Valable sur tout le site</p>
            </div>
            <div className="text-primary font-bold">1000 pts</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Livraison gratuite</h3>
              <p className="text-sm text-gray-500">Prochaine commande</p>
            </div>
            <div className="text-primary font-bold">500 pts</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Coupon 10€</h3>
              <p className="text-sm text-gray-500">Valable sur tout le site</p>
            </div>
            <div className="text-primary font-bold">2000 pts</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Produit gratuit</h3>
              <p className="text-sm text-gray-500">Parmi une sélection</p>
            </div>
            <div className="text-primary font-bold">3000 pts</div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}

