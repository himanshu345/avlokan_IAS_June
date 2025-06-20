import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { initiatePayment } from '../services/payment';
import Head from 'next/head';

interface Plan {
  title: string;
  features: string[];
  price: number;
  originalPrice: number;
  buttonText: string;
  highlight?: string;
  hasEMI?: boolean;
  isPopular?: boolean;
}

type PlanCategory = 'gs' | 'optional' | 'combo';

interface Plans {
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
      title: 'One Month',
      features: [
        'English/हिंदी Medium',
        'Active for 30 days',
        'Total 60 GS Questions + 4 Essays',
        '2 questions/day, 1 Essay/Week',
        'Select question from any source',
        'Evaluation within 24 working* hours',
        'Access to Question Bank'
      ],
      price: 1799,
      originalPrice: 2499,
      buttonText: 'Subscribe'
    },
    {
      title: 'Mains 2025',
      highlight: 'UPSC CSE + State PCS with similar Pattern',
      features: [
        'English/हिंदी Medium',
        'Active till UPSC CSE Mains 2025',
        'Unlimited GS + Essay Evaluation',
        'No limit on Daily Submissions',
        'Access to Question Bank',
        'Full-length tests covered',
        'Evaluation within 24 working* hours',
        'Complimentary One-on-One Mentorship Calls',
        'Free Precision Answer Writing Video Course (PAWC)',
        'Mentored MAW Sessions (Rank Holders)',
        'Access to Previous Year Toppers Copies',
        'Also valid for similar State PCS exams'
      ],
      price: 8499,
      originalPrice: 10999,
      buttonText: 'Subscribe'
    },
    {
      title: 'Mains 2026',
      highlight: 'UPSC CSE + State PCS with similar Pattern',
      features: [
        'English/हिंदी Medium',
        'Active till UPSC CSE Mains 2026',
        'Unlimited GS + Essay Evaluation',
        'No limit on Daily Submissions',
        'Access to Question Bank',
        'Full-length tests covered',
        'Evaluation within 24 working* hours',
        'Complimentary One-on-One Mentorship Calls',
        'Free Precision Answer Writing Video Course (PAWC)',
        'Mentored MAW Sessions (Rank Holders)',
        'Access to Previous Year Toppers Copies',
        'Also valid for similar State PCS exams'
      ],
      price: 12999,
      originalPrice: 16999,
      buttonText: 'Subscribe',
      hasEMI: true
    }
  ],
  optional: {
    'SOCIOLOGY': [
      {
        title: 'Socio - One Month',
        features: [
          'English/हिंदी Medium',
          'Active for 30 days',
          'Total 60 Questions',
          '2 questions/day',
          'Select question from any source',
          'Evaluation within 24 working* hours',
          'Access to Question Bank'
        ],
        price: 1799,
        originalPrice: 2499,
        buttonText: 'Subscribe'
      },
      {
        title: 'Socio - Mains 2025',
        highlight: 'UPSC CSE + State PCS with similar Pattern',
        features: [
          'English/हिंदी Medium',
          'Active till UPSC CSE Mains 2025',
          'Unlimited Evaluation',
          'No limit on Daily Submissions',
          'Access to Question Bank',
          'Full-length tests covered',
          'Evaluation within 24 working* hours',
          'Complimentary One-on-One Mentorship Calls',
          'Free Precision Answer Writing Video Course (PAWC)',
          'Mentored MAW Sessions (Rank Holders)',
          'Access to Previous Year Toppers Copies',
          'Also valid for similar State PCS exams'
        ],
        price: 8499,
        originalPrice: 10999,
        buttonText: 'Subscribe'
      },
      {
        title: 'Socio - Mains 2026',
        highlight: 'UPSC CSE + State PCS with similar Pattern',
        features: [
          'English/हिंदी Medium',
          'Active till UPSC CSE Mains 2026',
          'Unlimited Evaluation',
          'No limit on Daily Submissions',
          'Access to Question Bank',
          'Full-length tests covered',
          'Evaluation within 24 working* hours',
          'Complimentary One-on-One Mentorship Calls',
          'Free Precision Answer Writing Video Course (PAWC)',
          'Mentored MAW Sessions (Rank Holders)',
          'Access to Previous Year Toppers Copies',
          'Also valid for similar State PCS exams'
        ],
        price: 12999,
        originalPrice: 16999,
        buttonText: 'Subscribe',
        hasEMI: true
      }
    ],
    // Add similar plans for other subjects
  },
  combo: {
    'SOCIOLOGY + PSIR': [
      {
        title: 'SOCIO + PSIR - One Month',
        features: [
          'English/हिंदी Medium',
          'Active for 30 days',
          'Total 60 Questions (30 each subject)',
          '2 questions/day per subject',
          'Select question from any source',
          'Evaluation within 24 working* hours',
          'Access to Question Bank for both subjects'
        ],
        price: 2999,
        originalPrice: 3999,
        buttonText: 'Subscribe'
      },
      {
        title: 'SOCIO + PSIR - Mains 2025',
        highlight: 'UPSC CSE + State PCS with similar Pattern',
        features: [
          'English/हिंदी Medium',
          'Active till UPSC CSE Mains 2025',
          'Unlimited Evaluation for both subjects',
          'No limit on Daily Submissions',
          'Access to Question Bank for both subjects',
          'Full-length tests covered',
          'Evaluation within 24 working* hours',
          'Complimentary One-on-One Mentorship Calls',
          'Free Precision Answer Writing Video Course (PAWC)',
          'Mentored MAW Sessions (Rank Holders)',
          'Access to Previous Year Toppers Copies',
          'Also valid for similar State PCS exams'
        ],
        price: 14999,
        originalPrice: 18999,
        buttonText: 'Subscribe'
      },
      {
        title: 'SOCIO + PSIR - Mains 2026',
        highlight: 'UPSC CSE + State PCS with similar Pattern',
        features: [
          'English/हिंदी Medium',
          'Active till UPSC CSE Mains 2026',
          'Unlimited Evaluation for both subjects',
          'No limit on Daily Submissions',
          'Access to Question Bank for both subjects',
          'Full-length tests covered',
          'Evaluation within 24 working* hours',
          'Complimentary One-on-One Mentorship Calls',
          'Free Precision Answer Writing Video Course (PAWC)',
          'Mentored MAW Sessions (Rank Holders)',
          'Access to Previous Year Toppers Copies',
          'Also valid for similar State PCS exams'
        ],
        price: 19999,
        originalPrice: 24999,
        buttonText: 'Subscribe',
        hasEMI: true
      }
    ],
    // Add similar plans for other combo subjects
  }
};

