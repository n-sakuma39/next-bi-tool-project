'use client'

import type { Task, User } from '@/types/type'
import { createContext, useContext, useState } from 'react'

type TaskContextType = {
  tasks: Task[]
  users: User[]
  setTasks: (tasks: Task[]) => void
  setUsers: (users: User[]) => void
  getTask: (id: string) => Task | undefined
  updateTask: (task: Task) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  const updateTask = (updatedTask: Task) => {
    setTasks((prevTasks) => {
      const index = prevTasks.findIndex((task) => task.id === updatedTask.id)
      if (index === -1) {
        return [...prevTasks, updatedTask]
      }
      const newTasks = [...prevTasks]
      newTasks[index] = updatedTask
      return newTasks
    })
  }

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      users, 
      setTasks, 
      setUsers, 
      getTask, 
      updateTask 
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}
