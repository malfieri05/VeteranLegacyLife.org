# Radio Button Auto-Advance System

## Overview
The radio button auto-advance system provides intelligent, user-friendly progression through the funnel by automatically advancing users when they make selections, while preventing unwanted auto-advance when navigating back.

## Affected Steps
The following steps use radio buttons and have auto-advance enabled:
- **Step 1**: State Selection
- **Step 2**: Military Status
- **Step 3**: Branch of Service  
- **Step 4**: Marital Status
- **Step 5**: Coverage Amount
- **Step 6**: Birthday (3 dropdowns)
- **Step 8**: Tobacco Use
- **Step 10**: Height & Weight (2 fields)
- **Step 11**: Hospital Care
- **Step 12**: Diabetes Medication

## Auto-Advance Logic

### **Radio Button Steps (Steps 1, 2, 3, 4, 5, 8, 11, 12)**
- **First Visit**: Auto-advance after 500ms when valid answer selected
- **Return Visit**: No auto-advance, manual navigation only
- **Answer Change**: Auto-advance after 500ms when answer is changed

### **Multi-Field Steps**
- **Step 6 (Birthday)**: Auto-advance when all 3 dropdowns (month, day, year) are filled
- **Step 10 (Height & Weight)**: Auto-advance when both height and weight are selected

## User Experience Examples

### **Scenario 1: First Time User**
```
1. User reaches Step 1 (State Selection)
2. User selects "California" 
3. ✅ Auto-advances to Step 2 after 500ms
```

### **Scenario 2: User Goes Back**
```
1. User is on Step 4 (Marital Status)
2. User clicks "Back" to Step 3 (Branch of Service)
3. Step 3 shows existing answer "Army"
4. ❌ No auto-advance (user can review/modify)
5. User can click "Continue" or change answer
```

### **Scenario 3: Multi-Field Auto-Advance**
```
1. User reaches Step 6 (Birthday)
2. User selects "June" from month dropdown
3. User selects "15" from day dropdown  
4. User selects "1985" from year dropdown
5. ✅ Auto-advances to Step 7 after 500ms
```

### **Scenario 4: Height & Weight Auto-Advance**
```
1. User reaches Step 10 (Height & Weight)
2. User selects "5'10"" from height dropdown
3. User types "175" in weight field
4. ✅ Auto-advances to Step 11 after 500ms
```

## Technical Implementation

### **Store Logic**
The auto-advance logic is implemented in `funnelStore.ts`:

```typescript
updateFormData: (data) => {
  const { currentStep, visitedSteps, formData } = get()
  const radioButtonSteps = getRadioButtonSteps() // Dynamically get radio button steps

  if (radioButtonSteps.includes(currentStep)) {
    const hasVisited = visitedSteps.has(currentStep)
    let isNewAnswer = false
    let isAnswerChange = false

    if (!hasVisited) {
      isNewAnswer = true
    } else {
      const currentValue = getCurrentStepValue(currentStep, formData)
      const newValue = getCurrentStepValue(currentStep, { ...formData, ...data })
      isAnswerChange = currentValue !== newValue && newValue !== ''
    }

    set((state) => ({
      formData: { ...state.formData, ...data },
      visitedSteps: new Set([...visitedSteps, currentStep])
    }))

    if (isNewAnswer || isAnswerChange) {
      const stepConfig = getStepConfig(currentStep)
      if (stepConfig?.requiresValidation) {
        const isValid = checkStepValidation(currentStep, { ...formData, ...data })
        if (isValid) {
          setTimeout(() => {
            console.log(`🎯 Auto-advancing from radio button step ${currentStep} (${isNewAnswer ? 'new answer' : 'answer change'})`)
            get().goToNextStep()
          }, 500)
        }
      }
    }
  } else {
    set((state) => ({
      formData: { ...state.formData, ...data },
      visitedSteps: new Set([...visitedSteps, currentStep])
    }))
  }
}
```

### **Step Configuration**
Radio button steps are configured in `stepConfig.ts`:

```typescript
{
  id: 1,
  name: 'State Selection',
  component: StateSelection,
  requiresValidation: true,
  submitPartial: true,
  showBackButton: false,
  showContinueButton: true,
  isRadioButtonStep: true // Enable auto-advance
}
```

### **Validation Functions**
Helper functions in `funnelStore.ts`:

```typescript
// Get current step value for comparison
const getCurrentStepValue = (step: number, formData: FormData): string => {
  switch (step) {
    case 1: return formData.preQualification?.state || ''
    case 6: return formData.contactInfo?.dateOfBirth || ''
    case 10: return formData.medicalAnswers?.height && formData.medicalAnswers?.weight 
      ? `${formData.medicalAnswers.height}-${formData.medicalAnswers.weight}` 
      : ''
    // ... other cases
  }
}

// Check if step is valid for auto-advance
const checkStepValidation = (step: number, formData: FormData): boolean => {
  switch (step) {
    case 1: return !!formData.preQualification?.state
    case 6: return !!formData.contactInfo?.dateOfBirth
    case 10: return !!formData.medicalAnswers?.height && !!formData.medicalAnswers?.weight
    // ... other cases
  }
}
```

## Radio Button Steps Array
```typescript
const RADIO_BUTTON_STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 11, 12]
```

## Benefits
- **Reduced Friction**: Users don't need to click "Continue" for simple selections
- **Smart Behavior**: No auto-advance when reviewing previous answers
- **Consistent UX**: Same behavior across all radio button steps
- **Maintainable**: Centralized logic and configuration
- **Flexible**: Supports both single and multi-field auto-advance

## Maintenance

### **Adding New Radio Button Step**
1. Add step to `RADIO_BUTTON_STEPS` array
2. Set `isRadioButtonStep: true` in step config
3. Add validation logic to `getCurrentStepValue()` and `checkStepValidation()`
4. Test auto-advance behavior

### **Modifying Auto-Advance Delay**
Edit the timeout in `funnelStore.ts`:
```typescript
setTimeout(() => {
  get().goToNextStep()
}, 500) // Change delay here
```

### **Adding Multi-Field Auto-Advance**
1. Set `isRadioButtonStep: true` in step config
2. Update `getCurrentStepValue()` to return combined field value
3. Update `checkStepValidation()` to check all required fields
4. Test with various field combinations 