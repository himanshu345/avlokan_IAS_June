import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Subscription = () => {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Store the current path to redirect back after login
      localStorage.setItem('redirectAfterLogin', '/subscription');
      router.push('/login');
      return;
    }

    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // If token is invalid, redirect to login
          localStorage.setItem('redirectAfterLogin', '/subscription');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        localStorage.setItem('redirectAfterLogin', '/subscription');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Pricing plans data
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Essential features for UPSC aspirants starting their preparation journey',
      monthlyPrice: 499,
      annualPrice: 4999,
      features: [
        'Access to free study materials',
        'Limited practice questions',
        '5 answer evaluations per month',
        'Basic performance analytics',
        'Email support',
        'Community access',
      ],
      isPopular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Comprehensive preparation package with premium features for serious aspirants',
      monthlyPrice: 999,
      annualPrice: 9999,
      features: [
        'All Basic features',
        'Full access to study materials',
        'Unlimited practice questions',
        '20 answer evaluations per month',
        'Detailed performance analytics',
        'Priority email & chat support',
        'Live doubt clearing sessions (weekly)',
        'Access to recorded webinars',
      ],
      isPopular: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Complete preparation system with personalized mentorship for top results',
      monthlyPrice: 1999,
      annualPrice: 19999,
      features: [
        'All Pro features',
        'Unlimited answer evaluations',
        'Personalized study plan',
        'One-on-one mentorship sessions',
        'Mock interview preparation',
        'Exclusive toppers' strategy sessions',
        'Direct access to UPSC experts',
        'Personalized feedback on essays',
      ],
      isPopular: false,
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-grow bg-background py-16">
        <div className="container-custom">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
            <p className="max-w-2xl mx-auto text-text-muted">
              Select the perfect subscription plan that suits your UPSC preparation needs and goals.
              All plans come with a 7-day money-back guarantee.
            </p>
            
            {/* Toggle Switch */}
            <div className="mt-8 inline-flex items-center bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  !isAnnual ? 'bg-white shadow-sm text-text' : 'text-text-muted'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isAnnual ? 'bg-white shadow-sm text-text' : 'text-text-muted'
                }`}
              >
                Annual <span className="text-accent">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`card relative ${
                  plan.isPopular ? 'border-2 border-primary shadow-lg' : ''
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                    <span className="bg-accent text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-text-muted mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-end">
                      <span className="text-4xl font-bold">₹{isAnnual ? plan.annualPrice : plan.monthlyPrice}</span>
                      <span className="text-text-muted ml-2 pb-1">/{isAnnual ? 'year' : 'month'}</span>
                    </div>
                    {isAnnual && (
                      <p className="text-accent text-sm mt-1">
                        Equivalent to ₹{Math.round(plan.annualPrice / 12)} per month
                      </p>
                    )}
                  </div>
                  
                  <button className={`w-full py-3 rounded-md font-medium transition-colors ${
                    plan.isPopular 
                      ? 'bg-primary text-white hover:bg-primary-dark' 
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}>
                    Get Started
                  </button>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold mb-4">What's included:</h3>
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-5 h-5 text-primary flex-shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6 text-center">Features Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-4 px-6 text-left">Features</th>
                    <th className="py-4 px-6 text-center">Basic</th>
                    <th className="py-4 px-6 text-center">Pro</th>
                    <th className="py-4 px-6 text-center">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">Study Materials</td>
                    <td className="py-4 px-6 text-center">Limited</td>
                    <td className="py-4 px-6 text-center">Full Access</td>
                    <td className="py-4 px-6 text-center">Full Access</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">Answer Evaluations</td>
                    <td className="py-4 px-6 text-center">5 / month</td>
                    <td className="py-4 px-6 text-center">20 / month</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">Practice Questions</td>
                    <td className="py-4 px-6 text-center">Limited</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                    <td className="py-4 px-6 text-center">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">Performance Analytics</td>
                    <td className="py-4 px-6 text-center">Basic</td>
                    <td className="py-4 px-6 text-center">Detailed</td>
                    <td className="py-4 px-6 text-center">Advanced</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">Support</td>
                    <td className="py-4 px-6 text-center">Email</td>
                    <td className="py-4 px-6 text-center">Priority Email & Chat</td>
                    <td className="py-4 px-6 text-center">Direct Expert Access</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">Mentorship</td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">Group Sessions</td>
                    <td className="py-4 px-6 text-center">One-on-One</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 font-medium">Mock Interviews</td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <svg className="w-5 h-5 text-primary mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-2">Can I switch plans later?</h3>
                <p className="text-text-muted">
                  Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the new rate will apply at the start of your next billing cycle.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-2">Is there a refund policy?</h3>
                <p className="text-text-muted">
                  We offer a 7-day money-back guarantee for all plans. If you're not satisfied with our service, you can request a full refund within the first 7 days of your subscription.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-2">How do answer evaluations work?</h3>
                <p className="text-text-muted">
                  You can submit your answers through our platform, and our experts will evaluate them based on UPSC criteria. You'll receive detailed feedback, scores, and suggestions for improvement within 48 hours.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-bold mb-2">What payment methods do you accept?</h3>
                <p className="text-text-muted">
                  We accept major credit/debit cards, net banking, UPI, and popular digital wallets. All transactions are processed securely through our payment partners.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="max-w-2xl mx-auto text-text-muted mb-8">
              Our support team is here to help you choose the right plan for your UPSC preparation journey.
              Feel free to reach out with any questions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="/contact" className="btn btn-primary">
                Contact Support
              </a>
              <button className="btn btn-outline">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Subscription; 