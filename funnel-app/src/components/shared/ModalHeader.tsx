import React from 'react'
import { ProgressBar } from './ProgressBar'

interface ModalHeaderProps {
  currentStep: number
  totalSteps: number
  onClose: () => void
  hideProgressBar?: boolean
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  currentStep,
  totalSteps,
  onClose,
  hideProgressBar = false
}) => {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Top row: Close button right-aligned */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: '0.5rem'
      }}>
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '0.25rem',
            lineHeight: 1,
            width: '2rem',
            height: '2rem',
            borderRadius: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          ×
        </button>
      </div>

      {/* Progress bar on its own row - conditionally rendered */}
      {!hideProgressBar && (
        <div>
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      )}
    </div>
  )
} 