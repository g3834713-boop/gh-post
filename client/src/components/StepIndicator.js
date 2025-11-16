import React from 'react';

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Delivery Status' },
    { number: 2, label: 'Update Address' },
    { number: 3, label: 'Payment' },
  ];

  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`step-item ${
            step.number === currentStep
              ? 'active'
              : step.number < currentStep
              ? 'completed'
              : ''
          }`}
        >
          <div className="step-number">{step.number}</div>
          <div className="step-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
}

export default StepIndicator;
