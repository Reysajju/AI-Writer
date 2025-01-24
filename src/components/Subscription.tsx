import React from 'react';
import { Check, Zap, Rocket, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '$9.99',
    icon: Zap,
    features: [
      '50 generations per day',
      'Access to Gemini Pro',
      'Character Creation',
      'World Building',
      'Basic Support',
    ],
    color: 'from-blue-600 to-sky-600',
    recommended: false
  },
  {
    name: 'Professional',
    price: '$29.99',
    icon: Rocket,
    features: [
      '200 generations per day',
      'Access to GPT-4',
      'Priority Support',
      'Advanced Templates',
      'Team Collaboration',
      'API Access'
    ],
    color: 'from-purple-600 to-indigo-600',
    recommended: true
  },
  {
    name: 'Enterprise',
    price: '$99.99',
    icon: Crown,
    features: [
      'Unlimited generations',
      'Access to Claude-3',
      'Custom AI Model Training',
      'Dedicated Support',
      'White-label Solution',
      'Custom Integration',
      'Advanced Analytics'
    ],
    color: 'from-amber-500 to-orange-600',
    recommended: false
  }
];

export function Subscription() {
  const handleSubscribe = (planName: string) => {
    // Handle subscription logic here
    console.log(`Subscribing to ${planName} plan`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-navy-800 bg-clip-text text-transparent mb-4">
          Choose Your Plan
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Start with 5 free generations per day. Upgrade your plan to unlock more features and increase your daily generation limit.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 ${
              plan.recommended ? 'ring-2 ring-indigo-600 scale-105' : ''
            }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                Recommended
              </div>
            )}

            <div className={`p-8 bg-gradient-to-br ${plan.color} text-white`}>
              <plan.icon className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="ml-2 text-sm opacity-80">/month</span>
              </div>
            </div>

            <div className="p-8">
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r ${
                  plan.color
                } hover:opacity-90 transition-opacity`}
              >
                Subscribe Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Enterprise Custom Solutions</h3>
        <p className="text-gray-600 mb-6">
          Need a custom solution? Contact us for personalized pricing and features tailored to your organization's needs.
        </p>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
          Contact Sales
        </button>
      </div>
    </div>
  );
}