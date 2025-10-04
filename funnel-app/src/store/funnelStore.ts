import { create } from 'zustand'
import { getApiUrl } from '../config/globalConfig'
import { 
  FormData
} from '../types/funnel'
import { getStepConfig, getStepName, getRadioButtonSteps } from './stepConfig'

const initialState: FormData = {
  contactInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    transactionalConsent: false,
    marketingConsent: false
  },
  preQualification: {
    state: '',
    militaryStatus: '',
    branchOfService: '',
    maritalStatus: '',
    coverageAmount: ''
  },
  medicalAnswers: {
    tobaccoUse: '',
    medicalConditions: [],
    height: '',
    weight: '',
    hospitalCare: '',
    diabetesMedication: '',
    age: ''
  },
  applicationData: {
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    beneficiaries: [{ name: '', relationship: '', percentage: 100 }],
    vaClinicName: '',
    primaryDoctor: '',
    ssn: '',
    driversLicense: '',
    licenseState: '',
    bankName: '',
    routingNumber: '',
    accountNumber: ''
  },
  quoteData: {
    policyDate: '',
    coverage: '',
    premium: '',
    age: '',
    gender: '',
    type: ''
  },
  trackingData: {
    currentStep: '',
    stepName: ''
  }
}

const generateSessionId = () => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export interface FunnelState {
  currentStep: number
  isModalOpen: boolean
  isLoading: boolean
  sessionId: string
  formData: FormData
  visitedSteps: Set<number>
  isExitModalOpen: boolean // New property for exit modal
  isManualNavigation: boolean // Flag to prevent auto-advance during manual navigation
  autoAdvanceEnabled: boolean // Flag to control auto-advance functionality
}

export interface FunnelActions {
  setCurrentStep: (step: number) => void
  openModal: () => void
  closeModal: () => void
  setLoading: (loading: boolean) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  updateFormData: (data: Partial<FormData>) => void
  submitPartial: (step: number, stepName: string) => void
  submitLead: () => void
  submitApplication: () => void
  resetFunnel: () => void
  showExitModal: () => void // New action
  hideExitModal: () => void // New action
  setManualNavigation: (isManual: boolean) => void // New action to control manual navigation flag
  setAutoAdvanceEnabled: (enabled: boolean) => void // New action to control auto-advance
}

export type FunnelStore = FunnelState & FunnelActions

