export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return '予期せぬエラーが発生しました'
}
