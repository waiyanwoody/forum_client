"use client"

import type { ReactNode } from "react"
import { Header } from "./header"

type AppShellProps = {
  children: ReactNode
  sidebar?: ReactNode
  showSidebar?: boolean
}

export function AppShell({ children, sidebar, showSidebar = true }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">{children}</div>
            {showSidebar && sidebar && <aside className="hidden lg:block w-80 flex-shrink-0">{sidebar}</aside>}
          </div>
        </main>
      </div>
    </div>
  )
}
