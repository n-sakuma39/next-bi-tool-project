'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Loading from '@/components/elements/loading'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = () => {
      try {
        // ローカルストレージからユーザー情報を削除
        localStorage.removeItem('userRole')
        // ログインページにリダイレクト
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        // エラーが発生した場合でもログインページに遷移
        router.push('/login')
      }
    }

    // 即時実行
    performLogout()
  }, [router])

  // ログアウト処理中はローディング表示
  return <Loading />
}
