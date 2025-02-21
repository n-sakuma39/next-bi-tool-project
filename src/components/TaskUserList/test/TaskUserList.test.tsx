import { render, screen, fireEvent, waitFor, act, within } from '@testing-library/react'
import { describe, expect, it, afterAll } from 'vitest'
import { TaskUserList } from '@/components/TaskUserList'
import { TaskProvider } from '@/contexts/TaskContext'
import { STATUS_MAP, PRIORITY_MAP } from '@/constants/maps'
import type { Task } from '@/types/type'

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'テスト案件1',
    priority: 'high',
    status: 'completed',
    startDate: '2024-04-01T00:00:00.000Z',
    endDate: '2024-04-30T00:00:00.000Z',
    description: '',
    assignments: []
  },
  {
    id: '2',
    name: 'テスト案件2',
    priority: 'low',
    status: 'waiting',
    startDate: '2024-05-01T00:00:00.000Z',
    endDate: '2024-05-31T00:00:00.000Z',
    description: '',
    assignments: []
  }
]

describe('TaskList', () => {
  const originalFetch = global.fetch

  afterAll(() => {
    global.fetch = originalFetch
  })

  const TaskListWrapper = () => (
    <TaskProvider>
      <TaskUserList initialTasks={mockTasks} initialUsers={[]} />
    </TaskProvider>
  )

  it('タスク一覧が初期示される', () => {
    render(<TaskListWrapper />)
    expect(screen.getByText('テスト案件1')).toBeInTheDocument()
    expect(screen.getByText('テスト案件2')).toBeInTheDocument()
  })

  it('優先度でソートができる', async () => {
    render(<TaskListWrapper />)
    
    const priorityHeader = screen.getByText(/優先度/)
    fireEvent.click(priorityHeader)
    
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[0].querySelector('span:nth-child(2)')).toHaveTextContent(PRIORITY_MAP.high)
      expect(taskItems[1].querySelector('span:nth-child(2)')).toHaveTextContent(PRIORITY_MAP.low)
    })

    fireEvent.click(priorityHeader)
    
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[0].querySelector('span:nth-child(2)')).toHaveTextContent(PRIORITY_MAP.low)
      expect(taskItems[1].querySelector('span:nth-child(2)')).toHaveTextContent(PRIORITY_MAP.high)
    })
  })

  it('開始日でソートができる', async () => {
    render(<TaskListWrapper />)
    
    const startDateHeader = screen.getByText(/開始日/)
    fireEvent.click(startDateHeader)
    
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[0].querySelector('span:nth-child(4)')).toHaveTextContent('2024/04/01')
      expect(taskItems[1].querySelector('span:nth-child(4)')).toHaveTextContent('2024/05/01')
    })

    fireEvent.click(startDateHeader)
    
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[0].querySelector('span:nth-child(4)')).toHaveTextContent('2024/05/01')
      expect(taskItems[1].querySelector('span:nth-child(4)')).toHaveTextContent('2024/04/01')
    })
  })

  it('終了日でソートができる', async () => {
    render(<TaskListWrapper />)
    
    const endDateHeader = screen.getByText(/終了日/)
    fireEvent.click(endDateHeader)
    
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[0].querySelector('span:nth-child(5)')).toHaveTextContent('2024/04/30')
      expect(taskItems[1].querySelector('span:nth-child(5)')).toHaveTextContent('2024/05/31')
    })

    fireEvent.click(endDateHeader)
    
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[0].querySelector('span:nth-child(5)')).toHaveTextContent('2024/05/31')
      expect(taskItems[1].querySelector('span:nth-child(5)')).toHaveTextContent('2024/04/30')
    })
  })

  it('タスク詳細へのリンクが機能する', () => {
    render(<TaskListWrapper />)
    const taskLinks = screen.getAllByRole('link')
    const taskLinkHrefs = taskLinks.map(link => link.getAttribute('href')).sort()
    expect(taskLinkHrefs[0]).toBe('/tasks/1')
    expect(taskLinkHrefs[1]).toBe('/tasks/2')
  })

  it('ステータスでソートができる', async () => {
    render(<TaskListWrapper />)
    
    const statusHeader = screen.getByText(/状態/)
    fireEvent.click(statusHeader)
    
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[1].querySelector('span:nth-child(3)')).toHaveTextContent('対応済み')
      expect(taskItems[0].querySelector('span:nth-child(3)')).toHaveTextContent('未対応')
    })

    fireEvent.click(statusHeader)
    
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[0].querySelector('span:nth-child(3)')).toHaveTextContent('対応済み')
      expect(taskItems[1].querySelector('span:nth-child(3)')).toHaveTextContent('未対応')
    })
  })

  it('エラー時のハンドリングが機能する', async () => {
    // APIエンドポイントをモック
    const originalFetch = global.fetch
    global.fetch = vi.fn(() => Promise.reject(new Error('API Error')))
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<TaskListWrapper />)
    const usersButton = screen.getByText('USERS')
    await fireEvent.click(usersButton)
    
    // エラーメッセージの確認（実際のコンポーネントのエラーメッセージに合わせる）
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching users:', expect.any(Error))
    
    // クリーンアップ
    global.fetch = originalFetch
    consoleSpy.mockRestore()
  })

  it('handlePanelChangeがユーザーパネルを正しく切り替える', async () => {
    render(<TaskListWrapper />)
    const usersButton = screen.getByText('USERS')
    
    // USERSパネルに切り替え
    await fireEvent.click(usersButton)
    expect(screen.getByTestId('userBox')).toHaveStyle({ display: 'block' })
    expect(screen.getByTestId('taskBox')).toHaveStyle({ display: 'none' })
    
    // TASKSパネルに戻す
    const tasksButton = screen.getByText('TASKS')
    await fireEvent.click(tasksButton)
    expect(screen.getByTestId('userBox')).toHaveStyle({ display: 'none' })
    expect(screen.getByTestId('taskBox')).toHaveStyle({ display: 'block' })
  })

  it('ソートアイコンが正しく表示される', () => {
    render(<TaskListWrapper />)
    
    // 開始日でソート（デフォルトでは降順）
    const startDateHeader = screen.getByText(/開始日/)
    expect(startDateHeader).toHaveTextContent('▼')
    
    // 優先度ヘッダーにはアイコンがない
    const priorityHeader = screen.getByRole('button', { name: /優先度/ })
    expect(priorityHeader).not.toHaveTextContent('▼')
    expect(priorityHeader).not.toHaveTextContent('▲')
  })

  it('リセット機能が正しく動作する', async () => {
    render(<TaskListWrapper />)
    const usersButton = screen.getByText('USERS')
    await fireEvent.click(usersButton)
    
    // リセットアイコンをクリック
    const resetIcon = screen.getByTestId('reset-icon')
    fireEvent.click(resetIcon)
    
    // パネルの表示状態を確認
    expect(screen.getByTestId('userBox')).toHaveStyle({ display: 'block' })
    expect(screen.getByTestId('taskBox')).toHaveStyle({ display: 'none' })
  })

  it('業務過多のユーザーが検出される', async () => {
    const overworkedUser = {
      id: '3',
      username: 'テストユーザー3',
      totalOccupancyRate: 120,
      job: 'frontend',
      avatar: 'test.jpg'
    }
    
    render(
      <TaskProvider>
        <TaskUserList 
          initialTasks={mockTasks} 
          initialUsers={[overworkedUser]} 
        />
      </TaskProvider>
    )
    
    const usersButton = screen.getByText('USERS')
    await fireEvent.click(usersButton)
    
    // 業務過多のユーザーが表示されることを確認
    expect(screen.getByTestId('overworked-toaster')).toBeInTheDocument()
  })

  it('日付フォーマトが正しく機能する', () => {
    render(<TaskListWrapper />)
    const taskItems = screen.getAllByRole('listitem').slice(1)
    
    // 開始日のフォーマット確認（デフォルトで降順）
    expect(taskItems[0].querySelector('span:nth-child(4)')).toHaveTextContent('2024/05/01')
    expect(taskItems[1].querySelector('span:nth-child(4)')).toHaveTextContent('2024/04/01')
    
    // 終了日のフォーマット確認
    expect(taskItems[0].querySelector('span:nth-child(5)')).toHaveTextContent('2024/05/31')
    expect(taskItems[1].querySelector('span:nth-child(5)')).toHaveTextContent('2024/04/30')
  })

  it('職種フィルターが正しく機能する', async () => {
    const mockUsers = [
      {
        id: '1',
        username: 'フロントエンド太郎',
        job: 'frontend',
        totalOccupancyRate: 80,
        avatar: 'test1.jpg',
        description: 'フロントエンド開発'
      },
      {
        id: '2',
        username: 'バックエンド次��',
        job: 'backend',
        totalOccupancyRate: 70,
        avatar: 'test2.jpg',
        description: 'バックエンド開発'
      }
    ]

    render(
      <TaskProvider>
        <TaskUserList initialTasks={[]} initialUsers={mockUsers} />
      </TaskProvider>
    )

    // USERSパネルに切り替え
    const usersButton = screen.getByText('USERS')
    fireEvent.click(usersButton)

    // パネル切り替えの完了を待つ
    await waitFor(() => {
      expect(screen.getByTestId('userBox')).toHaveStyle({ display: 'block' })
    })

    // フロントエンドでフィルター
    const frontendFilter = screen.getByTestId('job-filter-フロントエンドエンジニア')
    fireEvent.click(frontendFilter)

    // フィルター結果の確認（修正版）
    await waitFor(() => {
      const userCards = screen.getAllByTestId('user-card')
      
      // フロントエンドユーザーのカードが存在することを確認
      const hasFrontendUser = userCards.some(card => 
        card.getAttribute('data-username') === 'フロントエンド太郎'
      )
      expect(hasFrontendUser).toBe(true)
      
      // バックエンドユーザーのカードが存在しないことを確認
      const hasBackendUser = userCards.some(card => 
        card.getAttribute('data-username') === 'バックエンド次郎'
      )
      expect(hasBackendUser).toBe(false)
    }, { timeout: 5000 })
  })

  it('ソート機能が正しく動作する', async () => {
    render(<TaskListWrapper />)
    
    // 優先度でソート
    const priorityHeader = screen.getByText(/優先度/)
    fireEvent.click(priorityHeader)
    
    // ソート後の状態を確認
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[0].querySelector('span:nth-child(2)')).toHaveTextContent(PRIORITY_MAP.high)
      expect(taskItems[1].querySelector('span:nth-child(2)')).toHaveTextContent(PRIORITY_MAP.low)
    })
    
    // 再度クリックで逆順ソート
    fireEvent.click(priorityHeader)
    
    await waitFor(() => {
      const taskItems = screen.getAllByRole('listitem').slice(1)
      expect(taskItems[0].querySelector('span:nth-child(2)')).toHaveTextContent(PRIORITY_MAP.low)
      expect(taskItems[1].querySelector('span:nth-child(2)')).toHaveTextContent(PRIORITY_MAP.high)
    })
  })

  it('エラー処理が正しく機能する', async () => {
    // APIエンドポイントをモック
    const originalFetch = global.fetch
    global.fetch = vi.fn(() => Promise.reject(new Error('API Error')))
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(<TaskListWrapper />)
    const usersButton = screen.getByText('USERS')
    await fireEvent.click(usersButton)
    
    // エラーメッセージの確認（実際のコンポーネントのエラーメッセージに合わせる）
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching users:', expect.any(Error))
    
    // クリーンアップ
    global.fetch = originalFetch
    consoleSpy.mockRestore()
  })

  it('コンポーネントのクリーンアップが正しく機能する', () => {
    const { unmount } = render(<TaskListWrapper />)
    unmount()
    // クリーンアップ後の状態を確認するアサーションを追加
  })

  // useEffectやイベントハンドラーのテストを追加
  it('useEffectが正しく機能する', async () => {
    render(<TaskListWrapper />)
    
    // パネル切り替えの確認
    const usersButton = screen.getByText('USERS')
    await fireEvent.click(usersButton)
    
    // ユーザーデータのフェッチが行われることを確認
    await waitFor(() => {
      expect(screen.getByTestId('userBox')).toBeInTheDocument()
    })
  })
})
