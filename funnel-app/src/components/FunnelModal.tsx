import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFunnelStore } from '../store/funnelStore'
import { StepRenderer } from './funnel/StepRenderer'
import { StepNavigation } from './shared/StepNavigation'
import { ModalHeader } from './shared/ModalHeader'
import { ExitModal } from './shared/ExitModal'
import { getStepConfig, getTotalSteps } from '../store/stepConfig'
import { validateContactInfo } from '../utils/validation'

export const FunnelModal: React.FC = () => {
  const { 
    isModalOpen, 
    closeModal, 
    currentStep, 
    goToNextStep, 
    goToPreviousStep,
    formData,
    isExitModalOpen,
    showExitModal,
    hideExitModal
  } = useFunnelStore()

  const currentStepConfig = getStepConfig(currentStep)
  const totalSteps = getTotalSteps()

  // Handle exit attempts
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isModalOpen && currentStep > 1) {
        e.preventDefault()
        e.returnValue = ''
        showExitModal()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen && currentStep > 1) {
        e.preventDefault()
        showExitModal()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen, currentStep, showExitModal])

  // Validation logic for each step
  const canGoNext = () => {
    if (!currentStepConfig) return false
    
    // Auto-advance steps don't need manual validation
    if (currentStepConfig.autoAdvance) return false
    
    // Check if step requires validation
    if (currentStepConfig.requiresValidation) {
      switch (currentStep) {
        case 1:
          return !!formData.preQualification?.state
        case 2:
          return !!formData.preQualification?.militaryStatus
        case 3:
          return !!formData.preQualification?.branchOfService
        case 4:
          return !!formData.preQualification?.maritalStatus
        case 5:
          return !!formData.preQualification?.coverageAmount
        case 6:
          return !!formData.contactInfo?.dateOfBirth
        case 7:
          const validation = validateContactInfo(formData.contactInfo)
          return validation.isValid
        case 8:
          return !!formData.medicalAnswers?.tobaccoUse
        case 9:
          return formData.medicalAnswers?.medicalConditions && formData.medicalAnswers.medicalConditions.length > 0
        case 10:
          return !!formData.medicalAnswers?.height && !!formData.medicalAnswers?.weight
        case 11:
          return !!formData.medicalAnswers?.hospitalCare
        case 12:
          return !!formData.medicalAnswers?.diabetesMedication
        case 16:
          return isOptionsModalComplete()
        case 17:
          return isApplicationStep1Complete()
        case 18:
          return isApplicationStep2Complete()
        default:
          return true
      }
    }
    
    return true
  }

  const handleNext = () => {
    if (canGoNext()) {
      // Mark this as manual navigation just for this transition
      // so radio-button auto-advance in the next step is not blocked
      try {
        // setManualNavigation exists in the store; import via destructuring when available
        // @ts-ignore - tolerate if not present in type until types are updated
        useFunnelStore.getState().setManualNavigation?.(true)
      } catch {}

      goToNextStep()

      // Reset the flag shortly after the transition
      setTimeout(() => {
        try {
          // @ts-ignore
          useFunnelStore.getState().setManualNavigation?.(false)
        } catch {}
      }, 300)
    }
  }

  const handleBack = () => {
    goToPreviousStep()
  }

  const handleCloseModal = () => {
    if (currentStep > 1 && currentStep !== 19) { // Don't show exit modal on final step
      showExitModal()
    } else {
      closeModal()
    }
  }

  const handleContinueApplication = () => {
    hideExitModal()
  }

  const isOptionsModalComplete = () => {
    // Add validation logic for OptionsModal if needed
    return true
  }

  const isApplicationStep1Complete = () => {
    const beneficiaries = formData.applicationData?.beneficiaries || []
    
    // Check if at least one beneficiary is complete
    const hasValidBeneficiary = beneficiaries.length > 0 && 
      beneficiaries.some(beneficiary => 
        beneficiary.name && beneficiary.relationship
      )
    
    return hasValidBeneficiary
  }

  const isApplicationStep2Complete = () => {
    const appData = formData.applicationData
    return !!(
      appData?.streetAddress &&
      appData?.city &&
      appData?.state &&
      appData?.zipCode &&
      appData?.ssn &&
      appData?.driversLicense &&
      appData?.licenseState
    )
  }

  const canGoBack = () => {
    return currentStep > 1
  }

  if (!isModalOpen || !currentStepConfig) return null

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '92vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Shared Header Component */}
            <ModalHeader
              currentStep={currentStep}
              totalSteps={totalSteps}
              onClose={handleCloseModal}
              hideProgressBar={currentStepConfig.hideProgressBar}
            />

            {/* Step Content */}
            <div style={{ marginBottom: '1.5rem' }}>
              <StepRenderer />
            </div>

            {/* Navigation Buttons */}
            <StepNavigation
              stepConfig={currentStepConfig}
              canGoNext={canGoNext()}
              canGoBack={canGoBack()}
              onNext={handleNext}
              onBack={handleBack}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Exit Modal */}
      <ExitModal
        isOpen={isExitModalOpen}
        onClose={closeModal}
        onContinue={handleContinueApplication}
      />
    </>
  )
} 