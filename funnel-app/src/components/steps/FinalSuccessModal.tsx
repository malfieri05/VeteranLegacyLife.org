import React, { useState } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const FinalSuccessModal: React.FC = () => {
  const { formData, closeModal } = useFunnelStore()
  const [showAgentOptions, setShowAgentOptions] = useState(false)
  
  const monthlyPremium = parseFloat(formData.quoteData?.premium?.replace('$', '').replace(',', '') || '0')
  const coverageAmount = parseFloat(formData.quoteData?.coverage?.replace('$', '').replace(',', '') || '0')
  const userAge = parseInt(formData.quoteData?.age || '0')
  const userGender = formData.quoteData?.gender || ''
  const quoteType = formData.quoteData?.type || 'IUL'

  const handleCallAgent = () => {
    setShowAgentOptions(true)
  }

  const handleCallDirectly = () => {
    window.location.href = 'tel:503-764-5097'
  }

  const handleScheduleCall = () => {
    window.open('https://calendly.com/mikealfieri/30min', '_blank')
  }

  const handleBackToMain = () => {
    setShowAgentOptions(false)
  }

  return (
    <div className="success-modal-container" style={{ textAlign: 'center', padding: '0 1.5rem', maxWidth: '600px', margin: '0 auto' }}>
      <style>
        {`
          @media (max-width: 768px) {
            .success-modal-container {
              padding: 0 1rem !important;
            }
            .success-title {
              font-size: 1.6rem !important;
            }
            .success-coverage {
              font-size: 1.8rem !important;
            }
            .success-button {
              padding: 1rem 1.5rem !important;
              font-size: 1rem !important;
            }
          }
          @media (max-width: 480px) {
            .success-modal-container {
              padding: 0 0.75rem !important;
            }
            .success-title {
              font-size: 1.4rem !important;
            }
            .success-coverage {
              font-size: 1.6rem !important;
            }
            .success-button {
              padding: 0.875rem 1.25rem !important;
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>

      {showAgentOptions ? (
        // Agent Options View
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            color: '#1e293b', 
            fontSize: '1.4rem', 
            marginBottom: '0.75rem',
            fontWeight: '600'
          }}>
            Expert Assistance Available
          </h2>
          <p style={{ 
            color: '#64748b', 
            fontSize: '0.95rem',
            lineHeight: '1.5',
            marginBottom: '1.5rem'
          }}>
            Our licensed insurance specialists are ready to guide you through any questions about your policy.
          </p>

          {/* Call Directly Button */}
          <button
            onClick={handleCallDirectly}
            style={{
              background: 'white',
              color: '#1e293b',
              border: '2px solid #e2e8f0',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              marginBottom: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fas fa-phone" style={{ fontSize: '1rem' }}></i>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Call Directly:</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>503-764-5097</div>
          </button>

          <div style={{ 
            color: '#64748b', 
            fontSize: '0.9rem', 
            margin: '0.75rem 0',
            fontWeight: '500'
          }}>
            or
          </div>

          {/* Schedule Consultation Button */}
          <button
            onClick={handleScheduleCall}
            style={{
              background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              color: 'white',
              border: 'none',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 4px 8px rgba(220, 38, 38, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(220, 38, 38, 0.3)'
            }}
          >
            <i className="fas fa-calendar" style={{ fontSize: '1.1rem' }}></i>
            Schedule Consultation
          </button>

          {/* Back Button */}
          <button
            onClick={handleBackToMain}
            style={{
              background: 'transparent',
              color: '#64748b',
              border: '1px solid #d1d5db',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
              e.currentTarget.style.borderColor = '#9ca3af'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#d1d5db'
            }}
          >
            <i className="fas fa-times" style={{ fontSize: '0.8rem' }}></i>
            Back
          </button>
        </div>
      ) : (
        // Main Success View
        <>
          {/* Logo */}
          <div style={{ marginBottom: '1rem' }}>
            <img 
              src="/logo.png" 
              alt="Veteran Legacy Life Logo" 
              style={{ height: '4rem', width: 'auto', objectFit: 'contain', margin: '0 auto' }}
              onError={(e) => {
                // Fallback if logo doesn't load
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
          
          {/* Success Title */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 className="success-title" style={{ 
              color: '#1e293b', 
              fontSize: '1.8rem', 
              marginBottom: '0.75rem',
              fontWeight: '600'
            }}>
              Congrats, {formData.contactInfo?.firstName || 'there'}!
            </h2>
            <p style={{ 
              color: '#64748b', 
              fontSize: '1rem',
              lineHeight: '1.5',
              marginBottom: '1rem'
            }}>
              Your application has been submitted successfully! A licensed insurance representative will contact you within 24 hours to finalize your policy.
            </p>
          </div>
            
          {/* Prominent Quote Display - Shows user's actual selections */}
          <div style={{ 
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
            color: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '2px solid #2563eb'
          }}>
            <div style={{ 
              fontSize: '0.9rem', 
              fontWeight: '500',
              marginBottom: '0.5rem',
              opacity: 0.9,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Coverage Amount
            </div>
            <div className="success-coverage" style={{ 
              fontSize: '2.2rem', 
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
              ${coverageAmount.toLocaleString()}
            </div>
            <div style={{ 
              fontSize: '1.1rem',
              opacity: 0.9,
              fontWeight: '500'
            }}>
              ${monthlyPremium.toFixed(2)} /mo
            </div>
          </div>

          {/* Your Quote Summary */}
          <div style={{ 
            background: '#ffffff', 
            padding: '1.25rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
          }}>
            <h3 style={{ 
              color: '#1e293b', 
              fontSize: '1.1rem', 
              marginBottom: '1rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              Your Quote Summary
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              fontSize: '0.9rem'
            }}>
              <div style={{ color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>Monthly Premium:</strong><br />
                <span style={{ color: '#059669', fontWeight: '600' }}>${monthlyPremium.toFixed(2)}</span>
              </div>
              <div style={{ color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>Coverage Amount:</strong><br />
                <span style={{ color: '#059669', fontWeight: '600' }}>${coverageAmount.toLocaleString()}</span>
              </div>
              <div style={{ color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>Policy Type:</strong><br />
                <span style={{ color: '#059669', fontWeight: '600' }}>{quoteType}</span>
              </div>
              <div style={{ color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>Age:</strong><br />
                <span style={{ color: '#059669', fontWeight: '600' }}>{userAge}</span>
              </div>
              <div style={{ color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>Gender:</strong><br />
                <span style={{ color: '#059669', fontWeight: '600' }}>{userGender === 'male' ? 'Male' : 'Female'}</span>
              </div>
              <div style={{ color: '#374151' }}>
                <strong style={{ color: '#1e293b' }}>Status:</strong><br />
                <span style={{ color: '#059669', fontWeight: '600' }}>Submitted</span>
              </div>
            </div>
          </div>

          {/* What Happens Next - More Compact */}
          <div style={{ 
            background: '#fef3c7', 
            padding: '1.25rem',
            borderRadius: '12px',
            marginBottom: '1rem',
            border: '1px solid #f59e0b'
          }}>
            <h3 style={{ 
              color: '#92400e', 
              fontSize: '1rem', 
              marginBottom: '0.75rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              What Happens Next?
            </h3>
            <ul style={{ 
              textAlign: 'left', 
              color: '#92400e',
              lineHeight: '1.5',
              margin: '0',
              paddingLeft: '1.25rem',
              fontSize: '0.9rem'
            }}>
              <li>You'll receive a confirmation email within 5 minutes</li>
              <li>A licensed agent will call you within 24 hours</li>
              <li>Your policy will be processed and finalized</li>
              <li>Coverage will begin on your selected start date</li>
            </ul>
          </div>

          {/* Contact Licensed Agent Button - Biggest and Primary */}
          <button
            onClick={handleCallAgent}
            style={{
              background: 'white',
              color: '#1e293b',
              border: '2px solid #e2e8f0',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
              marginBottom: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fas fa-phone" style={{ fontSize: '1rem' }}></i>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Call Licensed Agent:</span>
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>503-764-5097</div>
          </button>

          {/* Close Button */}
          <button
            onClick={() => closeModal()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.875rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#2563eb'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#3b82f6'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            Finished!
          </button>
        </>
      )}
    </div>
  )
} 