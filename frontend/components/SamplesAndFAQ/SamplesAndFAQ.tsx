import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const faqs = [
  {
    question: 'Does AvlokanIAS provide test series?',
    answer: 'Yes, AvlokanIAS offers structured test series for various subjects and exams.'
  },
  {
    question: 'How long does it take to get my answers evaluated?',
    answer: 'We typically evaluate answers within 48 hours of submission.'
  },
  {
    question: 'Does AvlokanIAS provide a question bank?',
    answer: 'Yes, we provide a comprehensive question bank covering all subjects.'
  },
  {
    question: 'Can I get personalized feedback on my answers?',
    answer: 'Yes, our expert faculty provides detailed, personalized feedback on each answer.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, UPI, and net banking.'
  }
];

export default function SamplesAndFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      {/* Sample Evaluations Section */}
      <section className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-16 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-2">Sample Evaluations</h2>
          <p className="text-lg mb-10">Click on the PDF to check out sample evaluations</p>

          <div className="flex justify-center gap-6 flex-wrap px-4">
            {[1, 2, 3].map((num) => (
              <motion.a
                key={num}
                href={`/pdf/sample${num}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center transition-transform transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="mb-2">
                  <Image
                    src="/images/pdf_icon.png"
                    alt="PDF Icon"
                    width={64}
                    height={64}
                    className="mb-4"
                  />
                </div>
                <span className="border border-white px-4 py-1 rounded text-sm">Sample {num}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-semibold text-center text-gray-800 mb-12 border-b border-gray-300 inline-block"
          >
            Frequently Asked Questions
          </motion.h3>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border-b border-gray-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left py-4 text-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  <span>{faq.question}</span>
                  <span className="transform transition-transform duration-200">
                    {openFaq === index ? '▲' : '▼'}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openFaq === index ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600 pb-4 pl-4">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 