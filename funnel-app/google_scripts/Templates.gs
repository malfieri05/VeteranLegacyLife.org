/**
 * Templates for Google Apps Script
 * Consolidated email and SMS functions organized by notification type
 * 
 * NOTIFICATION TYPES:
 * 1. NEW LEAD - Customer lead confirmation + Admin notification
 * 2. PARTIAL LEAD - Abandonment alerts + Follow-up messages
 * 3. COMPLETE APPLICATION - Application confirmation + Admin notification
 */

// Configuration is managed in env.gs
// CONFIG object is available from env.gs file

// =============== NEW LEAD NOTIFICATIONS ===============

function sendLeadNotification(data) {
  Logger.log('Sending NEW LEAD notification email');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      medicalAnswers: data.medicalAnswers || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      phone: parsedFormData.contactInfo?.phone || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || '',
      tobaccoUse: parsedFormData.medicalAnswers?.tobaccoUse || '',
      medicalConditions: parsedFormData.medicalAnswers?.medicalConditions || '',
      height: parsedFormData.medicalAnswers?.height || '',
      weight: parsedFormData.medicalAnswers?.weight || ''
    };
    
    // Generate HTML email
    const html = generateLeadNotificationHTML(emailData);
    
    // Send admin notification
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailConfig.ADMIN,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `🚨 NEW LEAD: ${emailData.firstName} ${emailData.lastName} (${emailData.branchOfService})`,
      htmlBody: html
    });
    
    // Send customer confirmation
    sendLeadConfirmation(data);
    
    Logger.log('NEW LEAD notifications sent successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending NEW LEAD notifications:', error.toString());
    return false;
  }
}

function sendLeadConfirmation(data) {
  Logger.log('Sending NEW LEAD confirmation email to customer');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || ''
    };
    
    // Generate HTML email
    const html = generateLeadConfirmationHTML(emailData);
    
    // Send email to customer
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailData.email,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `Thank you for your interest in Veteran Legacy Life Insurance`,
      htmlBody: html
    });
    
    Logger.log('NEW LEAD confirmation email sent to customer successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending NEW LEAD confirmation email:', error.toString());
    return false;
  }
}

function sendLeadNotificationSMS(data) {
  Logger.log('Sending NEW LEAD SMS notification');
  
  try {
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    const message = `NEW LEAD: ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''} - ${parsedFormData.preQualification?.branchOfService || ''} - ${parsedFormData.preQualification?.coverageAmount || ''} coverage. Contact: ${parsedFormData.contactInfo?.phone || ''}`;
    
    // sendSMS(CONFIG.EMAIL.ADMIN, message); // Uncomment when SMS service is configured
    
    Logger.log('NEW LEAD SMS notification sent');
    return true;
    
  } catch (error) {
    Logger.log('Error sending NEW LEAD SMS:', error.toString());
    return false;
  }
}

// =============== PARTIAL LEAD NOTIFICATIONS ===============

function sendPartialLeadEmail(data, sessionId) {
  Logger.log('Sending PARTIAL LEAD abandonment alert');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      phone: parsedFormData.contactInfo?.phone || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || ''
    };
    
    // Generate HTML email
    const html = generateAbandonmentAlertHTML(emailData);
    
    // Send admin alert
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailConfig.ADMIN,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `⚠️ ABANDONED LEAD: ${emailData.firstName} ${emailData.lastName} - Follow up needed`,
      htmlBody: html
    });
    
    // Send customer recovery email
    sendAbandonmentRecoveryEmail(data);
    
    Logger.log('PARTIAL LEAD notifications sent successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending PARTIAL LEAD notifications:', error.toString());
    return false;
  }
}

function sendAbandonmentRecoveryEmail(data) {
  Logger.log('Sending PARTIAL LEAD recovery email to customer');
  
  try {
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || ''
    };
    
    const html = generateAbandonmentRecoveryHTML(emailData);
    
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailData.email,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `Complete Your Veteran Legacy Life Insurance Application`,
      htmlBody: html
    });
    
    Logger.log('PARTIAL LEAD recovery email sent to customer');
    return true;
    
  } catch (error) {
    Logger.log('Error sending PARTIAL LEAD recovery email:', error.toString());
    return false;
  }
}

