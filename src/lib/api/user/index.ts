import { handleApiError } from '@/utils/error'
import type { ApiResponse, User, UserCreateData } from '@/types/type'

export const userApi = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`)
      
      if (!response.ok) {
        throw new Error('ユーザーの取得に失敗しました')
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  },

  create: async (userData: UserCreateData): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('ユーザーの作成に失敗しました')
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  },

  update: async (userId: string, userData: Partial<UserCreateData>): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('ユーザーの更新に失敗しました')
      }

      const data = await response.json()
      return { data, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  },

  delete: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('ユーザーの削除に失敗しました')
      }

      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: handleApiError(error) }
    }
  }
}
