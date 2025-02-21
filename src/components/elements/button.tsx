import '@/app/common.css'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
function Button() {
  const router = useRouter()

  return (
    <div className="buttonContainer">
      <button
        type="button"
        onClick={() => router.push('/')}
        className="backButton"
      >
        トップへ戻る
      </button>
    </div>
  )
}

export default Button
