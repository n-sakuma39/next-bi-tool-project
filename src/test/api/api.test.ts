import { describe, it, expect } from 'vitest'
import { TASK_PRIORITIES, TASK_STATUS, USER_JOBS } from '@/constants'

describe('API Tests', () => {
  it('タスク一覧を取得できる', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(10)
    expect(data[0]).toMatchObject({
      id: expect.any(String),
      name: expect.stringMatching(/^#\{案件名_[A-Za-z0-9]{8}\}$/),
      priority: expect.stringMatching(new RegExp(`^(${TASK_PRIORITIES.join('|')})$`)),
      status: expect.stringMatching(new RegExp(`^(${TASK_STATUS.join('|')})$`)),
      startDate: expect.any(String),
      endDate: expect.any(String)
    })
  })

  it('ユーザー一覧を取得できる', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBe(10)
    expect(data[0]).toMatchObject({
      id: expect.any(String),
      username: expect.any(String),
      avatar: expect.stringMatching(/^https:\/\/loremflickr\.com\/\d+\/\d+\/people/),
      job: expect.stringMatching(new RegExp(`^(${USER_JOBS.join('|')})$`)),
      totalOccupancyRate: expect.any(Number)
    })
  })

  it('タスクの詳細を取得できる', async () => {
    const taskId = '1'
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/${taskId}`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data).toMatchObject({
      id: taskId,
      name: expect.stringMatching(/^#\{案件名_[A-Za-z0-9]{8}\}$/),
      priority: expect.stringMatching(new RegExp(`^(${TASK_PRIORITIES.join('|')})$`)),
      status: expect.stringMatching(new RegExp(`^(${TASK_STATUS.join('|')})$`)),
      startDate: expect.any(String),
      endDate: expect.any(String),
      description: expect.stringMatching(/^この文章は.*のダミーです/),
      assignment: expect.any(Array)
    })
  })

  it('ユーザーの詳細を取得できる', async () => {
    const userId = '1'
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/${userId}`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data).toMatchObject({
      id: userId,
      username: expect.any(String),
      avatar: expect.stringMatching(/^https:\/\/loremflickr\.com\/\d+\/\d+\/people/),
      job: expect.stringMatching(new RegExp(`^(${USER_JOBS.join('|')})$`)),
      description: expect.stringMatching(/^この文章は.*のダミーです/)
    })
  })

  it('存在しないタスクIDの場合は404エラーを返す', async () => {
    const taskId = 'non-existent-id'
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/${taskId}`)
    
    expect(response.status).toBe(404)
  })

  it('存在しないユーザーIDの場合は404エラーを返す', async () => {
    const userId = 'non-existent-id'
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/${userId}`)
    
    expect(response.status).toBe(404)
  })

  it('タスクの詳細データが期待される形式である', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task`)
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)

    // 最初のタスクの構造をチェック
    expect(data[0]).toMatchObject({
      id: expect.any(String),
      name: expect.stringMatching(/^#\{案件名_[A-Za-z0-9]{8}\}$/),
      priority: expect.stringMatching(new RegExp(`^(${TASK_PRIORITIES.join('|')})$`)),
      status: expect.stringMatching(new RegExp(`^(${TASK_STATUS.join('|')})$`)),
      startDate: expect.any(String),
      endDate: expect.any(String)
    })
  })

  it('タスクの日付が正しい形式である', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task`)
    const data = await response.json()

    for (const task of data) {
      const startDate = new Date(task.startDate)
      const endDate = new Date(task.endDate)
      
      expect(startDate.toString()).not.toBe('Invalid Date')
      expect(endDate.toString()).not.toBe('Invalid Date')
      expect(startDate.getTime()).toBeLessThan(endDate.getTime())
    }
  })

  it('ユーザーの稼働率が正しい範囲である', async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`)
    const data = await response.json()

    for (const user of data) {
      expect(user.totalOccupancyRate).toBeGreaterThanOrEqual(0)
      expect(user.totalOccupancyRate).toBeLessThanOrEqual(200)
    }
  })
})
