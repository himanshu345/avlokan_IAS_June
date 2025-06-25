import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { initiatePayment } from '../services/payment';

export interface Plan {
  title: string;
  features: string[];
  price: number;
  originalPrice: number;
  buttonText: string;
  highlight?: string;
  hasEMI?: boolean;
  isPopular?: boolean;
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
      price: 699,
      originalPrice: 1999,
      buttonText: 'Subscribe'
    },
    // {
    //   title: 'Mains 2025',
    //   tag: 'UPSC CSE + State PCS with similar Pattern',
    //   features: [
    //     'English/हिंदी Medium',
    //     'Active Till UPSC CSE Mains 2025',
    //     'Unlimited GS + Essay Evaluation',
    //     'No Limit on Daily Submissions',
    //     'Access to Question Bank',
    //     'Select question from any source',
    //     'Full length tests covered',
    //     'Evaluation within 24 working* hours',
    //     'Complimentary One-on-One Mentorship Calls',
    //     'Free – Precision Answer Writing Video Course (PAWC)',
    //     'Recorded Topic Wise GS Mentored Answer Writing (MAW) Sessions by Rank Holder with Hand Written Model Answers',
    //     'Access to Previous Year Toppers Copies'
    //   ],
    //   price: 8499,
    //   originalPrice: 10999,
    //   buttonText: 'Subscribe'
    // },
    {
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
    SOCIOLOGY: [
      // Optional subject plans will be added here
    ],
    PSIR: [
      // Optional subject plans will be added here
    ],
    GEOGRAPHY: [
      // Optional subject plans will be added here
    ],
    PHILOSOPHY: [
      // Optional subject plans will be added here
    ],
    PUBLIC_ADMINISTRATION: [
      // Optional subject plans will be added here
    ],
    HINDI_LITERATURE: [
      // Optional subject plans will be added here
    ],
    HISTORY: [
      // Optional subject plans will be added here
    ],
    TAMIL_LITERATURE: [
      // Optional subject plans will be added here
    ]
  },
  combo: {
    SOCIOLOGY_PSIR: [
      // Combo plans will be added here
    ],
    PSIR_GEOGRAPHY: [
      // Combo plans will be added here
    ],
    SOCIOLOGY_ANTHROPOLOGY: [
      // Combo plans will be added here
    ],
    PHILOSOPHY_HISTORY: [
      // Combo plans will be added here
    ],
    GEOGRAPHY_PUBLIC_ADMINISTRATION: [
      // Combo plans will be added here
    ]
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

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Evaluation Plans</h2>
        
        {/* Tab Selector */}
        <div className="flex justify-center space-x-8 mb-12">
          {['gs', 'optional', 'combo'].map((tab) => (
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
          ))}
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
                  onClick={() => initiatePayment(plan.price, plan.title)}
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