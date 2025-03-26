import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "App Fidélité Client",
  description: "Application de fidélité avec scan de tickets et récompenses",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="mobile-container">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'