import commonStyles from '@/app/styles/admin/common.module.css'
import Button from '@/components/elements/button'
import { JOB_NAME_MAP, PRIORITY_MAP, STATUS_MAP } from '@/constants/maps'
import type { JobType, PriorityType, StatusType, Task, User, UserFormData } from '@/types/type'
import type { ChangeEvent } from 'react'
import styles from './modal.module.css'

type BaseModalProps = {
  isOpen: boolean
  onClose: () => void
}

type FormModalProps = BaseModalProps & {
  type: 'form'
  formType: 'edit' | 'create'
} & (
    | {
        isTaskForm: true
        formData: TaskFormData
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
        onSubmit: (e: React.FormEvent) => Promise<void>
        error?: string
      }
    | {
        isTaskForm: false
        formData: UserFormData
        onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
        onSubmit: (e: React.FormEvent) => Promise<void>
        error?: string
      }
  )

type DeleteModalProps = BaseModalProps & {
  type: 'delete'
  username?: string | string[]
  taskNames?: string[]
  onDelete: () => void
  isTaskDelete?: boolean
}

type SuccessModalProps = BaseModalProps & {
  type: 'success'
  message: string
}

type TaskFormData = {
  taskName: string
  priority: PriorityType
  status: StatusType
  startDate: string
  endDate: string
}

// 型ガード関数を追加
function isTaskFormData(formData: UserFormData | TaskFormData): formData is TaskFormData {
  return 'taskName' in formData
}

function isUserFormData(formData: UserFormData | TaskFormData): formData is UserFormData {
  return 'username' in formData
}

// 部署の定義を追加
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

type ModalProps = {
  type: 'delete' | 'form' | 'success'
  formType?: 'create' | 'edit'
  isOpen: boolean
  onClose: () => void
  username?: string | string[]
  taskNames?: string[]
  onDelete?: () => void
  message?: string
  formData?: UserFormData | TaskFormData
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onSubmit?: (e: React.FormEvent) => Promise<void>
  error?: string
  isTaskForm?: boolean
  isTaskDelete?: boolean
  selectedTasks?: Task[]
  selectedUsers?: User[]
}

