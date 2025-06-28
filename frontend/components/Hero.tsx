import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Concerned about your UPSC mains?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get your answers evaluated by Interview-Appeared faculty
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-300"
              >
                Start For Free
              </button>
              <button
                onClick={() => router.push('/evaluation-plans')}
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300"
              >
                View Evaluation Plans
              </button>
            </div>
          </motion.div>

          {/* Right Side - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex flex-col items-center justify-center w-full"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
              <div className="relative w-[80vw] max-w-[800px] sm:w-[100%] sm:max-w-[800px] aspect-square">
                <Image
                  src="/images/MSP.jpeg"
                  alt="MSP Illustration"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
              <div className="relative w-[80vw] max-w-[8000px] sm:w-[100%] sm:max-w-[800px] aspect-square">
                <Image
                  src="/images/PMP.jpeg"
                  alt="PMP Illustration"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Support Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300"
        onClick={() => router.push('/contact')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </motion.button>
    </section>
  );
} 