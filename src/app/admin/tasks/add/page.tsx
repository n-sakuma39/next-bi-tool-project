'use client'

import { PRIORITY_MAP, STATUS_MAP } from '@/constants/maps'
import type { PriorityType, StatusType } from '@/types/type'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import '@/app/styles/admin/form.css'
import { taskApi } from '@/lib/api/task'
import Link from 'next/link'

interface TaskFormData {
  taskName: string
  priority: PriorityType | ''
  status: StatusType | ''
  startDate: string
  endDate: string
}

export default function AddTaskPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    taskName: '',
    priority: '',
    status: '',
    startDate: '',
    endDate: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTaskFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!taskFormData.priority || !taskFormData.status) {
      setError('必須項目を入力してください')
      return
    }

    const requestBody = {
      name: taskFormData.taskName,
      priority: taskFormData.priority as PriorityType,
      status: taskFormData.status as StatusType,
      startDate: new Date(taskFormData.startDate).toISOString(),
      endDate: new Date(taskFormData.endDate).toISOString(),
    }

    const { data, error: apiError } = await taskApi.create(requestBody)

    if (apiError) {
      setError(apiError)
      return
    }

    console.log('作成された案件:', data)
    router.push('/admin')
  }

  return (
    <div className="admin-form-container">
      <header className="admin-form-header">
        <h1 className="admin-form-title">案件追加</h1>
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
            <label htmlFor="taskName">案件名 *</label>
            <input
              type="text"
              id="taskName"
              name="taskName"
              value={taskFormData.taskName}
              onChange={handleChange}
              required
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="priority">優先度 *</label>
            <select
              id="priority"
              name="priority"
              value={taskFormData.priority}
              onChange={handleChange}
              required
              className="admin-form-input"
            >
              <option value="">選択してください</option>
              {Object.entries(PRIORITY_MAP).map(([key, value]) => (
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
            <label htmlFor="status">状態 *</label>
            <select
              id="status"
              name="status"
              value={taskFormData.status}
              onChange={handleChange}
              required
              className="admin-form-input"
            >
              <option value="">選択してください</option>
              {Object.entries(STATUS_MAP).map(([key, value]) => (
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
            <label htmlFor="startDate">開始日 *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={taskFormData.startDate}
              onChange={handleChange}
              required
              className="admin-form-input"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="endDate">期限日 *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={taskFormData.endDate}
              onChange={handleChange}
              required
              className="admin-form-input"
            />
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
