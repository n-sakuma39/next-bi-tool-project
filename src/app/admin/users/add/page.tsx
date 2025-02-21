'use client'

import { JOB_NAME_MAP } from '@/constants/maps'
import type { JobType } from '@/types/type'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import '@/app/styles/admin/form.css'
import { userApi } from '@/lib/api/user'
import { faker } from '@faker-js/faker'
import Image from 'next/image'

type UserFormData = {
  username: string
  job: JobType
  avatar: string
  description: string
  employmentDate: string
  department: string
  employeeId: string
  email: string
  skills: string[]
  projectHistory: string
  certifications: string[]
}

// アバター画像のURLリスト
const AVATAR_URLS = {
  avatars: [
    'https://api.dicebear.com/7.x/avataaars/svg',    // 人物アバター
    'https://api.dicebear.com/7.x/micah/svg',        // シンプル人物
    'https://api.dicebear.com/7.x/personas/svg',     // カジュアル人物
  ],
  animals: [
    'https://loremflickr.com/128/128/animal',        // 動物の写真
    'https://loremflickr.com/128/128/pet',           // ペットの写真
    'https://loremflickr.com/128/128/cute-animal'    // かわいい動物の写真
  ],
  nature: [
    'https://loremflickr.com/128/128/nature',        // 自然の風景
    'https://loremflickr.com/128/128/landscape',     // 風景
    'https://loremflickr.com/128/128/scenery'        // 景色
  ]
}

