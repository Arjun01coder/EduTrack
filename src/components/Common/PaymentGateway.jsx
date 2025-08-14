import React, { useState } from 'react';
import Modal from './Modal';

const PaymentGateway = ({ feeDetails, onPaymentComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    // Card details
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    
    // UPI details
    upiId: '',
    
    // Bank details
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    
    // Net banking
    selectedBank: '',
    
    // Billing address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Amount selection
    amountType: 'full', // 'full', 'partial', 'custom'
    customAmount: '',
    installmentPlan: 'none' // 'none', '3months', '6months', '12months'
  });

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
    { id: 'upi', name: 'UPI', icon: '📱', description: 'Google Pay, PhonePe, Paytm' },
    { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks' },
    { id: 'wallet', name: 'Digital Wallet', icon: '👛', description: 'Paytm, PhonePe Wallet' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏧', description: 'Direct bank transfer' }
  ];

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Indian Bank'
  ];

  const installmentPlans = [
    { id: 'none', name: 'Pay Full Amount', months: 0, fee: 0 },
    { id: '3months', name: '3 Monthly Installments', months: 3, fee: 2 },
    { id: '6months', name: '6 Monthly Installments', months: 6, fee: 5 },
    { id: '12months', name: '12 Monthly Installments', months: 12, fee: 8 }
  ];

  const getPaymentAmount = () => {
    const baseAmount = paymentData.amountType === 'full' 
      ? feeDetails.pendingAmount 
      : paymentData.amountType === 'partial' 
        ? Math.ceil(feeDetails.pendingAmount * 0.5)
        : parseFloat(paymentData.customAmount) || 0;

    const plan = installmentPlans.find(p => p.id === paymentData.installmentPlan);
    const processingFee = plan ? (baseAmount * plan.fee / 100) : 0;
    
    return baseAmount + processingFee;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setPaymentData(prev => ({ ...prev, expiryDate: value }));
  };

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      return paymentData.cardNumber.replace(/\s/g, '').length === 16 && 
             paymentData.expiryDate.length === 5 && 
             paymentData.cvv.length === 3 && 
             paymentData.cardholderName.trim();
    }
    if (paymentMethod === 'upi') {
      return paymentData.upiId.includes('@');
    }
    if (paymentMethod === 'netbanking') {
      return paymentData.selectedBank;
    }
    return true;
  };

  const processPayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const paymentResult = {
      success: true,
      transactionId: 'TXN' + Date.now(),
      amount: getPaymentAmount(),
      method: paymentMethod,
      timestamp: new Date(),
      installmentPlan: paymentData.installmentPlan
    };
    
    setProcessing(false);
    onPaymentComplete(paymentResult);
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5') || cleaned.startsWith('2')) return 'mastercard';
    if (cleaned.startsWith('6')) return 'rupay';
    return 'unknown';
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map(step => (
        <div key={step} className={`step ${currentStep >= step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
          <div className="step-number">{currentStep > step ? '✓' : step}</div>
          <div className="step-label">
            {step === 1 && 'Amount & Method'}
            {step === 2 && 'Payment Details'}
            {step === 3 && 'Confirmation'}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="payment-step">
      <h3>Select Payment Amount & Method</h3>
      
      {/* Fee Summary */}
      <div className="fee-summary">
        <h4>Fee Details</h4>
        <div className="fee-row">
          <span>Total Fee Amount:</span>
          <span>₹{feeDetails.totalAmount.toLocaleString()}</span>
        </div>
        <div className="fee-row">
          <span>Already Paid:</span>
          <span>₹{feeDetails.paidAmount.toLocaleString()}</span>
        </div>
        <div className="fee-row pending">
          <span>Pending Amount:</span>
          <span>₹{feeDetails.pendingAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Amount Selection */}
      <div className="amount-selection">
        <h4>Select Payment Amount</h4>
        <div className="amount-options">
          <label className="amount-option">
            <input
              type="radio"
              name="amountType"
              value="full"
              checked={paymentData.amountType === 'full'}
              onChange={handleInputChange}
            />
            <div className="option-content">
              <div className="option-title">Pay Full Amount</div>
              <div className="option-amount">₹{feeDetails.pendingAmount.toLocaleString()}</div>
            </div>
          </label>
          
          <label className="amount-option">
            <input
              type="radio"
              name="amountType"
              value="partial"
              checked={paymentData.amountType === 'partial'}
              onChange={handleInputChange}
            />
            <div className="option-content">
              <div className="option-title">Pay 50%</div>
              <div className="option-amount">₹{Math.ceil(feeDetails.pendingAmount * 0.5).toLocaleString()}</div>
            </div>
          </label>
          
          <label className="amount-option">
            <input
              type="radio"
              name="amountType"
              value="custom"
              checked={paymentData.amountType === 'custom'}
              onChange={handleInputChange}
            />
            <div className="option-content">
              <div className="option-title">Custom Amount</div>
              <input
                type="number"
                name="customAmount"
                value={paymentData.customAmount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                className="custom-amount-input"
                min="1000"
                max={feeDetails.pendingAmount}
              />
            </div>
          </label>
        </div>
      </div>

      {/* Installment Plans */}
      <div className="installment-plans">
        <h4>Installment Options</h4>
        <div className="plan-options">
          {installmentPlans.map(plan => (
            <label key={plan.id} className="plan-option">
              <input
                type="radio"
                name="installmentPlan"
                value={plan.id}
                checked={paymentData.installmentPlan === plan.id}
                onChange={handleInputChange}
              />
              <div className="plan-content">
                <div className="plan-name">{plan.name}</div>
                {plan.fee > 0 && (
                  <div className="plan-fee">Processing fee: {plan.fee}%</div>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="payment-methods">
        <h4>Choose Payment Method</h4>
        <div className="method-grid">
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className={`payment-method ${paymentMethod === method.id ? 'selected' : ''}`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <div className="method-icon">{method.icon}</div>
              <div className="method-info">
                <div className="method-name">{method.name}</div>
                <div className="method-desc">{method.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amount Summary */}
      <div className="amount-summary">
        <div className="summary-row">
          <span>Payment Amount:</span>
          <span>₹{getPaymentAmount().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="payment-step">
      <h3>Enter Payment Details</h3>
      
      {paymentMethod === 'card' && (
        <div className="card-form">
          <div className="card-preview">
            <div className={`card ${getCardType(paymentData.cardNumber)}`}>
              <div className="card-number">
                {paymentData.cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="card-bottom">
                <div className="card-name">
                  {paymentData.cardholderName || 'CARDHOLDER NAME'}
                </div>
                <div className="card-expiry">
                  {paymentData.expiryDate || 'MM/YY'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="form-control"
                maxLength="19"
              />
            </div>
            
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={paymentData.expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className="form-control"
                maxLength="5"
              />
            </div>
            
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={paymentData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className="form-control"
                maxLength="3"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                value={paymentData.cardholderName}
                onChange={handleInputChange}
                placeholder="Name as on card"
                className="form-control"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'upi' && (
        <div className="upi-form">
          <div className="upi-icon">📱</div>
          <h4>Enter UPI ID</h4>
          <input
            type="text"
            name="upiId"
            value={paymentData.upiId}
            onChange={handleInputChange}
            placeholder="yourname@paytm"
            className="form-control upi-input"
          />
          
          <div className="upi-apps">
            <div className="app-option">📱 Google Pay</div>
            <div className="app-option">📱 PhonePe</div>
            <div className="app-option">📱 Paytm</div>
            <div className="app-option">📱 Amazon Pay</div>
          </div>
        </div>
      )}

      {paymentMethod === 'netbanking' && (
        <div className="netbanking-form">
          <h4>Select Your Bank</h4>
          <select
            name="selectedBank"
            value={paymentData.selectedBank}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Choose your bank</option>
            {banks.map(bank => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>
      )}

      {paymentMethod === 'wallet' && (
        <div className="wallet-form">
          <h4>Digital Wallet</h4>
          <div className="wallet-options">
            <div className="wallet-option">
              <div className="wallet-icon">💳</div>
              <div className="wallet-name">Paytm Wallet</div>
            </div>
            <div className="wallet-option">
              <div className="wallet-icon">📱</div>
              <div className="wallet-name">PhonePe Wallet</div>
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'bank' && (
        <div className="bank-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={paymentData.accountNumber}
                onChange={handleInputChange}
                placeholder="Account number"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>IFSC Code</label>
              <input
                type="text"
                name="routingNumber"
                value={paymentData.routingNumber}
                onChange={handleInputChange}
                placeholder="IFSC Code"
                className="form-control"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={paymentData.bankName}
                onChange={handleInputChange}
                placeholder="Bank name"
                className="form-control"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="payment-step">
      <h3>Confirm Payment</h3>
      
      <div className="confirmation-details">
        <div className="confirmation-section">
          <h4>Payment Summary</h4>
          <div className="detail-row">
            <span>Student:</span>
            <span>{feeDetails.studentName}</span>
          </div>
          <div className="detail-row">
            <span>Semester:</span>
            <span>{feeDetails.semester}</span>
          </div>
          <div className="detail-row">
            <span>Payment Method:</span>
            <span>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
          </div>
          <div className="detail-row">
            <span>Amount to Pay:</span>
            <span className="amount-highlight">₹{getPaymentAmount().toLocaleString()}</span>
          </div>
          
          {paymentData.installmentPlan !== 'none' && (
            <div className="installment-info">
              <div className="installment-title">Installment Plan</div>
              <div className="installment-details">
                {installmentPlans.find(p => p.id === paymentData.installmentPlan)?.name}
              </div>
            </div>
          )}
        </div>

        <div className="security-notice">
          <div className="security-icon">🔒</div>
          <div className="security-text">
            <strong>Secure Payment</strong>
            <p>Your payment information is encrypted and secure. This transaction will appear on your statement as "EduTrack Fee Payment".</p>
          </div>
        </div>
      </div>

      {processing && (
        <div className="processing-animation">
          <div className="spinner"></div>
          <p>Processing your payment...</p>
          <p className="processing-steps">Please do not close this window</p>
        </div>
      )}
    </div>
  );

  return (
    <Modal title="Fee Payment Gateway" onClose={onClose} size="large">
      <div className="payment-gateway">
        {renderStepIndicator()}
        
        <div className="payment-content">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="payment-actions">
          {currentStep > 1 && (
            <button 
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn btn-secondary"
              disabled={processing}
            >
              ← Back
            </button>
          )}
          
          <div className="action-buttons">
            {currentStep < 3 && (
              <button 
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn btn-primary"
                disabled={currentStep === 2 && !validatePayment()}
              >
                Continue →
              </button>
            )}
            
            {currentStep === 3 && (
              <button 
                onClick={processPayment}
                className="btn btn-success"
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay ₹${getPaymentAmount().toLocaleString()}`}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .payment-gateway {
          max-width: 100%;
        }

        .step-indicator {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 30px;
          position: relative;
        }

        .step::after {
          content: '';
          position: absolute;
          top: 20px;
          left: 50px;
          width: 60px;
          height: 2px;
          background: #ddd;
        }

        .step:last-child::after {
          display: none;
        }

        .step.completed::after {
          background: #28a745;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ddd;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .step.active .step-number {
          background: #667eea;
        }

        .step.completed .step-number {
          background: #28a745;
        }

        .step-label {
          font-size: 12px;
          color: #666;
          text-align: center;
        }

        .payment-content {
          min-height: 400px;
          margin-bottom: 30px;
        }

        .payment-step h3 {
          margin: 0 0 25px 0;
          color: #333;
          font-size: 20px;
        }

        .fee-summary {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .fee-summary h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .fee-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .fee-row.pending {
          font-weight: bold;
          color: #dc3545;
          border-top: 1px solid #ddd;
          padding-top: 8px;
          margin-top: 8px;
        }

        .amount-selection,
        .installment-plans {
          margin-bottom: 25px;
        }

        .amount-selection h4,
        .installment-plans h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .amount-options,
        .plan-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .amount-option,
        .plan-option {
          display: flex;
          align-items: center;
          padding: 15px;
          border: 2px solid #eee;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .amount-option:hover,
        .plan-option:hover {
          border-color: #667eea;
        }

        .amount-option input[type="radio"],
        .plan-option input[type="radio"] {
          margin-right: 12px;
        }

        .option-content,
        .plan-content {
          flex: 1;
        }

        .option-title,
        .plan-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .option-amount {
          color: #667eea;
          font-weight: bold;
        }

        .plan-fee {
          font-size: 12px;
          color: #666;
        }

        .custom-amount-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-top: 8px;
        }

        .payment-methods {
          margin-bottom: 25px;
        }

        .payment-methods h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .method-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
        }

        .payment-method {
          display: flex;
          align-items: center;
          padding: 15px;
          border: 2px solid #eee;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .payment-method:hover {
          border-color: #667eea;
        }

        .payment-method.selected {
          border-color: #667eea;
          background: #f0f8ff;
        }

        .method-icon {
          font-size: 24px;
          margin-right: 15px;
        }

        .method-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .method-desc {
          font-size: 12px;
          color: #666;
        }

        .amount-summary {
          background: #e6f3ff;
          border-radius: 8px;
          padding: 15px;
          border-left: 4px solid #667eea;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }

        .card-form {
          max-width: 500px;
          margin: 0 auto;
        }

        .card-preview {
          margin-bottom: 25px;
        }

        .card {
          width: 300px;
          height: 180px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          padding: 20px;
          color: white;
          font-family: 'Courier New', monospace;
          position: relative;
          margin: 0 auto;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .card.visa {
          background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
        }

        .card.mastercard {
          background: linear-gradient(135deg, #c53030 0%, #e53e3e 100%);
        }

        .card.rupay {
          background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
        }

        .card-number {
          font-size: 18px;
          letter-spacing: 2px;
          margin: 40px 0 20px 0;
        }

        .card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: end;
        }

        .card-name {
          font-size: 12px;
          text-transform: uppercase;
        }

        .card-expiry {
          font-size: 14px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-control {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }

        .form-control:focus {
          outline: none;
          border-color: #667eea;
        }

        .upi-form {
          text-align: center;
          max-width: 400px;
          margin: 0 auto;
        }

        .upi-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .upi-input {
          font-size: 18px;
          text-align: center;
          margin-bottom: 25px;
        }

        .upi-apps {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .app-option {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .app-option:hover {
          background: #f0f8ff;
          border-color: #667eea;
        }

        .netbanking-form,
        .wallet-form,
        .bank-form {
          max-width: 400px;
          margin: 0 auto;
        }

        .wallet-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .wallet-option {
          text-align: center;
          padding: 20px;
          border: 2px solid #eee;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .wallet-option:hover {
          border-color: #667eea;
          background: #f0f8ff;
        }

        .wallet-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .confirmation-details {
          max-width: 500px;
          margin: 0 auto;
        }

        .confirmation-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .confirmation-section h4 {
          margin: 0 0 15px 0;
          color: #333;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .amount-highlight {
          color: #667eea;
          font-weight: bold;
          font-size: 16px;
        }

        .installment-info {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #ddd;
        }

        .installment-title {
          font-weight: 500;
          margin-bottom: 5px;
        }

        .security-notice {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: #e8f5e8;
          border-radius: 8px;
          border-left: 4px solid #28a745;
        }

        .security-icon {
          font-size: 24px;
        }

        .security-text strong {
          display: block;
          margin-bottom: 5px;
          color: #155724;
        }

        .security-text p {
          margin: 0;
          font-size: 13px;
          color: #155724;
        }

        .processing-animation {
          text-align: center;
          padding: 40px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .processing-steps {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
        }

        .payment-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
        }

        @media (max-width: 768px) {
          .step {
            margin: 0 15px;
          }

          .step::after {
            width: 30px;
            left: 35px;
          }

          .amount-options,
          .plan-options,
          .method-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .card {
            width: 250px;
            height: 150px;
            padding: 15px;
          }

          .card-number {
            font-size: 14px;
            margin: 30px 0 15px 0;
          }

          .upi-apps,
          .wallet-options {
            grid-template-columns: 1fr;
          }

          .payment-actions {
            flex-direction: column;
            gap: 15px;
          }

          .action-buttons {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </Modal>
  );
};

export default PaymentGateway;
