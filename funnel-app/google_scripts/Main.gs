/**
 * Google Apps Script for React Funnel Data Capture - SIMPLIFIED VERSION
 * Matches FunnelStore.ts structure exactly
 */

// Configuration is now managed in env.gs
// CONFIG object is available from env.gs file

// Column mapping for 51 columns
const SHEET_COLUMNS = {
  TIMESTAMP: 1, SESSION_ID: 2, STATUS: 3, LAST_ACTIVITY: 4,
  FIRST_NAME: 5, LAST_NAME: 6, EMAIL: 7, PHONE: 8, DOB: 9,
  TRANSACTIONAL_CONSENT: 10, MARKETING_CONSENT: 11, STATE: 12,
  MILITARY_STATUS: 13, BRANCH: 14, MARITAL_STATUS: 15, COVERAGE_AMOUNT: 16,
  TOBACCO_USE: 17, MEDICAL_CONDITIONS: 18, HEIGHT: 19, WEIGHT: 20,
  HOSPITAL_CARE: 21, DIABETES_MEDICATION: 22, STREET_ADDRESS: 23,
  CITY: 24, APPLICATION_STATE: 25, ZIP_CODE: 26, BENEFICIARIES: 27,
  VA_NUMBER: 28, SERVICE_CONNECTED: 29, SSN: 30, DRIVERS_LICENSE: 31, 
  BANK_NAME: 32, ROUTING_NUMBER: 33, ACCOUNT_NUMBER: 34, POLICY_DATE: 35, 
  QUOTE_COVERAGE: 36, QUOTE_PREMIUM: 37, QUOTE_AGE: 38, QUOTE_GENDER: 39, 
  QUOTE_TYPE: 40, CURRENT_STEP: 41, STEP_NAME: 42, FORM_TYPE: 43, 
  USER_AGENT: 44, REFERRER: 45, UTM_SOURCE: 46, UTM_MEDIUM: 47, 
  UTM_CAMPAIGN: 48, PARTIAL_EMAIL_SENT: 49, COMPLETED_EMAIL_SENT: 50
};