export const Modal = ({
  type,
  formType,
  isOpen,
  onClose,
  username,
  taskNames,
  onDelete,
  message,
  formData,
  onChange,
  onSubmit,
  error,
  isTaskForm,
  isTaskDelete,
  selectedTasks,
  selectedUsers,
}: ModalProps) => {
  if (!isOpen) return null

  const renderContent = () => {
    switch (type) {
      case 'delete': {
        if (isTaskDelete) {
          return (
            <div className={styles.modalContent}>
              {selectedTasks && selectedTasks.length > 0 ? (
                <>
                  <p className={styles.deleteMessage}>この選択した案件を削除してもよろしいですか？</p>
                  {selectedTasks.map((task) => (
                    <p key={`task-${task.id}`} className={styles.deleteItem}>「{task.name}」</p>
                  ))}
                </>
              ) : (
                <p className={styles.deleteMessage}>この案件「{taskNames}」を削除してもよろしいですか？</p>
              )}
              <div className={styles.buttonContainer}>
                <button
                  type="button"
                  onClick={onDelete}
                  className={styles.deleteButton}
                >
                  削除
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.cancelButton}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )
        }

        return (
          <div className={styles.modalContent}>
            {selectedUsers && selectedUsers.length > 0 ? (
              <>
                <p className={styles.deleteMessage}>この選択したユーザーを削除してもよろしいですか？</p>
                {selectedUsers.map((user) => (
                  <p key={`user-${user.id}`} className={styles.deleteItem}>「{user.username}」</p>
                ))}
              </>
            ) : (
              <p className={styles.deleteMessage}>このユーザー「{username}」を削除してもよろしいですか？</p>
            )}
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={onDelete}
                className={styles.deleteButton}
              >
                削除
              </button>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                キャンセル
              </button>
            </div>
          </div>
        )
      }

      case 'success': {
        return <p>{message}</p>
      }

      case 'form': {
        if (isTaskForm) {
          const taskFormData = formData as TaskFormData
          return (
            <div className={`${styles.modalContent} ${commonStyles.formSection}`}>
              <h2 className={commonStyles.formTitle}>{formType === 'create' ? '案件追加' : '案件編集'}</h2>
              {error && <p className={commonStyles.formError}>{error}</p>}
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (onSubmit) {
                    await onSubmit(e)
                    onClose()
                  }
                }}
                className={commonStyles.formSection}
              >
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.formLabel}>案件名</label>
                  <input
                    type="text"
                    name="taskName"
                    value={taskFormData.taskName}
                    onChange={onChange}
                    className={commonStyles.formInput}
                    required
                  />
                </div>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.formLabel}>優先度</label>
                  <select
                    name="priority"
                    value={taskFormData.priority}
                    onChange={onChange}
                    className={commonStyles.formInput}
                    required
                  >
                    <option value="">優先度を選択</option>
                    {(Object.entries(PRIORITY_MAP) as [PriorityType, string][]).map(([key, value]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.formLabel}>状態</label>
                  <select
                    name="status"
                    value={taskFormData.status}
                    onChange={onChange}
                    className={commonStyles.formInput}
                    required
                  >
                    <option value="">状態を選択</option>
                    {(Object.entries(STATUS_MAP) as [StatusType, string][]).map(([key, value]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.formLabel}>開始日</label>
                  <input
                    type="date"
                    name="startDate"
                    value={taskFormData.startDate}
                    onChange={onChange}
                    className={commonStyles.formInput}
                    required
                  />
                </div>
                <div className={commonStyles.formGroup}>
                  <label className={commonStyles.formLabel}>期限日</label>
                  <input
                    type="date"
                    name="endDate"
                    value={taskFormData.endDate}
                    onChange={onChange}
                    className={commonStyles.formInput}
                    required
                  />
                </div>
                <div className={styles.buttonContainer}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                  >
                    {formType === 'create' ? '作成' : '更新'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className={styles.cancelButton}
                  >
                    キャンセル
                  </button>
                </div>
              </form>
            </div>
          )
        }

        const userFormData = formData as UserFormData
        return (
          <div className={`${styles.modalContent} ${commonStyles.formSection}`}>
            <h2 className={commonStyles.formTitle}>{formType === 'create' ? 'ユーザー追加' : 'ユーザー編集'}</h2>
            {error && <p className={commonStyles.formError}>{error}</p>}
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (onSubmit) {
                  await onSubmit(e)
                  onClose()
                }
              }}
              className={commonStyles.formSection}
            >
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.formLabel}>ユーザー名</label>
                <input
                  type="text"
                  name="username"
                  value={userFormData.username}
                  onChange={onChange}
                  className={commonStyles.formInput}
                  required
                />
              </div>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.formLabel}>職種</label>
                <select
                  name="job"
                  value={userFormData.job}
                  onChange={onChange}
                  className={commonStyles.formInput}
                  required
                >
                  <option value="">職種を選択</option>
                  {Object.entries(JOB_NAME_MAP).map(([key, value]) => (
                    <option
                      key={key}
                      value={key}
                    >
                      {value}
                    </option>
                  ))}
                </select>
              </div>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.formLabel}>入社日</label>
                <input
                  type="date"
                  name="employmentDate"
                  value={userFormData.employmentDate}
                  onChange={onChange}
                  className={commonStyles.formInput}
                />
              </div>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.formLabel}>部署</label>
                <select
                  name="department"
                  value={userFormData.department}
                  onChange={onChange}
                  className={commonStyles.formInput}
                >
                  <option value="">部署を選択</option>
                  {DEPARTMENTS.map((dept) => (
                    <option
                      key={dept}
                      value={dept}
                    >
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.formLabel}>社員番号</label>
                <input
                  type="text"
                  name="employeeId"
                  value={userFormData.employeeId}
                  onChange={onChange}
                  className={commonStyles.formInput}
                />
              </div>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.formLabel}>メールアドレス</label>
                <input
                  type="email"
                  name="email"
                  value={userFormData.email}
                  onChange={onChange}
                  className={commonStyles.formInput}
                />
              </div>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.formLabel}>スキルセット</label>
                <input
                  type="text"
                  name="skills"
                  value={userFormData.skills.join(', ')}
                  onChange={onChange}
                  className={commonStyles.formInput}
                  placeholder="カンマ区切りで入力"
                />
              </div>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.formLabel}>プロジェクト履歴</label>
                <textarea
                  name="projectHistory"
                  value={userFormData.projectHistory}
                  onChange={onChange}
                  className={commonStyles.formTextarea}
                  rows={5}
                />
              </div>
              <div className={commonStyles.formGroup}>
                <label className={commonStyles.formLabel}>保有資格</label>
                <input
                  type="text"
                  name="certifications"
                  value={userFormData.certifications.join(', ')}
                  onChange={onChange}
                  className={commonStyles.formInput}
                  placeholder="カンマ区切りで入力"
                />
              </div>
              <div className={styles.buttonContainer}>
                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  {formType === 'create' ? '作成' : '更新'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.cancelButton}
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )
      }
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
      }}
      tabIndex={0}
      role="button"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className={styles.content}>{renderContent()}</div>
      </div>
    </div>
  )
}
