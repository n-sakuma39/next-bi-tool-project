'use client'

import { Modal } from '@/components/admin/Modal'
import { TaskManagement } from '@/components/admin/task'
import { UserManagement } from '@/components/admin/users'
import { SwitchPanel } from '@/components/elements/SwitchPanel'
import Loading from '@/components/elements/loading'
import Header from '@/components/layouts/header'
import { JOB_NAME_MAP } from '@/constants/maps'
import { PRIORITY_MAP, STATUS_MAP } from '@/constants/maps'
import { useAuth } from '@/hooks/useAuth'
import { taskApi } from '@/lib/api/task'
import { userApi } from '@/lib/api/user'
import type { JobType, Task, TaskFormData, TaskPriority, TaskStatus, User, UserFormData } from '@/types/type'
import { faker } from '@faker-js/faker/locale/ja'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import styles from './styles.module.css'

// ローカルでの型定義は削除し、インポートした型を使用
type FormData = UserFormData | TaskFormData

// 部署の定義（共通で使用）
const DEPARTMENTS = [
  '開発部',
  'インフラ部',
  'デザイン部',
  'プロジェクト管理部',
  '営業部',
  'カスタマーサポート部',
  '人事部',
  '総務部',
] as const

export default function AdminPage() {
  useAuth('admin')
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPanel, setShowPanel] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedTasks, setSelectedTasks] = useState<Task[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [userFormData, setUserFormData] = useState<UserFormData>({
    username: '',
    job: '' as JobType,
    avatar: '',
    description: '',
    employmentDate: '',
    department: '',
    employeeId: '',
    email: '',
    skills: [],
    projectHistory: '',
    certifications: [],
  })
  const [taskFormData, setTaskFormData] = useState<TaskFormData>({
    taskName: '',
    priority: 'middle',
    status: 'waiting',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })
  const [error, setError] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: userData, error: userError }, { data: taskData, error: taskError }] = await Promise.all([
          userApi.getAll(),
          taskApi.getAll(),
        ])

        if (userError || taskError) {
          throw new Error('データの取得に失敗しました')
        }

        if (userData) setUsers(userData)
        if (taskData) setTasks(taskData)
      } catch (err) {
        setError('データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTaskDeleteClick = (taskOrTasks: Task | Task[]) => {
    if (Array.isArray(taskOrTasks)) {
      setSelectedTasks(taskOrTasks)
    } else {
      setSelectedTask(taskOrTasks)
    }
    setIsDeleteModalOpen(true)
  }

  const handleUserDeleteClick = (userOrUsers: User | User[]) => {
    if (Array.isArray(userOrUsers)) {
      setSelectedUsers(userOrUsers)
    } else {
      setSelectedUser(userOrUsers)
    }
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (selectedTask) {
      try {
        const { error } = await taskApi.delete(selectedTask.id)
        if (error) {
          setError(error)
          return
        }

        // 削除されたタスクの情報をログ出力
        console.log('削除されたタスク:', {
          タスク名: selectedTask.name,
          優先度: PRIORITY_MAP[selectedTask.priority],
          ステータス: STATUS_MAP[selectedTask.status],
          開始日: selectedTask.startDate,
          終了日: selectedTask.endDate,
          説明: selectedTask.description || '(説明なし)',
        })

        setTasks(tasks.filter((task) => task.id !== selectedTask.id))
        setIsDeleteModalOpen(false)
        setSelectedTask(null)
        setSelectedTasks([])
        setSuccessMessage('タスクを削除しました')
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
          setSuccessMessage('')
        }, 700)
      } catch (err) {
        console.error('Error deleting task:', err)
        setError('タスクの削除に失敗しました')
      }
    } else if (selectedUser) {
      try {
        const { error } = await userApi.delete(selectedUser.id)
        if (error) {
          setError(error)
          return
        }

        // 削除されたユーザーの情報をログ出力
        console.log('削除されたユーザー:', {
          ユーザー名: selectedUser.username,
          職種: JOB_NAME_MAP[selectedUser.job],
          部署: selectedUser.department || '(部署なし)',
          メールアドレス: selectedUser.email || '(未設定)',
          スキル: selectedUser.skills.join(', ') || '(未設定)',
          説明: selectedUser.description || '(説明なし)',
        })

        setUsers(users.filter((user) => user.id !== selectedUser.id))
        setIsDeleteModalOpen(false)
        setSelectedUser(null)
        setSelectedUsers([])
        setSuccessMessage('ユーザーを削除しました')
        setShowSuccessModal(true)
        setTimeout(() => {
          setShowSuccessModal(false)
          setSuccessMessage('')
        }, 700)
      } catch (err) {
        console.error('Error deleting user:', err)
        setError('ユーザーの削除に失敗しました')
      }
    }
  }

  const resetUserForm = () => {
    setUserFormData({
      username: '',
      job: '' as JobType,
      avatar: '',
      description: '',
      employmentDate: '',
      department: '',
      employeeId: '',
      email: '',
      skills: [],
      projectHistory: '',
      certifications: [],
    })
    setError('')
  }

  const resetTaskForm = () => {
    setTaskFormData({
      taskName: '',
      priority: 'middle',
      status: 'waiting',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    })
    setError('')
  }

  const handleUserCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const userData = {
        username: userFormData.username,
        job: userFormData.job,
        avatar: userFormData.avatar,
        occupancyRate: 0,
        description: userFormData.description || '',
        employmentDate: userFormData.employmentDate,
        department: userFormData.department,
        employeeId: userFormData.employeeId,
        email: userFormData.email,
        skills: userFormData.skills,
        projectHistory: userFormData.projectHistory,
        certifications: userFormData.certifications,
      }

      const { data, error } = await userApi.create(userData)
      
      if (error) {
        setError(error)
        return
      }

      setIsCreateModalOpen(false)
      resetUserForm()
      setSuccessMessage('ユーザーを作成しました')
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        setSuccessMessage('')
      }, 1500)
    } catch (err) {
      console.error('Error creating user:', err)
      setError('ユーザーの作成に失敗しました')
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (!showPanel) {
      // タスクフォームの処理
      setTaskFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    } else {
      // ユーザーフォームの処理
      if (name === 'skills' || name === 'certifications') {
        setUserFormData((prev) => ({
          ...prev,
          [name]: value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        }))
      } else {
        setUserFormData((prev) => ({
          ...prev,
          [name]: value,
        }))
      }
    }
  }

  const handleEditClick = (user: User) => {
    setEditingUser(user)

    const generateDummyDescription = (username: string) => {
      return `${username}は${faker.helpers.arrayElement(DEPARTMENTS)}で活躍中のエンジニアです。
      主に${faker.helpers.arrayElement(['フロントエンド', 'バックエンド', 'インフラ', 'デザイン'])}領域を担当しています。`
    }

    const dummySkills = ['React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'AWS', 'Docker', 'Git', 'GraphQL', 'PostgreSQL']

    const dummyCertifications = [
      '基本情報技術者',
      'AWS認定ソリューションアーキテクト',
      'Oracle認定資格',
      'LPIC Level 1',
      'Java Silver',
      'Python3エンジニア認定基礎試験',
    ]

    // プロジェクト履歴のフォーマットを修正
    const generateProjectHistory = () => {
      const projects = [
        '社内システム開発',
        'ECサイト構築',
        'モバイルアプリ開発',
        'クラウド移行',
        'システムリプレイス',
        'APIサービス開発',
        'データ分析基盤構築',
        'セキュリティ強化',
        'UI/UX改善',
      ]

      return Array.from({ length: 3 }, () => `・${faker.helpers.arrayElement(projects)}（${faker.date.past().getFullYear()}年）`).join('\n')
    }

    // メールアドレスをランダムな英数字で生成
    const generateRandomEmail = () => {
      const randomString = faker.string.alphanumeric(8).toLowerCase()
      return `${randomString}@example.com`
    }

    setUserFormData({
      username: user.username || '',
      job: (user.job as JobType) || 'frontend',
      avatar: user.avatar || '',
      description: user.description || generateDummyDescription(user.username),
      employmentDate: user.employmentDate || faker.date.past().toISOString().split('T')[0],
      department: user.department || faker.helpers.arrayElement(DEPARTMENTS),
      employeeId: user.employeeId || `EMP${faker.string.numeric(6)}`,
      email: user.email || generateRandomEmail(),
      skills: user.skills?.length ? user.skills : faker.helpers.arrayElements(dummySkills, { min: 3, max: 6 }),
      projectHistory: user.projectHistory || generateProjectHistory(),
      certifications: user.certifications?.length
        ? user.certifications
        : faker.helpers.arrayElements(dummyCertifications, { min: 1, max: 3 }),
    })
    setIsEditModalOpen(true)
  }

  const handleUserEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!editingUser) return

      const updateData = {
        username: userFormData.username,
        job: userFormData.job,
        description: userFormData.description,
        employmentDate: userFormData.employmentDate,
        department: userFormData.department,
        employeeId: userFormData.employeeId,
        email: userFormData.email,
        skills: userFormData.skills,
        projectHistory: userFormData.projectHistory,
        certifications: userFormData.certifications,
        avatar: editingUser.avatar,
        occupancyRate: editingUser.occupancyRate,
      }

      const { error } = await userApi.update(editingUser.id, updateData)

      if (error) {
        setError(error)
        return
      }

      // 画面上のユーザーリストを直接更新
      const updatedUser = {
        ...editingUser,
        ...updateData,
      }

      // 強制的に再レンダリングを発生させるため、新しい配列を作成
      const newUsers = [...users]
      const userIndex = newUsers.findIndex((user) => user.id === editingUser.id)
      if (userIndex !== -1) {
        newUsers[userIndex] = updatedUser
        setUsers(newUsers)
      }

      console.log('編集されたユーザー:', {
        ユーザー名: updateData.username,
        職種: JOB_NAME_MAP[updateData.job as keyof typeof JOB_NAME_MAP],
        説明: updateData.description || '(説明なし)',
        入社日: updateData.employmentDate,
        部署: updateData.department,
        社員ID: updateData.employeeId,
        メールアドレス: updateData.email,
        スキル: updateData.skills.join(', ') || '(スキルなし)',
        プロジェクト履歴: updateData.projectHistory || '(履歴なし)',
        保有資格: updateData.certifications.join(', ') || '(資格なし)',
      })

      setIsEditModalOpen(false)
      setEditingUser(null)
      resetUserForm()
      setSuccessMessage('ユーザーを編集しました')
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        setSuccessMessage('')
      }, 1500)
    } catch (err) {
      console.error('Error updating user:', err)
      setError('ユーザーの編集に失敗しました')
    }
  }

  // const handleLogout = () => {
  //   try {
  //     // ローカルストレージからユーザー情報を削除
  //     localStorage.removeItem('userRole')
  //     // ログインページにリダイレクト
  //     router.push('/login')
  //   } catch (error) {
  //     console.error('Logout error:', error)
  //     // エラーが発生した場合でもログインページに遷移
  //     router.push('/login')
  //   }
  // }

  const handleTaskEditClick = (task: Task) => {
    // 日付を YYYY-MM-DD 形式に変換
    const formatDateForInput = (dateString: string) => {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    }

    setEditingTask(task)
    setTaskFormData({
      taskName: task.name,
      priority: task.priority,
      status: task.status,
      startDate: formatDateForInput(task.startDate),
      endDate: formatDateForInput(task.endDate),
    })
    setIsEditModalOpen(true)
  }

  const handleTaskCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 日付フォーマット関数
      const formatDate = (dateString: string) => {
        const [year, month, day] = dateString.split('-')
        return `${year}/${month}/${day}`
      }

      const requestBody = {
        userId: crypto.randomUUID(),
        taskIds: [crypto.randomUUID()],
        name: taskFormData.taskName,
        priority: taskFormData.priority,
        status: taskFormData.status,
        startDate: new Date(taskFormData.startDate).toISOString(),
        endDate: new Date(taskFormData.endDate).toISOString(),
        assignedUsers: [],
      }

      // フォーマットされた日付でログ出力
      console.log('作成されたタスク:', {
        案件名: taskFormData.taskName,
        優先度: PRIORITY_MAP[taskFormData.priority],
        状態: STATUS_MAP[taskFormData.status],
        開始日: formatDate(taskFormData.startDate),
        期限日: formatDate(taskFormData.endDate),
      })

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) throw new Error('Failed to create task')

      const newTask = await response.json()
      const taskToAdd = newTask.tasks?.[0] || {
        id: requestBody.taskIds[0],
        name: taskFormData.taskName,
        priority: taskFormData.priority,
        status: taskFormData.status,
        startDate: requestBody.startDate,
        endDate: requestBody.endDate,
        assignedUsers: [],
      }

      setTasks((prevTasks) => [...prevTasks, taskToAdd])
      setIsCreateModalOpen(false)
      resetTaskForm()

      setSuccessMessage('案件を作成しました')
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        setSuccessMessage('')
      }, 1500)
    } catch (err) {
      console.error('Error creating task:', err)
      setError('案件の作成に失敗しました')
    }
  }

  const handleTaskEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!editingTask) return

      const updateData = {
        name: taskFormData.taskName,
        priority: taskFormData.priority as TaskPriority,
        status: taskFormData.status as TaskStatus,
        startDate: new Date(taskFormData.startDate).toISOString(),
        endDate: new Date(taskFormData.endDate).toISOString(),
      }

      const { data, error } = await taskApi.update(editingTask.id, updateData)

      if (error) {
        setError(error)
        return
      }

      // APIからの応答データを使用して更新
      if (data) {
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === editingTask.id ? data : task)))
      }

      console.log('編集されたタスク:', {
        案件名: updateData.name,
        優先度: PRIORITY_MAP[updateData.priority],
        状態: STATUS_MAP[updateData.status],
        開始日: new Date(updateData.startDate).toLocaleDateString('ja-JP'),
        期限日: new Date(updateData.endDate).toLocaleDateString('ja-JP'),
      })

      setIsEditModalOpen(false)
      setEditingTask(null)
      resetTaskForm()
      setSuccessMessage('案件を編集しました')
      setShowSuccessModal(true)
      setTimeout(() => {
        setShowSuccessModal(false)
        setSuccessMessage('')
      }, 1500)
    } catch (err) {
      console.error('Error updating task:', err)
      setError('案件の編集に失敗しました')
    }
  }

  const tasksContent = (
    <TaskManagement
      key={JSON.stringify(tasks)}
      tasks={tasks}
      selectedTaskIds={selectedTaskIds}
      onEditClick={handleTaskEditClick}
      onDeleteClick={handleTaskDeleteClick}
      onSelectionChange={setSelectedTaskIds}
    />
  )

  const usersContent = (
    <UserManagement
      key={JSON.stringify(users)}
      users={users}
      selectedUserIds={selectedUserIds}
      onEditClick={handleEditClick}
      onDeleteClick={handleUserDeleteClick}
      onSelectionChange={setSelectedUserIds}
    />
  )

  if (isLoading) return <Loading />

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.mainContent}>
        <SwitchPanel
          activePanel={showPanel}
          onPanelChange={setShowPanel}
          firstPanelLabel="TASKS"
          secondPanelLabel="USERS"
          firstPanelContent={tasksContent}
          secondPanelContent={usersContent}
        />
      </main>

      <Modal
        type="delete"
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedTask(null)
          setSelectedTasks([])
          setSelectedUser(null)
          setSelectedUsers([])
        }}
        onDelete={handleDelete}
        username={selectedUser?.username}
        taskNames={selectedTask ? [selectedTask.name] : selectedTasks.map((task) => task.name)}
        isTaskDelete={!!selectedTask || selectedTasks.length > 0}
        selectedTasks={selectedTasks}
        selectedUsers={selectedUsers}
      />

      <Modal
        type="form"
        formType="create"
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          !showPanel ? resetTaskForm() : resetUserForm()
        }}
        formData={!showPanel ? taskFormData : userFormData}
        onChange={handleChange}
        onSubmit={!showPanel ? handleTaskCreateSubmit : handleUserCreateSubmit}
        error={error}
        isTaskForm={!showPanel}
      />

      <Modal
        type="success"
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          setSuccessMessage('')
        }}
        message={successMessage}
      />

      <Modal
        type="form"
        formType="edit"
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingTask(null)
          setEditingUser(null)
          resetTaskForm()
          resetUserForm()
          setError('')
        }}
        formData={!showPanel ? taskFormData : userFormData}
        onChange={handleChange}
        onSubmit={!showPanel ? handleTaskEditSubmit : handleUserEditSubmit}
        error={error}
        isTaskForm={!showPanel}
      />
    </div>
  )
}