function doPost(e) {
  try {
    // Initialize configuration
    if (!initializeConfig()) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Configuration initialization failed'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    Logger.log(`Processing request`);
    Logger.log(`e.postData: ${JSON.stringify(e.postData)}`);
    Logger.log(`e.parameter: ${JSON.stringify(e.parameter)}`);
    
    // Check for test function call first
    if (e.postData && e.postData.contents) {
      // Try to parse as JSON first for test functions
      try {
        const data = JSON.parse(e.postData.contents);
        if (data.action === 'testNewEntriesAndEmails') {
          Logger.log(`Running testNewEntriesAndEmails`);
          return testNewEntriesAndEmails();
        }
        if (data.action === 'setupHeaders') {
          Logger.log(`Running setupHeaders`);
          return setupHeaders();
        }
      } catch (e) {
        // Not JSON, continue with URL-encoded parsing
      }
    }
    
    // Parse the incoming data - handle both JSON and URL-encoded
    let parsedData;
    
    // For URL-encoded data, Google Apps Script provides it in e.parameter
    if (e.parameter && Object.keys(e.parameter).length > 0) {
      parsedData = {};
      for (const [key, value] of Object.entries(e.parameter)) {
        try {
          // Try to parse as JSON for complex objects
          parsedData[key] = JSON.parse(value);
        } catch (e) {
          // Keep as string if not valid JSON
          parsedData[key] = value;
        }
      }
    } else if (e.postData && e.postData.contents) {
      // Try JSON parsing for JSON data
      try {
        parsedData = JSON.parse(e.postData.contents);
      } catch (e) {
        // Fall back to URL-encoded parsing
        const content = e.postData.contents;
        parsedData = {};
        
        // Parse URL-encoded parameters manually
        const pairs = content.split('&');
        for (const pair of pairs) {
          const [key, value] = pair.split('=');
          if (key && value) {
            const decodedKey = decodeURIComponent(key);
            const decodedValue = decodeURIComponent(value);
            
            try {
              // Try to parse as JSON for complex objects
              parsedData[decodedKey] = JSON.parse(decodedValue);
            } catch (e) {
              // Keep as string if not valid JSON
              parsedData[decodedKey] = decodedValue;
            }
          }
        }
      }
    } else {
      throw new Error('No data received');
    }
    Logger.log(`Parsed data: ${JSON.stringify(parsedData)}`);
    
    // Extract sessionId from frontend data
    const sessionId = parsedData.sessionId || 'unknown_session';
    Logger.log(`Using sessionId from frontend: ${sessionId}`);
    
    // Determine form type and route accordingly
    const formType = parsedData.formType || 'Unknown';
    Logger.log(`Form type: ${formType}`);
    
    let result;
    switch (formType) {
      case 'Lead':
        result = handleLeadSubmission(parsedData, sessionId);
        break;
      case 'LeadPartial':
        result = handleLeadPartialSubmission(parsedData, sessionId);
        break;
      case 'Partial':
        result = handlePartialSubmission(parsedData, sessionId);
        break;
      case 'Application':
        result = handleApplicationSubmission(parsedData, sessionId);
        break;
      default:
        throw new Error(`Unknown form type: ${formType}`);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log(`Error in doPost: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Simple response for GET requests
  return ContentService.createTextOutput('OK')
    .setMimeType(ContentService.MimeType.TEXT);
}

function handleApplicationSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing Application submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = new Array(50).fill('');
    
    // Contact Info (columns 5-11)
    rowData[SHEET_COLUMNS.FIRST_NAME - 1] = data.contactInfo?.firstName || '';
    rowData[SHEET_COLUMNS.LAST_NAME - 1] = data.contactInfo?.lastName || '';
    rowData[SHEET_COLUMNS.EMAIL - 1] = data.contactInfo?.email || '';
    rowData[SHEET_COLUMNS.PHONE - 1] = data.contactInfo?.phone || '';
    rowData[SHEET_COLUMNS.DOB - 1] = data.contactInfo?.dateOfBirth || '';
    rowData[SHEET_COLUMNS.TRANSACTIONAL_CONSENT - 1] = data.contactInfo?.transactionalConsent || false;
    rowData[SHEET_COLUMNS.MARKETING_CONSENT - 1] = data.contactInfo?.marketingConsent || false;
    
    // Pre-qualification (columns 12-16)
    rowData[SHEET_COLUMNS.STATE - 1] = data.preQualification?.state || '';
    rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = data.preQualification?.militaryStatus || '';
    rowData[SHEET_COLUMNS.BRANCH - 1] = data.preQualification?.branchOfService || '';
    rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = data.preQualification?.maritalStatus || '';
    rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = data.preQualification?.coverageAmount || '';
    
    // Medical (columns 17-22)
    rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = data.medicalAnswers?.tobaccoUse || '';
    rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = data.medicalAnswers?.medicalConditions || '';
    rowData[SHEET_COLUMNS.HEIGHT - 1] = data.medicalAnswers?.height || '';
    rowData[SHEET_COLUMNS.WEIGHT - 1] = data.medicalAnswers?.weight || '';
    rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = data.medicalAnswers?.hospitalCare || '';
    rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = data.medicalAnswers?.diabetesMedication || '';
    
    // Application (columns 23-35)
    rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = data.applicationData?.streetAddress || '';
    rowData[SHEET_COLUMNS.CITY - 1] = data.applicationData?.city || '';
    rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = data.applicationData?.state || '';
    rowData[SHEET_COLUMNS.ZIP_CODE - 1] = data.applicationData?.zipCode || '';
    // Handle beneficiaries array - store all beneficiaries in one column
    const beneficiaries = data.applicationData?.beneficiaries || [];
    const beneficiariesText = beneficiaries.length > 0 
      ? beneficiaries.map(b => `${b.name} (${b.relationship}) - ${b.percentage}%`).join('\n')
      : '';
    
    rowData[SHEET_COLUMNS.BENEFICIARIES - 1] = beneficiariesText;
    rowData[SHEET_COLUMNS.VA_NUMBER - 1] = data.applicationData?.vaNumber || '';
    rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = data.applicationData?.serviceConnected || '';
    rowData[SHEET_COLUMNS.SSN - 1] = data.applicationData?.ssn || '';
    rowData[SHEET_COLUMNS.DRIVERS_LICENSE - 1] = data.applicationData?.driversLicense || '';
    rowData[SHEET_COLUMNS.BANK_NAME - 1] = data.applicationData?.bankName || '';
    rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = data.applicationData?.routingNumber || '';
    rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = data.applicationData?.accountNumber || '';
    
    // Quote Data (columns 36-41) - CRITICAL FIX
    const policyDate = data.quoteData?.policyDate || '';
    const quoteCoverage = data.quoteData?.coverage || '';
    const quotePremium = data.quoteData?.premium || '';
    const quoteAge = data.quoteData?.age || '';
    const quoteGender = data.quoteData?.gender || '';
    const quoteType = data.quoteData?.type || '';
    
    Logger.log(`[${sessionId}] Quote data values: policyDate=${policyDate}, coverage=${quoteCoverage}, premium=${quotePremium}, age=${quoteAge}, gender=${quoteGender}, type=${quoteType}`);
    
    rowData[SHEET_COLUMNS.POLICY_DATE - 1] = policyDate;
    rowData[SHEET_COLUMNS.QUOTE_COVERAGE - 1] = quoteCoverage;
    rowData[SHEET_COLUMNS.QUOTE_PREMIUM - 1] = quotePremium;
    rowData[SHEET_COLUMNS.QUOTE_AGE - 1] = quoteAge;
    rowData[SHEET_COLUMNS.QUOTE_GENDER - 1] = quoteGender;
    rowData[SHEET_COLUMNS.QUOTE_TYPE - 1] = quoteType;
    
    Logger.log(`[${sessionId}] Quote data array positions: [35]=${rowData[35]}, [36]=${rowData[36]}, [37]=${rowData[37]}, [38]=${rowData[38]}, [39]=${rowData[39]}, [40]=${rowData[40]}`);
    
    // Tracking (columns 42-49)
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.trackingData?.currentStep || '';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.trackingData?.stepName || '';
    rowData[SHEET_COLUMNS.FORM_TYPE - 1] = 'Application';
    
    // Core (columns 1-4)
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'Application';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    // Email flags (columns 50-51)
    rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'No';
    rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'No';
    
    Logger.log(`[${sessionId}] About to write row with ${rowData.length} elements`);
    Logger.log(`[${sessionId}] Quote data: ${rowData[35]}, ${rowData[36]}, ${rowData[37]}, ${rowData[38]}, ${rowData[39]}, ${rowData[40]}`);
    
    // Find existing row or create new one
    const existingRow = findRowBySessionId(sheet, sessionId);
    if (existingRow) {
      Logger.log(`[${sessionId}] Updating existing row ${existingRow}`);
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      Logger.log(`[${sessionId}] Creating new row`);
      sheet.appendRow(rowData);
    }
    Logger.log(`[${sessionId}] Row written successfully`);
    
    // Send application completion email
    try {
      Logger.log(`[${sessionId}] Sending application completion email`);
      Logger.log(`[${sessionId}] Email config: ${JSON.stringify(getEmailConfig())}`);
      const emailResult = sendApplicationCompleteEmail(data);
      Logger.log(`[${sessionId}] Email send result: ${emailResult}`);
      rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'Yes';
      // Update the email flag in the sheet
      if (existingRow) {
        sheet.getRange(existingRow, SHEET_COLUMNS.COMPLETED_EMAIL_SENT, 1, 1).setValue('Yes');
      }
      Logger.log(`[${sessionId}] Application completion email sent successfully`);
    } catch (emailError) {
      Logger.log(`[${sessionId}] Error sending application completion email: ${emailError.toString()}`);
      Logger.log(`[${sessionId}] Error stack: ${emailError.stack}`);
    }
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Application submitted successfully'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleApplicationSubmission: ${error.toString()}`);
    throw error;
  }
}

function findRowBySessionId(sheet, sessionId) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) { // Start from row 2 (skip header)
    if (data[i][SHEET_COLUMNS.SESSION_ID - 1] === sessionId) {
      return i + 1; // Return 1-based row number
    }
  }
  return null; // Not found
}

function handlePartialSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing Partial submission`);
  Logger.log(`[${sessionId}] Quote data received: ${JSON.stringify(data.quoteData)}`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = new Array(50).fill('');
    
    // Same mapping as Application but with Partial status
    rowData[SHEET_COLUMNS.FIRST_NAME - 1] = data.contactInfo?.firstName || '';
    rowData[SHEET_COLUMNS.LAST_NAME - 1] = data.contactInfo?.lastName || '';
    rowData[SHEET_COLUMNS.EMAIL - 1] = data.contactInfo?.email || '';
    rowData[SHEET_COLUMNS.PHONE - 1] = data.contactInfo?.phone || '';
    rowData[SHEET_COLUMNS.DOB - 1] = data.contactInfo?.dateOfBirth || '';
    rowData[SHEET_COLUMNS.TRANSACTIONAL_CONSENT - 1] = data.contactInfo?.transactionalConsent || false;
    rowData[SHEET_COLUMNS.MARKETING_CONSENT - 1] = data.contactInfo?.marketingConsent || false;
    
    rowData[SHEET_COLUMNS.STATE - 1] = data.preQualification?.state || '';
    rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = data.preQualification?.militaryStatus || '';
    rowData[SHEET_COLUMNS.BRANCH - 1] = data.preQualification?.branchOfService || '';
    rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = data.preQualification?.maritalStatus || '';
    rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = data.preQualification?.coverageAmount || '';
    
    rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = data.medicalAnswers?.tobaccoUse || '';
    rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = data.medicalAnswers?.medicalConditions || '';
    rowData[SHEET_COLUMNS.HEIGHT - 1] = data.medicalAnswers?.height || '';
    rowData[SHEET_COLUMNS.WEIGHT - 1] = data.medicalAnswers?.weight || '';
    rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = data.medicalAnswers?.hospitalCare || '';
    rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = data.medicalAnswers?.diabetesMedication || '';
    
    rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = data.applicationData?.streetAddress || '';
    rowData[SHEET_COLUMNS.CITY - 1] = data.applicationData?.city || '';
    rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = data.applicationData?.state || '';
    rowData[SHEET_COLUMNS.ZIP_CODE - 1] = data.applicationData?.zipCode || '';
    // Handle beneficiaries array - store all beneficiaries in one column
    const beneficiaries = data.applicationData?.beneficiaries || [];
    const beneficiariesText = beneficiaries.length > 0 
      ? beneficiaries.map(b => `${b.name} (${b.relationship}) - ${b.percentage}%`).join('\n')
      : '';
    
    rowData[SHEET_COLUMNS.BENEFICIARIES - 1] = beneficiariesText;
    rowData[SHEET_COLUMNS.VA_NUMBER - 1] = data.applicationData?.vaNumber || '';
    rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = data.applicationData?.serviceConnected || '';
    rowData[SHEET_COLUMNS.SSN - 1] = data.applicationData?.ssn || '';
    rowData[SHEET_COLUMNS.DRIVERS_LICENSE - 1] = data.applicationData?.driversLicense || '';
    rowData[SHEET_COLUMNS.BANK_NAME - 1] = data.applicationData?.bankName || '';
    rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = data.applicationData?.routingNumber || '';
    rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = data.applicationData?.accountNumber || '';
    
    const policyDate = data.quoteData?.policyDate || '';
    const quoteCoverage = data.quoteData?.coverage || '';
    const quotePremium = data.quoteData?.premium || '';
    const quoteAge = data.quoteData?.age || '';
    const quoteGender = data.quoteData?.gender || '';
    const quoteType = data.quoteData?.type || '';
    
    Logger.log(`[${sessionId}] Partial - Quote data values: policyDate=${policyDate}, coverage=${quoteCoverage}, premium=${quotePremium}, age=${quoteAge}, gender=${quoteGender}, type=${quoteType}`);
    
    rowData[SHEET_COLUMNS.POLICY_DATE - 1] = policyDate;
    rowData[SHEET_COLUMNS.QUOTE_COVERAGE - 1] = quoteCoverage;
    rowData[SHEET_COLUMNS.QUOTE_PREMIUM - 1] = quotePremium;
    rowData[SHEET_COLUMNS.QUOTE_AGE - 1] = quoteAge;
    rowData[SHEET_COLUMNS.QUOTE_GENDER - 1] = quoteGender;
    rowData[SHEET_COLUMNS.QUOTE_TYPE - 1] = quoteType;
    
    Logger.log(`[${sessionId}] Partial - Quote data array positions: [35]=${rowData[35]}, [36]=${rowData[36]}, [37]=${rowData[37]}, [38]=${rowData[38]}, [39]=${rowData[39]}, [40]=${rowData[40]}`);
    
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.trackingData?.currentStep || '';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.trackingData?.stepName || '';
    rowData[SHEET_COLUMNS.FORM_TYPE - 1] = 'Partial';
    
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'Partial';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'No';
    rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'No';
    
    // Find existing row or create new one
    const existingRow = findRowBySessionId(sheet, sessionId);
    if (existingRow) {
      Logger.log(`[${sessionId}] Updating existing row ${existingRow}`);
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      Logger.log(`[${sessionId}] Creating new row`);
      sheet.appendRow(rowData);
    }
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Partial submission recorded'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handlePartialSubmission: ${error.toString()}`);
    throw error;
  }
}

function handleLeadSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing Lead submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = new Array(50).fill('');
    
    // Same mapping as Application but with Lead status
    rowData[SHEET_COLUMNS.FIRST_NAME - 1] = data.contactInfo?.firstName || '';
    rowData[SHEET_COLUMNS.LAST_NAME - 1] = data.contactInfo?.lastName || '';
    rowData[SHEET_COLUMNS.EMAIL - 1] = data.contactInfo?.email || '';
    rowData[SHEET_COLUMNS.PHONE - 1] = data.contactInfo?.phone || '';
    rowData[SHEET_COLUMNS.DOB - 1] = data.contactInfo?.dateOfBirth || '';
    rowData[SHEET_COLUMNS.TRANSACTIONAL_CONSENT - 1] = data.contactInfo?.transactionalConsent || false;
    rowData[SHEET_COLUMNS.MARKETING_CONSENT - 1] = data.contactInfo?.marketingConsent || false;
    
    rowData[SHEET_COLUMNS.STATE - 1] = data.preQualification?.state || '';
    rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = data.preQualification?.militaryStatus || '';
    rowData[SHEET_COLUMNS.BRANCH - 1] = data.preQualification?.branchOfService || '';
    rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = data.preQualification?.maritalStatus || '';
    rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = data.preQualification?.coverageAmount || '';
    
    rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = data.medicalAnswers?.tobaccoUse || '';
    rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = data.medicalAnswers?.medicalConditions || '';
    rowData[SHEET_COLUMNS.HEIGHT - 1] = data.medicalAnswers?.height || '';
    rowData[SHEET_COLUMNS.WEIGHT - 1] = data.medicalAnswers?.weight || '';
    rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = data.medicalAnswers?.hospitalCare || '';
    rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = data.medicalAnswers?.diabetesMedication || '';
    
    rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = data.applicationData?.streetAddress || '';
    rowData[SHEET_COLUMNS.CITY - 1] = data.applicationData?.city || '';
    rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = data.applicationData?.state || '';
    rowData[SHEET_COLUMNS.ZIP_CODE - 1] = data.applicationData?.zipCode || '';
    // Handle beneficiaries array - store all beneficiaries in one column
    const beneficiaries = data.applicationData?.beneficiaries || [];
    const beneficiariesText = beneficiaries.length > 0 
      ? beneficiaries.map(b => `${b.name} (${b.relationship}) - ${b.percentage}%`).join('\n')
      : '';
    
    rowData[SHEET_COLUMNS.BENEFICIARIES - 1] = beneficiariesText;
    rowData[SHEET_COLUMNS.VA_NUMBER - 1] = data.applicationData?.vaNumber || '';
    rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = data.applicationData?.serviceConnected || '';
    rowData[SHEET_COLUMNS.SSN - 1] = data.applicationData?.ssn || '';
    rowData[SHEET_COLUMNS.DRIVERS_LICENSE - 1] = data.applicationData?.driversLicense || '';
    rowData[SHEET_COLUMNS.BANK_NAME - 1] = data.applicationData?.bankName || '';
    rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = data.applicationData?.routingNumber || '';
    rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = data.applicationData?.accountNumber || '';
    
    rowData[SHEET_COLUMNS.POLICY_DATE - 1] = data.quoteData?.policyDate || '';
    rowData[SHEET_COLUMNS.QUOTE_COVERAGE - 1] = data.quoteData?.coverage || '';
    rowData[SHEET_COLUMNS.QUOTE_PREMIUM - 1] = data.quoteData?.premium || '';
    rowData[SHEET_COLUMNS.QUOTE_AGE - 1] = data.quoteData?.age || '';
    rowData[SHEET_COLUMNS.QUOTE_GENDER - 1] = data.quoteData?.gender || '';
    rowData[SHEET_COLUMNS.QUOTE_TYPE - 1] = data.quoteData?.type || '';
    
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.trackingData?.currentStep || '';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.trackingData?.stepName || '';
    rowData[SHEET_COLUMNS.FORM_TYPE - 1] = 'Lead';
    
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'Lead';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'No';
    rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'No';
    
    // Find existing row or create new one
    const existingRow = findRowBySessionId(sheet, sessionId);
    if (existingRow) {
      Logger.log(`[${sessionId}] Updating existing row ${existingRow}`);
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      Logger.log(`[${sessionId}] Creating new row`);
      sheet.appendRow(rowData);
    }
    
    // Send lead notification email
    try {
      Logger.log(`[${sessionId}] Sending lead notification email`);
      sendLeadNotification(data);
      rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'Yes';
      // Update the email flag in the sheet
      if (existingRow) {
        sheet.getRange(existingRow, SHEET_COLUMNS.COMPLETED_EMAIL_SENT, 1, 1).setValue('Yes');
      }
      Logger.log(`[${sessionId}] Lead notification email sent successfully`);
    } catch (emailError) {
      Logger.log(`[${sessionId}] Error sending lead notification email: ${emailError.toString()}`);
    }
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Lead submitted successfully'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleLeadSubmission: ${error.toString()}`);
    throw error;
  }
}

