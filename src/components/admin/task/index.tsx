'use client'

import commonStyles from '@/app/styles/admin/common.module.css'
import { PRIORITY_MAP, STATUS_MAP } from '@/constants/maps'
import type { Task } from '@/types/type'
import Link from 'next/link'
import { useState } from 'react'
import type { FC } from 'react'
import styles from './styles.module.css'

type Props = {
  tasks: Task[]
  selectedTaskIds: string[]
  onEditClick: (task: Task) => void
  onDeleteClick: (task: Task | Task[]) => void
  onSelectionChange: (ids: string[]) => void
}

export const TaskManagement: FC<Props> = ({ 
  tasks, 
  selectedTaskIds, 
  onEditClick, 
  onDeleteClick, 
  onSelectionChange 
}: Props) => {
  const [sortField, setSortField] = useState<'priority' | 'status' | 'startDate' | 'endDate'>('startDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = (field: typeof sortField) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (field: typeof sortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '▲' : '▼'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const getSortedTasks = () => {
    return [...tasks].sort((a, b) => {
      if (sortField === 'startDate' || sortField === 'endDate') {
        const dateA = new Date(a[sortField]).getTime()
        const dateB = new Date(b[sortField]).getTime()
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
      }
      return sortDirection === 'asc' ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField])
    })
  }

  const handleSelectAll = () => {
    if (selectedTaskIds.length === tasks.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(tasks.map((task) => task.id))
    }
  }

  const handleSelectTask = (taskId: string) => {
    onSelectionChange(
      selectedTaskIds.includes(taskId)
        ? selectedTaskIds.filter((id) => id !== taskId)
        : [...selectedTaskIds, taskId]
    )
  }

  const handleBulkDelete = () => {
    const selectedTasksData = tasks.filter((task) => selectedTaskIds.includes(task.id))
    onDeleteClick(selectedTasksData)
  }

  const isAllSelected = selectedTaskIds.length === tasks.length

  return (
    <div className={styles.container}>
      <div className={styles.adminNav}>
        <div className={commonStyles.bulkActions}>
          {selectedTaskIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className={commonStyles.bulkDeleteButton}
            >
              選択した案件を削除
            </button>
          )}
        </div>
        <Link
          href="/admin/tasks/add"
          className={styles.addButton}
        >
          ＋ 案件を追加する
        </Link>
      </div>

      <div className={styles.taskList}>
        <div className={styles.listHeader}>
          <span className={commonStyles.checkboxCell}>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className={commonStyles.checkbox}
            />
          </span>
          <span>案件名</span>
          <span
            className={styles.clickable}
            onClick={() => handleSort('priority')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSort('priority')
              }
            }}
            role="button"
            tabIndex={0}
          >
            優先度 {sortField === 'priority' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
          </span>
          <span
            className={styles.clickable}
            onClick={() => handleSort('status')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSort('status')
              }
            }}
            role="button"
            tabIndex={0}
          >
            状態 {sortField === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
          </span>
          <span
            className={styles.clickable}
            onClick={() => handleSort('startDate')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSort('startDate')
              }
            }}
            role="button"
            tabIndex={0}
          >
            開始日 {sortField === 'startDate' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
          </span>
          <span
            className={styles.clickable}
            onClick={() => handleSort('endDate')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleSort('endDate')
              }
            }}
            role="button"
            tabIndex={0}
          >
            終了日 {sortField === 'endDate' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
          </span>
          <span>&nbsp;</span>
        </div>
        <ul className={styles.list}>
          {getSortedTasks().map((task) => (
            <li
              key={task.id}
              className={styles.listItem}
            >
              <span className={commonStyles.checkboxCell}>
                <input
                  type="checkbox"
                  checked={selectedTaskIds.includes(task.id)}
                  onChange={() => handleSelectTask(task.id)}
                  className={commonStyles.checkbox}
                />
              </span>
              <span>{task.name}</span>
              <span>{PRIORITY_MAP[task.priority]}</span>
              <span>{STATUS_MAP[task.status]}</span>
              <span>{formatDate(task.startDate)}</span>
              <span>{formatDate(task.endDate)}</span>
              <div className={commonStyles.actions}>
                <button
                  type="button"
                  onClick={() => onEditClick(task)}
                  className={commonStyles.editButton}
                >
                  編集
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteClick(task)}
                  className={commonStyles.deleteButton}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
