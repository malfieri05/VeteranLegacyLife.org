import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'

interface ExitModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
}

export const ExitModal: React.FC<ExitModalProps> = ({
  isOpen,
  onClose,
  onContinue
}) => {
  const [showAgentOptions, setShowAgentOptions] = useState(false)
  const handleCallAgent = () => {
    window.location.href = 'tel:503-764-5097'
  }
  const handleScheduleCall = () => {
    window.open('https://calendly.com/mikealfieri/30min', '_blank')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onContinue}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280',
              zIndex: 10
            }}
          >
            ×
          </button>
          {showAgentOptions ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ 
                color: '#1e293b', 
                fontSize: '2rem', 
                marginBottom: '1rem',
                fontWeight: '700',
                letterSpacing: '-0.025em'
              }}>
                Expert Assistance Available
              </h2>

              <p style={{ 
                color: '#64748b', 
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '2.0rem',
                fontWeight: '400'
              }}>
                Our licensed insurance specialists are ready to guide you through the finalization process and address any questions about your policy.
              </p>

              {/* Call Directly Button */}
              <button
                onClick={handleCallAgent}
                style={{
                  background: 'white',
                  color: '#1e3a8a',
                  border: '2px solid #1e3a8a',
                  padding: '1.25rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: '1.25rem',
                  boxShadow: '0 4px 8px rgba(30, 58, 138, 0.1)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.025em',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(30, 58, 138, 0.2)'
                  e.currentTarget.style.background = '#f8fafc'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(30, 58, 138, 0.1)'
                  e.currentTarget.style.background = 'white'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className="fas fa-phone" style={{ fontSize: '1rem' }}></i>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Call Directly:</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>503-764-5097</div>
              </button>

              <div style={{ 
                margin: '1.0rem 0',
                color: '#64748b',
                fontSize: '0.9rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                or
              </div>

              {/* Schedule Consultation Button (Calendly) */}
              <button
                onClick={handleScheduleCall}
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: 'white',
                  border: 'none',
                  padding: '1.1rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: '1.5rem',
                  boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.025em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.3)'
                }}
              >
                <i className="fas fa-calendar" style={{ fontSize: '1.1rem' }}></i>
                Schedule Consultation
              </button>

              <button
                onClick={() => setShowAgentOptions(false)}
                style={{
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e5e7eb'
                  e.currentTarget.style.color = '#4b5563'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f3f4f6'
                  e.currentTarget.style.color = '#6b7280'
                }}
              >
                <i className="fas fa-arrow-left" style={{ fontSize: '0.9rem' }}></i>
                Back
              </button>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: '#fef3c7',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: '#f59e0b',
                fontSize: '1.5rem'
              }}>
                <i className="fas fa-exclamation-triangle"></i>
              </div>

              {/* Title */}
              <h2 style={{
                color: '#1f2937',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                Wait! Don't Lose Your Progress
              </h2>

              {/* Message */}
              <p style={{
                color: '#6b7280',
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                You're just a few steps away from securing your veteran life insurance benefits. 
                If you leave now, you'll need to start over.
              </p>

              {/* Benefits */}
              <div style={{
                background: '#f0f9ff',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: '1px solid #0ea5e9'
              }}>
                <p style={{
                  color: '#0c4a6e',
                  fontSize: '0.9rem',
                  margin: '0',
                  fontWeight: '500'
                }}>
                  <strong>Your Benefits:</strong> No medical exam, guaranteed acceptance, 
                  and premiums that never increase!
                </p>
              </div>

              {/* Contact Licensed Agent - Big Red Button */}
              <button
                onClick={() => setShowAgentOptions(true)}
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: 'white',
                  border: 'none',
                  padding: '1.25rem 2rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  width: '100%',
                  marginBottom: '1.25rem',
                  boxShadow: '0 8px 16px rgba(220, 38, 38, 0.3)',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.025em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(220, 38, 38, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(220, 38, 38, 0.3)'
                }}
              >
                <i className="fas fa-user-tie" style={{ fontSize: '1.1rem' }}></i>
                Contact Licensed Agent
              </button>

              {/* Bottom Row: Leave Anyway (Left) and Continue Application (Right) */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'space-between'
              }}>
                <Button
                  onClick={() => {
                    onContinue();
                    onClose();
                  }}
                  variant="secondary"
                  style={{
                    padding: '0.875rem 1.5rem',
                    fontSize: '1rem',
                    flex: 1
                  }}
                >
                  Leave Anyway
                </Button>
                
                <Button
                  onClick={onContinue}
                  style={{
                    padding: '0.875rem 1.5rem',
                    fontSize: '1rem',
                    backgroundColor: '#16a34a',
                    flex: 1
                  }}
                >
                  Continue Application
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 