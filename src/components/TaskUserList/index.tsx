'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IoReload } from 'react-icons/io5'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import styles from './styles.module.css'
import 'swiper/css'
import 'swiper/css/navigation'
import '@/app/swiperCustom.css'
import { SwitchPanel } from '@/components/elements/SwitchPanel'
import { JOB_NAME_MAP, PRIORITY_MAP, PRIORITY_ORDER, STATUS_MAP, STATUS_ORDER } from '@/constants/maps'
import { useTaskContext } from '@/contexts/TaskContext'
import type { Task, User } from '@/types/type'

// 型定義を追加
type SortField = 'priority' | 'status' | 'startDate' | 'endDate'
type SortDirection = 'asc' | 'desc'

type Props = {
  initialTasks: Task[]
  initialUsers: User[]
}

export function TaskUserList({ initialTasks, initialUsers }: Props) {
  const { tasks, users, setTasks, setUsers } = useTaskContext()
  const [showPanel, setShowPanel] = useState(false)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('startDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // 初期データをセット
  useEffect(() => {
    if (initialTasks?.length > 0) {
      setTasks(initialTasks)
    }
  }, [initialTasks, setTasks])

  // users の初期データをセット
  useEffect(() => {
    if (initialUsers?.length > 0) {
      setUsers(initialUsers)
    }
  }, [initialUsers, setUsers])

  const handlePanelChange = async (showUsersPanel: boolean) => {
    setShowPanel(showUsersPanel)

    if (showUsersPanel && (!users || users.length === 0)) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`)
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    if (showUsersPanel) {
      setSelectedJob(null)
    } else {
      setSortField('startDate')
      setSortDirection('desc')
    }
  }

  const filteredUsers = selectedJob ? users.filter((user) => JOB_NAME_MAP[user.job as keyof typeof JOB_NAME_MAP] === selectedJob) : users

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}/${month}/${day}`
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev: SortDirection) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortedTasks = () => {
    if (!tasks) return []
    return [...tasks].sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1

      switch (sortField) {
        case 'priority':
          return (PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]) * multiplier
        case 'status':
          return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * multiplier
        case 'startDate':
          return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * multiplier
        case 'endDate':
          return (new Date(a.endDate).getTime() - new Date(b.endDate).getTime()) * multiplier
        default:
          return 0
      }
    })
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '▲' : '▼'
  }

  const handleReset = () => {
    setSelectedJob(null) // 職種フィルターをリセット
  }

  const getOverworkedUsers = (users: User[]) => {
    return users.filter((user) => user.occupancyRate >= 100)
  }

  const overworkedUsers = getOverworkedUsers(users)

  const tasksContent = (
    <div
      id="taskBox"
      data-testid="taskBox"
    >
      <ul className={styles.list}>
        <li className={styles.listHeader}>
          <span>案件名</span>
          <span
            onClick={() => handleSort('priority')}
            onKeyDown={(e) => e.key === 'Enter' && handleSort('priority')}
            className={styles.clickable}
            role="button"
            tabIndex={0}
          >
            優先度 {getSortIcon('priority')}
          </span>
          <span
            onClick={() => handleSort('status')}
            onKeyDown={(e) => e.key === 'Enter' && handleSort('status')}
            className={styles.clickable}
            role="button"
            tabIndex={0}
          >
            状態 {getSortIcon('status')}
          </span>
          <span
            onClick={() => handleSort('startDate')}
            onKeyDown={(e) => e.key === 'Enter' && handleSort('startDate')}
            className={styles.clickable}
            role="button"
            tabIndex={0}
          >
            開始日 {getSortIcon('startDate')}
          </span>
          <span
            onClick={() => handleSort('endDate')}
            onKeyDown={(e) => e.key === 'Enter' && handleSort('endDate')}
            className={styles.clickable}
            role="button"
            tabIndex={0}
          >
            終了日 {getSortIcon('endDate')}
          </span>
        </li>
        {getSortedTasks().map((task) => (
          <li
            key={task.id}
            className={styles.listItem}
          >
            <Link href={`/tasks/${task.id}`}>
              <span>{task.name}</span>
              <span>{PRIORITY_MAP[task.priority]}</span>
              <span>{STATUS_MAP[task.status]}</span>
              <span>{formatDate(task.startDate)}</span>
              <span>{formatDate(task.endDate)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  const usersContent = (
    <div
      id="userBox"
      data-testid="userBox"
    >
      <div className={styles.usersFilterBox}>
        <div className={styles.useSelect}>
          <ul>
            <li>
              <span
                role="button"
                onClick={() => setSelectedJob(null)}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedJob(null)}
                tabIndex={0}
                className={selectedJob === null ? styles.active : ''}
              >
                すべて
              </span>
            </li>
            {Object.values(JOB_NAME_MAP).map((jobName) => (
              <li key={jobName}>
                <span
                  role="button"
                  onClick={() => setSelectedJob(jobName)}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedJob(jobName)}
                  tabIndex={0}
                  className={selectedJob === jobName ? styles.active : ''}
                  data-testid={`job-filter-${jobName}`}
                >
                  {jobName}
                </span>
              </li>
            ))}
            <li>
              <span
                role="button"
                onClick={handleReset}
                onKeyDown={(e) => e.key === 'Enter' && handleReset()}
                tabIndex={0}
                data-testid="reset-icon"
              >
                <IoReload className={styles.reloadIcon} />
              </span>
            </li>
          </ul>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={'auto'}
        breakpoints={{
          // PC画面
          768: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          // スマホ画面
          0: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        }}
        navigation
        className={styles.swiper}
      >
        {filteredUsers.map((user) => (
          <SwiperSlide key={user.id}>
            <div
              className={styles.userCard}
              data-testid="user-card"
              data-username={user.username}
            >
              <Link
                href={`/users/${user.id}`}
                className={styles.userItem}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  width={180}
                  height={180}
                />
                <div>
                  <span>{user.username}</span>
                  <span>{JOB_NAME_MAP[user.job as keyof typeof JOB_NAME_MAP]}</span>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )

  return (
    <>
      <SwitchPanel
        activePanel={showPanel}
        onPanelChange={handlePanelChange}
        firstPanelLabel="TASKS"
        secondPanelLabel="USERS"
        firstPanelContent={tasksContent}
        secondPanelContent={usersContent}
      />
      {overworkedUsers.length > 0 && (
        <div
          className={styles.toaster}
          data-testid="overworked-toaster"
        >
          <span className={styles.toasterText}>業務過多のユーザー</span>
          <div className={styles.userIcons}>
            {overworkedUsers.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className={styles.userIconLink}
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className={styles.userIcon}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
