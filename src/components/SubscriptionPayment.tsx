import React from 'react';
import { ArrowLeft, Calendar, CreditCard, Shield } from 'lucide-react';

interface SubscriptionPaymentProps {
  plan: {
    name: string;
    price: string;
    features: string[];
  };
  onBack: () => void;
}

export function SubscriptionPayment({ plan, onBack }: SubscriptionPaymentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Plans
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-navy-800 bg-clip-text text-transparent">
            Payment Integration Coming Soon
          </h2>
          <p className="text-gray-600 mt-2">
            We're working hard to bring you a seamless payment experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Selected Plan</h3>
              <div className="space-y-3">
                <p className="text-2xl font-bold text-navy-800">{plan.name}</p>
                <p className="text-xl text-gray-600">{plan.price}<span className="text-sm">/month</span></p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-gray-600 flex items-center">
                      <Shield className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-sky-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Get Notified</h3>
              <p className="text-gray-600 mb-4">
                Leave your email and we'll notify you when payment integration is ready.
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-600 to-navy-800 text-white py-3 rounded-lg font-medium hover:from-sky-700 hover:to-navy-900 transition-colors"
                >
                  Notify Me
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Coming Features</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CreditCard className="w-6 h-6 text-sky-600 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Multiple Payment Methods</h4>
                    <p className="text-gray-600">Credit cards, PayPal, and more</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-6 h-6 text-sky-600 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Flexible Billing</h4>
                    <p className="text-gray-600">Monthly and annual plans with discounts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-sky-600 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Secure Transactions</h4>
                    <p className="text-gray-600">Enterprise-grade security for all payments</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Launch Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <p className="text-gray-600">Payment Integration Development</p>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <p className="text-gray-600">Security Audits & Testing</p>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-3"></div>
                  <p className="text-gray-600">Launch & Availability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}