function handleLeadPartialSubmission(data, sessionId) {
  Logger.log(`[${sessionId}] Processing LeadPartial submission`);
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const rowData = new Array(50).fill('');
    
    // Same mapping as Application but with LeadPartial status
    rowData[SHEET_COLUMNS.FIRST_NAME - 1] = data.contactInfo?.firstName || '';
    rowData[SHEET_COLUMNS.LAST_NAME - 1] = data.contactInfo?.lastName || '';
    rowData[SHEET_COLUMNS.EMAIL - 1] = data.contactInfo?.email || '';
    rowData[SHEET_COLUMNS.PHONE - 1] = data.contactInfo?.phone || '';
    rowData[SHEET_COLUMNS.DOB - 1] = data.contactInfo?.dateOfBirth || '';
    rowData[SHEET_COLUMNS.TRANSACTIONAL_CONSENT - 1] = data.contactInfo?.transactionalConsent || false;
    rowData[SHEET_COLUMNS.MARKETING_CONSENT - 1] = data.contactInfo?.marketingConsent || false;
    
    rowData[SHEET_COLUMNS.STATE - 1] = data.preQualification?.state || '';
    rowData[SHEET_COLUMNS.MILITARY_STATUS - 1] = data.preQualification?.militaryStatus || '';
    rowData[SHEET_COLUMNS.BRANCH - 1] = data.preQualification?.branchOfService || '';
    rowData[SHEET_COLUMNS.MARITAL_STATUS - 1] = data.preQualification?.maritalStatus || '';
    rowData[SHEET_COLUMNS.COVERAGE_AMOUNT - 1] = data.preQualification?.coverageAmount || '';
    
    rowData[SHEET_COLUMNS.TOBACCO_USE - 1] = data.medicalAnswers?.tobaccoUse || '';
    rowData[SHEET_COLUMNS.MEDICAL_CONDITIONS - 1] = data.medicalAnswers?.medicalConditions || '';
    rowData[SHEET_COLUMNS.HEIGHT - 1] = data.medicalAnswers?.height || '';
    rowData[SHEET_COLUMNS.WEIGHT - 1] = data.medicalAnswers?.weight || '';
    rowData[SHEET_COLUMNS.HOSPITAL_CARE - 1] = data.medicalAnswers?.hospitalCare || '';
    rowData[SHEET_COLUMNS.DIABETES_MEDICATION - 1] = data.medicalAnswers?.diabetesMedication || '';
    
    rowData[SHEET_COLUMNS.STREET_ADDRESS - 1] = data.applicationData?.streetAddress || '';
    rowData[SHEET_COLUMNS.CITY - 1] = data.applicationData?.city || '';
    rowData[SHEET_COLUMNS.APPLICATION_STATE - 1] = data.applicationData?.state || '';
    rowData[SHEET_COLUMNS.ZIP_CODE - 1] = data.applicationData?.zipCode || '';
    // Handle beneficiaries array - store all beneficiaries in one column
    const beneficiaries = data.applicationData?.beneficiaries || [];
    const beneficiariesText = beneficiaries.length > 0 
      ? beneficiaries.map(b => `${b.name} (${b.relationship}) - ${b.percentage}%`).join('\n')
      : '';
    
    rowData[SHEET_COLUMNS.BENEFICIARIES - 1] = beneficiariesText;
    rowData[SHEET_COLUMNS.VA_NUMBER - 1] = data.applicationData?.vaNumber || '';
    rowData[SHEET_COLUMNS.SERVICE_CONNECTED - 1] = data.applicationData?.serviceConnected || '';
    rowData[SHEET_COLUMNS.SSN - 1] = data.applicationData?.ssn || '';
    rowData[SHEET_COLUMNS.DRIVERS_LICENSE - 1] = data.applicationData?.driversLicense || '';
    rowData[SHEET_COLUMNS.BANK_NAME - 1] = data.applicationData?.bankName || '';
    rowData[SHEET_COLUMNS.ROUTING_NUMBER - 1] = data.applicationData?.routingNumber || '';
    rowData[SHEET_COLUMNS.ACCOUNT_NUMBER - 1] = data.applicationData?.accountNumber || '';
    
    rowData[SHEET_COLUMNS.POLICY_DATE - 1] = data.quoteData?.policyDate || '';
    rowData[SHEET_COLUMNS.QUOTE_COVERAGE - 1] = data.quoteData?.coverage || '';
    rowData[SHEET_COLUMNS.QUOTE_PREMIUM - 1] = data.quoteData?.premium || '';
    rowData[SHEET_COLUMNS.QUOTE_AGE - 1] = data.quoteData?.age || '';
    rowData[SHEET_COLUMNS.QUOTE_GENDER - 1] = data.quoteData?.gender || '';
    rowData[SHEET_COLUMNS.QUOTE_TYPE - 1] = data.quoteData?.type || '';
    
    rowData[SHEET_COLUMNS.CURRENT_STEP - 1] = data.trackingData?.currentStep || '';
    rowData[SHEET_COLUMNS.STEP_NAME - 1] = data.trackingData?.stepName || '';
    rowData[SHEET_COLUMNS.FORM_TYPE - 1] = 'LeadPartial';
    
    rowData[SHEET_COLUMNS.TIMESTAMP - 1] = new Date();
    rowData[SHEET_COLUMNS.SESSION_ID - 1] = sessionId;
    rowData[SHEET_COLUMNS.STATUS - 1] = 'LeadPartial';
    rowData[SHEET_COLUMNS.LAST_ACTIVITY - 1] = new Date();
    
    rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'No';
    rowData[SHEET_COLUMNS.COMPLETED_EMAIL_SENT - 1] = 'No';
    
    // Find existing row or create new one
    const existingRow = findRowBySessionId(sheet, sessionId);
    if (existingRow) {
      Logger.log(`[${sessionId}] Updating existing row ${existingRow}`);
      sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    } else {
      Logger.log(`[${sessionId}] Creating new row`);
      sheet.appendRow(rowData);
    }
    
    // Send partial lead abandonment email
    try {
      Logger.log(`[${sessionId}] Sending partial lead abandonment email`);
      sendPartialLeadEmail(data, sessionId);
      rowData[SHEET_COLUMNS.PARTIAL_EMAIL_SENT - 1] = 'Yes';
      // Update the email flag in the sheet
      if (existingRow) {
        sheet.getRange(existingRow, SHEET_COLUMNS.PARTIAL_EMAIL_SENT, 1, 1).setValue('Yes');
      }
      Logger.log(`[${sessionId}] Partial lead abandonment email sent successfully`);
    } catch (emailError) {
      Logger.log(`[${sessionId}] Error sending partial lead abandonment email: ${emailError.toString()}`);
    }
    
    return {
      success: true,
      sessionId: sessionId,
      message: 'Lead partial submitted successfully'
    };
    
  } catch (error) {
    Logger.log(`[${sessionId}] Error in handleLeadPartialSubmission: ${error.toString()}`);
    throw error;
  }
}

