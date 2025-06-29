import { motion } from 'framer-motion';
import Image from 'next/image';

const features = [
  'Expert team of developers and designers',
  'Proven track record of successful projects',
  'Cutting-edge technology stack',
  'Dedicated support and maintenance',
];

export default function WhyUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12 lg:mb-0"
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
              Why Choose avlokanias?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We combine technical expertise with creative thinking to deliver exceptional digital solutions that drive results.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="flex items-start"
                >
                  <svg
                    className="h-6 w-6 text-indigo-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-96 rounded-lg overflow-hidden"
          >
            <Image
              src="/images/why-us.svg"
              alt="Why Choose Us"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
} 