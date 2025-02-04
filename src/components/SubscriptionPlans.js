import React from "react";
import "./SubscriptionPlans.css";

const plans = [
  { name: "Basic", price: "€0,00", priceId: null, features: ["1 horse per month", "3 shares"] },
  { name: "Plus", price: "€4,99", priceId: "price_1Qo67GDCGWh9lQnCP4woIdoo", features: ["2 horses per month", "10 shares"] },
  { name: "Premium", price: "€14,99", priceId: "price_1Qo67nDCGWh9lQnCV35pyiym", features: ["6 horses per month", "30 shares"] },
  { name: "Ultimate", price: "€34,99", priceId: "price_1Qo68DDCGWh9lQnCaWeRF1YO", features: ["Unlimited horses", "Unlimited shares"] },
];

const SubscriptionPlans = ({ onSelectPlan, onClose, currentPlan }) => {
  return (
    <div className="plans-container">
      <h2 className="plans-title">Choose Your Plan</h2>
      <div className="plans-row">
        {plans.map((plan) => {
          // 🔍 Prevent error if `currentPlan` is undefined
          const isCurrentPlan = plan?.name?.toLowerCase().trim() === currentPlan?.toLowerCase().trim();

          return (
            <div key={plan.name} className={`plan-card ${isCurrentPlan ? "active-plan" : ""}`}>
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-price">{plan.price}</p>
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              {/* 🔥 If it's the current plan, change the appearance and remove the action */}
              {isCurrentPlan ? (
                <button className="current-plan-btn" disabled>✔ Current Plan</button>
              ) : (
                <button onClick={() => onSelectPlan(plan)} className="select-plan-btn">
                  Select {plan.name}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={onClose} className="cancel-btn">Cancel</button>
    </div>
  );
};

export default SubscriptionPlans;
