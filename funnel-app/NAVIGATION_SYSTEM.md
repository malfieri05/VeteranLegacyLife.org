# Navigation System Documentation

## Overview
The funnel navigation system provides consistent, user-friendly navigation across all 19 steps with intelligent auto-advance functionality and exit protection.

## Step Types

### **1. Radio Button Steps (Steps 1, 2, 3, 4, 5, 6, 8, 10, 11, 12)**
- Auto-advance on first answer selection
- Manual navigation when returning
- Continue/Back buttons always available
- Includes: State Selection, Military Status, Branch of Service, Marital Status, Coverage Amount, Birthday, Tobacco Use, Height & Weight, Hospital Care, Diabetes Medication

### **2. Form Steps (Steps 7, 9, 17, 18)**
- Manual validation required
- Continue button enabled when form is complete
- Standard validation

### **3. Auto-Advance Steps (Steps 13, 14, 15)**
- No navigation buttons
- Automatic progression after delays
- Loading screens and action modals

### **4. Final Step (Step 19)**
- No navigation buttons
- Final success state

## Step-by-Step Navigation

### **Step 1 (State Selection)**
- ✅ **Continue Button**: Yes
- ❌ **Back Button**: No (first step)
- ✅ **Auto-Advance**: Yes (when state is selected)

### **Steps 2-18 (Main Flow)**
- ✅ **Continue Button**: Yes (when validation passes)
- ✅ **Back Button**: Yes (except auto-advance steps)
- ✅ **Auto-Advance**: Yes (for radio button steps)

### **Step 19 (Final Success)**
- ❌ **Continue Button**: No (final step)
- ❌ **Back Button**: No (final step)

## Auto-Advance Logic

### **Radio Button Steps**
- **First Visit**: Auto-advance after 500ms when valid answer selected
- **Return Visit**: No auto-advance, manual navigation only
- **Answer Change**: Auto-advance after 500ms when answer is changed

### **Multi-Field Steps**
- **Step 6 (Birthday)**: Auto-advance when all 3 dropdowns (month, day, year) are filled
- **Step 10 (Height & Weight)**: Auto-advance when both height and weight are selected

### **Loading Steps**
- **Step 13**: Auto-advance after 12 seconds
- **Step 14**: Auto-advance after 5 seconds  
- **Step 15**: Auto-advance after 8 seconds

## Exit Protection

### **Exit Modal**
- Triggers when user tries to close modal after Step 1
- Shows warning about losing progress
- Offers "Continue Application" or "Leave Anyway" options
- Prevents accidental exits

### **Exit Detection**
- **Escape Key**: Shows exit modal
- **Close Button**: Shows exit modal (after Step 1)
- **Browser Close**: Shows exit modal
- **Tab Close**: Shows exit modal

## UI Components

### **ModalHeader Component**
- Consistent progress bar display
- Properly aligned close button
- Responsive design
- Used across all modals

### **StepNavigation Component**
- Dynamic button rendering based on step config
- Consistent styling and behavior
- Proper spacing and alignment

### **ExitModal Component**
- Professional exit warning
- Clear call-to-action buttons
- Benefits reminder
- Consistent with main modal styling

## First Time User Flow
```
Step 1: [Continue] (no back) → Auto-advance on state selection
Step 2: [Back] [Continue] → Auto-advance on selection
Step 3: [Back] [Continue] → Auto-advance on selection
Step 4: [Back] [Continue] → Auto-advance on selection
Step 5: [Back] [Continue] → Auto-advance on selection
Step 6: [Back] [Continue] → Auto-advance on all 3 dropdowns
Step 7: [Back] [Continue] → Manual validation
Step 8: [Back] [Continue] → Auto-advance on selection
Step 9: [Back] [Continue] → Manual validation
Step 10: [Back] [Continue] → Auto-advance on height/weight
Step 11: [Back] [Continue] → Auto-advance on selection
Step 12: [Back] [Continue] → Auto-advance on selection
Step 13: [No buttons] → Auto-advance after 12s
Step 14: [No buttons] → Auto-advance after 5s
Step 15: [No buttons] → Auto-advance after 8s
Step 16: [Back] [Continue] → Manual validation
Step 17: [Back] [Continue] → Manual validation
Step 18: [Back] [Continue] → Manual validation + "Finish Application" button
Step 19: [No buttons] (final)
```

## Navigation Button Visibility
- [ ] Step 1: Only Continue button (auto-advances on selection)
- [ ] Steps 2-18: Both Back and Continue buttons
- [ ] Step 13: No buttons (loading)
- [ ] Step 14: No buttons (auto-advance)
- [ ] Step 15: No buttons (auto-advance)
- [ ] Step 19: No buttons (final)

## Maintenance

### **Adding New Steps**
1. Add step config to `stepConfig.ts`
2. Set appropriate `showBackButton`, `showContinueButton`, `isRadioButtonStep`
3. Add validation logic to `canGoNext()` in `FunnelModal.tsx`
4. Update documentation

### **Modifying Auto-Advance**
1. Update `isRadioButtonStep` in step config
2. Add validation logic to `getCurrentStepValue()` and `checkStepValidation()`
3. Test auto-advance behavior

### **Exit Modal Customization**
1. Modify `ExitModal.tsx` component
2. Update exit detection logic in `FunnelModal.tsx`
3. Test exit scenarios

## Benefits
- **Consistent UX**: All modals have same header and navigation
- **Intelligent Auto-Advance**: Reduces friction for radio button selections
- **Exit Protection**: Prevents accidental data loss
- **Maintainable**: Clear component structure and configuration
- **Production Ready**: Handles all edge cases and user scenarios 