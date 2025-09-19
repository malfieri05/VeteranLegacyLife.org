import React, { useEffect, useMemo } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { FormField } from '../shared/FormField'
import { validateContactInfo } from '../../utils/validation'

export const ContactInfo: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()
  
  const handleContactInfoChange = (field: keyof typeof formData.contactInfo, value: string | boolean) => {
    updateFormData({
      contactInfo: {
        ...formData.contactInfo,
        [field]: value
      }
    })
  }
  
  // No auto-advance on final step
  useEffect(() => {
    // Check if all required fields are filled
    const { firstName, lastName, email, phone, transactionalConsent, marketingConsent } = formData.contactInfo
    const allFieldsFilled = firstName && lastName && email && phone && transactionalConsent && marketingConsent
    
    if (allFieldsFilled) {
      // Final step - no auto-advance
      console.log('All contact information fields completed')
    }
  }, [formData.contactInfo])

  const isFormValid = useMemo(() => {
    const validation = validateContactInfo(formData.contactInfo)
    return validation.isValid === true
  }, [formData.contactInfo])
  
  return (
    <div className="contact-info-container">
      <style>
        {`
          /* Gentle pulse to draw attention to Submit */
          @keyframes pulseScale {
            0% { transform: scale(1); box-shadow: 0 6px 16px rgba(26,44,66,0.15); }
            50% { transform: scale(1.015); box-shadow: 0 10px 24px rgba(26,44,66,0.25); }
            100% { transform: scale(1); box-shadow: 0 6px 16px rgba(26,44,66,0.15); }
          }

          @media (prefers-reduced-motion: reduce) {
            .submit-pulse { animation: none !important; }
          }

          @media (max-width: 768px) {
            .contact-info-container h2 {
              font-size: 1.75rem !important;
            }
            .contact-info-container h3 {
              font-size: 1rem !important;
            }
            .contact-info-container .form-grid {
              grid-template-columns: 1fr !important;
              gap: 0.75rem !important;
            }
            .contact-info-container .consent-text {
              font-size: 0.75rem !important;
            }
          }
          @media (max-width: 480px) {
            .contact-info-container h2 {
              font-size: 1.5rem !important;
            }
            .contact-info-container .consent-text {
              font-size: 0.7rem !important;
            }
          }
        `}
      </style>
      <h2>Contact Information</h2>
      <p>Please provide your contact information so we can get in touch with you about your quote.</p>
      
      <div className="form-grid">
        <FormField
          label="First Name"
          name="firstName"
          type="text"
          value={formData.contactInfo.firstName}
          onChange={(value) => handleContactInfoChange('firstName', value)}
          placeholder="Enter your first name"
          required
        />
        
        <FormField
          label="Last Name"
          name="lastName"
          type="text"
          value={formData.contactInfo.lastName}
          onChange={(value) => handleContactInfoChange('lastName', value)}
          placeholder="Enter your last name"
          required
        />
      </div>
      
      <FormField
        label="Email Address"
        name="email"
        type="email"
        value={formData.contactInfo.email}
        onChange={(value) => handleContactInfoChange('email', value)}
        placeholder="Enter your email address"
        required
      />
      
      <FormField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.contactInfo.phone}
        onChange={(value) => handleContactInfoChange('phone', value)}
        placeholder="Enter your phone number"
        required
      />
      
      {/* Required Consent Checkboxes */}
      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>Required Consents</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.contactInfo.transactionalConsent || false}
              onChange={(e) => handleContactInfoChange('transactionalConsent', e.target.checked)}
              style={{ marginTop: '0.125rem' }}
              required
            />
            <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
              <div className="consent-text" style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                By checking this box, I consent to receive transactional messages from Veteran Legacy Life related to my account, orders, or services I have requested. These messages may include appointment reminders, order confirmations, and account notifications among others. We will not share your private information with third parties for marketing purposes. Message frequency may vary. Message & Data rates may apply. Reply HELP for help or STOP to opt-out.
              </div>
            </div>
          </label>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.contactInfo.marketingConsent || false}
              onChange={(e) => handleContactInfoChange('marketingConsent', e.target.checked)}
              style={{ marginTop: '0.125rem' }}
              required
            />
            <div style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
              <div className="consent-text" style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                By checking this box, I consent to receive marketing and promotional messages from Veteran Legacy Life, including special offers, discounts, new product updates among others. We will not share your private information with third parties for marketing purposes. Message frequency may vary. Message & Data rates may apply. Reply HELP for help or STOP to opt-out.
              </div>
            </div>
          </label>
        </div>
      </div>
      
      <div className="security-note">
        <i className="fas fa-shield-alt"></i>
        <span>Your information is secure and will only be used to provide you with insurance quotes.</span>
      </div>

      {/* Submit button for final step progression */}
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => isFormValid && goToNextStep()}
          disabled={!isFormValid}
          style={{
            background: isFormValid ? '#1A2C42' : '#94a3b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.9rem 1.25rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            width: '100%',
            maxWidth: '360px',
            boxShadow: '0 6px 16px rgba(26,44,66,0.15)',
            animation: isFormValid ? 'pulseScale 2s ease-in-out infinite' : 'none',
            willChange: 'transform, box-shadow'
          }}
          className="submit-pulse"
        >
          Submit
        </button>
      </div>
    </div>
  )
} 