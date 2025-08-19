/**
 * Environment Configuration for Google Apps Script
 * Centralized configuration for emails, phone numbers, and other settings
 * 
 * IMPORTANT: Update these values when deploying to different environments
 */

// Environment Configuration
var CONFIG = {
  // Email Configuration
  EMAIL: {
    // Admin email (where notifications are sent)
    ADMIN: 'michaelalfieri.ffl@gmail.com',
    // From email (sender)
    FROM: 'michaelalfieri.ffl@gmail.com',
    // To email (recipient) - change to actual user email when authorized
    TO: 'michaelalfieri.ffl@gmail.com',
    // Reply-to email
    REPLY_TO: 'michaelalfieri.ffl@gmail.com'
  },
  
  // Google Sheet Configuration
  GOOGLE_SHEET: {
    // Google Sheet ID (found in the URL of the sheet)
    SHEET_ID: '1-X3qkXd6xh2Y9dG6AmIP_ljd2o0UUZfYUcR1RoreMXM',
    // Sheet name (tab name)
    SHEET_NAME: 'Veteran Legacy Life Funnel Data'
  },
  
  // Company Information
  COMPANY: {
    NAME: 'Veteran Legacy Life',
    PHONE: '503-764-5097',
    PHONE_DIALABLE: '5037645097', // Actual number to dial
    WEBSITE: 'https://veteranlegacylife.com'
  },
  
  // Environment Settings
  ENVIRONMENT: {
    // Set to 'production' or 'development'
    TYPE: 'production',
    // Enable/disable email sending
    EMAIL_ENABLED: true,
    // Enable/disable SMS sending (when implemented)
    SMS_ENABLED: false,
    // Enable/disable detailed logging
    DEBUG_LOGGING: true
  }
};

// Global function to access CONFIG from any file
function getGlobalConfig() {
  return CONFIG;
}

// Helper functions to access configuration
function getEmailConfig() {
  try {
    // Try direct access first
    if (typeof CONFIG !== 'undefined' && CONFIG.EMAIL) {
      return CONFIG.EMAIL;
    }
    
    // Fallback to global function
    const globalConfig = getGlobalConfig();
    if (globalConfig && globalConfig.EMAIL) {
      return globalConfig.EMAIL;
    }
    
    // Last resort - return hardcoded values
    Logger.log('⚠️ CONFIG not accessible, using fallback email config');
    return {
      ADMIN: 'michaelalfieri.ffl@gmail.com',
      FROM: 'michaelalfieri.ffl@gmail.com',
      TO: 'michaelalfieri.ffl@gmail.com',
      REPLY_TO: 'michaelalfieri.ffl@gmail.com'
    };
  } catch (error) {
    Logger.log('❌ Error in getEmailConfig:', error.toString());
    // Return fallback values
    return {
      ADMIN: 'michaelalfieri.ffl@gmail.com',
      FROM: 'michaelalfieri.ffl@gmail.com',
      TO: 'michaelalfieri.ffl@gmail.com',
      REPLY_TO: 'michaelalfieri.ffl@gmail.com'
    };
  }
}

function getGoogleSheetConfig() {
  return CONFIG.GOOGLE_SHEET;
}

function getCompanyConfig() {
  return CONFIG.COMPANY;
}

function getEnvironmentConfig() {
  return CONFIG.ENVIRONMENT;
}

// Validation function to ensure all required config is present
function validateConfig() {
  const required = [
    'EMAIL.ADMIN',
    'EMAIL.FROM', 
    'EMAIL.REPLY_TO',
    'GOOGLE_SHEET.SHEET_ID',
    'GOOGLE_SHEET.SHEET_NAME',
    'COMPANY.NAME',
    'COMPANY.PHONE',
    'COMPANY.WEBSITE'
  ];
  
  for (const path of required) {
    const keys = path.split('.');
    let value = CONFIG;
    for (const key of keys) {
      value = value[key];
      if (!value) {
        throw new Error(`Missing required config: ${path}`);
      }
    }
  }
  
  Logger.log('✅ Configuration validated successfully');
  return true;
}

// Initialize and validate configuration
function initializeConfig() {
  try {
    validateConfig();
    Logger.log('🚀 Environment configuration loaded successfully');
    Logger.log(`📧 Admin email: ${CONFIG.EMAIL.ADMIN}`);
    Logger.log(`🏢 Company: ${CONFIG.COMPANY.NAME}`);
    Logger.log(`📊 Sheet: ${CONFIG.GOOGLE_SHEET.SHEET_NAME}`);
    return true;
  } catch (error) {
    Logger.log('❌ Configuration validation failed:', error.toString());
    return false;
  }
} 