export default function AddUser() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [userFormData, setUserFormData] = useState<UserFormData>({
    username: '',
    job: '' as JobType,
    avatar: '',
    description: '',
    employmentDate: new Date().toISOString().split('T')[0],
    department: '',
    employeeId: '',
    email: '',
    skills: [],
    projectHistory: '',
    certifications: [],
  })
  const [avatarPreview, setAvatarPreview] = useState<string>('')

  // カテゴリごとのアバター生成関数
  const generateAvatarByCategory = useCallback((category: 'avatars' | 'animals' | 'nature') => {
    const urls = AVATAR_URLS[category]
    const randomUrl = urls[Math.floor(Math.random() * urls.length)]
    
    // DiceBearはseedを使用、LoremFlickrは直接URLを使用
    const newAvatarUrl = category === 'avatars'
      ? `${randomUrl}?seed=${faker.string.alphanumeric(8)}`
      : `${randomUrl}?random=${Math.random()}`  // キャッシュ回避用のランダムパラメータ

    setUserFormData((prev) => ({
      ...prev,
      avatar: newAvatarUrl,
    }))
    setAvatarPreview(newAvatarUrl)
  }, [])

  // 初回マウント時のアバター生成
  useEffect(() => {
    if (!userFormData.avatar) {
      generateAvatarByCategory('avatars')
    }
  }, [userFormData.avatar, generateAvatarByCategory])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // スキルと資格は、カンマ区切りの文字列を配列に変換
    if (name === 'skills' || name === 'certifications') {
      setUserFormData((prev) => ({
        ...prev,
        [name]: value
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      }))
    } else {
      setUserFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userData = {
      username: userFormData.username,
      job: userFormData.job,
      avatar: userFormData.avatar,
      occupancyRate: 0,
      description: userFormData.description || '',
      employmentDate: userFormData.employmentDate,
      department: userFormData.department,
      employeeId: userFormData.employeeId,
      email: userFormData.email,
      skills: userFormData.skills,
      projectHistory: userFormData.projectHistory,
      certifications: userFormData.certifications,
    }

    const { data, error: apiError } = await userApi.create(userData)

    if (apiError) {
      setError(apiError)
      return
    }

    // dataがnullでないことを確認
    if (!data) {
      setError('ユーザーの作成に失敗しました')
      return
    }

    console.log('作成されたユーザー:', {
      ユーザー名: data.username,
      職種: JOB_NAME_MAP[data.job as keyof typeof JOB_NAME_MAP],
      入社日: userData.employmentDate,
      部署: userData.department || '未所属',
      社員番号: userData.employeeId || '未設定',
      メールアドレス: userData.email || '未設定',
      スキル: data.skills?.length ? data.skills.join(', ') : '未設定',
      プロジェクト履歴: data.projectHistory || '未設定',
      保有資格: data.certifications?.length ? data.certifications.join(', ') : '未設定',
      説明: data.description || '(説明なし)',
      アバター画像URL: data.avatar,
      稼働率: '0%',
    })

    router.push('/admin')
  }

  return (
    <div className="admin-form-container">
      <header className="admin-form-header">
        <h1 className="admin-form-title">ユーザー追加</h1>
        <Link
          href="/admin"
          className="admin-form-back-button"
        >
          管理画面TOPへ戻る
        </Link>
      </header>

      <main className="admin-form-main">
        <form
          onSubmit={handleSubmit}
          className="admin-form"
        >
          {error && <p className="admin-form-error">{error}</p>}

          <div className="admin-form-group">
            <label htmlFor="username">ユーザー名 *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userFormData.username}
              onChange={handleChange}
              required
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="job">職種 *</label>
            <select
              id="job"
              name="job"
              value={userFormData.job}
              onChange={handleChange}
              required
              className="admin-form-input"
            >
              <option value="">職種を選択</option>
              {Object.entries(JOB_NAME_MAP).map(([key, value]) => (
                <option
                  key={key}
                  value={key}
                >
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="description">説明</label>
            <textarea
              id="description"
              name="description"
              value={userFormData.description}
              onChange={handleChange}
              className="admin-form-textarea"
              rows={4}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="employmentDate">入社日</label>
            <input
              type="date"
              id="employmentDate"
              name="employmentDate"
              value={userFormData.employmentDate}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="department">部署</label>
            <input
              type="text"
              id="department"
              name="department"
              value={userFormData.department}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="employeeId">社員番号</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              value={userFormData.employeeId}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userFormData.email}
              onChange={handleChange}
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="skills">スキルセット</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={Array.isArray(userFormData.skills) ? userFormData.skills.join(', ') : ''}
              onChange={handleChange}
              className="admin-form-input"
              placeholder="カンマ区切りで入力（例：React, TypeScript, Next.js）"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="projectHistory">プロジェクト履歴</label>
            <textarea
              id="projectHistory"
              name="projectHistory"
              value={userFormData.projectHistory}
              onChange={handleChange}
              className="admin-form-textarea"
              rows={4}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="certifications">保有資格</label>
            <input
              type="text"
              id="certifications"
              name="certifications"
              value={Array.isArray(userFormData.certifications) ? userFormData.certifications.join(', ') : ''}
              onChange={handleChange}
              className="admin-form-input"
              placeholder="カンマ区切りで入力（例：基本情報技術者, AWS認定）"
            />
          </div>

          <div className="admin-form-group">
            <label>アバター画像</label>
            <div className="avatar-preview">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="アバタープレビュー"
                  className="avatar-image"
                  onError={(e) => {
                    console.log('アバター画像の読み込みに失敗しました。再生成します。')
                    generateAvatarByCategory('avatars')
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  画像<br />読み込み中...
                </div>
              )}
              <div className="avatar-buttons">
                <button
                  type="button"
                  onClick={() => generateAvatarByCategory('avatars')}
                  className="regenerate-button"
                >
                  人物
                </button>
                <button
                  type="button"
                  onClick={() => generateAvatarByCategory('animals')}
                  className="regenerate-button"
                >
                  動物
                </button>
                <button
                  type="button"
                  onClick={() => generateAvatarByCategory('nature')}
                  className="regenerate-button"
                >
                  風景
                </button>
              </div>
            </div>
          </div>

          <div className="admin-form-button-group">
            <button
              type="submit"
              className="admin-form-submit-button"
            >
              作成する
            </button>
            <Link
              href="/admin"
              className="admin-form-cancel-button"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
