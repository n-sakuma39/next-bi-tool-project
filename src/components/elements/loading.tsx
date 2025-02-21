import '@/app/common.css'

export function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <span className="loading-text">Loading...</span>
    </div>
  )
}

export default Loading