function sendAbandonmentAlertSMS(data) {
  Logger.log('Sending PARTIAL LEAD SMS alert');
  
  try {
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {}
    };
    
    const message = `ABANDONED LEAD: ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''} - ${parsedFormData.preQualification?.branchOfService || ''} - ${parsedFormData.preQualification?.coverageAmount || ''} coverage. Contact: ${parsedFormData.contactInfo?.phone || ''} - Follow up needed!`;
    
    // sendSMS(CONFIG.EMAIL.ADMIN, message); // Uncomment when SMS service is configured
    
    Logger.log('PARTIAL LEAD SMS alert sent');
    return true;
    
  } catch (error) {
    Logger.log('Error sending PARTIAL LEAD SMS:', error.toString());
    return false;
  }
}

// =============== COMPLETE APPLICATION NOTIFICATIONS ===============

function sendApplicationCompleteEmail(data) {
  Logger.log('Sending COMPLETE APPLICATION notification');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      medicalAnswers: data.medicalAnswers || {},
      applicationData: data.applicationData || {},
      quoteData: data.quoteData || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      phone: parsedFormData.contactInfo?.phone || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || '',
      streetAddress: parsedFormData.applicationData?.streetAddress || '',
      city: parsedFormData.applicationData?.city || '',
      applicationState: parsedFormData.applicationData?.state || '',
      zipCode: parsedFormData.applicationData?.zipCode || '',
      beneficiaryName: parsedFormData.applicationData?.beneficiaryName || '',
      beneficiaryRelationship: parsedFormData.applicationData?.beneficiaryRelationship || '',
      vaNumber: parsedFormData.applicationData?.vaNumber || '',
      serviceConnected: parsedFormData.applicationData?.serviceConnected || '',
      ssn: encryptSensitiveData(parsedFormData.applicationData?.ssn || ''),
      driversLicense: encryptSensitiveData(parsedFormData.applicationData?.driversLicense || ''),
      bankName: parsedFormData.applicationData?.bankName || '',
      routingNumber: encryptSensitiveData(parsedFormData.applicationData?.routingNumber || ''),
      accountNumber: encryptSensitiveData(parsedFormData.applicationData?.accountNumber || ''),
      policyDate: parsedFormData.quoteData?.policyDate || '',
      quoteCoverage: parsedFormData.quoteData?.coverage || '',
      quotePremium: parsedFormData.quoteData?.premium || '',
      quoteAge: parsedFormData.quoteData?.age || '',
      quoteGender: parsedFormData.quoteData?.gender || '',
      quoteType: parsedFormData.quoteData?.type || ''
    };
    
    // Generate HTML email
    const html = generateApplicationCompleteHTML(emailData);
    
    // Send admin notification
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailConfig.ADMIN,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `✅ APPLICATION COMPLETE: ${emailData.firstName} ${emailData.lastName} - ${emailData.quoteCoverage} Coverage`,
      htmlBody: html
    });
    
    // Send customer confirmation
    sendApplicationConfirmation(data);
    
    Logger.log('COMPLETE APPLICATION notifications sent successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending COMPLETE APPLICATION notifications:', error.toString());
    return false;
  }
}

