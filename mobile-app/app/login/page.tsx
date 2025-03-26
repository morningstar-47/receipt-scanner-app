"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { loginWithCredentials, loginWithGoogle, loginWithApple } from "../actions/auth"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirect") || "/"

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const response = await loginWithCredentials(formData)

    setIsLoading(false)

    if (response.success) {
      router.push(redirectUrl)
    } else {
      setError(response.error || "Erreur de connexion")
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError(null)

    const response = await loginWithGoogle()

    setIsLoading(false)

    if (response.success) {
      router.push(redirectUrl)
    } else {
      setError(response.error || "Erreur de connexion avec Google")
    }
  }

  const handleAppleLogin = async () => {
    setIsLoading(true)
    setError(null)

    const response = await loginWithApple()

    setIsLoading(false)

    if (response.success) {
      router.push(redirectUrl)
    } else {
      setError(response.error || "Erreur de connexion avec Apple")
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Connexion</h1>
          <p className="text-gray-500 mt-2">Accédez à votre compte et gérez vos points</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" name="remember" />
              <label htmlFor="remember" className="text-sm">
                Se souvenir de moi
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm">
              Mot de passe oublié
            </Link>
          </div>

          <Button type="submit" className="w-full h-14 bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-300 absolute w-full"></div>
            <span className="bg-white px-2 text-sm text-gray-500 relative">ou</span>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full h-14 rounded-lg bg-white border border-gray-300 hover:bg-gray-50"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C14.0223 13.607 12.1761 15 9.99984 15C7.23859 15 4.99984 12.7612 4.99984 10C4.99984 7.23871 7.23859 5 9.99984 5C11.2744 5 12.4344 5.48683 13.3177 6.28537L15.6744 3.92871C14.1887 2.56204 12.2094 1.66663 9.99984 1.66663C5.39775 1.66663 1.6665 5.39788 1.6665 10C1.6665 14.6021 5.39775 18.3333 9.99984 18.3333C14.6019 18.3333 18.3332 14.6021 18.3332 10C18.3332 9.44121 18.2757 8.89583 18.1711 8.36788Z"
                  fill="#FFC107"
                />
                <path
                  d="M2.62744 6.12121L5.36536 8.12913C6.10619 6.29496 7.90036 5 9.99994 5C11.2745 5 12.4345 5.48683 13.3178 6.28537L15.6745 3.92871C14.1887 2.56204 12.2095 1.66663 9.99994 1.66663C6.79911 1.66663 4.02327 3.47371 2.62744 6.12121Z"
                  fill="#FF3D00"
                />
                <path
                  d="M10 18.3334C12.1587 18.3334 14.0962 17.4813 15.5687 16.1717L13.0062 13.9875C12.1474 14.6452 11.0875 15.0009 10 15.0001C7.83255 15.0001 5.99213 13.6167 5.2996 11.6875L2.61377 13.7829C3.99043 16.4817 6.78127 18.3334 10 18.3334Z"
                  fill="#4CAF50"
                />
                <path
                  d="M18.1712 8.36796H17.5V8.33337H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0054 13.9879L13.0063 13.9871L15.5688 16.1713C15.4121 16.3154 18.3333 14.1667 18.3333 10C18.3333 9.44129 18.2758 8.89591 18.1712 8.36796Z"
                  fill="#1976D2"
                />
              </svg>
              <span className="text-black">Continue with Google</span>
            </div>
          </Button>

          <Button
            type="button"
            onClick={handleAppleLogin}
            className="w-full h-14 rounded-lg bg-black text-white hover:bg-gray-900"
            disabled={isLoading}
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.0756 10.5C14.0654 9.25225 14.6607 8.10938 15.6725 7.4295C15.1166 6.63012 14.2473 6.10137 13.2842 5.9685C12.3755 5.84075 11.3994 6.36525 10.8936 6.36525C10.3674 6.36525 9.56939 5.97675 8.84007 5.97675C7.39532 6.00262 5.89007 7.03975 5.89007 9.1685C5.89007 9.77837 5.99944 10.4035 6.21819 11.0286C6.52257 11.8895 7.40569 13.6354 8.33132 13.6C8.82944 13.5851 9.17507 13.2245 9.83757 13.2245C10.4797 13.2245 10.7994 13.6 11.3704 13.6C12.2994 13.5851 13.0897 11.9989 13.3781 11.1329C12.1781 10.5079 14.0756 10.5 14.0756 10.5ZM12.5781 4.5C13.0559 3.92675 13.3392 3.18763 13.2689 2.5C12.6392 2.54175 12.0447 2.81188 11.5967 3.2685C11.1487 3.72513 10.8654 4.33925 10.9204 5C11.5804 5.01675 12.1004 4.77325 12.5781 4.5Z"
                  fill="white"
                />
              </svg>
              <span>Continue with Apple</span>
            </div>
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Pas de connecté ? </span>
            <Link href="/register" className="text-primary font-medium">
              Inscrivez-vous
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}

