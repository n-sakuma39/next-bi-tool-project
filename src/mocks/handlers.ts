/**
 * imports
 */
import { mockTaskRepositoryHandlers } from '@/mocks/dummies/task'
import { mockUserRepositoryHandlers } from '@/mocks/dummies/user'

export const handlers = [...mockTaskRepositoryHandlers, ...mockUserRepositoryHandlers]