export const useFunnelStore = create<FunnelStore>((set, get) => ({
  currentStep: 1,
  isModalOpen: false,
  isLoading: false,
  sessionId: '',
  formData: initialState,
  visitedSteps: new Set<number>(), // Track which steps have been visited
  isExitModalOpen: false, // Initialize new state
  isManualNavigation: false, // Initialize manual navigation flag
  autoAdvanceEnabled: true, // Initialize auto-advance as enabled

  setCurrentStep: (step) => set({ currentStep: step }),
  
  openModal: () => {
    const newSessionId = generateSessionId();
    console.log('🎯 OPENING MODAL - Generated new session ID:', newSessionId);
    set({ 
      isModalOpen: true,
      sessionId: newSessionId,
      isExitModalOpen: false // reset exit modal on open
    });
  },
  
  closeModal: () => set({ isModalOpen: false, isExitModalOpen: false }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  updateFormData: (data) => {
    const { currentStep, visitedSteps, formData, isManualNavigation } = get()
    const radioButtonSteps = getRadioButtonSteps()
    
    // Check if this is a radio button step
    if (radioButtonSteps.includes(currentStep)) {
      const hasVisited = visitedSteps.has(currentStep)
      
      // Determine if this is a new answer or a change
      let isNewAnswer = false
      let isAnswerChange = false
      let isReclickOfCurrentAnswer = false
      
      if (!hasVisited) {
        // First time visiting this step
        isNewAnswer = true
      } else {
        // Check if the answer has changed
        const currentValue = getCurrentStepValue(currentStep, formData)
        const newValue = getCurrentStepValue(currentStep, { ...formData, ...data })
        if (currentValue !== newValue && newValue !== '') {
          isAnswerChange = true
        } else if (currentValue === newValue && newValue !== '') {
          // User clicked the same option again (explicit reconfirmation)
          isReclickOfCurrentAnswer = true
        }
      }
      
      // If the user navigated back, keep auto-advance disabled until they
      // either pick a new answer OR re-click their current answer.
      const unlockAutoAdvance = isManualNavigation && (isNewAnswer || isAnswerChange || isReclickOfCurrentAnswer)

      // Compute whether we should auto-advance for this change
      const shouldAutoAdvance = (isNewAnswer || isAnswerChange || isReclickOfCurrentAnswer) && (!isManualNavigation || unlockAutoAdvance)

      if (unlockAutoAdvance) {
        // Clear the manual navigation guard now that the user explicitly chose
        // an option on this step.
        set({ isManualNavigation: false })
      }

      if (shouldAutoAdvance) {
        const stepConfig = getStepConfig(currentStep)
        if (stepConfig?.requiresValidation) {
          // Check if the step is now valid
          const isValid = checkStepValidation(currentStep, { ...formData, ...data })
          if (isValid) {
            // Auto-advance after a short delay
            setTimeout(() => {
              const reason = isNewAnswer ? 'new answer' : (isAnswerChange ? 'answer change' : 're-click of current answer')
              console.log(`🎯 Auto-advancing from radio button step ${currentStep} (${reason})`)
              get().goToNextStep()
            }, 500) // 500ms delay for better UX
          }
        }
      }
      
      // Update the form data and mark as visited AFTER auto-advance check
      set((state) => ({
        formData: { ...state.formData, ...data },
        visitedSteps: new Set([...visitedSteps, currentStep])
      }))
    } else {
      // For non-radio button steps, just update the data normally
      set((state) => ({
        formData: { ...state.formData, ...data },
        visitedSteps: new Set([...visitedSteps, currentStep])
      }))
    }
  },

  submitPartial: async (currentStep: number, stepName: string) => {
    const { formData, sessionId } = get()
    
    console.log(`🎯 SUBMIT PARTIAL - Step ${currentStep} (${stepName}) - Session ID: ${sessionId}`)
    
    // Check if session ID is empty and regenerate if needed
    if (!sessionId) {
      console.log('⚠️ WARNING: Session ID is empty! Regenerating...');
      const newSessionId = generateSessionId();
      set({ sessionId: newSessionId });
      console.log('🎯 Generated new session ID:', newSessionId);
    }
    
    // Format data to match the nice test data format
    const formatCurrency = (amount: string | number) => {
      if (!amount) return ''
      const num = typeof amount === 'string' ? parseFloat(amount.replace(/[$,]/g, '')) : amount
      return `$${num.toLocaleString()}`
    }
    
    const formatDate = (date: string) => {
      if (!date) return ''
      // Convert YYYY-MM-DD to MM/DD/YYYY for better readability
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
    
    try {
      const payload = {
        sessionId,
        formType: 'Partial',
        contactInfo: formData.contactInfo,
        preQualification: {
          ...formData.preQualification,
          coverageAmount: formatCurrency(formData.preQualification.coverageAmount)
        },
        medicalAnswers: formData.medicalAnswers,
        applicationData: formData.applicationData,
        quoteData: {
          ...formData.quoteData,
          coverage: formatCurrency(formData.quoteData.coverage),
          premium: formatCurrency(formData.quoteData.premium),
          policyDate: formatDate(formData.quoteData.policyDate)
        },
        trackingData: {
          currentStep: currentStep.toString(),
          stepName: stepName
        }
      }
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('🔍 Raw response:', responseText);
      
      let result;
      if (responseText.startsWith('{') || responseText.startsWith('[')) {
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { success: false, error: 'Invalid JSON response' };
        }
      } else if (responseText.includes('=')) {
        const params = new URLSearchParams(responseText);
        result = {
          success: params.get('success') === 'true',
          error: params.get('error') || null,
          message: params.get('message') || null
        };
      } else {
        result = { success: true, message: responseText };
      }
      console.log('Partial save successful:', result)
    } catch (error) {
      console.error('Error submitting partial data:', error)
    }
  },

  submitLeadPartial: async () => {
    const { formData, sessionId } = get()
    
    try {
      const payload = {
        sessionId,
        formType: 'LeadPartial',
        contactInfo: formData.contactInfo,
        preQualification: formData.preQualification,
        medicalAnswers: formData.medicalAnswers,
        applicationData: formData.applicationData,
        quoteData: formData.quoteData,
        trackingData: {
          currentStep: '12',
          stepName: 'Diabetes Medication'
        }
      }
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit lead partial data')
      }
      
      const responseText = await response.text();
      console.log('🔍 Raw response:', responseText);
      
      let result;
      if (responseText.startsWith('{') || responseText.startsWith('[')) {
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { success: false, error: 'Invalid JSON response' };
        }
      } else if (responseText.includes('=')) {
        const params = new URLSearchParams(responseText);
        result = {
          success: params.get('success') === 'true',
          error: params.get('error') || null,
          message: params.get('message') || null
        };
      } else {
        result = { success: true, message: responseText };
      }
      
      console.log('Lead partial data submitted successfully:', result)
    } catch (error) {
      console.error('Error submitting lead partial data:', error)
    }
  },

  submitLead: async () => {
    const { formData, sessionId } = get()
    
    try {
      const payload = {
        sessionId,
        formType: 'Lead',
        contactInfo: formData.contactInfo,
        preQualification: formData.preQualification,
        medicalAnswers: formData.medicalAnswers,
        applicationData: formData.applicationData,
        quoteData: formData.quoteData,
        trackingData: {
          currentStep: '7',
          stepName: 'Contact Information'
        }
      }
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit lead data')
      }
      
      const responseText = await response.text();
      console.log('🔍 Raw response:', responseText);
      
      let result;
      if (responseText.startsWith('{') || responseText.startsWith('[')) {
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { success: false, error: 'Invalid JSON response' };
        }
      } else if (responseText.includes('=')) {
        const params = new URLSearchParams(responseText);
        result = {
          success: params.get('success') === 'true',
          error: params.get('error') || null,
          message: params.get('message') || null
        };
      } else {
        result = { success: true, message: responseText };
      }
      
      console.log('Lead data submitted successfully:', result)
      try {
        // Fire tracking events if available
        // @ts-ignore
        const cfg = (window && (window as any).VeteranFunnelConfig && (window as any).VeteranFunnelConfig.TRACKING) || {};
        // @ts-ignore
        if (typeof window !== 'undefined' && (window as any).gtag) {
          // Google Ads conversion tracking
          // @ts-ignore
          (window as any).gtag('event', 'conversion', {'send_to': 'AW-17196490702/E36jCNzg_aUbEM6_9odA'});
          
          if (cfg && cfg.CONVERSION) {
            // @ts-ignore
            (window as any).gtag('event', 'conversion', { send_to: cfg.CONVERSION });
          } else {
            // @ts-ignore
            (window as any).gtag('event', 'generate_lead', { method: 'desktop_funnel' });
          }
        } else if (typeof window !== 'undefined' && (window as any).dataLayer) {
          // @ts-ignore
          (window as any).dataLayer.push({ event: 'desktop_lead_submitted' });
        }
      } catch (e) {
        console.warn('Tracking event failed:', e)
      }
    } catch (error) {
      console.error('Error submitting lead data:', error)
      alert('There was an issue submitting your information. Please try again.')
    }
  },
  
  submitApplication: async () => {
    const { formData, sessionId } = get()
    
    console.log('🎯 SUBMIT APPLICATION - Starting application submission')
    console.log('🎯 Session ID:', sessionId)
    console.log('🎯 Form data:', formData)
    
    // Format data to match the nice test data format
    const formatCurrency = (amount: string | number) => {
      if (!amount) return ''
      const num = typeof amount === 'string' ? parseFloat(amount.replace(/[$,]/g, '')) : amount
      return `$${num.toLocaleString()}`
    }
    
    const formatDate = (date: string) => {
      if (!date) return ''
      // Convert YYYY-MM-DD to MM/DD/YYYY for better readability
      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    }
    
    try {
      const payload = {
        sessionId,
        formType: 'Application',
        contactInfo: formData.contactInfo,
        preQualification: {
          ...formData.preQualification,
          coverageAmount: formatCurrency(formData.preQualification.coverageAmount)
        },
        medicalAnswers: formData.medicalAnswers,
        applicationData: formData.applicationData,
        quoteData: {
          ...formData.quoteData,
          coverage: formatCurrency(formData.quoteData.coverage),
          premium: formatCurrency(formData.quoteData.premium),
          policyDate: formatDate(formData.quoteData.policyDate)
        },
        trackingData: {
          currentStep: '18',
          stepName: 'Application Complete'
        }
      }
      
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value === 'object') {
          params.append(key, JSON.stringify(value));
        } else {
          params.append(key, String(value));
        }
      }
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit application data')
      }
      
      const responseText = await response.text();
      console.log('🔍 Raw response:', responseText);
      
      let result;
      if (responseText.startsWith('{') || responseText.startsWith('[')) {
        try {
          result = JSON.parse(responseText);
        } catch (e) {
          result = { success: false, error: 'Invalid JSON response' };
        }
      } else if (responseText.includes('=')) {
        const params = new URLSearchParams(responseText);
        result = {
          success: params.get('success') === 'true',
          error: params.get('error') || null,
          message: params.get('message') || null
        };
      } else {
        result = { success: true, message: responseText };
      }
      
      console.log('Application data submitted successfully:', result)
      
      // Fire Google Ads conversion tracking for full application
      try {
        // @ts-ignore
        if (typeof window !== 'undefined' && (window as any).gtag) {
          // Google Ads conversion tracking for full application
          // @ts-ignore
          (window as any).gtag('event', 'conversion', {'send_to': 'AW-17196490702/E36jCNzg_aUbEM6_9odA'});
        }
      } catch (e) {
        console.warn('Application conversion tracking failed:', e)
      }
    } catch (error) {
      console.error('Error submitting application data:', error)
      alert('There was an issue submitting your application. Please try again.')
    }
  },

  goToNextStep: () => {
    const { currentStep, sessionId } = get()
    const nextStep = currentStep + 1
    const currentStepConfig = getStepConfig(currentStep)
    const nextStepConfig = getStepConfig(nextStep)
    
    console.log(`🎯 GO TO NEXT STEP - From step ${currentStep} (${getStepName(currentStep)}) to ${nextStep} (${getStepName(nextStep)}) - Session ID: ${sessionId}`)
    
    // Note: manual navigation flag is controlled by UI when user clicks Continue
    
    // Handle step-specific actions based on configuration
    if (currentStepConfig) {
      // Submit partial data if configured
      if (currentStepConfig.submitPartial) {
        get().submitPartial(currentStep, currentStepConfig.name)
      }
      
      // Submit lead data if configured
      if (currentStepConfig.submitLead) {
        get().submitLead()
      }
      
      // Submit lead partial data if configured
      if (currentStepConfig.submitLeadPartial) {
        get().submitLead()
      }
      
      // Submit application data if configured
      if (currentStepConfig.submitApplication) {
        get().submitApplication()
      }
    }
    
    // Move to next step
    set({ currentStep: nextStep })
    console.log(`🎯 Step changed to ${nextStep} (${getStepName(nextStep)})`)
    
    // UI will reset manual navigation flag after navigation
  },
  
  goToPreviousStep: () => {
    const { currentStep } = get()
    if (currentStep > 1) {
      const previousStep = currentStep - 1
      // Enable manual navigation lock; it will be cleared by updateFormData
      // only when the user selects an option (new or reclick).
      set({ 
        currentStep: previousStep,
        isManualNavigation: true
      })
      console.log(`🎯 Step changed to ${previousStep} (${getStepName(previousStep)}) - Manual navigation flag set (no timer reset) `)
    }
  },
  
  resetFunnel: () => {
    console.log('🎯 RESET FUNNEL CALLED - Clearing session ID');
    set({
      currentStep: 1,
      isModalOpen: false,
      isLoading: false,
      sessionId: '',
      formData: initialState,
      visitedSteps: new Set<number>(),
      isExitModalOpen: false, // Reset new state
      isManualNavigation: false, // Reset manual navigation flag
      autoAdvanceEnabled: true // Reset auto-advance to enabled
    });
  },

  showExitModal: () => set({ isExitModalOpen: true }),
  hideExitModal: () => set({ isExitModalOpen: false }),
  setManualNavigation: (isManual: boolean) => set({ isManualNavigation: isManual }),
  setAutoAdvanceEnabled: (enabled: boolean) => set({ autoAdvanceEnabled: enabled })
}))

