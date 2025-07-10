import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { initiatePayment } from '../../services/payment';

export interface Plan {
  title: string;
  features: string[];
  price: number;
  originalPrice: number;
  buttonText: string;
  highlight?: string;
  hasEMI?: boolean;
  isPopular?: boolean;
  id?: string; // Added for new plans
}

export type PlanCategory = 'gs' | 'optional' | 'combo';

export interface Plans {
  gs: Plan[];
  optional: { [key: string]: Plan[] };
  combo: { [key: string]: Plan[] };
}

const optionalSubjects = [
  'SOCIOLOGY',
  'PSIR',
  'GEOGRAPHY',
  'PHILOSOPHY',
  'PUBLIC ADMINISTRATION',
  'HINDI LITERATURE',
  'HISTORY',
  'TAMIL LITERATURE'
];

const comboSubjects = [
  'SOCIOLOGY + PSIR',
  'PSIR + GEOGRAPHY',
  'SOCIOLOGY + ANTHROPOLOGY',
  'PHILOSOPHY + HISTORY',
  'GEOGRAPHY + PUBLIC ADMINISTRATION'
];

const plans: Plans = {
  gs: [
    {
      id: '686e8c26c678f9e876818e46', // Basic
      title: 'One Month 2 questions/day',
      highlight: 'Daily Two Answers(DTA) Program',
      features: [
        'English',
        'Active for 30 days',
        'Total 60 GS Questions + 4 Essays',
        '2 questions/day, 1 Essay/Week',
        'Select question from any source',
        'Evaluation within 24 working hours',
        'Access to Question Bank'
      ],
      price: 1499,
      originalPrice: 2499,
      buttonText: 'Subscribe'
    },
    {
      id: '686e8c26c678f9e876818e47', // DOA
      title: 'One Month 1 questions/day',
      highlight: 'Daily One Answer(DOA) Program',
      features: [
        'English',
        'Active for 30 days',
        'Total 60 GS Questions + 2 Essays',
        '1 questions/day, 1 Essay/Week',
        'Select question from any source',
        'Evaluation within 24 working hours',
        'Access to Question Bank'
      ],
      price: 1,
      originalPrice: 99,
      buttonText: 'Subscribe'
    },
    {
      id: '686e8c26c678f9e876818e49', // Premium
      title: 'Mains 2025',
      highlight: 'Lakshya Mains 2025',
      features: [
        'English',
        'Active Till UPSC CSE Mains 2025',
        'Unlimited GS + Essay Evaluation',
        'No Limit on Daily Submissions',
        'Access to Question Bank',
        'Select question from any source',
        'Full length tests covered',
        'Evaluation within 24 working* hours',
        'Complimentary One-on-One Mentorship Calls',
        'Access to Previous Year Toppers Copies'
      ],
      price: 6999,
      originalPrice: 16999,
      buttonText: 'Subscribe',
      hasEMI: true
    }
  ],
  optional: {
    SOCIOLOGY: [],
    PSIR: [],
    GEOGRAPHY: [],
    PHILOSOPHY: [],
    PUBLIC_ADMINISTRATION: [],
    HINDI_LITERATURE: [],
    HISTORY: [],
    TAMIL_LITERATURE: []
  },
  combo: {
    SOCIOLOGY_PSIR: [],
    PSIR_GEOGRAPHY: [],
    SOCIOLOGY_ANTHROPOLOGY: [],
    PHILOSOPHY_HISTORY: [],
    GEOGRAPHY_PUBLIC_ADMINISTRATION: []
  }
};

interface EvaluationPlansProps {
  user?: any;
  showTitleSection?: boolean;
  showNotesSection?: boolean;
}

export default function EvaluationPlans({ user, showTitleSection = true, showNotesSection = true }: EvaluationPlansProps) {
  const [activeTab, setActiveTab] = useState<PlanCategory>('gs');
  const [selectedSubject, setSelectedSubject] = useState<string>('SOCIOLOGY');
  const [selectedCombo, setSelectedCombo] = useState<string>('SOCIOLOGY + PSIR');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isComboDropdownOpen, setIsComboDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [formError, setFormError] = useState('');

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Evaluation Plans</h2>
        
        {/* Tab Selector */}
        <div className="flex justify-center space-x-8 mb-12">
          {/* {['gs', 'optional', 'combo'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as PlanCategory)}
              className={`text-lg font-medium pb-2 transition-colors ${
                activeTab === tab
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))} */}
          <button
            onClick={() => setActiveTab('gs')}
            className="text-lg font-medium pb-2 transition-colors text-purple-600 border-b-2 border-purple-600"
          >
            Evaluation Plans
          </button>
        </div>

        {/* Email and Mobile Inputs */}
        {formError && (
          <div className="text-red-600 text-center mb-4">{formError}</div>
        )}
        <div className="flex flex-col md:flex-row md:space-x-4 mb-8 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="border rounded px-4 py-2 mb-4 md:mb-0"
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Enter your mobile number"
            className="border rounded px-4 py-2"
            value={userPhone}
            onChange={e => setUserPhone(e.target.value)}
            required
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(plans[activeTab as keyof typeof plans] as Plan[]).map((plan: Plan, index: number) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              {plan.highlight && (
                <span className="bg-purple-100 text-purple-600 text-xs font-medium px-3 py-1 rounded-full mb-2 inline-block">
                  {plan.highlight}
                </span>
              )}
              <h3 className="text-xl font-bold mb-4">{plan.title}</h3>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="ml-2 text-gray-500 line-through">₹{plan.originalPrice}</span>
                </div>
                <button
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 w-full transition-colors"
                  onClick={() => {
                    setFormError('');
                    if (!user) {
                      window.location.href = '/login';
                      return;
                    }
                    if (!userEmail || !userPhone) {
                      setFormError('Please enter your email and mobile number.');
                      return;
                    }
                    // Basic validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const phoneRegex = /^\d{10}$/;
                    if (!emailRegex.test(userEmail)) {
                      setFormError('Please enter a valid email address.');
                      return;
                    }
                    if (!phoneRegex.test(userPhone)) {
                      setFormError('Please enter a valid 10-digit mobile number.');
                      return;
                    }
                    initiatePayment(
                      10, // 10 INR (backend will multiply by 100 to get 1000 paise)
                      plan.title,
                      user._id,
                      plan.id || '',
                      1, // 1 month duration for all plans here
                      userEmail,
                      userPhone
                    );
                  }}
                >
                  {plan.buttonText}
                </button>
                {plan.hasEMI && (
                  <>
                    <button className="mt-2 bg-white text-purple-600 border border-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 w-full transition-colors">
                      Pay in EMI
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      EMI comes with nominal additional charges
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 