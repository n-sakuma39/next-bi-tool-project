'use client'

import { TaskUserList } from '@/components/TaskUserList'
import Loading from '@/components/elements/loading'
import { useTaskContext } from '@/contexts/TaskContext'
import { useAuth } from '@/hooks/useAuth'
import { taskApi } from '@/lib/api/task'
import { userApi } from '@/lib/api/user'
import { useEffect, useState } from 'react'
import '@/app/common.css'
import Header from '@/components/layouts/header'

export default function Page() {
  const isChecking = useAuth('user')
  const { tasks, users, setTasks, setUsers } = useTaskContext()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: taskData }, { data: userData }] = await Promise.all([taskApi.getAll(), userApi.getAll()])

        if (taskData) setTasks(taskData)
        if (userData) setUsers(userData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (localStorage.getItem('userRole')) {
      fetchData()
    }
  }, [setTasks, setUsers])

  // ローディング表示（認証チェック中）
  if (isChecking) {
    return <Loading />
  }

  // ローディング表示（データ取得中）
  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="header-container">
      <Header />
      <main>
        <TaskUserList
          initialTasks={tasks}
          initialUsers={users}
        />
      </main>
    </div>
  )
}
