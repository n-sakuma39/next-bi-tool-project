'use client'

import Link from 'next/link'
import { PRIORITY_MAP, STATUS_MAP } from '@/constants/maps'
import type { TaskListProps } from '@/types/type'
import styles from './styles.module.css'
import { formatDate } from '@/utils/date'

export function TaskList({ tasks, onSort, sortField, sortDirection }: TaskListProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '▲' : '▼'
  }

  return (
    <ul className={styles.list}>
      <li className={styles.listHeader}>
        <span>案件名</span>
        <span
          onClick={() => onSort('priority')}
          onKeyDown={(e) => e.key === 'Enter' && onSort('priority')}
          className={styles.clickable}
          role="button"
          tabIndex={0}
        >
          優先度 {getSortIcon('priority')}
        </span>
        <span
          onClick={() => onSort('status')}
          onKeyDown={(e) => e.key === 'Enter' && onSort('status')}
          className={styles.clickable}
          role="button"
          tabIndex={0}
        >
          状態 {getSortIcon('status')}
        </span>
        <span
          onClick={() => onSort('startDate')}
          onKeyDown={(e) => e.key === 'Enter' && onSort('startDate')}
          className={styles.clickable}
          role="button"
          tabIndex={0}
        >
          開始日 {getSortIcon('startDate')}
        </span>
        <span
          onClick={() => onSort('endDate')}
          onKeyDown={(e) => e.key === 'Enter' && onSort('endDate')}
          className={styles.clickable}
          role="button"
          tabIndex={0}
        >
          終了日 {getSortIcon('endDate')}
        </span>
      </li>
      {tasks.map((task) => (
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
  )
}
