import React from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { getStepConfig } from '../../store/stepConfig'

export const StepRenderer: React.FC = () => {
  const { currentStep, formData } = useFunnelStore()
  const stepConfig = getStepConfig(currentStep)

  if (!stepConfig) {
    console.error(`No configuration found for step ${currentStep}`)
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Step {currentStep}</h2>
        <p>This step is under development.</p>
      </div>
    )
  }

  const StepComponent = stepConfig.component

  // Pass formData as props to the step component
  return <StepComponent formData={formData} />
} 