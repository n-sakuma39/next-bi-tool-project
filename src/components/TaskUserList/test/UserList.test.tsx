import { TaskUserList } from '@/components/TaskUserList'
import { TaskProvider } from '@/contexts/TaskContext'
import type { User } from '@/types/type'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { JOB_NAME_MAP } from '@/constants/maps'

const mockUsers: User[] = [
  {
    id: '1',
    username: 'テストユーザー1',
    avatar: 'https://example.com/avatar1.jpg',
    job: 'frontend',
    totalOccupancyRate: 90,
    description: '',
  },
  {
    id: '2',
    username: 'テストユーザー2',
    avatar: 'https://example.com/avatar2.jpg',
    job: 'backend',
    totalOccupancyRate: 120,
    description: '',
  }
]

describe('UserList', () => {
  const UserListWrapper = () => (
    <TaskProvider>
      <TaskUserList initialTasks={[]} initialUsers={mockUsers} />
    </TaskProvider>
  )

  it('ユネル切り替えが機能する', () => {
    render(<UserListWrapper />)
    const usersButton = screen.getByText('USERS')
    const tasksButton = screen.getByText('TASKS')
    
    // 初期状態ではタスクパネルが表示
    expect(screen.getByTestId('taskBox')).toBeVisible()
    expect(screen.getByTestId('userBox')).not.toBeVisible()
    
    // USERSボタンをクリック
    fireEvent.click(usersButton)
    expect(screen.getByTestId('taskBox')).not.toBeVisible()
    expect(screen.getByTestId('userBox')).toBeVisible()
    
    // TASKSボタンをクリック
    fireEvent.click(tasksButton)
    expect(screen.getByTestId('taskBox')).toBeVisible()
    expect(screen.getByTestId('userBox')).not.toBeVisible()
  })

  it('職種フィルターが機能する', async () => {
    render(<UserListWrapper />)
    const usersButton = screen.getByText('USERS')
    fireEvent.click(usersButton)

    // フィルターを特定（日本語の職種名を使用）
    const frontendFilter = screen.getByTestId('job-filter-フロントエンドエンジニア')
    fireEvent.click(frontendFilter)

    // フィルター後の表示確認
    expect(screen.getByText('テストユーザー1')).toBeInTheDocument()
    expect(screen.queryByText('テストユーザー2')).not.toBeInTheDocument()
  })

  it('日付フォーマットが正しく機能する', () => {
    render(<UserListWrapper />)
    const date = new Date('2024-04-01T00:00:00.000Z')
    const formattedDate = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    expect(formattedDate).toBe('2024/04/01')
  })
it('業務過多のユーザーが正しく検出される', () => {
    render(<UserListWrapper />)
    const usersButton = screen.getByText('USERS')
    fireEvent.click(usersButton)
    
    const overworkedToaster = screen.getByTestId('overworked-toaster')
    expect(overworkedToaster).toBeInTheDocument()
    
    // img要素のalt属性でユーザー名を確認
    const overworkedUserImage = within(overworkedToaster).getByAltText('テストユーザー2')
    expect(overworkedUserImage).toBeInTheDocument()
  })

  it('リセットボタンが機能する', async () => {
    render(<UserListWrapper />)
    const usersButton = screen.getByText('USERS')
    fireEvent.click(usersButton)

    // フィルターを適用（日本語の職種名を使用）
    const frontendFilter = screen.getByTestId('job-filter-フロントエンドエンジニア')
    fireEvent.click(frontendFilter)
    
    // この時点でテストユーザー2は非表示になっているはず
    expect(screen.queryByText('テストユーザー2')).not.toBeInTheDocument()
    
    // リセットボタンをクリック
    const resetButton = screen.getByTestId('reset-icon')
    fireEvent.click(resetButton)
    
    // すべてのユーザーが表示されることを確認
    expect(screen.getByText('テストユーザー1')).toBeInTheDocument()
    expect(screen.getByText('テストユーザー2')).toBeInTheDocument()
  })
})
