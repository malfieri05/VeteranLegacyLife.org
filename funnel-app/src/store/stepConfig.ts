import { StepConfig } from '../types/funnel'
import { StateSelection } from '../components/steps/StateSelection'
import { MilitaryStatus } from '../components/steps/MilitaryStatus'
import { BranchOfService } from '../components/steps/BranchOfService'
import { MaritalStatus } from '../components/steps/MaritalStatus'
import { CoverageAmount } from '../components/steps/CoverageAmount'
import { Birthday } from '../components/steps/Birthday'
import { ContactInfo } from '../components/steps/ContactInfo'
import { FinalSuccessModal } from '../components/steps/FinalSuccessModal'

export const STEP_CONFIGS: StepConfig[] = [
  {
    id: 1,
    name: 'State Selection',
    component: StateSelection,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: false, // First step - no back button
    showContinueButton: true,
    isRadioButtonStep: true // Enable auto-advance for state selection
  },
  {
    id: 2,
    name: 'Military Status',
    component: MilitaryStatus,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: true
  },
  {
    id: 3,
    name: 'Branch of Service',
    component: BranchOfService,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: true
  },
  {
    id: 4,
    name: 'Marital Status',
    component: MaritalStatus,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: true
  },
  {
    id: 5,
    name: 'Coverage Amount',
    component: CoverageAmount,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: true
  },
  {
    id: 6,
    name: 'Birthday',
    component: Birthday,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: true // Enable auto-advance for birthday selection
  },
  {
    id: 7,
    name: 'Contact Information',
    component: ContactInfo,
    requiresValidation: false,
    submitPartial: true,
    submitLead: true,
    showBackButton: true,
    showContinueButton: false,
    isRadioButtonStep: false,
    autoAdvance: false
  },
  {
    id: 8,
    name: 'Success',
    component: FinalSuccessModal,
    showBackButton: false,
    showContinueButton: false,
    isRadioButtonStep: false,
    hideProgressBar: true
  }
]

export const getStepConfig = (stepId: number): StepConfig | undefined => {
  return STEP_CONFIGS.find(config => config.id === stepId)
}

export const getTotalSteps = (): number => {
  return STEP_CONFIGS.length
}

export const getStepName = (stepId: number): string => {
  const config = getStepConfig(stepId)
  return config?.name || `Step ${stepId}`
}

// Helper function to get radio button steps
export const getRadioButtonSteps = (): number[] => {
  return STEP_CONFIGS.filter(config => config.isRadioButtonStep).map(config => config.id)
} 