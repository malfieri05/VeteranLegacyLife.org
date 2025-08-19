import { StepConfig } from '../types/funnel'
import { StateSelection } from '../components/steps/StateSelection'
import { MilitaryStatus } from '../components/steps/MilitaryStatus'
import { BranchOfService } from '../components/steps/BranchOfService'
import { MaritalStatus } from '../components/steps/MaritalStatus'
import { CoverageAmount } from '../components/steps/CoverageAmount'
import { Birthday } from '../components/steps/Birthday'
import { ContactInfo } from '../components/steps/ContactInfo'
import { TobaccoUse } from '../components/steps/TobaccoUse'
import { MedicalConditions } from '../components/steps/MedicalConditions'
import { HeightWeight } from '../components/steps/HeightWeight'
import { HospitalCare } from '../components/steps/HospitalCare'
import { DiabetesMedication } from '../components/steps/DiabetesMedication'
import { LoadingScreen } from '../components/steps/LoadingScreen'
import { PreQualifiedSuccess } from '../components/steps/PreQualifiedSuccess'
import { IULQuoteModal } from '../components/steps/IULQuoteModal'
import { OptionsModal } from '../components/steps/OptionsModal'
import { ApplicationStep1 } from '../components/steps/ApplicationStep1'
import { ApplicationStep2 } from '../components/steps/ApplicationStep2'
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
    requiresValidation: true,
    submitPartial: true,
    submitLead: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: false
  },
  {
    id: 8,
    name: 'Tobacco Use',
    component: TobaccoUse,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: true
  },
  {
    id: 9,
    name: 'Medical Conditions',
    component: MedicalConditions,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: false
  },
  {
    id: 10,
    name: 'Height & Weight',
    component: HeightWeight,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: true // Enable auto-advance for height/weight selection
  },
  {
    id: 11,
    name: 'Hospital Care',
    component: HospitalCare,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: true
  },
  {
    id: 12,
    name: 'Diabetes Medication',
    component: DiabetesMedication,
    requiresValidation: true,
    submitPartial: true,
    submitLeadPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: true
  },
  {
    id: 13,
    name: 'Loading Screen',
    component: LoadingScreen,
    autoAdvance: true,
    autoAdvanceDelay: 12000, // 12 seconds
    submitPartial: false,
    showBackButton: false, // Loading screen - no navigation
    showContinueButton: false,
    isRadioButtonStep: false,
    hideProgressBar: true // Hide progress bar for loading screen
  },
  {
    id: 14,
    name: 'Pre-Qualified Success',
    component: PreQualifiedSuccess,
    autoAdvance: true,
    autoAdvanceDelay: 5000, // 5 seconds
    submitPartial: true,
    showBackButton: false, // Auto-advance step - no navigation
    showContinueButton: false,
    isRadioButtonStep: false,
    hideProgressBar: true // Hide progress bar for pre-qualified success
  },
  {
    id: 15,
    name: 'IUL Quote Modal',
    component: IULQuoteModal,
    autoAdvance: false, // Remove auto-advance - users should manually continue
    submitPartial: true,
    showBackButton: true, // Enable back button for IUL modal
    showContinueButton: true, // Enable Continue button for manual progression
    isRadioButtonStep: false,
    hideProgressBar: true // Hide progress bar for IUL modal
  },
  {
    id: 16,
    name: 'Options Modal',
    component: OptionsModal,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: false
  },
  {
    id: 17,
    name: 'Application Step 1',
    component: ApplicationStep1,
    requiresValidation: true,
    submitPartial: true,
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: false
  },
  {
    id: 18,
    name: 'Application Step 2',
    component: ApplicationStep2,
    requiresValidation: true,
    submitPartial: true, // Changed back to submitPartial - only submit application on final step
    showBackButton: true,
    showContinueButton: true,
    isRadioButtonStep: false
  },
  {
    id: 19,
    name: 'Final Success',
    component: FinalSuccessModal,
    submitApplication: true,
    showBackButton: false, // Final step - no back button
    showContinueButton: false, // Final step - no continue button
    isRadioButtonStep: false
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