'use client'

import styles from '@/app/styles/layout/header.module.css'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'

const Header = () => {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminPage, setIsAdminPage] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const userRole = localStorage.getItem('userRole')
    if (!userRole) {
      router.push('/login')
      return
    }
    setIsAdmin(userRole === 'admin')
    // 現在のパスが/adminで始まるかチェック
    setIsAdminPage(window.location.pathname.startsWith('/admin'))
  }, [router])

  const handleLogout = () => {
    try {
      localStorage.removeItem('userRole')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        {isAdminPage ? '管理者画面TOP' : 'プロジェクト一覧'}
      </h1>
      
      <button 
        type="button" 
        className={styles.menuButton}
        onClick={toggleMenu}
        aria-label="メニュー"
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
        <ul className={styles.menuList}>
          {isAdminPage && (
            <li>
              <Link
                href="/"
                className={styles.menuItem}
                onClick={() => setIsMenuOpen(false)}
              >
                TOPページを表示
              </Link>
            </li>
          )}
          {isAdmin && !isAdminPage && (
            <li>
              <button
                type="button"
                onClick={() => {
                  router.push('/admin')
                  setIsMenuOpen(false)
                }}
                className={styles.menuItem}
              >
                管理者画面TOP
              </button>
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={() => {
                handleLogout()
                setIsMenuOpen(false)
              }}
              className={`${styles.menuItem} ${styles.logoutItem}`}
            >
              ログアウト
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
