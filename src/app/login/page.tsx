'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './styles.module.css'

/**
 * ログインページコンポーネント
 * 注意: この実装はポートフォリオ用のデモ認証です。
 * 本番環境では、Next-AuthやJWTなどを使用したより堅牢な認証システムが必要です。
 */
export default function LoginPage() {
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (userId === process.env.NEXT_PUBLIC_ADMIN_ID && 
        password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('userRole', 'admin')
      router.push('/admin')
    } else if (userId === process.env.NEXT_PUBLIC_USER_ID && 
               password === process.env.NEXT_PUBLIC_USER_PASSWORD) {
      localStorage.setItem('userRole', 'user')
      router.push('/')
    } else {
      setError('ユーザーIDまたはパスワードが正しくありません')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>ログイン</h1>
        <p className={styles.description}>
          下記のユーザーIDとパスワードで
          <br />
          ログインしてください
        </p>
        <form
          onSubmit={handleSubmit}
          className={styles.form}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="userId">ユーザーID</label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">パスワード</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button
            type="submit"
            className={styles.button}
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  )
}
