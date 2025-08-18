import React, { useEffect } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { getStepConfig } from '../../store/stepConfig'

export const PreQualifiedSuccess: React.FC = () => {
  const { goToNextStep } = useFunnelStore()
  const stepConfig = getStepConfig(14) // PreQualifiedSuccess is step 14

  useEffect(() => {
    // Use the configured delay from stepConfig, default to 5 seconds
    const delay = stepConfig?.autoAdvanceDelay || 5000
    
    console.log(`🎯 PreQualifiedSuccess: Auto-advancing in ${delay}ms`)
    
    const timer = setTimeout(() => {
      console.log('🎯 PreQualifiedSuccess: Auto-advancing to next step')
      goToNextStep()
    }, delay)

    return () => {
      console.log('🎯 PreQualifiedSuccess: Cleaning up timer')
      clearTimeout(timer)
    }
  }, [goToNextStep])

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Success Icon */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ width: '4rem', height: '4rem', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
          <svg style={{ width: '2rem', height: '2rem', color: '#16a34a' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Pre-Qualified!
        </h2>
        <p style={{ color: '#6b7280', fontSize: '1.125rem', lineHeight: '1.6' }}>
          Congratulations! Based on your answers, you appear to qualify for life insurance coverage.
        </p>
      </div>

      {/* Next Steps */}
      <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Next Steps:
        </h3>
        <ul style={{ textAlign: 'left', color: '#6b7280', margin: '0', padding: '0', listStyle: 'none' }}>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ width: '0.5rem', height: '0.5rem', background: '#3b82f6', borderRadius: '50%', marginRight: '0.75rem' }}></span>
            Get your personalized quote
          </li>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ width: '0.5rem', height: '0.5rem', background: '#3b82f6', borderRadius: '50%', marginRight: '0.75rem' }}></span>
            Review coverage options
          </li>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ width: '0.5rem', height: '0.5rem', background: '#3b82f6', borderRadius: '50%', marginRight: '0.75rem' }}></span>
            Complete your application
          </li>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ width: '0.5rem', height: '0.5rem', background: '#3b82f6', borderRadius: '50%', marginRight: '0.75rem' }}></span>
            Start your coverage
          </li>
        </ul>
      </div>

      {/* Auto-advance indicator */}
      <div style={{ 
        background: '#eff6ff', 
        borderLeft: '4px solid #3b82f6', 
        padding: '1rem', 
        borderRadius: '0.5rem',
        marginBottom: '1rem'
      }}>
        <p style={{ color: '#1e40af', fontSize: '0.875rem', margin: 0 }}>
          <strong>Loading your personalized quote...</strong>
        </p>
      </div>

      {/* Help Section */}
      <div style={{ background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '1rem', borderRadius: '0.5rem' }}>
        <p style={{ color: '#1e40af', fontSize: '0.875rem' }}>
          <strong>Need help?</strong> Call us at 503-764-5097<br />
          Monday-Saturday 8AM-6PM Pacific Time
        </p>
      </div>
    </div>
  )
} 