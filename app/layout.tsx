import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import QueryProvider from "./providers/query-provider"
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Forum - Community Discussions",
  description: "A modern forum for developers and creators",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
            <AuthProvider>
            <QueryProvider>
              {children}
              <Toaster position="bottom-right" reverseOrder={false} />
            </QueryProvider>
            </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
