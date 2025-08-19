import React from 'react'
import { Button } from './Button'
import { StepConfig } from '../../types/funnel'

interface StepNavigationProps {
  stepConfig: StepConfig
  canGoNext: boolean
  canGoBack: boolean
  onNext: () => void
  onBack: () => void
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  stepConfig,
  canGoNext,
  canGoBack,
  onNext,
  onBack
}) => {
  const shouldShowBackButton = stepConfig.showBackButton && canGoBack
  const shouldShowContinueButton = stepConfig.showContinueButton

  // Don't render anything if no navigation is needed
  if (!shouldShowBackButton && !shouldShowContinueButton) {
    return null
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      gap: '1rem',
      marginTop: '2rem'
    }}>
      {shouldShowBackButton && (
        <Button
          onClick={onBack}
          variant="secondary"
          style={{ flex: 1 }}
        >
          Back
        </Button>
      )}
      
      {!shouldShowBackButton && shouldShowContinueButton && (
        <div style={{ flex: 1 }}></div>
      )}
      
      {shouldShowContinueButton && (
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          style={{ flex: 1 }}
        >
          Continue
        </Button>
      )}
    </div>
  )
} 