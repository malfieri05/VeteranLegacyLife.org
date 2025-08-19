/**
 * Enhanced Email Templates for Google Apps Script
 * Beautiful, professional email designs with logo integration
 */

// =============== EMAIL STYLE CONSTANTS ===============

const EMAIL_STYLES = {
  // Color scheme
  primary: '#1e3a8a',
  secondary: '#3b82f6', 
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#dc2626',
  light: '#f8fafc',
  dark: '#1e293b',
  gray: '#6b7280',
  
  // Typography
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  
  // Spacing
  padding: '20px',
  margin: '10px 0',
  
  // Border radius
  borderRadius: '12px',
  
  // Shadows
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
};

// =============== EMAIL HEADER TEMPLATE ===============

function generateEmailHeader(title, subtitle = '') {
  const companyConfig = getCompanyConfig();
  return `
    <div style="background: linear-gradient(135deg, ${EMAIL_STYLES.primary}, ${EMAIL_STYLES.secondary}); 
                color: white; 
                padding: ${EMAIL_STYLES.padding}; 
                text-align: center; 
                border-radius: ${EMAIL_STYLES.borderRadius} ${EMAIL_STYLES.borderRadius} 0 0;">
      
      <!-- Logo Section -->
      <div style="margin-bottom: 15px;">
        <img src="https://veteranlegacylife.com/wp-content/uploads/2024/01/veteran-legacy-life-logo-white.png" 
             alt="Veteran Legacy Life" 
             style="height: 60px; width: auto; max-width: 200px; object-fit: contain;">
      </div>
      
      <!-- Title Section -->
      <h1 style="margin: 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        ${title}
      </h1>
      
      ${subtitle ? `<p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${subtitle}</p>` : ''}
      
      <!-- Decorative Element -->
      <div style="width: 60px; height: 3px; background: rgba(255,255,255,0.3); margin: 15px auto 0; border-radius: 2px;"></div>
    </div>
  `;
}

// =============== EMAIL FOOTER TEMPLATE ===============

function generateEmailFooter() {
  const companyConfig = getCompanyConfig();
  return `
    <div style="background: ${EMAIL_STYLES.light}; 
                padding: ${EMAIL_STYLES.padding}; 
                text-align: center; 
                border-radius: 0 0 ${EMAIL_STYLES.borderRadius} ${EMAIL_STYLES.borderRadius};
                border-top: 1px solid #e5e7eb;">
      
      <!-- Company Info -->
      <div style="margin-bottom: 15px;">
        <img src="https://veteranlegacylife.com/wp-content/uploads/2024/01/veteran-legacy-life-logo.png" 
             alt="Veteran Legacy Life" 
             style="height: 40px; width: auto; margin-bottom: 10px;">
        <p style="margin: 0; font-size: 14px; color: ${EMAIL_STYLES.gray};">
          <strong>Veteran Legacy Life</strong><br>
          Veteran Life Insurance Specialists
        </p>
      </div>
      
      <!-- Contact Info -->
      <div style="display: inline-block; margin: 0 15px;">
        <a href="tel:${companyConfig.PHONE_DIALABLE}" 
           style="color: ${EMAIL_STYLES.primary}; text-decoration: none; font-weight: 600;">
          📞 ${companyConfig.PHONE}
        </a>
      </div>
      
      <div style="display: inline-block; margin: 0 15px;">
        <a href="${companyConfig.WEBSITE}" 
           style="color: ${EMAIL_STYLES.primary}; text-decoration: none; font-weight: 600;">
          🌐 ${companyConfig.WEBSITE}
        </a>
      </div>
      
      <!-- Trust Badges -->
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <span style="display: inline-block; margin: 0 5px; padding: 4px 8px; background: ${EMAIL_STYLES.success}; 
                    color: white; border-radius: 4px; font-size: 11px; font-weight: 600;">
          ✓ Licensed
        </span>
        <span style="display: inline-block; margin: 0 5px; padding: 4px 8px; background: ${EMAIL_STYLES.primary}; 
                    color: white; border-radius: 4px; font-size: 11px; font-weight: 600;">
          ✓ Veteran-Owned
        </span>
        <span style="display: inline-block; margin: 0 5px; padding: 4px 8px; background: ${EMAIL_STYLES.warning}; 
                    color: white; border-radius: 4px; font-size: 11px; font-weight: 600;">
          ✓ Trusted
        </span>
      </div>
    </div>
  `;
}

