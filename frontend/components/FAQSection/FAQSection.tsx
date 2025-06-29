import React, { useState } from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: 'How does the answer evaluation process work?',
      answer: 'After subscribing to a plan, you can submit your answers through our platform. Our expert evaluators will assess your answers based on UPSC criteria and provide detailed feedback, including strengths, weaknesses, and suggestions for improvement, within 48-72 hours.',
    },
    {
      question: 'Who are the evaluators?',
      answer: 'Our evaluation team consists of experienced UPSC mentors, subject matter experts, and successful civil servants who have excelled in the UPSC examination. They provide authentic and actionable feedback aligned with UPSC expectations.',
    },
    {
      question: 'How many answers can I submit for evaluation?',
      answer: 'The number of evaluations depends on your subscription plan. The Basic plan allows 5 evaluations per month, Premium offers 15 evaluations, and Ultimate provides unlimited evaluations. You can always upgrade your plan if you need more evaluations.',
    },
    {
      question: 'Can I access previous years\' question papers?',
      answer: 'Yes, all subscription plans include access to previous years\' question papers (PYQs). The Basic plan provides limited access, while Premium and Ultimate plans offer full access to our comprehensive PYQ database with topic-wise categorization.',
    },
    {
      question: 'What study materials are available on the platform?',
      answer: 'Our platform offers a wide range of study materials including detailed notes, video lectures, mind maps, current affairs, and toppers\' answer copies. The access level varies based on your subscription plan.',
    },
    {
      question: 'Is there a refund policy?',
      answer: 'Yes, we offer a 7-day money-back guarantee for all subscription plans. If you\'re not satisfied with our services, you can request a refund within the first week of your subscription.',
    },
    {
      question: 'Can I switch between different plans?',
      answer: 'Absolutely! You can upgrade your plan at any time. When upgrading, we prorate the remaining value of your current subscription and apply it to the new plan.',
    },
    {
      question: 'How can I contact support if I have questions?',
      answer: 'You can reach our support team through email at support@convertias.com, phone at +91 98765 43210, or through the live chat feature on our website. Premium and Ultimate subscribers receive priority support.',
    },
  ];

  // const [activeIndex, setActiveIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // const toggleFAQ = (index) => {
  //   setActiveIndex(activeIndex === index ? null : index);
  // };
  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="max-w-3xl mx-auto text-text-muted">
            Find answers to common questions about our evaluation services, study resources, and subscription plans.
          </p>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="py-5">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-semibold">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-primary transition-transform duration-200 ${
                    activeIndex === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`mt-2 transition-all duration-200 overflow-hidden ${
                  activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-text-muted">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="mb-4 text-text-muted">
            Still have questions? We're here to help.
          </p>
          <button className="btn btn-primary">Contact Support</button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection; 