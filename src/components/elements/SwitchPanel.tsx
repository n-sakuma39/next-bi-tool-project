import type { ReactNode } from 'react'
import '@/app/common.css'

type SwitchPanelProps = {
  activePanel: boolean
  onPanelChange: (isSecondPanel: boolean) => void
  firstPanelLabel: string
  secondPanelLabel: string
  firstPanelContent: ReactNode
  secondPanelContent: ReactNode
}

export function SwitchPanel({
  activePanel,
  onPanelChange,
  firstPanelLabel,
  secondPanelLabel,
  firstPanelContent,
  secondPanelContent
}: SwitchPanelProps) {
  return (
    <>
      <div className="switchBox">
        <button
          type="button"
          className={`button ${!activePanel ? 'activeButton' : ''}`}
          onClick={() => onPanelChange(false)}
        >
          {firstPanelLabel}
        </button>
        <button
          type="button"
          className={`button ${activePanel ? 'activeButton' : ''}`}
          onClick={() => onPanelChange(true)}
        >
          {secondPanelLabel}
        </button>
      </div>

      <div style={{ display: activePanel ? 'none' : 'block' }}>
        {firstPanelContent}
      </div>

      <div style={{ display: activePanel ? 'block' : 'none' }}>
        {secondPanelContent}
      </div>
    </>
  )
}