export default function EvaluationPlans() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PlanCategory>('gs');
  const [selectedSubject, setSelectedSubject] = useState<string>('SOCIOLOGY');
  const [selectedCombo, setSelectedCombo] = useState<string>('SOCIOLOGY + PSIR');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isComboDropdownOpen, setIsComboDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubscribe = (plan: Plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Store the current path and plan details for redirect
      localStorage.setItem('redirectAfterLogin', '/evaluation-plans');
      localStorage.setItem('selectedPlan', JSON.stringify(plan));
      router.push('/login');
      return;
    }
    // If user is logged in, proceed with payment
    initiatePayment(plan.price, plan.title);
  };

  const getDropdownTitle = () => {
    switch (activeTab) {
      case 'optional':
        return 'OPTIONAL SUBJECTS';
      case 'combo':
        return 'COMBO SUBJECTS';
      default:
        return '';
    }
  };

  const getDropdownOptions = () => {
    switch (activeTab) {
      case 'optional':
        return optionalSubjects;
      case 'combo':
        return comboSubjects;
      default:
        return [];
    }
  };

  const getSelectedValue = () => {
    switch (activeTab) {
      case 'optional':
        return selectedSubject;
      case 'combo':
        return selectedCombo;
      default:
        return '';
    }
  };

  const handleDropdownToggle = () => {
    if (activeTab === 'optional') {
      setIsDropdownOpen(!isDropdownOpen);
    } else if (activeTab === 'combo') {
      setIsComboDropdownOpen(!isComboDropdownOpen);
    }
  };

  const handleOptionSelect = (value: string) => {
    if (activeTab === 'optional') {
      setSelectedSubject(value);
      setIsDropdownOpen(false);
    } else if (activeTab === 'combo') {
      setSelectedCombo(value);
      setIsComboDropdownOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Evaluation Plans - AvlokanIAS</title>
        <meta name="description" content="Choose from our comprehensive evaluation plans for UPSC preparation. Get expert feedback and improve your answer writing skills." />
      </Head>
      <Navbar user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Evaluation Plans
          </h1>
          <div className="mt-4 h-1 w-24 bg-purple-600 mx-auto"></div>
        </div>

        {/* Tabs Section */}
        <div className="flex justify-center space-x-4 mb-12">
          {(Object.keys(plans) as PlanCategory[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Subjects Dropdown */}
        {(activeTab === 'optional' || activeTab === 'combo') && (
          <div className="max-w-xs mx-auto mb-12">
            <div className="relative">
              <button
                onClick={handleDropdownToggle}
                className="w-full px-4 py-2 text-left border border-purple-200 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{getSelectedValue()}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                      (activeTab === 'optional' && isDropdownOpen) || (activeTab === 'combo' && isComboDropdownOpen)
                        ? 'rotate-180'
                        : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {((activeTab === 'optional' && isDropdownOpen) || (activeTab === 'combo' && isComboDropdownOpen)) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-purple-200 rounded-md shadow-lg">
                  {getDropdownOptions().map((option) => (
                    <button
                      key={option}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center justify-between ${
                        getSelectedValue() === option ? 'bg-purple-50' : ''
                      }`}
                    >
                      <span className="text-gray-700">{option}</span>
                      {getSelectedValue() === option && (
                        <CheckCircleIcon className="w-5 h-5 text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(activeTab === 'optional' 
            ? plans.optional[selectedSubject] || []
            : activeTab === 'combo'
            ? plans.combo[selectedCombo] || []
            : plans[activeTab]
          ).map((plan: Plan, index: number) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {plan.highlight && (
                <div className="bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium text-center">
                  {plan.highlight}
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {plan.title}
                </h3>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{plan.price}
                    </span>
                    <span className="ml-2 text-lg text-gray-500 line-through">
                      ₹{plan.originalPrice}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    (Including GST)
                  </p>

                  <div className="mt-6 space-y-3">
                    <button 
                      onClick={() => handleSubscribe(plan)}
                      className={`w-full py-3 rounded-md font-medium transition-colors ${
                        plan.isPopular 
                          ? 'bg-primary text-white hover:bg-primary-dark' 
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                    >
                      {plan.buttonText}
                    </button>
                    
                    {plan.hasEMI && (
                      <>
                        <button 
                          onClick={() => initiatePayment(plan.price, `${plan.title} - EMI`)}
                          className="w-full border-2 border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors duration-200"
                        >
                          Pay in EMI
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                          EMI comes with nominal additional charges
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Notes Section */}
        <div className="mt-12 max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full bg-purple-600 mt-2 mr-3"></span>
              <span>Evaluation is completed within 24 working hours (excluding weekends and holidays)</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full bg-purple-600 mt-2 mr-3"></span>
              <span>Essay evaluations may take up to 48 working hours due to detailed feedback</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full bg-purple-600 mt-2 mr-3"></span>
              <span>Mentorship calls are scheduled once every two weeks</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 rounded-full bg-purple-600 mt-2 mr-3"></span>
              <span>Plans are valid until the respective exam dates or as specified in the plan duration</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
} 