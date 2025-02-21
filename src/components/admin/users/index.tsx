'use client'

import commonStyles from '@/app/styles/admin/common.module.css'
import { JOB_NAME_MAP } from '@/constants/maps'
import type { User } from '@/types/type'
import type { JobType } from '@/types/type'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import styles from './styles.module.css'

type Props = {
  users: User[]
  selectedUserIds: string[]
  onEditClick: (user: User) => void
  onDeleteClick: (user: User | User[]) => void
  onSelectionChange: (ids: string[] | ((prev: string[]) => string[])) => void
}

export function UserManagement({ users, selectedUserIds, onEditClick, onDeleteClick, onSelectionChange }: Props) {
  const handleSelectAll = () => {
    if (selectedUserIds.length === users.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(users.map((user) => user.id))
    }
  }

  const handleSelectUser = (userId: string) => {
    onSelectionChange((prev: string[]) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleBulkDelete = () => {
    const selectedUsersData = users.filter((user) => selectedUserIds.includes(user.id))
    onDeleteClick(selectedUsersData)
  }

  const handleSingleDelete = (user: User) => {
    onDeleteClick(user)
  }

  const isAllSelected = selectedUserIds.length === users.length

  return (
    <div className={styles.container}>
      <div className={styles.adminNav}>
        <div className={commonStyles.bulkActions}>
          {selectedUserIds.length > 0 && (
            <button
              type="button"
              onClick={handleBulkDelete}
              className={commonStyles.bulkDeleteButton}
            >
              選択したユーザーを削除
            </button>
          )}
        </div>
        <Link
          href="/admin/users/add"
          className={styles.addButton}
        >
          ＋ 新規ユーザー追加
        </Link>
      </div>

      <div className={styles.userList}>
        <div className={styles.header}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAll}
              className={commonStyles.checkbox}
            />
          </div>
          <div className={styles.headerUserName}>ユーザー名</div>
          <div className={styles.headerJob}>職種</div>
          <div className={styles.headerOccupancy}>稼働率</div>
          <div className={styles.headerActions}>&nbsp;</div>
        </div>

        {users.map((user) => (
          <div
            key={user.id}
            className={styles.userRow}
          >
            <div className={styles.checkbox}>
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleSelectUser(user.id)}
                className={commonStyles.checkbox}
              />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={40}
                  height={40}
                />
              </div>
              <span className={styles.userName}>{user.username}</span>
            </div>
            <div className={styles.jobTitle}>{JOB_NAME_MAP[user.job as JobType]}</div>
            <div className={`${styles.occupancyRate} ${user.occupancyRate >= 100 ? styles.highOccupancy : ''}`}>{user.occupancyRate}%</div>
            <div className={commonStyles.actions}>
              <button
                type="button"
                onClick={() => onEditClick(user)}
                className={commonStyles.editButton}
              >
                編集
              </button>
              <button
                type="button"
                onClick={() => handleSingleDelete(user)}
                className={commonStyles.deleteButton}
              >
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
