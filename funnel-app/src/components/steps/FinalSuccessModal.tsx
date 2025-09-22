import React, { useEffect, useState } from 'react'
import { useFunnelStore } from '../../store/funnelStore'

export const FinalSuccessModal: React.FC = () => {
  const { closeModal } = useFunnelStore()
  const [phase, setPhase] = useState<'loading' | 'done'>('loading')
  const [showAssigned, setShowAssigned] = useState(false)

  useEffect(() => {
    // Keep the loading spinner visible for 6 seconds, then switch to final view instantly
    const timer = setTimeout(() => {
      setPhase('done')
      setShowAssigned(true)
    }, 6000)

    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <style>
        {`
          .success-hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 0.25rem 0 0.5rem 0;
          }
          .content-frame {
            border: 1px solid #000;
            border-radius: 10px;
            padding: 16px;
            margin: 4px 0 0 0;
          }
          .modal-brand-logo {
            position: absolute;
            top: 10px;
            right: 12px;
            width: 48px;
            height: auto;
            opacity: .9;
            filter: drop-shadow(0 1px 1px rgba(0,0,0,.08));
            pointer-events: none;
          }
          .brand-strip {
            height: 6px;
            width: 100%;
            border-radius: 6px;
            background: linear-gradient(90deg,#1a2c42 0%, #0b4ea2 50%, #1a2c42 100%);
            opacity: .35;
            margin-bottom: 12px;
          }
          .check-wrap {
            position: relative;
            width: 84px;
            height: 84px;
            border-radius: 50%;
            background: #10b981;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            box-shadow: 0 10px 24px rgba(16,185,129,.35);
            animation: popIn .6s ease-out both;
            margin-bottom: 10px;
          }
          .check-wrap .check-svg { width: 56px; height: 56px; }
          .check-wrap .spinner { opacity: 0; }
          .check-wrap.loading .spinner { opacity: 1; animation: spin 1s linear infinite; transform-origin: 50% 50%; }
          .check-wrap.done .spinner { opacity: 0; transition: opacity .25s ease-out; }
          .check-wrap .check-path { stroke-dasharray: 26; stroke-dashoffset: 26; }
          .check-wrap.done .check-path { animation: drawCheck .35s ease-out forwards .05s; }
          .ring {
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            border: 3px solid rgba(16,185,129,.35);
            animation: ringPulse 1.8s ease-out 0.3s infinite;
            display: none;
          }
          .check-wrap.done .ring { display: block; }
          @keyframes popIn {
            0% { transform: scale(.85); opacity: 0; }
            60% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); }
          }
          @keyframes ringPulse {
            0% { transform: scale(1); opacity: .8; }
            70% { transform: scale(1.35); opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes drawCheck { to { stroke-dashoffset: 0; } }
          .next-steps {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin: 16px 0 16px 0;
          }
          .next-card {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 24px 16px;
            box-shadow: 0 8px 22px rgba(2,8,23,0.05);
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .muted {
            color: #64748b;
            font-size: .95rem;
          }
          @media (max-width: 768px) {
            .next-steps { grid-template-columns: 1fr; }
          }
          .agent-caption { color:#334155; font-size:.95rem; margin: 10px 0 6px 0; }
          .agent-bio {
            color: #475569;
            font-size: 0.9rem;
            line-height: 1.6;
            max-width: 540px;
            margin: 6px auto 10px;
            padding: 0 16px;
            text-align: center;
            font-weight: 400;
          }
          .bestcard {
            width: 520px;
            max-width: 95%;
            height: auto;
            margin: 10px auto 10px;
            display: block;
            border-radius: 12px;
            border: 2px solid #000000;
            box-shadow: 0 10px 24px rgba(2,8,23,0.08);
            animation: fadeInUp .35s ease-out both;
          }
          .agent-row { 
            display: flex; 
            gap: 24px; 
            align-items: center; 
            justify-content: center; 
            margin-top: 8px; 
          }
          .agent-left { flex: 0 0 auto; }
          .agent-right { max-width: 560px; text-align: left; }
          .agent-photo-wrapper {
            width: 160px;
            height: 200px;
            border-radius: 16px;
            margin-top: 26px; /* extra breathing room below the check */
            overflow: hidden;
            animation: fadeInUp .35s ease-out both;
          }
          .agent-photo {
            width: 102%; /* bleed 1% on each side to eliminate baked-in margins */
            height: 102%;
            object-fit: cover;
            display: block;
            transform: translate(-1%, -1%);
          }
          .partner-logos {
            width: 480px;
            max-width: 95%;
            height: auto;
            margin-top: 16px;
            opacity: 1;
            background: #ffffff;
            border: 4px solid #1A2C42;
            border-radius: 16px;
            box-shadow: 
              0 12px 28px rgba(2, 8, 23, 0.12),
              0 2px 4px rgba(2, 8, 23, 0.05);
            padding: 0;
            animation: fadeInUp .35s ease-out both;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          
          .partner-logos:hover {
            transform: translateY(-2px);
            box-shadow: 
              0 20px 32px rgba(2, 8, 23, 0.16),
              0 4px 8px rgba(2, 8, 23, 0.08);
            border-color: #1A2C42;
          }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
          .trust-badges {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 32px;
            margin-top: 12px;
            padding: 0;
          }
          .trust-badge {
            opacity: 1;
            background: transparent;
            border: none;
            box-shadow: none;
            object-fit: contain;
            display: block;
          }
          .trust-badge[alt*="NIPR"] {
            height: 45px;
            width: auto;
          }
          .trust-badge[alt*="BBB"] {
            height: 55px;
            width: auto;
            object-fit: contain;
            transform: scale(1.1);
          }

          @media (max-width: 768px) {
            .agent-row { flex-direction: column; gap: 12px; }
            .agent-right { text-align: center; max-width: 600px; }
            .agent-photo-wrapper { margin-top: 10px; }
          }
          @media (max-width: 480px) {
            .success-hero { padding: 0.25rem 0 0.25rem 0; }
            .content-frame { padding: 12px; border-radius: 10px; }
            .modal-brand-logo { width: 36px; top: 8px; right: 10px; }
            .check-wrap { width: 72px; height: 72px; margin-bottom: 8px; }
            .check-wrap .check-svg { width: 46px; height: 46px; }
            .next-steps { gap: 10px; margin: 12px 0; }
            .next-card { padding: 16px 12px; border-radius: 10px; }
            .agent-bio { font-size: 0.95rem; padding: 0 8px; }
            .bestcard { width: 100%; max-width: 420px; }
            .trust-badges { gap: 20px; margin-top: 8px; }
            .trust-badge[alt*="NIPR"] { height: 40px; }
            .trust-badge[alt*="BBB"] { height: 48px; transform: none; }
          }
        `}
      </style>

      {/* Removed internal close button and brand strip to avoid duplicate UI with header */}

      <div className="content-frame">
      <div className="success-hero">
        {/* Subtle brand mark in corner */}
        <img className="modal-brand-logo" src="/production/darklogo.png" alt="Veteran Legacy Life" />
        <h2 style={{ color: '#1A2C42', fontSize: '1.9rem', margin: '0 0 6px 0' }}>
          {phase === 'loading' ? 'Loading...' : 'Success!'}
          </h2>
        <p className="muted" style={{ margin: '0 0 16px 0' }}>
          {phase === 'loading'
            ? 'Submitting your info and assigning a licensed agent.'
            : 'Your assigned agent will reach out within 24 hours to consult.'}
        </p>
        <div className={`check-wrap ${phase}`}>
          <svg className="check-svg" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Spinner arc */}
            <g className="spinner">
              <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="4" strokeLinecap="round" strokeDasharray="90" strokeDashoffset="60"/>
            </g>
            {/* Check mark path */}
            <path className="check-path" d="M30 16 L20 27 L14 22" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="ring"></span>
        </div>

        {showAssigned && (
          <>
            <img className="bestcard" src="/production/bestcard.png" alt="Best card" />
            <div className="agent-bio">
              <strong>ABOUT MR. ALFIERI:</strong> Michael is one of the top-producing agents with Veteran Legacy Life and an industry-leading professional in Insurance. Born and raised in Oregon, he comes from a big Catholic family of 6 kids. 5 years ago he retired from playing Professional Football in Europe and he decided to follow in his father's footsteps to pursue a career in Insurance, dedicated to helping families secure their financial futures.
            </div>
            <div className="trust-badges">
              <img className="trust-badge" src="/production/NIPR.png" alt="NIPR - National Insurance Producer Registry" />
              <img className="trust-badge" src="/production/BBBblue.png" alt="BBB A+ Rating" />
          </div>
            <p className="muted" style={{ marginTop: '12px', fontSize: '0.9rem', color: '#475569', fontStyle: 'italic' }}>
              Look out for Michael's call from a (503) area code.
            </p>
          <button
              onClick={closeModal}
            style={{
                marginTop: '16px',
                padding: '10px 32px',
                fontSize: '1rem',
                fontWeight: 600,
              color: 'white',
                background: '#1A2C42',
              border: 'none',
                borderRadius: '8px',
              cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transform: 'scale(1)',
                WebkitTapHighlightColor: 'transparent'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.currentTarget.style.background = '#233552';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                e.currentTarget.style.background = '#1A2C42';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
            >
              Done
          </button>
          </>
        )}
          </div>
          
      {/* Loading-only: show two cards (Concierge Call, No Obligation) */}
      {phase === 'loading' && (
        <div className="next-steps">
          <div className="next-card">
            <strong style={{ color: '#1A2C42' }}><span style={{ filter: 'brightness(0.5) sepia(1) saturate(3) hue-rotate(180deg)', marginRight: '8px' }}>👤</span>Concierge Call</strong>
            <p className="muted" style={{ marginTop: 6 }}>A licensed specialist reviews your profile and contacts you to tailor options.</p>
          </div>
          <div className="next-card">
            <strong style={{ color: '#1A2C42' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '8px', verticalAlign: 'text-bottom' }}>
                <defs>
                  <clipPath id="rightHalf">
                    <rect x="12" y="0" width="12" height="24"/>
                  </clipPath>
                </defs>
                <path fill="#1A2C42" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                <path fill="white" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" clipPath="url(#rightHalf)"/>
                <path fill="none" stroke="#1A2C42" strokeWidth="1" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              No Obligation</strong>
            <p className="muted" style={{ marginTop: 6 }}>You’ll receive clear recommendations from top A‑rated carriers.</p>
          </div>
            </div>
      )}

      </div>
    </div>
  )
} 


