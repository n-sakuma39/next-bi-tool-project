// 表示用の定数マップ
export const JOB_NAME_MAP = {
  director: 'ディレクター',
  designer: 'デザイナー',
  frontend: 'フロントエンドエンジニア',
  backend: 'バックエンドエンジニア',
} as const

export const PRIORITY_MAP = {
  low: '低',
  middle: '中',
  high: '高',
} as const

export const STATUS_MAP = {
  waiting: '未対応',
  processing: '対応中',
  completed: '対応済み',
  done: '完了',
} as const

// ソート用の順序定数
export const PRIORITY_ORDER = {
  high: 1, // 高
  middle: 2, // 中
  low: 3, // 低
} as const

export const STATUS_ORDER = {
  waiting: 1, // 未対応
  processing: 2, // 対応中
  completed: 3, // 対応済み
  done: 4, // 完了
} as const