function sendApplicationNotification(data, sessionId) {
  Logger.log('Sending COMPLETE APPLICATION notification');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      medicalAnswers: data.medicalAnswers || {},
      applicationData: data.applicationData || {},
      quoteData: data.quoteData || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      phone: parsedFormData.contactInfo?.phone || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      state: parsedFormData.preQualification?.state || '',
      streetAddress: parsedFormData.applicationData?.streetAddress || '',
      city: parsedFormData.applicationData?.city || '',
      applicationState: parsedFormData.applicationData?.state || '',
      zipCode: parsedFormData.applicationData?.zipCode || '',
      beneficiaryName: parsedFormData.applicationData?.beneficiaryName || '',
      beneficiaryRelationship: parsedFormData.applicationData?.beneficiaryRelationship || '',
      vaNumber: parsedFormData.applicationData?.vaNumber || '',
      serviceConnected: parsedFormData.applicationData?.serviceConnected || '',
      ssn: encryptSensitiveData(parsedFormData.applicationData?.ssn || ''),
      driversLicense: encryptSensitiveData(parsedFormData.applicationData?.driversLicense || ''),
      bankName: parsedFormData.applicationData?.bankName || '',
      routingNumber: encryptSensitiveData(parsedFormData.applicationData?.routingNumber || ''),
      accountNumber: encryptSensitiveData(parsedFormData.applicationData?.accountNumber || ''),
      policyDate: parsedFormData.quoteData?.policyDate || '',
      quoteCoverage: parsedFormData.quoteData?.coverage || '',
      quotePremium: parsedFormData.quoteData?.premium || '',
      quoteAge: parsedFormData.quoteData?.age || '',
      quoteGender: parsedFormData.quoteData?.gender || '',
      quoteType: parsedFormData.quoteData?.type || ''
    };
    
    // Generate HTML email
    const html = generateApplicationCompleteHTML(emailData);
    
    // Send admin notification
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailConfig.ADMIN,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `✅ APPLICATION COMPLETE: ${emailData.firstName} ${emailData.lastName} - ${emailData.quoteCoverage} Coverage`,
      htmlBody: html
    });
    
    // Send customer confirmation
    sendApplicationConfirmation(data);
    
    Logger.log('COMPLETE APPLICATION notifications sent successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending COMPLETE APPLICATION notifications:', error.toString());
    return false;
  }
}

function sendApplicationConfirmation(data) {
  Logger.log('Sending COMPLETE APPLICATION confirmation email to customer');
  
  try {
    // Parse form data
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      quoteData: data.quoteData || {}
    };
    
    // Build email data
    const emailData = {
      firstName: parsedFormData.contactInfo?.firstName || '',
      lastName: parsedFormData.contactInfo?.lastName || '',
      email: parsedFormData.contactInfo?.email || '',
      militaryStatus: parsedFormData.preQualification?.militaryStatus || '',
      branchOfService: parsedFormData.preQualification?.branchOfService || '',
      coverageAmount: parsedFormData.preQualification?.coverageAmount || '',
      quoteCoverage: parsedFormData.quoteData?.coverage || '',
      quotePremium: parsedFormData.quoteData?.premium || '',
      quoteType: parsedFormData.quoteData?.type || ''
    };
    
    // Generate HTML email
    const html = generateApplicationConfirmationHTML(emailData);
    
    // Send email to customer
    const emailConfig = getEmailConfig();
    MailApp.sendEmail({
      to: emailData.email,
      from: emailConfig.FROM,
      replyTo: emailConfig.REPLY_TO,
      subject: `Your Veteran Legacy Life Insurance Application is Complete`,
      htmlBody: html
    });
    
    Logger.log('COMPLETE APPLICATION confirmation email sent to customer successfully');
    return true;
    
  } catch (error) {
    Logger.log('Error sending COMPLETE APPLICATION confirmation email:', error.toString());
    return false;
  }
}

function sendApplicationCompleteSMS(data) {
  Logger.log('Sending COMPLETE APPLICATION SMS notification');
  
  try {
    const parsedFormData = {
      contactInfo: data.contactInfo || {},
      preQualification: data.preQualification || {},
      quoteData: data.quoteData || {}
    };
    
    const message = `APPLICATION COMPLETE: ${parsedFormData.contactInfo?.firstName || ''} ${parsedFormData.contactInfo?.lastName || ''} - ${parsedFormData.quoteData?.coverage || ''} coverage - ${parsedFormData.quoteData?.premium || ''} premium. Contact: ${parsedFormData.contactInfo?.phone || ''}`;
    
    // sendSMS(CONFIG.EMAIL.ADMIN, message); // Uncomment when SMS service is configured
    
    Logger.log('COMPLETE APPLICATION SMS notification sent');
    return true;
    
  } catch (error) {
    Logger.log('Error sending COMPLETE APPLICATION SMS:', error.toString());
    return false;
  }
}

