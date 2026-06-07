import React, { useState } from 'react';
import { Send, CheckCircle2, User, MessageCircle, ArrowRight, Star } from 'lucide-react';

// Custom Brand SVGs since Lucide deprecated them
const YoutubeIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const TwitterIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Animated checkmark SVG for success state
const AnimatedCheck = () => (
  <svg className="animated-check" width="56" height="56" viewBox="0 0 56 56" fill="none">
    <circle className="check-circle" cx="28" cy="28" r="25" stroke="var(--text-primary)" strokeWidth="2" />
    <path className="check-path" d="M17 28.5L24.5 36L39 21" stroke="var(--text-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function TipPageView({ creatorInfo, onAddTip, isWidget = false }) {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [bounceKey, setBounceKey] = useState(null);

  const presets = [10, 50, 100, 500];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setBounceKey(amount);
    setTimeout(() => setBounceKey(null), 400);
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const activeAmount = selectedAmount !== null ? selectedAmount : (parseInt(customAmount) || 0);

  const handleSubmitTip = (e) => {
    e.preventDefault();
    if (activeAmount <= 0) return;

    setIsSending(true);
    
    // Simulate transaction delay
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      
      // Notify parent app to add to recent tip history
      if (onAddTip) {
        onAddTip({
          sender: senderName.trim() || 'Anonymous Fan',
          address: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
          amount: activeAmount,
          message: message.trim() || 'Supported the creator!',
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      }
    }, 2000);
  };

  const resetForm = () => {
    setIsSuccess(false);
    setMessage('');
    setSenderName('');
    setSelectedAmount(50);
    setCustomAmount('');
  };

  return (
    <div className={`tip-container ${isWidget ? 'widget-mode' : ''}`}>
      {!isSuccess ? (
        <div className="glass-card tip-card" style={{ animationDelay: '0.05s' }}>
          {/* Top gradient accent */}
          <div className="tip-card-accent" />

          {/* Creator Profile Header */}
          <div className="tip-profile-header">
            <div className="creator-avatar-ring">
              <div className="creator-avatar">
                {creatorInfo.name ? creatorInfo.name.charAt(0).toUpperCase() : 'C'}
              </div>
            </div>
            <div className="creator-name-row">
              <h2 className="creator-title">{creatorInfo.name || 'Creator Name'}</h2>
              <Star size={15} className="verified-badge" />
            </div>
            <p className="creator-handle">@{creatorInfo.username || 'username'}</p>
            <p className="creator-bio">"{creatorInfo.bio || 'Thank you for supporting my content creation journey!'}"</p>
            
            {/* Social Badges */}
            {(creatorInfo.youtube || creatorInfo.twitter) && (
              <div className="social-badges">
                {creatorInfo.youtube && (
                  <a href={creatorInfo.youtube} target="_blank" rel="noopener noreferrer" className="social-badge">
                    <YoutubeIcon size={13} /> YouTube
                  </a>
                )}
                {creatorInfo.twitter && (
                  <a href={creatorInfo.twitter} target="_blank" rel="noopener noreferrer" className="social-badge">
                    <TwitterIcon size={13} /> Twitter
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Form */}
          <form className="tipping-form" onSubmit={handleSubmitTip}>
            <div className="form-group">
              <label>Select Amount (G$)</label>
              <div className="preset-grid">
                {presets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAmountSelect(amt)}
                    className={`preset-chip ${selectedAmount === amt ? 'active' : ''} ${bounceKey === amt ? 'bounce' : ''}`}
                  >
                    {amt} G$
                  </button>
                ))}
              </div>
              <div className="or-divider">
                <span className="or-divider-line" />
                <span className="or-divider-text">or</span>
                <span className="or-divider-line" />
              </div>
              <div className="floating-input-wrap">
                <input
                  type="text"
                  placeholder=" "
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  onFocus={() => setFocusedField('custom')}
                  onBlur={() => setFocusedField(null)}
                  className="custom-amount-input"
                  id="customAmount"
                />
                <label htmlFor="customAmount" className="floating-label">Custom G$ amount</label>
              </div>
            </div>

            <div className="form-group">
              <div className="floating-input-wrap has-icon">
                <span className="input-icon"><User size={16} /></span>
                <input
                  type="text"
                  id="senderName"
                  placeholder=" "
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
                <label htmlFor="senderName" className="floating-label with-icon">Your Name (Optional)</label>
              </div>
            </div>

            <div className="form-group">
              <div className="floating-input-wrap has-icon textarea-wrap">
                <span className="input-icon textarea-icon"><MessageCircle size={16} /></span>
                <textarea
                  id="message"
                  placeholder=" "
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocusedField('msg')}
                  onBlur={() => setFocusedField(null)}
                  maxLength={150}
                />
                <label htmlFor="message" className="floating-label with-icon">Add a Message</label>
              </div>
            </div>

            <button
              type="submit"
              disabled={activeAmount <= 0 || isSending}
              className="tip-submit-btn"
            >
              {isSending ? (
                <div className="submit-loading">
                  <div className="spinner-clean" />
                  <span className="sending-text">Processing…</span>
                </div>
              ) : (
                <span className="submit-content">
                  <span>Send {activeAmount > 0 ? `${activeAmount} G$` : 'Tip'}</span>
                  <ArrowRight size={16} className="submit-arrow" />
                </span>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Success State Screen */
        <div className="glass-card tip-card success-card">
          {/* CSS-only confetti particles */}
          <div className="confetti-container" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`confetti-dot dot-${i}`} />
            ))}
          </div>

          <div className="success-icon-wrap">
            <AnimatedCheck />
          </div>
          <h2 className="success-title">Tip Sent!</h2>
          <p className="success-desc">Your daily GoodDollar UBI has made someone's day.</p>
          
          <div className="receipt-box">
            <div className="receipt-row">
              <span className="receipt-label">Recipient</span>
              <span className="receipt-value">{creatorInfo.name}</span>
            </div>
            <div className="receipt-row">
              <span className="receipt-label">Amount</span>
              <span className="receipt-value-strong">{activeAmount} G$</span>
            </div>
            {senderName && (
              <div className="receipt-row">
                <span className="receipt-label">From</span>
                <span className="receipt-value">{senderName}</span>
              </div>
            )}
            {message && (
              <div className="receipt-msg">
                <span className="receipt-label">Message</span>
                <p className="receipt-msg-text">"{message}"</p>
              </div>
            )}
          </div>

          <button onClick={resetForm} className="btn-secondary full-width reset-btn">
            Send Another Tip
          </button>
        </div>
      )}

      <style>{`
        /* =================== CONTAINER =================== */
        .tip-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          width: 100%;
        }

        .tip-card {
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 440px;
          padding: 36px;
          border-radius: 20px;
          animation: fadeUpScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .tip-card-accent {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--text-primary) 0%, transparent 100%);
          opacity: 0.7;
        }

        .tip-container.widget-mode {
          min-height: auto;
          padding: 0;
        }

        .widget-mode .tip-card {
          border-radius: 16px;
          box-shadow: none;
          max-width: 100%;
          padding: 20px;
        }

        /* =================== CREATOR HEADER =================== */
        .tip-profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 28px;
        }

        .creator-avatar-ring {
          position: relative;
          padding: 4px;
          border-radius: 50%;
          margin-bottom: 16px;
        }

        .creator-avatar-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid var(--border-glass-hover);
          animation: avatarPulse 3s ease-in-out infinite;
        }

        .creator-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.02);
          border: 1px solid var(--border-glass);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 2rem;
          font-weight: 700;
          position: relative;
          z-index: 1;
          box-shadow: 0 0 24px rgba(0, 0, 0, 0.015);
        }

        .creator-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .creator-title {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .verified-badge {
          color: var(--text-primary);
          fill: var(--text-primary);
          opacity: 0.85;
          flex-shrink: 0;
        }

        .creator-handle {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: var(--text-muted);
          opacity: 0.75;
          margin-bottom: 10px;
          letter-spacing: 0.01em;
        }

        .creator-bio {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.65;
          font-style: italic;
          max-width: 360px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .social-badges {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .social-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.01);
          border: 1px solid var(--border-glass);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: var(--transition-smooth);
          cursor: pointer;
        }

        .social-badge:hover {
          color: var(--text-primary);
          border-color: var(--text-primary);
          background: rgba(0, 0, 0, 0.025);
          transform: scale(1.05);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }

        /* =================== FORM =================== */
        .tipping-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        /* =================== AMOUNT CHIPS =================== */
        .preset-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .preset-chip {
          background: transparent;
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
          padding: 11px 0;
          border-radius: 10px;
          font-family: var(--font-mono);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
          position: relative;
        }

        .preset-chip:hover {
          border-color: rgba(10, 10, 10, 0.35);
          color: var(--text-primary);
          background: rgba(0, 0, 0, 0.015);
        }

        .preset-chip.active {
          background: var(--text-primary);
          color: #ffffff;
          border-color: var(--text-primary);
          transform: scale(1.02);
          box-shadow: 0 2px 10px rgba(10, 10, 10, 0.12);
        }

        .preset-chip.bounce {
          animation: chipBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* =================== OR DIVIDER =================== */
        .or-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 14px 0 6px;
        }

        .or-divider-line {
          flex: 1;
          height: 1px;
          background: var(--border-glass);
        }

        .or-divider-text {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* =================== FLOATING LABEL INPUTS =================== */
        .floating-input-wrap {
          position: relative;
        }

        .floating-input-wrap input,
        .floating-input-wrap textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid var(--border-glass);
          border-radius: 8px;
          color: var(--text-primary);
          padding: 18px 16px 8px;
          font-family: var(--font-body);
          font-size: 0.92rem;
          outline: none;
          transition: border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      background 0.35s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .floating-input-wrap.has-icon input,
        .floating-input-wrap.has-icon textarea {
          padding-left: 44px;
        }

        .floating-input-wrap input:focus,
        .floating-input-wrap textarea:focus {
          border-color: var(--text-primary);
          background: #ffffff;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }

        .floating-label {
          position: absolute;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
          color: var(--text-muted);
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          background: transparent;
          padding: 0 4px;
          margin-left: -4px;
        }

        .floating-label.with-icon {
          left: 44px;
        }

        .textarea-wrap .floating-label {
          top: 18px;
          transform: none;
        }

        /* Float up when focused or has content */
        .floating-input-wrap input:focus ~ .floating-label,
        .floating-input-wrap input:not(:placeholder-shown) ~ .floating-label {
          top: 6px;
          transform: none;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
        }

        .floating-input-wrap textarea:focus ~ .floating-label,
        .floating-input-wrap textarea:not(:placeholder-shown) ~ .floating-label {
          top: -8px;
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          background: linear-gradient(to bottom, transparent 45%, rgba(255,255,255,0.9) 45%);
        }

        .floating-input-wrap textarea {
          padding-top: 18px;
          min-height: 96px;
          resize: vertical;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
          z-index: 2;
          transition: color 0.3s ease;
        }

        .textarea-icon {
          top: 20px;
          transform: none;
        }

        .floating-input-wrap input:focus ~ .input-icon,
        .floating-input-wrap textarea:focus ~ .input-icon {
          color: var(--text-primary);
        }

        /* Icon color change hack — icon is before input, so use sibling of the wrapper */
        .has-icon:focus-within .input-icon {
          color: var(--text-secondary);
        }

        /* =================== SUBMIT BUTTON =================== */
        .tip-submit-btn {
          width: 100%;
          height: 48px;
          background: var(--text-primary);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          margin-top: 6px;
          position: relative;
          overflow: hidden;
        }

        .tip-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(10, 10, 10, 0.15);
          background: #1a1a16;
        }

        .tip-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .tip-submit-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .submit-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-arrow {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tip-submit-btn:hover:not(:disabled) .submit-arrow {
          transform: translateX(4px);
        }

        .submit-loading {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sending-text {
          font-size: 0.88rem;
          opacity: 0.8;
          animation: textFade 1.5s ease-in-out infinite;
        }

        .spinner-clean {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* =================== SUCCESS CARD =================== */
        .success-card {
          text-align: center;
          animation: fadeUpScale 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        /* Confetti particles */
        .confetti-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--text-primary);
          opacity: 0;
          animation: confettiFloat 2.8s ease-out forwards;
        }

        .dot-0  { left: 10%; bottom: 0; animation-delay: 0.1s; background: var(--text-primary); }
        .dot-1  { left: 20%; bottom: 0; animation-delay: 0.25s; background: var(--text-muted); width: 4px; height: 4px; }
        .dot-2  { left: 35%; bottom: 0; animation-delay: 0.15s; background: var(--text-secondary); }
        .dot-3  { left: 50%; bottom: 0; animation-delay: 0.35s; background: var(--text-primary); width: 6px; height: 6px; }
        .dot-4  { left: 65%; bottom: 0; animation-delay: 0.1s; background: var(--text-muted); }
        .dot-5  { left: 78%; bottom: 0; animation-delay: 0.3s; background: var(--text-secondary); width: 4px; height: 4px; }
        .dot-6  { left: 88%; bottom: 0; animation-delay: 0.2s; background: var(--text-primary); }
        .dot-7  { left: 15%; bottom: 0; animation-delay: 0.45s; background: var(--text-muted); width: 3px; height: 3px; }
        .dot-8  { left: 42%; bottom: 0; animation-delay: 0.05s; background: var(--text-primary); width: 4px; height: 4px; }
        .dot-9  { left: 58%; bottom: 0; animation-delay: 0.4s; background: var(--text-secondary); }
        .dot-10 { left: 72%; bottom: 0; animation-delay: 0.18s; background: var(--text-muted); width: 5px; height: 5px; }
        .dot-11 { left: 92%; bottom: 0; animation-delay: 0.32s; background: var(--text-primary); width: 3px; height: 3px; }

        .success-icon-wrap {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          width: 88px;
          height: 88px;
          background: rgba(0, 0, 0, 0.015);
          border: 1px solid var(--border-glass);
          border-radius: 50%;
          margin-bottom: 20px;
        }

        /* Animated checkmark */
        .animated-check .check-circle {
          stroke-dasharray: 160;
          stroke-dashoffset: 160;
          animation: drawCircle 0.6s cubic-bezier(0.65, 0, 0.35, 1) 0.2s forwards;
          fill: none;
        }

        .animated-check .check-path {
          stroke-dasharray: 36;
          stroke-dashoffset: 36;
          animation: drawCheck 0.4s cubic-bezier(0.65, 0, 0.35, 1) 0.65s forwards;
        }

        .success-title {
          font-family: var(--font-sans);
          font-size: 1.65rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .success-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 28px;
          line-height: 1.5;
        }

        .receipt-box {
          background: rgba(0, 0, 0, 0.015);
          border: 1px solid var(--border-glass);
          border-left: 3px solid var(--text-primary);
          border-radius: 10px;
          padding: 20px 22px;
          margin-bottom: 28px;
          text-align: left;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
        }

        .receipt-row:last-of-type {
          border-bottom: none;
        }

        .receipt-label {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 500;
        }

        .receipt-value {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .receipt-value-strong {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-primary);
        }

        .receipt-msg {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
        }

        .receipt-msg-text {
          margin-top: 6px;
          font-size: 0.84rem;
          color: var(--text-secondary);
          font-style: italic;
          line-height: 1.55;
        }

        .reset-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          font-weight: 600;
          transition: var(--transition-smooth);
        }

        .reset-btn:hover {
          border-color: var(--text-primary);
          background: rgba(0, 0, 0, 0.03);
        }

        .full-width {
          width: 100%;
          justify-content: center;
        }

        /* =================== KEYFRAMES =================== */
        @keyframes fadeUpScale {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes avatarPulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }

        @keyframes chipBounce {
          0% { transform: scale(1); }
          40% { transform: scale(1.08); }
          70% { transform: scale(0.98); }
          100% { transform: scale(1.02); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes textFade {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }

        @keyframes confettiFloat {
          0% {
            opacity: 0.9;
            transform: translateY(0) scale(1);
          }
          60% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateY(-280px) scale(0.3) translateX(var(--drift, 10px));
          }
        }

        .dot-0  { --drift: -12px; }
        .dot-1  { --drift: 18px; }
        .dot-2  { --drift: -8px; }
        .dot-3  { --drift: 14px; }
        .dot-4  { --drift: -20px; }
        .dot-5  { --drift: 10px; }
        .dot-6  { --drift: -15px; }
        .dot-7  { --drift: 22px; }
        .dot-8  { --drift: -6px; }
        .dot-9  { --drift: 16px; }
        .dot-10 { --drift: -18px; }
        .dot-11 { --drift: 8px; }

        @keyframes drawCircle {
          to { stroke-dashoffset: 0; }
        }

        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }

        /* =================== RESPONSIVE =================== */
        @media (max-width: 480px) {
          .tip-card {
            padding: 24px;
            border-radius: 16px;
          }

          .creator-title {
            font-size: 1.35rem;
          }

          .preset-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
