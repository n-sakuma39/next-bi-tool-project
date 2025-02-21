/**
 * imports
 */
// packages
import { faker } from '@faker-js/faker/locale/ja'
import { http, HttpResponse, delay } from 'msw'

//
import { USER_JOBS } from '@/constants'
import { API_FETCHER_DELAY, getRandomInt, getRandomValue } from '@/mocks/utilities'
import type { User, JobType } from '@/types/type'

let usersStore: User[] = []

const gets = http.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`, async () => {
  // 初回のみダミーデータを生成
  if (usersStore.length === 0) {
    for (let i = 0; i < 10; i++) {
      const taskIds = Array.from(
        { length: faker.number.int({ min: 1, max: 5 }) },
        () => faker.string.uuid()
      )
      
      usersStore.push({
        id: faker.string.uuid(),
        username: faker.person.fullName(),
        avatar: faker.image.urlLoremFlickr({ category: 'people' }),
        job: getRandomValue(USER_JOBS) as JobType,
        taskIds,
        occupancyRate: faker.number.int({ min: 30, max: 100 }),
        employmentDate: faker.date.past().toISOString().split('T')[0],
        skills: Array.from({ length: getRandomInt(2, 5) }, () => 
          faker.helpers.arrayElement(['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'AWS', 'Docker'])
        ),
        certifications: Array.from({ length: getRandomInt(1, 3) }, () =>
          faker.helpers.arrayElement(['基本情報技術者', 'AWS認定ソリューションアーキテクト', 'Oracle認定資格', 'LPIC'])
        ),
        createdAt: new Date().toISOString(),
        description: `この文章は${faker.person.fullName()}のダミーです`,
        department: faker.helpers.arrayElement(DEPARTMENTS),
        email: faker.internet.email(),
        employeeId: `EMP${faker.string.numeric(6)}`,
        projectHistory: `この文章は${faker.lorem.paragraph()}のダミーです`,
      })
    }
  }
  
  await delay(API_FETCHER_DELAY)
  return HttpResponse.json(usersStore)  // 常に最新のusersStoreを返す
})

// 部署名の配列を定義
const DEPARTMENTS = [
  '開発部',
  'インフラ部',
  'デザイン部',
  'プロジェクト管理部',
  '営業部',
  'カスタマーサポート部',
  '人事部',
  '総務部'
]

const get = http.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/:id`, async ({ params }) => {
  if (params.id === 'non-existent-id') {
    return new HttpResponse(null, { status: 404 })
  }

  const fixedUsername = faker.person.fullName()
  const generateUserDescriptions = (names: string, repeats: number) => {
    let result = ''
    for (let i = 0; i < repeats; i++) {
      result += `この文章は${names}のダミーです。文字の大きさ、量、字間、行間等を確認するために入れています。`
    }
    return result
  }

  await delay(API_FETCHER_DELAY)

  return HttpResponse.json({
    id: params.id,
    username: fixedUsername,
    avatar: faker.image.urlLoremFlickr({ category: 'people' }),
    job: getRandomValue(USER_JOBS) as JobType,
    description: generateUserDescriptions(fixedUsername, getRandomInt(1, 8)),
    employmentDate: faker.date.past().toISOString().split('T')[0],
    department: faker.helpers.arrayElement(DEPARTMENTS),
    employeeId: `EMP${faker.string.numeric(6)}`,
    email: faker.internet.email(),
    occupancyRate: faker.number.int({ min: 30, max: 100 }),
    skills: Array.from({ length: getRandomInt(2, 5) }, () => 
      faker.helpers.arrayElement(['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'AWS', 'Docker'])
    ),
    projectHistory: generateUserDescriptions(fixedUsername, getRandomInt(1, 3)),
    certifications: Array.from({ length: getRandomInt(1, 3) }, () =>
      faker.helpers.arrayElement(['基本情報技術者', 'AWS認定ソリューションアーキテクト', 'Oracle認定資格', 'LPIC'])
    ),
    taskIds: getTaskArray(),
  })
})

const getTaskArray = () => {
  const result = []
  const max = getRandomInt(0, 5)
  for (let i = 0; i < max; i++) {
    result.push(faker.string.uuid())
  }
  return result
}

// リクエストボディの型定義を追加
type UserRequestBody = {
  username?: string
  job?: string
  occupancyRate?: number
  description?: string
  employmentDate?: string
  department?: string
  employeeId?: string
  email?: string
  skills?: string[]
  projectHistory?: string
  certifications?: string[]
  taskIds?: string[]
  avatar?: string
}

const post = http.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`, async ({ request }) => {
  try {
    const body = await request.json() as UserRequestBody
    
    if (!body) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Bad Request: Missing request body',
      })
    }

    console.log('Creating new user with data:', body)

    // デフォルトのアバター画像を設定
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${faker.string.alphanumeric(8)}`

    const newUser: User = {
      id: crypto.randomUUID(),
      username: body.username || faker.person.fullName(),
      job: (body.job || getRandomValue(USER_JOBS)) as JobType,
      // アバターが空文字または未定義の場合、デフォルトのアバターを使用
      avatar: body.avatar || defaultAvatar,
      occupancyRate: body.occupancyRate ?? faker.number.int({ min: 30, max: 100 }),
      description: body.description || `この文章は${faker.lorem.paragraph()}のダミーです`,
      createdAt: new Date().toISOString(),
      employmentDate: body.employmentDate || faker.date.past().toISOString().split('T')[0],
      department: body.department || faker.helpers.arrayElement(DEPARTMENTS),
      employeeId: body.employeeId || `EMP${faker.string.numeric(6)}`,
      email: body.email || faker.internet.email(),
      skills: body.skills || Array.from({ length: getRandomInt(2, 5) }, () => 
        faker.helpers.arrayElement(['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'AWS', 'Docker'])
      ),
      projectHistory: body.projectHistory || `この文章は${faker.lorem.paragraph()}のダミーです`,
      certifications: body.certifications || Array.from({ length: getRandomInt(1, 3) }, () =>
        faker.helpers.arrayElement(['基本情報技術者', 'AWS認定ソリューションアーキテクト', 'Oracle認定資格', 'LPIC'])
      ),
      taskIds: body.taskIds || [],
    }
    
    console.log('Created new user:', newUser)
    
    usersStore.unshift(newUser)
    
    return HttpResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
})

const remove = http.delete(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/:id`, async ({ params }) => {
  try {
    if (!params.id) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Bad Request: ID is required',
      })
    }

    await delay(API_FETCHER_DELAY)
    usersStore = usersStore.filter((user) => user.id !== params.id)
    return new HttpResponse(null, { status: 200 })
  } catch (error) {
    return new HttpResponse(null, {
      status: 500,
      statusText: 'Internal Server Error',
    })
  }
})

// ユーザー編集用のハンドラー
const put = http.put(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/:id`, async ({ request, params }) => {
  try {
    const body = await request.json() as {
      username: string
      job: JobType
      avatar: string
      occupancyRate: number
      description?: string
      employmentDate: string
      department?: string
      employeeId?: string
      email?: string
      skills: string[]
      projectHistory?: string
      certifications: string[]
    }
    
    await delay(API_FETCHER_DELAY)
    
    // 更新されたデータをレスポンスとして返す
    const updatedUser: User = {
      id: params.id as string,
      username: body.username,
      job: body.job,
      avatar: body.avatar,
      occupancyRate: body.occupancyRate,
      description: body.description || '',
      employmentDate: body.employmentDate,
      department: body.department || '',
      employeeId: body.employeeId || '',
      email: body.email || '',
      skills: body.skills,
      projectHistory: body.projectHistory || '',
      certifications: body.certifications,
      createdAt: new Date().toISOString()
    }

    usersStore = usersStore.map((user) =>
      user.id === params.id ? updatedUser : user
    )

    return new HttpResponse(
      JSON.stringify(updatedUser),
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

export const mockUserRepositoryHandlers = [gets, get, post, remove, put]
