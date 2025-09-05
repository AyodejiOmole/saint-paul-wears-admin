import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Inter, Cormorant_Garamond } from "next/font/google"
import "./globals.css"

import { Toaster } from "react-hot-toast";

import { ReactQueryProvider } from "@/providers/react-query-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "Saint Paul Admin Dashboard",
  description: "Admin interface for Saint Paul brand management",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${inter.variable} ${cormorantGaramond.variable}`}
      >
        <ReactQueryProvider>
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right"
            />
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