// Helper function to validate phone number
const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Check if it's 10 digits (US phone number)
  return digits.length === 10;
};

// Helper function to check step validation
const checkStepValidation = (step: number, formData: FormData): boolean => {
  switch (step) {
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
      return !!(formData.contactInfo?.firstName && formData.contactInfo?.lastName && formData.contactInfo?.email && formData.contactInfo?.phone && isValidPhoneNumber(formData.contactInfo.phone))
    case 8:
      return !!formData.medicalAnswers?.tobaccoUse
    case 9:
      return Array.isArray(formData.medicalAnswers?.medicalConditions) && formData.medicalAnswers.medicalConditions.length > 0
    case 10:
      return !!formData.medicalAnswers?.height && !!formData.medicalAnswers?.weight
    case 11:
      return !!formData.medicalAnswers?.hospitalCare
    case 12:
      return !!formData.medicalAnswers?.diabetesMedication
    default:
      return true
  }
}

// Helper function to get current step value
const getCurrentStepValue = (step: number, formData: FormData): string => {
  switch (step) {
    case 1:
      return formData.preQualification?.state || ''
    case 2:
      return formData.preQualification?.militaryStatus || ''
    case 3:
      return formData.preQualification?.branchOfService || ''
    case 4:
      return formData.preQualification?.maritalStatus || ''
    case 5:
      return formData.preQualification?.coverageAmount || ''
    case 6:
      return formData.contactInfo?.dateOfBirth || ''
    case 7:
      return formData.contactInfo?.firstName || ''
    case 8:
      return formData.medicalAnswers?.tobaccoUse || ''
    case 9:
      return Array.isArray(formData.medicalAnswers?.medicalConditions) ? formData.medicalAnswers.medicalConditions.join(', ') : ''
    case 10:
      return formData.medicalAnswers?.height && formData.medicalAnswers?.weight 
        ? `${formData.medicalAnswers.height}-${formData.medicalAnswers.weight}` 
        : ''
    case 11:
      return formData.medicalAnswers?.hospitalCare || ''
    case 12:
      return formData.medicalAnswers?.diabetesMedication || ''
    default:
      return ''
  }
} 