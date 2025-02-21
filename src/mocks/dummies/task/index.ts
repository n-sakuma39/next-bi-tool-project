/**
 * imports
 */
import { TASK_PRIORITIES, TASK_STATUS, USER_JOBS } from '@/constants'
import { API_FETCHER_DELAY, divideTotalInt, getRandomInt, getRandomValue } from '@/mocks/utilities'
import { faker } from '@faker-js/faker/locale/ja'
import { addDays, differenceInDays } from 'date-fns'
import { http, HttpResponse, delay } from 'msw'
import type { Task, TaskPriority, TaskStatus } from '@/types/type'

// メモリ内データストア
const tasksStore: Task[] = []

const gets = http.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task`, async () => {
  // 初回のみダミーデータを生成
  if (tasksStore.length === 0) {
    for (let i = 0; i < 10; i++) {
      tasksStore.push({
        id: faker.string.uuid(),
        name: `#{案件名_${faker.string.alphanumeric(8)}}`,
        priority: getRandomValue(TASK_PRIORITIES) as TaskPriority,
        status: getRandomValue(TASK_STATUS) as TaskStatus,
        startDate: faker.date.past().toISOString(),
        endDate: faker.date.future().toISOString(),
        description: `この文章は${faker.lorem.paragraph()}のダミーです`,
        assignments: [],
        assignedUsers: []
      })
    }
  }
  
  await delay(API_FETCHER_DELAY)
  return HttpResponse.json(tasksStore)
})

const get = http.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/:id`, async ({ params }) => {
  if (params.id === 'non-existent-id') {
    return new HttpResponse(null, { status: 404 })
  }
  // 開始日
  const sd: Date = faker.date.past()
  // 期限日
  const ed: Date = faker.date.future()
  //  開始日と終了日の間の日数
  const days: number = differenceInDays(ed, sd)
  // 案件名
  const fixedTaskNames = `#{案件名_${faker.string.alphanumeric(8)}}`
  // 説明文
  const generateTaskDescriptions = (names: string, repeats: number) => {
    let result = ''
    for (let i = 0; i < repeats; i++) {
      result += `この文章は${names}のダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。`
    }
    return result
  }
  // 返却を遅延させる
  await delay(API_FETCHER_DELAY)
  // 返却
  return HttpResponse.json({
    id: params.id,
    name: fixedTaskNames,
    priority: getRandomValue(TASK_PRIORITIES),
    status: getRandomValue(TASK_STATUS),
    startDate: sd.toISOString(),
    endDate: ed.toISOString(),
    description: generateTaskDescriptions(fixedTaskNames, getRandomInt(1, 8)),
    assignment: getAssignmentArray(sd, days),
  })
})

const getAssignmentArray = (sd: Date, days: number) => {
  const result = []
  // 0 から 5 件までをランダムに生成
  const max = getRandomInt(0, 5)
  for (let i = 0; i < max; i++) {
    const offset = getRandomInt(0, days - 1)
    const start = addDays(sd, offset)
    const end = addDays(start, getRandomInt(1, days - offset))
    result.push({
      id: faker.string.uuid(),
      assignmentName: `#{子課題_${faker.string.alphanumeric(4)}}`,
      jobType: getRandomValue(USER_JOBS),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      assignmentId: faker.string.uuid(),
      status: getRandomValue(TASK_STATUS),
    })
  }
  return result
}

// TaskRequestBody型の定義を追加
type TaskRequestBody = {
  name: string
  priority: string
  status: string
  startDate: string
  endDate: string
  description?: string
  userId?: string
  taskIds?: string[]
}

const post = http.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task`, async ({ request }) => {
  try {
    const body = await request.json() as TaskRequestBody
    
    if (body?.name) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        name: body.name,
        priority: body.priority as TaskPriority,
        status: body.status as TaskStatus,
        startDate: body.startDate,
        endDate: body.endDate,
        description: `この文章は${faker.lorem.paragraph()}のダミーです`, // リクエストボディのdescriptionは使用せず、常にダミーテキストを生成
        assignments: [],
        assignedUsers: []
      }
      
      tasksStore.push(newTask)
      
      return HttpResponse.json(newTask, { status: 201 })
    }
    
    // 既存の割り当てタスク取得の処理
    if (body?.userId && body?.taskIds) {
      const result = []
      const totalOccupancyRate = faker.number.float({ min: 10, max: 120, fractionDigits: 1 })
      // タスクごとの占有率を生成
      const occupancyRates = divideTotalInt(totalOccupancyRate, body.taskIds.length, 1)
      for (let i = 0; i < body.taskIds.length; i++) {
        result.push({
          id: body.taskIds[i],
          name: `#{案件名_${faker.string.alphanumeric(8)}}`,
          priority: getRandomValue(TASK_PRIORITIES),
          status: getRandomValue(TASK_STATUS),
          startDate: faker.date.past().toISOString(),
          endDate: faker.date.future().toISOString(),
          occupancyRate: occupancyRates[i],
        })
      }
      
      return HttpResponse.json({
        id: body.userId,
        totalOccupancyRate: totalOccupancyRate,
        tasks: result,
      })
    }

    return new HttpResponse(null, {
      status: 400,
      statusText: 'Bad Request: Invalid task data',
    })
  } catch (error) {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
})

const remove = http.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/:id`, async ({ params }) => {
  try {
    if (!params.id) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Bad Request: ID is required',
      })
    }

    await delay(API_FETCHER_DELAY)
    return new HttpResponse(null, { status: 200 })
  } catch (error) {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
})

// タスク編集用のハンドラー
const put = http.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/:id`, async ({ request, params }) => {
  try {
    const body = await request.json() as {
      name: string
      priority: TaskPriority
      status: TaskStatus
      startDate: string
      endDate: string
    }
    
    await delay(API_FETCHER_DELAY)
    
    // 更新されたデータをレスポンスとして返す
    const updatedTask: Task = {
      id: params.id as string,
      name: body.name,
      priority: body.priority,
      status: body.status,
      startDate: body.startDate,
      endDate: body.endDate,
      description: '', // 既存の値を保持したい場合は、別途対応が必要
      assignments: [], // 既存の値を保持したい場合は、別途対応が必要
      assignedUsers: [], // 必須プロパティを追加
    }

    return new HttpResponse(
      JSON.stringify(updatedTask),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
})

export const mockTaskRepositoryHandlers = [gets, get, post, remove, put]
