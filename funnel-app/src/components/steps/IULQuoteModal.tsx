import React, { useState, useEffect, useRef } from 'react'
import { useFunnelStore } from '../../store/funnelStore'
import { calculatePremium, AGE_RANGE } from '../../data/quoteRates'
import { getStepConfig } from '../../store/stepConfig'

export const IULQuoteModal: React.FC = () => {
  const { formData, updateFormData, goToNextStep } = useFunnelStore()
  
  // State management for quote customization
  const [quoteGender, setQuoteGender] = useState<'male' | 'female'>('male')
  const [quoteAge, setQuoteAge] = useState(50)
  const [quoteCoverage, setQuoteCoverage] = useState(50000)
  const [healthTier] = useState<'IUL'>('IUL')
  const [quote, setQuote] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showInteractiveProjection, setShowInteractiveProjection] = useState(false)
  const isMountedRef = useRef(true)

  const minAge = AGE_RANGE.min
  const maxAge = AGE_RANGE.max

  // Debug logging function
  const debugLog = (message: string, data?: any) => {
    console.log(`[IULQuoteModal] ${message}`, data || '')
  }

  // Initialize default values from user's data
  useEffect(() => {
    // Set age from birthday
    if (formData.contactInfo?.dateOfBirth) {
      const birthDate = new Date(formData.contactInfo.dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      if (age >= minAge && age <= 100) {
        setQuoteAge(age)
        debugLog('Age set from birthday:', age)
      }
    }

    // Set coverage amount from user's selection
    if (formData.preQualification?.coverageAmount) {
      const coverageMap: { [key: string]: number } = {
        '50k': 50000,
        '100k': 100000,
        '150k': 150000,
        '200k': 200000,
        '250k': 250000
      }
      
      const coverageValue = coverageMap[formData.preQualification.coverageAmount]
      if (coverageValue) {
        setQuoteCoverage(coverageValue)
        debugLog('Coverage set from user selection:', coverageValue)
      }
    }
  }, [formData.contactInfo?.dateOfBirth, formData.preQualification?.coverageAmount])

  // Real-time quote calculation with error handling
  useEffect(() => {
    const calculateQuote = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        debugLog('Calculating quote with params:', {
          gender: quoteGender,
          age: quoteAge,
          coverage: quoteCoverage,
          healthTier
        })
        
        const calculatedQuote = calculatePremium(quoteGender, quoteAge, quoteCoverage, healthTier)
        
        if (calculatedQuote === null || calculatedQuote === undefined) {
          setError('Unable to calculate premium for selected parameters')
          setQuote(null)
          debugLog('Quote calculation returned null')
        } else {
          setQuote(calculatedQuote)
          debugLog('Quote calculated successfully:', calculatedQuote)
        }
      } catch (err) {
        console.error('Error calculating quote:', err)
        setError('Error calculating premium')
        setQuote(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce the calculation to avoid excessive calls
    const timeoutId = setTimeout(calculateQuote, 200)
    return () => clearTimeout(timeoutId)
  }, [quoteGender, quoteAge, quoteCoverage, healthTier])

  // Save quote data to store whenever quote changes
  useEffect(() => {
    if (quote !== null && quote !== undefined) {
      updateFormData({
        quoteData: {
          policyDate: new Date().toISOString().split('T')[0],
          coverage: quoteCoverage.toString(),
          premium: quote.toFixed(2),
          age: quoteAge.toString(),
          gender: quoteGender,
          type: 'IUL'
        }
      })
      debugLog('Quote data saved to store:', {
        coverage: quoteCoverage,
        premium: quote.toFixed(2),
        age: quoteAge,
        gender: quoteGender
      })
    }
  }, [quote, quoteCoverage, quoteAge, quoteGender, updateFormData])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Handle quote button click
  const handleSecureRate = () => {
    debugLog('Secure Rate button clicked')
    goToNextStep()
  }

  /**
   * Calculate IUL cash value projection
   * @param {number} monthlyPremium - User's monthly premium in dollars
   * @param {number} years - Projection length (default 25 years)
   * @returns {Array} - Array of projection data for each year
   */
  const projectIULCashValue = ({
    monthlyPremium,
    years = 25,
  }: {
    monthlyPremium: number
    years?: number
  }) => {
    const annualReturn = 0.11; // 11% annual return
    const annualPremium = monthlyPremium * 12;
    let cashValue = 0;
    const projection = [];

    for (let year = 1; year <= years; year++) {
      let allocationPercent;

      if (year === 1) {
        allocationPercent = 0.70; // Year 1: 70% to cash value
      } else if (year === 2) {
        allocationPercent = 0.85; // Year 2: 85% to cash value
      } else {
        allocationPercent = 0.90; // Year 3+: 90% to cash value
      }

      const allocatedPremium = annualPremium * allocationPercent;

      // Add allocated premium, then grow by annual return
      cashValue = (cashValue + allocatedPremium) * (1 + annualReturn);

      projection.push({
        year,
        cashValue: Math.round(cashValue),
        deathBenefit: Math.round(cashValue * 1.5), // 150% of cash value
        premiumPaid: annualPremium * year
      });
    }

    return projection;
  }

  // Calculate interactive IUL projection
  const iulProjection = quote ? projectIULCashValue({
    monthlyPremium: quote,
    years: 25
  }) : null

  return (
    <div className="iul-quote-container" style={{ 
      textAlign: 'center', 
      padding: '0.25rem 0.75rem 0.75rem 0.75rem', 
      maxHeight: '70vh', 
      overflowY: 'auto'
    }}>
      <style>
        {`
          .gold-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #10b981;
            border: 2px solid white;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
          }
          .gold-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #10b981;
            border: 2px solid white;
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.4);
          }
        `}
      </style>

      <h2 style={{ fontSize: '1.6rem', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>Your Personalized IUL Quote</h2>
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '0.5rem 0.75rem',
        marginTop: '0.25rem'
      }}>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          <strong>Insurance Type:</strong> IUL - Indexed Universal Life with cash value growth potential
        </p>
      </div>

      {/* Coverage Amount Display - Prominent Green Box */}
      <div style={{ 
        background: 'linear-gradient(135deg, #10b981, #059669)', 
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        margin: '0.75rem 0',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)'
      }}>
        <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem', opacity: 0.9 }}>
          Coverage Amount
        </div>
        <div className="coverage-display" style={{ fontSize: '2.2rem', fontWeight: 'bold', lineHeight: '1', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          ${quoteCoverage.toLocaleString()}
        </div>
      </div>

      {/* Coverage Slider */}
      <div style={{ margin: '0.5rem 0' }}>
        <input
          type="range"
          min="50000"
          max="250000"
          step="1000"
          value={quoteCoverage}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10)
            debugLog('Coverage changed to:', newValue)
            setQuoteCoverage(newValue)
          }}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: '#e5e7eb',
            outline: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer'
          }}
          className="gold-slider"
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '0.7rem', 
          color: '#6b7280', 
          marginTop: '0.2rem' 
        }}>
          <span>$50,000</span>
          <span>$250,000</span>
        </div>
      </div>

      {/* Age Slider */}
      <div style={{ margin: '0.5rem 0' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '0.25rem' 
        }}>
          Age: {quoteAge}
        </label>
        <input
          type="range"
          min={minAge}
          max={maxAge}
          step="1"
          value={quoteAge}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10)
            debugLog('Age changed to:', newValue)
            setQuoteAge(newValue)
          }}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: '#e5e7eb',
            outline: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer'
          }}
          className="gold-slider"
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '0.7rem', 
          color: '#6b7280', 
          marginTop: '0.2rem' 
        }}>
          <span>{minAge}</span>
          <span>{maxAge}</span>
        </div>
      </div>

      {/* Gender Selection */}
      <div style={{ margin: '0.5rem 0' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.9rem', 
          fontWeight: '600', 
          color: '#374151', 
          marginBottom: '0.25rem' 
        }}>
          Gender:
        </label>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {['male', 'female'].map(gender => (
            <label key={gender} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={quoteGender === gender}
                onChange={(e) => {
                  debugLog('Gender changed to:', e.target.value)
                  setQuoteGender(e.target.value as 'male' | 'female')
                }}
                style={{ margin: 0 }}
              />
              <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{gender}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Premium Display - Clickable Secure Rate Button */}
      <button
        onClick={handleSecureRate}
        className="quote-display"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '14px',
          margin: '0.75rem auto',
          textAlign: 'center',
          maxWidth: '300px',
          width: '100%',
          border: '2px solid #2563eb',
          display: 'block',
          position: 'relative',
          zIndex: 10,
          boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)',
          fontWeight: 'bold',
          fontSize: '1.05rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.4), 0 6px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(59, 130, 246, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '0.15rem', lineHeight: '1' }}>
          <span>${isLoading ? 'Calculating...' : error ? 'Error' : quote ? quote.toFixed(2) : '0'}</span>
          <span style={{ fontSize: '1.1rem' }}> /mo</span>
        </div>
        <div style={{ fontSize: '0.9rem', marginTop: '0.35rem', opacity: 0.9 }}>
          Secure Your Rate
        </div>
      </button>

      {/* Benefit Summary Cards */}
      {quote && iulProjection && (
        <div style={{ 
          background: '#ffffff', 
          padding: '1rem', 
          borderRadius: '10px', 
          margin: '0.5rem 0',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem',
            justifyContent: 'space-between'
          }}>
            <div style={{ 
              background: '#f0f9ff', 
              padding: '0.5rem', 
              borderRadius: '6px',
              border: '1px solid #bae6fd',
              flex: '1',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#0369a1', marginBottom: '0.25rem' }}>
                Monthly Premium
              </div>
              <div style={{ 
                background: 'white', 
                padding: '0.25rem', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                ${quote ? quote.toFixed(0) : '0'}
              </div>
            </div>
            
            <div style={{ 
              background: '#f0f9ff', 
              padding: '0.5rem', 
              borderRadius: '6px',
              border: '1px solid #bae6fd',
              flex: '1',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#0369a1', marginBottom: '0.25rem' }}>
                Death Benefit
              </div>
              <div style={{ 
                background: 'white', 
                padding: '0.25rem', 
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: '#1e293b'
              }}>
                ${quoteCoverage.toLocaleString()}
              </div>
            </div>
            
            <div style={{ 
              background: '#f0f9ff', 
              padding: '0.5rem', 
              borderRadius: '6px',
              border: '1px solid #bae6fd',
              flex: '1',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', color: '#0369a1', marginBottom: '0.25rem' }}>
                Cash Value
              </div>
              <div style={{ 
                background: 'white', 
                padding: '0.25rem', 
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: '#1e293b',
                lineHeight: '1.2'
              }}>
                Market linked<br/>
                Tax-deferred<br/>
                0% Floor
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 