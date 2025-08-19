// Funnel Types
export interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  transactionalConsent: boolean
  marketingConsent: boolean
}

export interface PreQualification {
  state: string
  militaryStatus: string
  branchOfService: string
  maritalStatus: string
  coverageAmount: string
}

export interface MedicalAnswers {
  tobaccoUse: string
  medicalConditions: string[]
  height: string
  weight: string
  hospitalCare: string
  diabetesMedication: string
  age: string
}

export interface Beneficiary {
  name: string
  relationship: string
  percentage: number
}

export interface ApplicationData {
  streetAddress: string
  city: string
  state: string
  zipCode: string
  beneficiaries: Beneficiary[]
  vaClinicName: string
  primaryDoctor: string
  ssn: string
  driversLicense: string
  licenseState: string
  bankName: string
  routingNumber: string
  accountNumber: string
}

export interface QuoteData {
  policyDate: string
  coverage: string
  premium: string
  age: string
  gender: string
  type: string
}

export interface TrackingData {
  currentStep: string
  stepName: string
}

export interface FormData {
  contactInfo: ContactInfo
  preQualification: PreQualification
  medicalAnswers: MedicalAnswers
  applicationData: ApplicationData
  quoteData: QuoteData
  trackingData: TrackingData
}

// Step Configuration Types
export interface StepConfig {
  id: number
  name: string
  component: React.ComponentType<any>
  autoAdvance?: boolean
  autoAdvanceDelay?: number
  requiresValidation?: boolean
  submitPartial?: boolean
  submitLead?: boolean
  submitLeadPartial?: boolean
  submitApplication?: boolean
  showBackButton: boolean
  showContinueButton: boolean
  isRadioButtonStep: boolean
  hideProgressBar?: boolean
}

export interface FunnelState {
  currentStep: number
  isModalOpen: boolean
  isLoading: boolean
  sessionId: string
  formData: FormData
  visitedSteps: Set<number>
}

export interface FunnelActions {
  setCurrentStep: (step: number) => void
  openModal: () => void
  closeModal: () => void
  setLoading: (loading: boolean) => void
  updateFormData: (data: Partial<FormData>) => void
  submitPartial: (currentStep: number, stepName: string) => Promise<void>
  submitLeadPartial: () => Promise<void>
  submitLead: () => Promise<void>
  submitApplication: () => Promise<void>
  reset: () => void
  goToNextStep: () => void
  goToPreviousStep: () => void
}

export type FunnelStore = FunnelState & FunnelActions 