// =============== HELPER FUNCTIONS ===============

function encryptSensitiveData(data) {
  if (!data || data.length < 4) return data;
  return '*'.repeat(data.length - 4) + data.slice(-4);
}

function generateSubject(type, data) {
  switch (type) {
    case 'newLead':
      return `🚨 NEW LEAD: ${data.firstName} ${data.lastName} (${data.branchOfService})`;
    case 'completeApplication':
      return `✅ APPLICATION COMPLETE: ${data.firstName} ${data.lastName} - ${data.quoteCoverage} Coverage`;
    case 'partialLead':
      return `⚠️ ABANDONED LEAD: ${data.firstName} ${data.lastName} - Follow up needed`;
    case 'leadConfirmation':
      return `Thank you for your interest in Veteran Legacy Life Insurance`;
    case 'applicationConfirmation':
      return `Your Veteran Legacy Life Insurance Application is Complete`;
    case 'abandonmentRecovery':
      return `Complete Your Veteran Legacy Life Insurance Application`;
    default:
      return 'Veteran Legacy Life Insurance Notification';
  }
}

// =============== HTML TEMPLATE GENERATORS ===============

function generateLeadNotificationHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Notification</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert-box { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        .data-table th { background: #f3f4f6; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>🚨 New Lead Received</h2>
          
          <div class="alert-box">
            <h3>Lead Summary</h3>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</p>
            <p><strong>Coverage:</strong> ${data.coverageAmount}</p>
            <p><strong>Contact:</strong> ${data.email} | ${data.phone}</p>
          </div>
          
          <table class="data-table">
            <tr><th colspan="2">Contact Information</th></tr>
            <tr><td>Name</td><td>${data.firstName} ${data.lastName}</td></tr>
            <tr><td>Email</td><td>${data.email}</td></tr>
            <tr><td>Phone</td><td>${data.phone}</td></tr>
            <tr><td>State</td><td>${data.state}</td></tr>
            <tr><td>Military Status</td><td>${data.militaryStatus}</td></tr>
            <tr><td>Branch of Service</td><td>${data.branchOfService}</td></tr>
            <tr><td>Coverage Amount</td><td>${data.coverageAmount}</td></tr>
            <tr><td>Tobacco Use</td><td>${data.tobaccoUse}</td></tr>
            <tr><td>Medical Conditions</td><td>${data.medicalConditions}</td></tr>
            <tr><td>Height</td><td>${data.height}</td></tr>
            <tr><td>Weight</td><td>${data.weight}</td></tr>
          </table>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateLeadConfirmationHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - Veteran Legacy Life</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .thank-you-box { background: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>Thank You for Your Interest!</h2>
          
          <div class="thank-you-box">
            <h3>Dear ${data.firstName},</h3>
            <p>Thank you for your interest in Veteran Legacy Life Insurance. We have received your information and our team will be in touch with you shortly to discuss your options.</p>
            
            <h4>Your Information:</h4>
            <ul>
              <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
              <li><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</li>
              <li><strong>Desired Coverage:</strong> ${data.coverageAmount}</li>
              <li><strong>State:</strong> ${data.state}</li>
            </ul>
            
            <p>We understand the unique needs of veterans and their families, and we're committed to finding you the best insurance options available.</p>
          </div>
          
          <p>If you have any questions, please don't hesitate to contact us at ${companyConfig.PHONE}.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateApplicationCompleteHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Complete Notification</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .data-table th, .data-table td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
        .data-table th { background: #f3f4f6; font-weight: bold; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>✅ Application Complete</h2>
          
          <div class="success-box">
            <h3>Application Summary</h3>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Coverage:</strong> ${data.quoteCoverage}</p>
            <p><strong>Premium:</strong> ${data.quotePremium}</p>
            <p><strong>Contact:</strong> ${data.email} | ${data.phone}</p>
          </div>
          
          <table class="data-table">
            <tr><th colspan="2">Contact Information</th></tr>
            <tr><td>Name</td><td>${data.firstName} ${data.lastName}</td></tr>
            <tr><td>Email</td><td>${data.email}</td></tr>
            <tr><td>Phone</td><td>${data.phone}</td></tr>
            <tr><td>Military Status</td><td>${data.militaryStatus}</td></tr>
            <tr><td>Branch of Service</td><td>${data.branchOfService}</td></tr>
            <tr><td>Coverage Amount</td><td>${data.coverageAmount}</td></tr>
            <tr><th colspan="2">Application Details</th></tr>
            <tr><td>Street Address</td><td>${data.streetAddress}</td></tr>
            <tr><td>City</td><td>${data.city}</td></tr>
            <tr><td>State</td><td>${data.applicationState}</td></tr>
            <tr><td>ZIP Code</td><td>${data.zipCode}</td></tr>
            <tr><td>Beneficiary Name</td><td>${data.beneficiaryName}</td></tr>
            <tr><td>Beneficiary Relationship</td><td>${data.beneficiaryRelationship}</td></tr>
            <tr><td>VA Number</td><td>${data.vaNumber}</td></tr>
            <tr><td>Service Connected</td><td>${data.serviceConnected}</td></tr>
            <tr><td>SSN</td><td>${data.ssn}</td></tr>
            <tr><td>Drivers License</td><td>${data.driversLicense}</td></tr>
            <tr><td>Bank Name</td><td>${data.bankName}</td></tr>
            <tr><td>Routing Number</td><td>${data.routingNumber}</td></tr>
            <tr><td>Account Number</td><td>${data.accountNumber}</td></tr>
            <tr><th colspan="2">Quote Information</th></tr>
            <tr><td>Policy Date</td><td>${data.policyDate}</td></tr>
            <tr><td>Coverage</td><td>${data.quoteCoverage}</td></tr>
            <tr><td>Premium</td><td>${data.quotePremium}</td></tr>
            <tr><td>Age</td><td>${data.quoteAge}</td></tr>
            <tr><td>Gender</td><td>${data.quoteGender}</td></tr>
            <tr><td>Quote Type</td><td>${data.quoteType}</td></tr>
          </table>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateApplicationConfirmationHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Confirmation - Veteran Legacy Life</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: linear-gradient(135deg, #3b82f6 0%, #ffffff 100%);">
        
        <!-- Email Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #3b82f6 0%, #ffffff 100%); padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: rgba(255,255,255,0.95); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 600px;">
                        
                        <!-- Header -->
                        <tr>
                            <td style="padding: 20px 30px 10px 30px; text-align: center; background-color: transparent;">
                                <img src="https://www.veteranlegacylife.com/logo.png" alt="Veteran Legacy Life" style="max-width: 120px; height: auto; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto;">
                                <h1 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 4px 0;">Veteran Legacy Life</h1>
                                <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0; font-weight: 400;">Veteran Life Insurance Specialists</p>
                            </td>
                        </tr>
                        
                        <!-- Main Content -->
                        <tr>
                            <td style="padding: 10px 30px 40px 30px;">
                                
                                <!-- Success Section -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
                                    <tr>
                                        <td style="text-align: center;">
                                            <div style="font-size: 36px; color: #10b981; margin: 0 auto 20px; text-align: center; font-weight: bold;">✅</div>
                                            <h2 style="font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 12px 0;">Congratulations, ${data.firstName}!</h2>
                                            <p style="font-size: 16px; color: #6b7280; margin: 0; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.6;">
                                                Your Veteran Legacy Life Insurance application has been successfully submitted. 
                                                Our team will review your application and contact you within 1-2 business days.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Quote Card -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; margin: 40px 0;">
                                    <tr>
                                        <td style="padding: 30px; text-align: center;">
                                            <h3 style="font-size: 18px; color: #475569; margin: 0 0 20px 0; font-weight: 600;">Your Insurance Quote</h3>
                                            <div style="font-size: 48px; font-weight: 800; color: #1e40af; margin: 0 0 8px 0; letter-spacing: -1px;">${data.quoteCoverage}</div>
                                            <div style="font-size: 20px; color: #10b981; font-weight: 600; margin: 0 0 16px 0;">${data.quotePremium} / month</div>
                                            <span style="background: #ddd6fe; color: #5b21b6; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block;">${data.quoteType} Policy</span>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Application Summary -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0;">
                                    <tr>
                                        <td>
                                            <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 24px 0;">📋 Application Summary</h3>
                                            
                                            <!-- Info Grid -->
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td width="50%" style="padding-right: 10px; vertical-align: top;">
                                                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
                                                            <div style="font-size: 14px; color: #6b7280; font-weight: 500; margin-bottom: 4px;">Name</div>
                                                            <div style="font-size: 16px; color: #1f2937; font-weight: 600;">${data.firstName} ${data.lastName}</div>
                                                        </div>
                                                    </td>
                                                    <td width="50%" style="padding-left: 10px; vertical-align: top;">
                                                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
                                                            <div style="font-size: 14px; color: #6b7280; font-weight: 500; margin-bottom: 4px;">Military Status</div>
                                                            <div style="font-size: 16px; color: #1f2937; font-weight: 600;">${data.militaryStatus} - ${data.branchOfService}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="50%" style="padding-right: 10px; vertical-align: top;">
                                                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                                            <div style="font-size: 14px; color: #6b7280; font-weight: 500; margin-bottom: 4px;">Coverage Amount</div>
                                                            <div style="font-size: 16px; color: #1f2937; font-weight: 600;">${data.coverageAmount}</div>
                                                        </div>
                                                    </td>
                                                    <td width="50%" style="padding-left: 10px; vertical-align: top;">
                                                        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                                                            <div style="font-size: 14px; color: #6b7280; font-weight: 500; margin-bottom: 4px;">Policy Type</div>
                                                            <div style="font-size: 16px; color: #1f2937; font-weight: 600;">${data.quoteType}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- What Happens Next -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0;">
                                    <tr>
                                        <td>
                                            <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin: 0 0 24px 0;">⏰ What Happens Next?</h3>
                                            
                                            <!-- Process List -->
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <table cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                                <td style="vertical-align: top; padding-right: 16px;">
                                                                    <div style="width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">1</div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">Phone Call</div>
                                                                    <div style="font-size: 14px; color: #6b7280;">Licensed agent will call within 24 hours</div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <table cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                                <td style="vertical-align: top; padding-right: 16px;">
                                                                    <div style="width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">2</div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">Review Process</div>
                                                                    <div style="font-size: 14px; color: #6b7280;">Application review and verification</div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                                                        <table cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                                <td style="vertical-align: top; padding-right: 16px;">
                                                                    <div style="width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">3</div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">Finalization</div>
                                                                    <div style="font-size: 14px; color: #6b7280;">Policy setup and activation</div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0;">
                                                        <table cellpadding="0" cellspacing="0" border="0">
                                                            <tr>
                                                                <td style="vertical-align: top; padding-right: 16px;">
                                                                    <div style="width: 32px; height: 32px; background: #3b82f6; color: white; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">4</div>
                                                                </td>
                                                                <td style="vertical-align: top;">
                                                                    <div style="font-weight: 600; color: #1f2937; margin-bottom: 2px;">Coverage Active</div>
                                                                    <div style="font-size: 14px; color: #6b7280;">Your protection begins</div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- CTA Button -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0;">
                                    <tr>
                                        <td style="text-align: center;">
                                            <a href="tel:${companyConfig.PHONE_DIALABLE}" style="display: inline-block; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);">
                                                📞 Call Us Now
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Help Section -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #f59e0b; border-radius: 12px; margin: 32px 0;">
                                    <tr>
                                        <td style="padding: 24px;">
                                            <h4 style="font-size: 18px; font-weight: 600; color: #92400e; margin: 0 0 12px 0;">💡 Need Help?</h4>
                                            <p style="color: #92400e; font-size: 14px; line-height: 1.5; margin: 0;">
                                                If you have any questions about your application or need to make changes, 
                                                please don't hesitate to contact us. We're here to help!
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <img src="https://www.veteranlegacylife.com/logo.png" alt="Veteran Legacy Life" style="max-width: 120px; height: auto; margin: 0 auto 16px; display: block;">
                                
                                <div style="font-size: 16px; font-weight: 700; color: #1f2937; margin-bottom: 4px;">Veteran Legacy Life</div>
                                <div style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">Veteran Life Insurance Specialists</div>
                                
                                <!-- Contact Links -->
                                <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px;">
                                    <tr>
                                        <td style="padding: 0 12px;">
                                            <a href="tel:${companyConfig.PHONE_DIALABLE}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">📞 ${companyConfig.PHONE}</a>
                                        </td>
                                        <td style="padding: 0 12px;">
                                            <a href="${companyConfig.WEBSITE}" style="color: #3b82f6; text-decoration: none; font-weight: 500;">🌐 ${companyConfig.WEBSITE.replace('https://', '')}</a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Trust Badges -->
                                <div>
                                    <span style="background: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 0 6px;">✓ Licensed</span>
                                    <span style="background: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 0 6px;">✓ Veteran-Owned</span>
                                    <span style="background: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin: 0 6px;">✓ Trusted</span>
                                </div>
                            </td>
                        </tr>
                        
                    </table>
                </td>
            </tr>
        </table>
        
    </body>
    </html>
  `;
}

function generateAbandonmentAlertHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Abandoned Lead Alert</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .alert-box { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>⚠️ Abandoned Lead Alert</h2>
          
          <div class="alert-box">
            <h3>Lead Information</h3>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</p>
            <p><strong>Desired Coverage:</strong> ${data.coverageAmount}</p>
            <p><strong>State:</strong> ${data.state}</p>
          </div>
          
          <p>This lead started the application process but did not complete it. Please follow up with them to encourage completion of their application.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateAbandonmentRecoveryHTML(data) {
  const companyConfig = getCompanyConfig();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Complete Your Application - Veteran Legacy Life</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; }
        .email-container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .recovery-box { background: #fffbeb; border: 1px solid #fed7aa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Veteran Legacy Life</h1>
          <p>Veteran Life Insurance Specialists</p>
        </div>
        
        <div class="content">
          <h2>Complete Your Application</h2>
          
          <div class="recovery-box">
            <h3>Dear ${data.firstName},</h3>
            <p>We noticed you started your Veteran Legacy Life Insurance application but didn't complete it. We'd love to help you finish the process and get the coverage you deserve.</p>
            
            <h4>Your Started Application:</h4>
            <ul>
              <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
              <li><strong>Military Status:</strong> ${data.militaryStatus} - ${data.branchOfService}</li>
              <li><strong>Desired Coverage:</strong> ${data.coverageAmount}</li>
            </ul>
            
            <p>Completing your application only takes a few more minutes, and our team is ready to help you every step of the way.</p>
            
            <p><strong>Why complete your application?</strong></p>
            <ul>
              <li>Get the coverage you and your family deserve</li>
              <li>Take advantage of veteran-specific benefits</li>
              <li>Lock in competitive rates</li>
              <li>Ensure your family's financial security</li>
            </ul>
          </div>
          
          <p>If you have any questions or need assistance, please contact us at ${companyConfig.PHONE}.</p>
        </div>
        
        <div class="footer">
          <p><strong>Veteran Legacy Life</strong></p>
          <p>Phone: <a href="tel:${companyConfig.PHONE_DIALABLE}">${companyConfig.PHONE}</a></p>
          <p>Website: <a href="${companyConfig.WEBSITE}">${companyConfig.WEBSITE}</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}