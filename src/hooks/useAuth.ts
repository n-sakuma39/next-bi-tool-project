import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export const useAuth = (requiredRole?: 'admin' | 'user') => {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const userRole = localStorage.getItem('userRole')
      
      // ユーザーが未ログインの場合
      if (!userRole) {
        if (window.location.pathname !== '/login') {
          router.push('/login')
        }
        setIsChecking(false)
        return
      }

      // 管理者ページに一般ユーザーがアクセスしようとした場合
      if (requiredRole === 'admin' && userRole !== 'admin') {
        router.push('/')
        setIsChecking(false)
        return
      }

      // ログイン済みユーザーがログインページにアクセスしようとした場合
      if (window.location.pathname === '/login') {
        router.push(userRole === 'admin' ? '/admin' : '/')
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [router, requiredRole])

  return isChecking
}

