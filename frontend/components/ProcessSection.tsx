import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function ProcessSection() {
  const router = useRouter();
  const steps = [
    {
      icon: '/icons/write.svg',
      title: '1. Write answers from any source',
      description: 'Write answers to questions from any source of your choice'
    },
    {
      icon: '/images/upload.png',
      title: '2. Upload it on the website',
      description: 'Upload them on our website through your personal dashboard'
    },
    {
      icon: '/icons/evaluate.svg',
      title: '3. Collect your evaluated papers',
      description: 'Your answers will get checked and appear on your dashboard'
    }
  ];

  return (
    <>
      {/* Try For Free Banner */}
      <section className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-16 text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">TRY FOR FREE</h2>
          <p className="text-lg md:text-xl mb-6">Get 2 Answers Evaluated For Free and then decide</p>
          <button
            className="bg-white text-purple-600 font-bold px-6 py-3 rounded-md shadow hover:bg-gray-100 transition"
            onClick={() => router.push('/submissions')}
          >
            Start For Free
          </button>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-semibold text-center mb-12 text-gray-800"
          >
            How It Works
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="mb-4">
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <p className="text-indigo-600 font-semibold text-lg">{step.title}</p>
                <p className="text-gray-600 mt-2 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 