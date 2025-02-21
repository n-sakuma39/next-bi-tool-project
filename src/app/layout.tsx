import ClientLayout from '@/components/layouts/ClientLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'title',
  description: 'description',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
