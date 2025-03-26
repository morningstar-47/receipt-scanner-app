"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const acceptTerms = formData.get("acceptTerms") === "on"

    // Validation côté client
    if (!name || !email || !password || !confirmPassword) {
      setError("Tous les champs sont obligatoires")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions d'utilisation")
      setIsLoading(false)
      return
    }

    try {
      // Appel à l'API d'inscription
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email ,name , password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription")
      }

      // Redirection vers la page de connexion
      router.push("/login?registered=true")
    } catch (err: any) {
      console.error("Erreur lors de l'inscription:", err)
      setError(err.message || "Erreur lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Inscription</h1>
          <p className="text-gray-500 mt-2">Créez votre compte et commencez à gagner des points</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="uppercase text-sm font-medium">NOM COMPLET</div>
            <Input
              type="text"
              name="name"
              placeholder="Votre nom complet"
              className="h-14 rounded-lg border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="uppercase text-sm font-medium">E-MAIL</div>
            <Input
              type="email"
              name="email"
              placeholder="Adresse E-mail"
              className="h-14 rounded-lg border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="uppercase text-sm font-medium">MOT DE PASSE</div>
            <Input
              type="password"
              name="password"
              placeholder="Mot de passe"
              className="h-14 rounded-lg border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="uppercase text-sm font-medium">CONFIRMER LE MOT DE PASSE</div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              className="h-14 rounded-lg border-gray-300"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="acceptTerms" name="acceptTerms" />
            <label htmlFor="acceptTerms" className="text-sm">
              J'accepte les{" "}
              <Link href="/terms" className="text-primary">
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link href="/privacy" className="text-primary">
                politique de confidentialité
              </Link>
            </label>
          </div>

          <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Inscription en cours..." : "S'inscrire"}
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Déjà inscrit ? </span>
            <Link href="/login" className="text-primary font-medium">
              Connectez-vous
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

