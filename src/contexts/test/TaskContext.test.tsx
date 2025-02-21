import { render, renderHook, act } from '@testing-library/react'
import { TaskProvider, useTaskContext } from '../TaskContext'
import { describe, expect, it } from 'vitest'
import type { Task } from '@/types/type'

describe('TaskContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TaskProvider>{children}</TaskProvider>
  )

  const mockTask: Task = {
    id: '1',
    name: 'テストタスク',
    priority: 'high' as const,
    status: 'processing' as const,
    startDate: '2024-04-01T00:00:00.000Z',
    endDate: '2024-04-30T00:00:00.000Z',
    description: 'テスト説明',
    assignments: []
  }

  it('TaskProviderが子コンポーネントをレンダリングする', () => {
    const { getByText } = render(
      <TaskProvider>
        <div>Test Child</div>
      </TaskProvider>
    )
    expect(getByText('Test Child')).toBeInTheDocument()
  })

  it('getTaskが正しくタスクを取得する', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })

    // 初期状態では空の配列
    expect(result.current.tasks).toHaveLength(0)
    expect(result.current.getTask('1')).toBeUndefined()

    // タスクを追加
    act(() => {
      result.current.setTasks([mockTask])
    })

    // 存在するタスクを取得
    const task = result.current.getTask('1')
    expect(task).toEqual(mockTask)

    // 存在しないタスクを取得
    const nonExistentTask = result.current.getTask('999')
    expect(nonExistentTask).toBeUndefined()
  })

  it('updateTaskが新しいタスクを追加する', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })

    // 初期状態を確認
    expect(result.current.tasks).toHaveLength(0)

    // 新しいタスクを追加
    act(() => {
      result.current.updateTask(mockTask)
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0]).toEqual(mockTask)
  })

  it('updateTaskが既存のタスクを更新する', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })

    // 初期タスクを設定
    act(() => {
      result.current.setTasks([mockTask])
    })

    const updatedTask: Task = {
      ...mockTask,
      name: '更新されたタスク',
      status: 'completed' as const
    }

    // タスクを更新
    act(() => {
      result.current.updateTask(updatedTask)
    })

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0].name).toBe('更新されたタスク')
    expect(result.current.tasks[0].status).toBe('completed')
  })

  it('TaskProviderの外でuseTaskContextを使用するとエラーを投げる', () => {
    expect(() => {
      renderHook(() => useTaskContext())
    }).toThrow('useTaskContext must be used within a TaskProvider')
  })

  it('setUsersが正しくユーザーを設定する', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    const mockUsers = [
      { id: '1', username: 'ユーザー1', job: 'frontend', avatar: '', totalOccupancyRate: 80 },
      { id: '2', username: 'ユーザー2', job: 'backend', avatar: '', totalOccupancyRate: 90 }
    ]

    act(() => {
      result.current.setUsers(mockUsers)
    })

    expect(result.current.users).toEqual(mockUsers)
  })
})
