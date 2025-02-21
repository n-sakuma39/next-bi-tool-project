'use client'

import { usePathname } from 'next/navigation'
import { TaskProvider } from '@/contexts/TaskContext'
import MocksProvider from '@/app/provider'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <>
      {!isLoginPage && <MocksProvider />}
      <TaskProvider>{children}</TaskProvider>
    </>
  )
}
