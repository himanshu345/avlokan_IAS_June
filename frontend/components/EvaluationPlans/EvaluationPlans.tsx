import { useState, useEffect, useRef } from 'react';
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
      price: 1,
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
      originalPrice: 1499,
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
      price: 1,
      originalPrice: 16999,
      buttonText: 'Subscribe',
      hasEMI: true
    },
    {
      id: '686e8c26c678f9e876818e50', // OMEGA
      title: 'One Month Evaluation with Guided Answer Writing(OMEGA) Program',
      highlight: 'OMEGA Program',
      features: [
        'English',
        'Live Weekly Mentorship Sessions',
        'Personalised guidance on structure, content, and presentation',
        'Strategy to handle different GS papers',
        'Doubt-solving & feedback discussion',
        'Active for 30 days',
        'Total 60 GS Questions + 2 Essays',
        '1 questions/day, 1 Essay/Week',
        'Select question from any source',
        'Evaluation within 24 working hours',
        'Access to Question Bank'
      ],
      price: 1,
      originalPrice: 1999,
      buttonText: 'Subscribe'
    },
    {
      id: '686e8c26c678f9e876818e51', // OMEGA 2 Q/day
      title: 'Daily Answer Writing with Nurturing(DAWN) Mentorship Program',
      highlight: 'DAWN Program',
      features: [
        'English',
        'Live Weekly Mentorship Sessions',
        'Personalised guidance on structure, content, and presentation',
        'Strategy to handle different GS papers',
        'Doubt-solving & feedback discussion',
        'Active for 30 days',
        'Total 120 GS Questions + 4 Essays',
        '2 questions/day, 1 Essay/Week',
        'Select question from any source',
        'Evaluation within 24 working hours',
        'Access to Question Bank'
      ],
      price: 1,
      originalPrice: 2999,
      buttonText: 'Subscribe'
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
  const [showModal, setShowModal] = useState(false);
  const [modalPlan, setModalPlan] = useState<Plan | null>(null);
  const [modalName, setModalName] = useState('');
  const [modalPhone, setModalPhone] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showModal && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showModal]);

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

        {formError && (
          <div className="text-red-600 text-center mb-4">{formError}</div>
        )}

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
                    setModalPlan(plan);
                    setShowModal(true);
                    setModalName(user.name || '');
                    setModalPhone('');
                    setModalEmail(user.email || '');
                  }}
                >
                  {plan.buttonText}
                </button>
                {plan.hasEMI && plan.id !== '686e8c26c678f9e876818e49' && (
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
        {/* Modal for Name and Mobile Number */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-xl font-semibold mb-4 text-center">Enter Your Details</h3>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  setFormError('');
                  // Basic validation
                  if (!modalName.trim()) {
                    setFormError('Please enter your name.');
                    nameInputRef.current?.focus();
                    return;
                  }
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(modalEmail)) {
                    setFormError('Please enter a valid email address.');
                    return;
                  }
                  const phoneRegex = /^\d{10}$/;
                  if (!phoneRegex.test(modalPhone)) {
                    setFormError('Please enter a valid 10-digit mobile number.');
                    return;
                  }
                  if (modalPlan && user) {
                    initiatePayment(
                      modalPlan.price,
                      modalPlan.title,
                      user._id,
                      modalPlan.id || '',
                      1,
                      modalEmail,
                      modalPhone
                    );
                    setShowModal(false);
                  }
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="border rounded px-4 py-2 w-full"
                    value={modalEmail}
                    onChange={e => setModalEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    ref={nameInputRef}
                    type="text"
                    className="border rounded px-4 py-2 w-full"
                    value={modalName}
                    onChange={e => setModalName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    className="border rounded px-4 py-2 w-full"
                    value={modalPhone}
                    onChange={e => setModalPhone(e.target.value)}
                    required
                    maxLength={10}
                  />
                </div>
                {formError && <div className="text-red-600 text-center mb-2">{formError}</div>}
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 w-full transition-colors"
                >
                  Proceed to Pay
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 