function testNewEntriesAndEmails() {
  Logger.log('Running testNewEntriesAndEmails function');
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    // Initialize configuration first
    Logger.log('Initializing configuration...');
    const configInitialized = initializeConfig();
    Logger.log('Configuration initialized:', configInitialized);
    
    // Try direct access to CONFIG
    Logger.log('Direct CONFIG access test:');
    try {
      Logger.log('CONFIG available:', typeof CONFIG !== 'undefined');
      if (typeof CONFIG !== 'undefined') {
        Logger.log('CONFIG.EMAIL:', CONFIG.EMAIL);
        Logger.log('CONFIG.EMAIL.ADMIN:', CONFIG.EMAIL.ADMIN);
      }
    } catch (configError) {
      Logger.log('❌ Direct CONFIG access failed:', configError.toString());
    }
    
    const emailConfig = getEmailConfig();
    
    // Test basic email sending first
    Logger.log('Testing basic email sending...');
    Logger.log('getEmailConfig() returned:', emailConfig);
    Logger.log('emailConfig type:', typeof emailConfig);
    Logger.log('emailConfig.ADMIN:', emailConfig?.ADMIN);
    Logger.log('emailConfig.FROM:', emailConfig?.FROM);
    Logger.log('Email config JSON:', JSON.stringify(emailConfig));
    
    // Check if MailApp is available
    Logger.log('MailApp available:', typeof MailApp !== 'undefined');
    Logger.log('MailApp.sendEmail available:', typeof MailApp.sendEmail === 'function');
    
    if (typeof MailApp === 'undefined') {
      Logger.log('❌ MailApp is not available!');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'MailApp is not available - check script permissions'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Test email address validation
    Logger.log('Testing email address validation...');
    const testEmail = 'michaelalfieri.ffl@gmail.com';
    Logger.log('Test email:', testEmail);
    Logger.log('Email type:', typeof testEmail);
    Logger.log('Email length:', testEmail.length);
    Logger.log('Email includes @:', testEmail.includes('@'));
    
    // Test 1: Try sending with hardcoded email address
    try {
      Logger.log('Test 1: Attempting to send email with hardcoded address...');
      Logger.log('Test 1: To address: michaelalfieri.ffl@gmail.com');
      Logger.log('Test 1: Subject: 🧪 TEST EMAIL 1 - Veteran Legacy Life Funnel');
      
      const result1 = MailApp.sendEmail({
        to: 'michaelalfieri.ffl@gmail.com',
        subject: '🧪 TEST EMAIL 1 - Veteran Legacy Life Funnel',
        htmlBody: '<h1>Test Email 1</h1><p>This is a test email with hardcoded address.</p>'
      });
      
      Logger.log('✅ Test 1 email sent successfully');
      Logger.log('✅ Test 1 result:', result1);
    } catch (emailTestError1) {
      Logger.log('❌ Test 1 failed with error object:', emailTestError1);
      Logger.log('❌ Test 1 error type:', typeof emailTestError1);
      Logger.log('❌ Test 1 error toString:', emailTestError1.toString());
      Logger.log('❌ Test 1 error name:', emailTestError1.name);
      Logger.log('❌ Test 1 error message:', emailTestError1.message);
      Logger.log('❌ Test 1 error stack:', emailTestError1.stack);
      
      // Try to get more error details
      try {
        Logger.log('❌ Test 1 error JSON:', JSON.stringify(emailTestError1));
      } catch (jsonError) {
        Logger.log('❌ Could not stringify error:', jsonError.toString());
      }
      
      // Test 2: Try with different email format
      try {
        Logger.log('Test 2: Attempting to send email with different format...');
        MailApp.sendEmail(emailConfig.ADMIN, '🧪 TEST EMAIL 2 - Veteran Legacy Life Funnel', 'This is a plain text test email.');
        Logger.log('✅ Test 2 email sent successfully');
      } catch (emailTestError2) {
        Logger.log('❌ Test 2 failed:', emailTestError2.toString());
        Logger.log('❌ Error name:', emailTestError2.name);
        Logger.log('❌ Error message:', emailTestError2.message);
        
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: 'All email sending tests failed',
          details: {
            test1: {
              name: emailTestError1.name,
              message: emailTestError1.message
            },
            test2: {
              name: emailTestError2.name,
              message: emailTestError2.message
            }
          }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Test data that matches the new FunnelStore structure exactly
    const testData1 = {
      sessionId: 'TEST_1_' + Date.now(),
      formType: 'Application',
      contactInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: emailConfig.ADMIN,
        phone: '555-123-4567',
        dateOfBirth: '1990-01-01',
        transactionalConsent: true,
        marketingConsent: true
      },
      preQualification: {
        state: 'CA',
        militaryStatus: 'Veteran',
        branchOfService: 'Army',
        maritalStatus: 'Single',
        coverageAmount: '$100,000'
      },
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: 'None',
        height: "5'10\"",
        weight: '180',
        hospitalCare: 'No',
        diabetesMedication: 'No',
        age: '30'
      },
      applicationData: {
        streetAddress: '123 Test Street',
        city: 'Test City',
        state: 'CA',
        zipCode: '90210',
        beneficiaries: [
          { name: 'Jane Doe', relationship: 'Spouse', percentage: 60 },
          { name: 'John Doe Jr.', relationship: 'Child', percentage: 25 },
          { name: 'Sarah Doe', relationship: 'Child', percentage: 15 }
        ],
        vaNumber: '123456789',
        serviceConnected: 'No',
        ssn: '123-45-6789',
        driversLicense: 'CA1234567',
        bankName: 'Test Bank',
        routingNumber: '123456789',
        accountNumber: '987654321'
      },
      quoteData: {
        policyDate: '2024-01-15',
        coverage: '$100,000',
        premium: '$45.00',
        age: '30',
        gender: 'Male',
        type: 'Term Life'
      },
      trackingData: {
        currentStep: '18',
        stepName: 'Application Complete'
      }
    };
    
    const testData2 = {
      sessionId: 'TEST_2_' + Date.now(),
      formType: 'Lead',
      contactInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: emailConfig.ADMIN,
        phone: '555-987-6543',
        dateOfBirth: '1985-05-15',
        transactionalConsent: true,
        marketingConsent: false
      },
      preQualification: {
        state: 'TX',
        militaryStatus: 'Active Duty',
        branchOfService: 'Navy',
        maritalStatus: 'Married',
        coverageAmount: '$250,000'
      },
      medicalAnswers: {
        tobaccoUse: 'No',
        medicalConditions: 'Hypertension',
        height: "5'8\"",
        weight: '160',
        hospitalCare: 'Yes',
        diabetesMedication: 'No',
        age: '35'
      },
      applicationData: {
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        beneficiaries: [
          { name: 'Mike Smith', relationship: 'Spouse', percentage: 70 },
          { name: 'Emma Smith', relationship: 'Child', percentage: 30 }
        ],
        vaNumber: '',
        serviceConnected: '',
        ssn: '',
        driversLicense: '',
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
        currentStep: '6',
        stepName: 'Contact Information'
      }
    };
    
    const testData3 = {
      sessionId: 'TEST_3_' + Date.now(),
      formType: 'Partial',
      contactInfo: {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: emailConfig.ADMIN,
        phone: '555-555-5555',
        dateOfBirth: '1975-12-25',
        transactionalConsent: false,
        marketingConsent: true
      },
      preQualification: {
        state: 'FL',
        militaryStatus: 'Veteran',
        branchOfService: 'Air Force',
        maritalStatus: 'Divorced',
        coverageAmount: '$500,000'
      },
      medicalAnswers: {
        tobaccoUse: 'Yes',
        medicalConditions: 'Diabetes',
        height: "6'0\"",
        weight: '200',
        hospitalCare: 'Yes',
        diabetesMedication: 'Yes',
        age: '45'
      },
      applicationData: {
        streetAddress: '456 Partial Ave',
        city: 'Partial City',
        state: 'FL',
        zipCode: '33101',
        beneficiaries: [
          { name: 'Child Johnson', relationship: 'Child', percentage: 50 },
          { name: 'Spouse Johnson', relationship: 'Spouse', percentage: 30 },
          { name: 'Parent Johnson', relationship: 'Parent', percentage: 20 }
        ],
        vaNumber: '987654321',
        serviceConnected: 'Yes',
        ssn: '987-65-4321',
        driversLicense: 'FL9876543',
        bankName: 'Partial Bank',
        routingNumber: '987654321',
        accountNumber: '123456789'
      },
      quoteData: {
        policyDate: '2024-02-20',
        coverage: '$500,000',
        premium: '$125.00',
        age: '45',
        gender: 'Male',
        type: 'Term Life'
      },
      trackingData: {
        currentStep: '12',
        stepName: 'Diabetes Medication'
      }
    };
    
    // Process all test data
    Logger.log('Processing test data 1 (Application)...');
    handleApplicationSubmission(testData1, testData1.sessionId);
    
    Logger.log('Processing test data 2 (Lead)...');
    handleLeadSubmission(testData2, testData2.sessionId);
    
    Logger.log('Processing test data 3 (Partial)...');
    handlePartialSubmission(testData3, testData3.sessionId);
    
    Logger.log('testNewEntriesAndEmails completed successfully');
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Test data written successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log(`Error in testNewEntriesAndEmails: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 

function setupHeaders() {
  try {
    Logger.log('Using active sheet for setupHeaders');
    const sheet = SpreadsheetApp.getActiveSheet();
    
    if (!sheet) {
      throw new Error('No active sheet found');
    }
    
    Logger.log('Active sheet name: ' + sheet.getName());
    
    // Define headers for 50 columns
    const headers = [
      'Timestamp',
      'Session ID', 
      'Status',
      'Last Activity',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Date of Birth',
      'Transactional Consent',
      'Marketing Consent',
      'State',
      'Military Status',
      'Branch of Service',
      'Marital Status',
      'Coverage Amount',
      'Tobacco Use',
      'Medical Conditions',
      'Height',
      'Weight',
      'Hospital Care',
      'Diabetes Medication',
      'Street Address',
      'City',
      'Application State',
      'ZIP Code',
      'Beneficiaries',
      'VA Number',
      'Service Connected',
      'SSN',
      'Driver\'s License',
      'Bank Name',
      'Routing Number',
      'Account Number',
      'Policy Date',
      'Quote Coverage',
      'Quote Premium',
      'Quote Age',
      'Quote Gender',
      'Quote Type',
      'Current Step',
      'Step Name',
      'Form Type',
      'User Agent',
      'Referrer',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Partial Email Sent',
      'Completed Email Sent'
    ];
    
    // Clear existing headers and set new ones
    Logger.log('Clearing existing data and setting headers...');
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    Logger.log('Headers set successfully');
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('white');
    
    // Auto-resize columns
    for (let i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    Logger.log('Headers setup completed successfully');
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Headers setup completed successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log(`Error in setupHeaders: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 