// =============== ENHANCED HTML TEMPLATE GENERATORS ===============

function generateLeadNotificationHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Notification - Veteran Legacy Life</title>
      <style>
        body { 
          font-family: ${EMAIL_STYLES.fontFamily}; 
          margin: 0; 
          padding: 0; 
          background: #f8fafc; 
        }
        .email-container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
          overflow: hidden; 
        }
        .content { 
          padding: ${EMAIL_STYLES.padding}; 
        }
        .alert-box { 
          background: linear-gradient(135deg, #fef2f2, #fecaca); 
          border: 1px solid #fca5a5; 
          padding: 20px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          margin: 20px 0; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
        }
        .data-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 15px; 
          margin: 20px 0; 
        }
        .data-item { 
          background: ${EMAIL_STYLES.light}; 
          padding: 15px; 
          border-radius: 8px; 
          border-left: 4px solid ${EMAIL_STYLES.primary}; 
        }
        .data-label { 
          font-size: 12px; 
          color: ${EMAIL_STYLES.gray}; 
          text-transform: uppercase; 
          font-weight: 600; 
          margin-bottom: 5px; 
        }
        .data-value { 
          font-size: 16px; 
          color: ${EMAIL_STYLES.dark}; 
          font-weight: 600; 
        }
        .highlight { 
          background: linear-gradient(135deg, ${EMAIL_STYLES.primary}, ${EMAIL_STYLES.secondary}); 
          color: white; 
          padding: 15px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          text-align: center; 
          margin: 20px 0; 
        }
        @media (max-width: 600px) {
          .data-grid { grid-template-columns: 1fr; }
          .email-container { margin: 10px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        ${generateEmailHeader('🚨 New Lead Alert', 'Veteran Legacy Life Insurance')}
        
        <div class="content">
          <div class="highlight">
            <h2 style="margin: 0; font-size: 24px;">New Lead Received!</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">A potential client has shown interest in our services</p>
          </div>
          
          <div class="alert-box">
            <h3 style="margin: 0 0 15px 0; color: ${EMAIL_STYLES.danger};">
              📋 Lead Summary
            </h3>
            <div class="data-grid">
              <div class="data-item">
                <div class="data-label">Name</div>
                <div class="data-value">${data.firstName} ${data.lastName}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Military Status</div>
                <div class="data-value">${data.militaryStatus} - ${data.branchOfService}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Coverage</div>
                <div class="data-value">${data.coverageAmount}</div>
              </div>
              <div class="data-item">
                <div class="data-label">State</div>
                <div class="data-value">${data.state}</div>
              </div>
            </div>
          </div>
          
          <h3 style="color: ${EMAIL_STYLES.primary}; margin: 30px 0 15px 0;">📞 Contact Information</h3>
          <div class="data-grid">
            <div class="data-item">
              <div class="data-label">Email</div>
              <div class="data-value">${data.email}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Phone</div>
              <div class="data-value">${data.phone}</div>
            </div>
          </div>
          
          <h3 style="color: ${EMAIL_STYLES.primary}; margin: 30px 0 15px 0;">🏥 Medical Information</h3>
          <div class="data-grid">
            <div class="data-item">
              <div class="data-label">Tobacco Use</div>
              <div class="data-value">${data.tobaccoUse}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Medical Conditions</div>
              <div class="data-value">${data.medicalConditions}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Height</div>
              <div class="data-value">${data.height}</div>
            </div>
            <div class="data-item">
              <div class="data-label">Weight</div>
              <div class="data-value">${data.weight}</div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${data.email}" 
               style="display: inline-block; background: ${EMAIL_STYLES.primary}; 
                      color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: ${EMAIL_STYLES.borderRadius}; font-weight: 600;">
              📧 Contact Lead
            </a>
          </div>
        </div>
        
        ${generateEmailFooter()}
      </div>
    </body>
    </html>
  `;
}

function generateLeadConfirmationHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You - Veteran Legacy Life</title>
      <style>
        body { 
          font-family: ${EMAIL_STYLES.fontFamily}; 
          margin: 0; 
          padding: 0; 
          background: #f8fafc; 
        }
        .email-container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
          overflow: hidden; 
        }
        .content { 
          padding: ${EMAIL_STYLES.padding}; 
        }
        .thank-you-box { 
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe); 
          border: 1px solid #7dd3fc; 
          padding: 25px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          margin: 20px 0; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
        }
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 15px; 
          margin: 20px 0; 
        }
        .info-item { 
          background: white; 
          padding: 15px; 
          border-radius: 8px; 
          border-left: 4px solid ${EMAIL_STYLES.secondary}; 
        }
        .info-label { 
          font-size: 12px; 
          color: ${EMAIL_STYLES.gray}; 
          text-transform: uppercase; 
          font-weight: 600; 
          margin-bottom: 5px; 
        }
        .info-value { 
          font-size: 16px; 
          color: ${EMAIL_STYLES.dark}; 
          font-weight: 600; 
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, ${EMAIL_STYLES.primary}, ${EMAIL_STYLES.secondary}); 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          font-weight: 600; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
          margin: 20px 0; 
        }
        @media (max-width: 600px) {
          .info-grid { grid-template-columns: 1fr; }
          .email-container { margin: 10px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        ${generateEmailHeader('Thank You!', 'Veteran Legacy Life Insurance')}
        
        <div class="content">
          <div class="thank-you-box">
            <h2 style="margin: 0 0 15px 0; color: ${EMAIL_STYLES.primary};">
              Dear ${data.firstName},
            </h2>
            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
              Thank you for your interest in <strong>Veteran Legacy Life Insurance</strong>. 
              We have received your information and our team of veteran insurance specialists 
              will be in touch with you shortly to discuss your options.
            </p>
            
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">
              We understand the unique needs of veterans and their families, and we're committed 
              to finding you the best insurance options available.
            </p>
          </div>
          
          <h3 style="color: ${EMAIL_STYLES.primary}; margin: 30px 0 15px 0;">📋 Your Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Name</div>
              <div class="info-value">${data.firstName} ${data.lastName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Military Status</div>
              <div class="info-value">${data.militaryStatus} - ${data.branchOfService}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Desired Coverage</div>
              <div class="info-value">${data.coverageAmount}</div>
            </div>
            <div class="info-item">
              <div class="info-label">State</div>
              <div class="info-value">${data.state}</div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="tel:${getCompanyConfig().PHONE_DIALABLE}" class="cta-button">
              📞 Call Us Now
            </a>
          </div>
          
          <div style="background: ${EMAIL_STYLES.light}; padding: 20px; border-radius: ${EMAIL_STYLES.borderRadius}; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: ${EMAIL_STYLES.primary};">
              ⏰ What Happens Next?
            </h4>
            <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Our team will review your information within 24 hours</li>
              <li>A licensed insurance specialist will contact you</li>
              <li>We'll discuss your specific needs and options</li>
              <li>You'll receive a personalized quote</li>
            </ul>
          </div>
        </div>
        
        ${generateEmailFooter()}
      </div>
    </body>
    </html>
  `;
}

// Continue with other email templates... 

function generateApplicationCompleteHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Complete - Veteran Legacy Life</title>
      <style>
        body { 
          font-family: ${EMAIL_STYLES.fontFamily}; 
          margin: 0; 
          padding: 0; 
          background: #f8fafc; 
        }
        .email-container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
          overflow: hidden; 
        }
        .content { 
          padding: ${EMAIL_STYLES.padding}; 
        }
        .success-box { 
          background: linear-gradient(135deg, #f0fdf4, #dcfce7); 
          border: 1px solid #86efac; 
          padding: 25px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          margin: 20px 0; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
        }
        .quote-highlight { 
          background: linear-gradient(135deg, ${EMAIL_STYLES.success}, #059669); 
          color: white; 
          padding: 20px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          text-align: center; 
          margin: 20px 0; 
        }
        .data-section { 
          margin: 25px 0; 
        }
        .data-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 12px; 
          margin: 15px 0; 
        }
        .data-item { 
          background: ${EMAIL_STYLES.light}; 
          padding: 12px; 
          border-radius: 8px; 
          border-left: 3px solid ${EMAIL_STYLES.success}; 
        }
        .data-label { 
          font-size: 11px; 
          color: ${EMAIL_STYLES.gray}; 
          text-transform: uppercase; 
          font-weight: 600; 
          margin-bottom: 3px; 
        }
        .data-value { 
          font-size: 14px; 
          color: ${EMAIL_STYLES.dark}; 
          font-weight: 600; 
        }
        .section-title { 
          color: ${EMAIL_STYLES.primary}; 
          margin: 25px 0 15px 0; 
          font-size: 18px; 
          border-bottom: 2px solid ${EMAIL_STYLES.primary}; 
          padding-bottom: 8px; 
        }
        @media (max-width: 600px) {
          .data-grid { grid-template-columns: 1fr; }
          .email-container { margin: 10px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        ${generateEmailHeader('✅ Application Complete', 'Veteran Legacy Life Insurance')}
        
        <div class="content">
          <div class="success-box">
            <h2 style="margin: 0 0 15px 0; color: ${EMAIL_STYLES.success};">
              🎉 Application Successfully Submitted!
            </h2>
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">
              <strong>${data.firstName} ${data.lastName}</strong> has completed their application for 
              <strong>${data.quoteCoverage}</strong> coverage with a monthly premium of <strong>${data.quotePremium}</strong>.
            </p>
          </div>
          
          <div class="quote-highlight">
            <h3 style="margin: 0 0 10px 0; font-size: 20px;">📊 Application Summary</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
              <div>
                <div style="font-size: 12px; opacity: 0.8;">Coverage Amount</div>
                <div style="font-size: 18px; font-weight: 700;">${data.quoteCoverage}</div>
              </div>
              <div>
                <div style="font-size: 12px; opacity: 0.8;">Monthly Premium</div>
                <div style="font-size: 18px; font-weight: 700;">${data.quotePremium}</div>
              </div>
            </div>
          </div>
          
          <div class="data-section">
            <h3 class="section-title">👤 Contact Information</h3>
            <div class="data-grid">
              <div class="data-item">
                <div class="data-label">Name</div>
                <div class="data-value">${data.firstName} ${data.lastName}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Email</div>
                <div class="data-value">${data.email}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Phone</div>
                <div class="data-value">${data.phone}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Military Status</div>
                <div class="data-value">${data.militaryStatus} - ${data.branchOfService}</div>
              </div>
            </div>
          </div>
          
          <div class="data-section">
            <h3 class="section-title">🏠 Application Details</h3>
            <div class="data-grid">
              <div class="data-item">
                <div class="data-label">Address</div>
                <div class="data-value">${data.streetAddress}</div>
              </div>
              <div class="data-item">
                <div class="data-label">City/State/ZIP</div>
                <div class="data-value">${data.city}, ${data.applicationState} ${data.zipCode}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Beneficiaries</div>
                <div class="data-value">${data.beneficiaryName}</div>
              </div>
              <div class="data-item">
                <div class="data-label">VA Clinic</div>
                <div class="data-value">${data.vaNumber}</div>
              </div>
            </div>
          </div>
          
          <div class="data-section">
            <h3 class="section-title">💳 Financial Information</h3>
            <div class="data-grid">
              <div class="data-item">
                <div class="data-label">Bank</div>
                <div class="data-value">${data.bankName}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Account Info</div>
                <div class="data-value">${data.routingNumber} / ${data.accountNumber}</div>
              </div>
            </div>
          </div>
          
          <div class="data-section">
            <h3 class="section-title">📋 Quote Information</h3>
            <div class="data-grid">
              <div class="data-item">
                <div class="data-label">Policy Date</div>
                <div class="data-value">${data.policyDate}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Quote Type</div>
                <div class="data-value">${data.quoteType}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Age</div>
                <div class="data-value">${data.quoteAge}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Gender</div>
                <div class="data-value">${data.quoteGender}</div>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${data.email}" 
               style="display: inline-block; background: ${EMAIL_STYLES.primary}; 
                      color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: ${EMAIL_STYLES.borderRadius}; font-weight: 600; margin: 0 10px;">
              📧 Contact Client
            </a>
            <a href="tel:${data.phone}" 
               style="display: inline-block; background: ${EMAIL_STYLES.success}; 
                      color: white; padding: 12px 24px; text-decoration: none; 
                      border-radius: ${EMAIL_STYLES.borderRadius}; font-weight: 600; margin: 0 10px;">
              📞 Call Client
            </a>
          </div>
        </div>
        
        ${generateEmailFooter()}
      </div>
    </body>
    </html>
  `;
}

function generateApplicationConfirmationHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Complete - Veteran Legacy Life</title>
      <style>
        body { 
          font-family: ${EMAIL_STYLES.fontFamily}; 
          margin: 0; 
          padding: 0; 
          background: #f8fafc; 
        }
        .email-container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
          overflow: hidden; 
        }
        .content { 
          padding: ${EMAIL_STYLES.padding}; 
        }
        .success-box { 
          background: linear-gradient(135deg, #f0fdf4, #dcfce7); 
          border: 1px solid #86efac; 
          padding: 25px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          margin: 20px 0; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
        }
        .quote-card { 
          background: linear-gradient(135deg, ${EMAIL_STYLES.primary}, ${EMAIL_STYLES.secondary}); 
          color: white; 
          padding: 25px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          text-align: center; 
          margin: 25px 0; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
        }
        .quote-amount { 
          font-size: 32px; 
          font-weight: 700; 
          margin: 10px 0; 
        }
        .quote-premium { 
          font-size: 24px; 
          font-weight: 600; 
          opacity: 0.9; 
        }
        .info-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 15px; 
          margin: 20px 0; 
        }
        .info-item { 
          background: ${EMAIL_STYLES.light}; 
          padding: 15px; 
          border-radius: 8px; 
          border-left: 4px solid ${EMAIL_STYLES.success}; 
        }
        .info-label { 
          font-size: 12px; 
          color: ${EMAIL_STYLES.gray}; 
          text-transform: uppercase; 
          font-weight: 600; 
          margin-bottom: 5px; 
        }
        .info-value { 
          font-size: 16px; 
          color: ${EMAIL_STYLES.dark}; 
          font-weight: 600; 
        }
        .cta-button { 
          display: inline-block; 
          background: linear-gradient(135deg, ${EMAIL_STYLES.primary}, ${EMAIL_STYLES.secondary}); 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          font-weight: 600; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
          margin: 20px 0; 
        }
        .next-steps { 
          background: ${EMAIL_STYLES.light}; 
          padding: 20px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          margin: 20px 0; 
        }
        @media (max-width: 600px) {
          .info-grid { grid-template-columns: 1fr; }
          .email-container { margin: 10px; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        ${generateEmailHeader('🎉 Application Complete!', 'Veteran Legacy Life Insurance')}
        
        <div class="content">
          <div class="success-box">
            <h2 style="margin: 0 0 15px 0; color: ${EMAIL_STYLES.success};">
              Congratulations, ${data.firstName}!
            </h2>
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">
              Your <strong>Veteran Legacy Life Insurance</strong> application has been successfully submitted! 
              Our team will review your application and contact you within 1-2 business days.
            </p>
          </div>
          
          <div class="quote-card">
            <h3 style="margin: 0 0 15px 0; font-size: 20px;">Your Insurance Quote</h3>
            <div class="quote-amount">${data.quoteCoverage}</div>
            <div class="quote-premium">${data.quotePremium} / month</div>
            <p style="margin: 15px 0 0 0; opacity: 0.9; font-size: 14px;">
              Policy Type: ${data.quoteType}
            </p>
          </div>
          
          <h3 style="color: ${EMAIL_STYLES.primary}; margin: 30px 0 15px 0;">📋 Application Summary</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Name</div>
              <div class="info-value">${data.firstName} ${data.lastName}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Military Status</div>
              <div class="info-value">${data.militaryStatus} - ${data.branchOfService}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Coverage Amount</div>
              <div class="info-value">${data.coverageAmount}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Policy Type</div>
              <div class="info-value">${data.quoteType}</div>
            </div>
          </div>
          
          <div class="next-steps">
            <h4 style="margin: 0 0 15px 0; color: ${EMAIL_STYLES.primary};">
              ⏰ What Happens Next?
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="text-align: center; padding: 15px;">
                <div style="font-size: 24px; margin-bottom: 8px;">📞</div>
                <div style="font-weight: 600; margin-bottom: 5px;">Phone Call</div>
                <div style="font-size: 14px; color: ${EMAIL_STYLES.gray};">
                  Licensed agent will call within 24 hours
                </div>
              </div>
              <div style="text-align: center; padding: 15px;">
                <div style="font-size: 24px; margin-bottom: 8px;">📋</div>
                <div style="font-weight: 600; margin-bottom: 5px;">Review Process</div>
                <div style="font-size: 14px; color: ${EMAIL_STYLES.gray};">
                  Application review and verification
                </div>
              </div>
              <div style="text-align: center; padding: 15px;">
                <div style="font-size: 24px; margin-bottom: 8px;">✅</div>
                <div style="font-weight: 600; margin-bottom: 5px;">Finalization</div>
                <div style="font-size: 14px; color: ${EMAIL_STYLES.gray};">
                  Policy setup and activation
                </div>
              </div>
              <div style="text-align: center; padding: 15px;">
                <div style="font-size: 24px; margin-bottom: 8px;">🎯</div>
                <div style="font-weight: 600; margin-bottom: 5px;">Coverage Active</div>
                <div style="font-size: 14px; color: ${EMAIL_STYLES.gray};">
                  Your protection begins
                </div>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="tel:${getCompanyConfig().PHONE_DIALABLE}" class="cta-button">
              📞 Call Us Now
            </a>
          </div>
          
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); 
                      border: 1px solid #f59e0b; padding: 20px; border-radius: ${EMAIL_STYLES.borderRadius}; 
                      margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #92400e;">
              💡 Need Help?
            </h4>
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              If you have any questions about your application or need to make changes, 
              please don't hesitate to contact us. We're here to help!
            </p>
          </div>
        </div>
        
        ${generateEmailFooter()}
      </div>
    </body>
    </html>
  `;
}

function generateAbandonmentAlertHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Abandoned Lead Alert - Veteran Legacy Life</title>
      <style>
        body { 
          font-family: ${EMAIL_STYLES.fontFamily}; 
          margin: 0; 
          padding: 0; 
          background: #f8fafc; 
        }
        .email-container { 
          max-width: 600px; 
          margin: 20px auto; 
          background: white; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
          overflow: hidden; 
        }
        .content { 
          padding: ${EMAIL_STYLES.padding}; 
        }
        .alert-box { 
          background: linear-gradient(135deg, #fef2f2, #fecaca); 
          border: 1px solid #fca5a5; 
          padding: 25px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          margin: 20px 0; 
          box-shadow: ${EMAIL_STYLES.shadow}; 
        }
        .lead-card { 
          background: ${EMAIL_STYLES.light}; 
          border: 1px solid #e5e7eb; 
          padding: 20px; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          margin: 20px 0; 
        }
        .data-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 15px; 
          margin: 15px 0; 
        }
        .data-item { 
          background: white; 
          padding: 12px; 
          border-radius: 8px; 
          border-left: 3px solid ${EMAIL_STYLES.warning}; 
        }
        .data-label { 
          font-size: 11px; 
          color: ${EMAIL_STYLES.gray}; 
          text-transform: uppercase; 
          font-weight: 600; 
          margin-bottom: 3px; 
        }
        .data-value { 
          font-size: 14px; 
          color: ${EMAIL_STYLES.dark}; 
          font-weight: 600; 
        }
        .action-buttons { 
          text-align: center; 
          margin: 25px 0; 
        }
        .action-btn { 
          display: inline-block; 
          padding: 12px 20px; 
          text-decoration: none; 
          border-radius: ${EMAIL_STYLES.borderRadius}; 
          font-weight: 600; 
          margin: 0 8px; 
        }
        .btn-primary { 
          background: ${EMAIL_STYLES.primary}; 
          color: white; 
        }
        .btn-secondary { 
          background: ${EMAIL_STYLES.warning}; 
          color: white; 
        }
        @media (max-width: 600px) {
          .data-grid { grid-template-columns: 1fr; }
          .email-container { margin: 10px; }
          .action-btn { display: block; margin: 8px 0; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        ${generateEmailHeader('⚠️ Abandoned Lead Alert', 'Veteran Legacy Life Insurance')}
        
        <div class="content">
          <div class="alert-box">
            <h2 style="margin: 0 0 15px 0; color: ${EMAIL_STYLES.danger};">
              🚨 Lead Abandonment Detected
            </h2>
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">
              A potential client started the application process but did not complete it. 
              This represents a valuable opportunity that requires immediate follow-up.
            </p>
          </div>
          
          <div class="lead-card">
            <h3 style="margin: 0 0 15px 0; color: ${EMAIL_STYLES.primary};">
              📋 Lead Information
            </h3>
            <div class="data-grid">
              <div class="data-item">
                <div class="data-label">Name</div>
                <div class="data-value">${data.firstName} ${data.lastName}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Email</div>
                <div class="data-value">${data.email}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Phone</div>
                <div class="data-value">${data.phone}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Military Status</div>
                <div class="data-value">${data.militaryStatus} - ${data.branchOfService}</div>
              </div>
              <div class="data-item">
                <div class="data-label">Desired Coverage</div>
                <div class="data-value">${data.coverageAmount}</div>
              </div>
              <div class="data-item">
                <div class="data-label">State</div>
                <div class="data-value">${data.state}</div>
              </div>
            </div>
          </div>
          
          <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); 
                      border: 1px solid #f59e0b; padding: 20px; border-radius: ${EMAIL_STYLES.borderRadius}; 
                      margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #92400e;">
              💡 Follow-up Strategy
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #92400e; line-height: 1.6;">
              <li>Call within 1 hour for best conversion rates</li>
              <li>Offer to help complete the application</li>
              <li>Address any concerns they may have had</li>
              <li>Provide additional information about benefits</li>
            </ul>
          </div>
          
          <div class="action-buttons">
            <a href="mailto:${data.email}" class="action-btn btn-primary">
              📧 Send Email
            </a>
            <a href="tel:${data.phone}" class="action-btn btn-secondary">
              📞 Call Now
            </a>
          </div>
          
          <div style="text-align: center; margin: 20px 0; padding: 15px; 
                      background: ${EMAIL_STYLES.light}; border-radius: ${EMAIL_STYLES.borderRadius};">
            <p style="margin: 0; font-size: 14px; color: ${EMAIL_STYLES.gray};">
              <strong>Remember:</strong> Quick follow-up significantly increases conversion rates. 
              This lead has already shown interest - they just need a little encouragement!
            </p>
          </div>
        </div>
        
        ${generateEmailFooter()}
      </div>
    </body>
    </html>
  `;
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
    default:
      return 'Veteran Legacy Life Insurance Notification';
  }
} 