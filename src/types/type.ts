import type { JOB_NAME_MAP, PRIORITY_MAP, STATUS_MAP } from '@/constants/maps'

export type Task = {
  id: string
  name: string
  priority: TaskPriority
  status: TaskStatus
  startDate: string
  endDate: string
  description: string
  assignments: Assignment[]
  occupancyRate?: number
  assignedUsers: User[]
}

export type User = {
  id: string
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
  createdAt: string
  taskIds?: string[]
}

export type UserDetails = User & {
  description: string
  taskIds: string[]
}

export type Assignment = {
  id: string
  assignmentName: string
  status: 'waiting' | 'processing' | 'completed' | 'done'
  startDate: string
  endDate: string
  jobType: string
  assignmentId: string
}

export type SortField = 'priority' | 'status' | 'startDate' | 'endDate'
export type SortDirection = 'asc' | 'desc'

export type TaskListProps = {
  tasks: Task[]
  onSort: (field: SortField) => void
  sortField: SortField
  sortDirection: SortDirection
}

export type UserListProps = {
  users: User[]
  selectedJob: string | null
  onJobSelect: (job: string | null) => void
  onReset: () => void
}

export type TaskUserListProps = {
  initialTasks: Task[]
  initialUsers: User[]
}

export type JobType = "director" | "designer" | "frontend" | "backend"
export type PriorityType = keyof typeof PRIORITY_MAP
export type StatusType = keyof typeof STATUS_MAP

export type TaskStatus = 'waiting' | 'processing' | 'completed' | 'done'

export type TaskPriority = 'high' | 'middle' | 'low'

export type TaskFormData = {
  taskName: string
  priority: TaskPriority
  status: TaskStatus
  startDate: string
  endDate: string
}

export type UserFormData = {
  username: string
  job: JobType
  avatar: string
  description: string
  employmentDate: string
  department: string
  employeeId: string
  email: string
  skills: string[]
  projectHistory?: string
  certifications: string[]
  occupancyRate?: number
}

export type ApiResponse<T> = {
  data: T | null
  error: string | null
}

export type TaskCreateData = {
  name: string
  priority: PriorityType
  status: StatusType
  startDate: string
  endDate: string
}

export type UserCreateData = {
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
