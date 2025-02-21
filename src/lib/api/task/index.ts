import type { ApiResponse, Task, TaskCreateData } from '@/types/type'
import { handleApiError } from '@/utils/error'

export const taskApi = {
  getAll: async (): Promise<ApiResponse<Task[]>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task`)

      if (!response.ok) {
        throw new Error('案件の取得に失敗しました')
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  },

  create: async (taskData: TaskCreateData): Promise<ApiResponse<Task>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error('案件の作成に失敗しました')
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  },

  update: async (taskId: string, taskData: Partial<TaskCreateData>): Promise<ApiResponse<Task>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error('案件の更新に失敗しました')
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  },

  delete: async (taskId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('案件の削除に失敗しました')
      }

      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  },
}
