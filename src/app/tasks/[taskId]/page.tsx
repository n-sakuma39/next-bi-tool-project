'use client'

import { useTaskContext } from '@/contexts/TaskContext'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import '@/app/common.css'
import { TaskChart } from '@/components/chart/TaskChart'
import Button from '@/components/elements/button'
import Loading from '@/components/elements/loading'
import { PRIORITY_MAP, STATUS_MAP } from '@/constants/maps'
import type { Task, User } from '@/types/type'
import styles from './styles.module.css'

// APIレスポンスの型定義
type UserApiResponse = {
  assignmentId: string
  username: string
  avatar: string
  job: string
}

const TaskDetails = () => {
  const params = useParams()
  const { getTask, updateTask } = useTaskContext()
  const [task, setTask] = useState<Task | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const taskId = params.taskId as string
  const savedTask = getTask(taskId)
  const [users, setUsers] = useState<User[]>([])

  const fetchAssignmentUsers = useCallback(async (assignmentIds: string[]) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`)
      const allUsers: User[] = await response.json()
      
      return allUsers.filter(user => assignmentIds.includes(user.id))
    } catch (error) {
      console.error('Error fetching assignment users:', error)
      return []
    }
  }, [])

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (savedTask?.assignments) {
          setTask(savedTask)
        } else {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/${taskId}`)

          if (!response.ok) {
            throw new Error(`Failed to fetch task: ${response.status}`)
          }

          const data = await response.json()

          if (!data) {
            throw new Error('No data received')
          }

          const processedTask = {
            ...data,
            assignments: data.assignment || [],
          }

          setTask(processedTask)
          if (processedTask) {
            updateTask(processedTask)
          }
        }
      } catch (error) {
        console.error('Error fetching task:', error)
        setError(error as Error)
      }
    }

    if (taskId) {
      fetchTask()
    }
  }, [taskId, savedTask, updateTask])

  useEffect(() => {
    const getAssignmentUsers = async () => {
      if (task?.assignments) {
        const assignmentIds = task.assignments.map((a) => a.assignmentId)
        
        const assignmentUsers = await fetchAssignmentUsers(assignmentIds)
        
        setUsers(assignmentUsers)
      }
    }

    if (task) {
      getAssignmentUsers()
    }
  }, [task, fetchAssignmentUsers])

  if (!task) {
    return <Loading />
  }

  if (error) {
    return (
      <div className="error-container">
        <p>エラーが発生しました。</p>
      </div>
    )
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.taskInfo}>
        <h1 className={styles.taskName}>{task.name}</h1>
        <div className={styles.infoRow}>
          <p className={styles.infoItem}>優先度: {PRIORITY_MAP[task.priority]}</p>
          <p className={styles.infoItem}>状態: {STATUS_MAP[task.status]}</p>
        </div>
        <div className={styles.infoRow}>
          <p className={styles.infoItem}>開始日: {new Date(task.startDate).toLocaleDateString('ja-JP')}</p>
          <p className={styles.infoItem}>終了日: {new Date(task.endDate).toLocaleDateString('ja-JP')}</p>
        </div>
        <div className={styles.description}>
          <p>{task.description}</p>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <TaskChart
          task={task}
          users={users}
        />
      </div>

      <Button />
    </main>
  )
}

export default TaskDetails
