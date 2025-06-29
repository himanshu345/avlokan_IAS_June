import React from 'react';
import Link from 'next/link';

const PricingSection = () => {
  const plans = [
    {
      name: 'Basic',
      price: '₹999',
      duration: 'per month',
      description: 'Essential features for beginners',
      features: [
        '5 Answer Evaluations per month',
        'Basic Feedback',
        'Access to Study Notes',
        'Limited PYQs Access',
        'Email Support',
      ],
      cta: 'Start Basic Plan',
      popular: false,
    },
    {
      name: 'Premium',
      price: '₹1,999',
      duration: 'per month',
      description: 'Enhanced features for serious aspirants',
      features: [
        '15 Answer Evaluations per month',
        'Detailed Feedback with Improvement Tips',
        'Complete Access to Study Materials',
        'Full PYQs Database',
        'Video Lectures Access',
        'Priority Email Support',
        'Monthly Group Mentoring Session',
      ],
      cta: 'Start Premium Plan',
      popular: true,
    },
    {
      name: 'Ultimate',
      price: '₹2,999',
      duration: 'per month',
      description: 'Comprehensive preparation package',
      features: [
        'Unlimited Answer Evaluations',
        'In-depth Analysis with Personalized Roadmap',
        'Complete Access to All Resources',
        'Toppers\' Answer Copies',
        'Live Webinars and Workshops',
        '24/7 Priority Support',
        'One-on-One Mentoring Sessions',
        'Mock Interview Preparation',
      ],
      cta: 'Start Ultimate Plan',
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Evaluation Plans</h2>
          <p className="max-w-3xl mx-auto text-text-muted">
            Choose the plan that best suits your preparation needs and goals. All plans include high-quality evaluation and essential resources.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`card border-2 relative ${
                plan.popular 
                  ? 'border-primary scale-105 shadow-lg z-10' 
                  : 'border-gray-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-semibold -mt-2 rounded-full shadow-sm">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-text-muted ml-1">{plan.duration}</span>
              </div>
              <p className="text-text-muted mb-6">{plan.description}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/subscription" 
                className={`btn w-full ${
                  plan.popular 
                    ? 'btn-primary' 
                    : 'btn-outline border-primary'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center">
          <p className="text-text-muted mb-4">
            All plans include a 7-day money-back guarantee. Need a custom plan?
          </p>
          <Link href="/contact" className="text-primary font-medium hover:underline">
            Contact us for custom solutions
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 