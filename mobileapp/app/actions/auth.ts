"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Types pour l'authentification
export interface AuthResponse {
  success: boolean
  user?: {
    id: string
    name: string
    email: string
    points: number
    avatar?: string
  }
  token?: string
  error?: string
}

// Mettre à jour la fonction loginWithCredentials pour qu'elle fonctionne avec notre backend Python
export async function loginWithCredentials(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const remember = formData.get("remember") === "on"

  if (!email || !password) {
    return {
      success: false,
      error: "Email et mot de passe requis",
    }
  }

  try {
    // Appel à notre API Python d'authentification
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: email, // FastAPI OAuth2 utilise 'username' au lieu de 'email'
        password: password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Erreur de connexion",
      }
    }

    // Stocker le token dans un cookie
    const cookieOptions = remember
      ? { maxAge: 30 * 24 * 60 * 60 } // 30 jours si "se souvenir de moi"
      : { maxAge: 24 * 60 * 60 } // 1 jour sinon

    cookies().set("auth_token", data.access_token, cookieOptions)

    return {
      success: true,
      user: data.user,
      token: data.access_token,
    }
  } catch (error) {
    console.error("Erreur de connexion:", error)
    return {
      success: false,
      error: "Erreur de connexion au serveur",
    }
  }
}

// Action pour la connexion avec Google
export async function loginWithGoogle(): Promise<AuthResponse> {
  // Dans une implémentation réelle, vous redirigeriez vers l'URL OAuth de Google
  // et géreriez le callback

  // Simulation d'une connexion réussie
  cookies().set("auth_token", "google_mock_token", { maxAge: 30 * 24 * 60 * 60 })

  return {
    success: true,
    user: {
      id: "user-123",
      name: "Félix Dupont",
      email: "felix.dupont@gmail.com",
      points: 6083,
    },
    token: "google_mock_token",
  }
}

// Action pour la connexion avec Apple
export async function loginWithApple(): Promise<AuthResponse> {
  // Dans une implémentation réelle, vous redirigeriez vers l'URL OAuth d'Apple
  // et géreriez le callback

  // Simulation d'une connexion réussie
  cookies().set("auth_token", "apple_mock_token", { maxAge: 30 * 24 * 60 * 60 })

  return {
    success: true,
    user: {
      id: "user-123",
      name: "Félix Dupont",
      email: "felix.dupont@icloud.com",
      points: 6083,
    },
    token: "apple_mock_token",
  }
}

// Action pour la déconnexion
export async function logout() {
  cookies().delete("auth_token")
  redirect("/login")
}

// Fonction pour vérifier si l'utilisateur est authentifié
export async function getAuthUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return null
  }

  try {
    // Appel à votre API pour vérifier le token et récupérer les infos utilisateur
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://api.example.com"}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      return null
    }

    const user = await response.json()
    return user
  } catch (error) {
    console.error("Erreur lors de la vérification de l'authentification:", error)
    return null
  }
}

