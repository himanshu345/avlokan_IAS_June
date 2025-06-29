import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';

const toppers = [
  {
    name: 'Isha Patil',
    rank: 'AIR 8',
    image: '/images/toppers/topper-1.svg',
    year: '2023'
  },
  {
    name: 'Rahul Sharma',
    rank: 'AIR 12',
    image: '/images/toppers/topper-2.svg',
    year: '2023'
  },
  {
    name: 'Priya Singh',
    rank: 'AIR 15',
    image: '/images/toppers/topper-3.svg',
    year: '2023'
  },
  {
    name: 'Amit Kumar',
    rank: 'AIR 18',
    image: '/images/toppers/topper-4.svg',
    year: '2023'
  }
];

export default function Toppers() {
  const router = useRouter();

  return (
    <section className="py-20 bg-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-6 h-6 text-yellow-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-center mb-12">
            Toppers from AvlokanIAS
          </h2>
          <button
            onClick={() => router.push('/toppers')}
            className="px-6 py-3 border-2 border-white text-white rounded-md hover:bg-white hover:text-purple-600 transition-colors duration-300"
          >
            View All Toppers
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {toppers.map((topper, index) => (
            <motion.div
              key={topper.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={`/images/toppers/topper-${index + 1}.svg`}
                  alt={`Topper ${index + 1}`}
                  width={200}
                  height={200}
                  className="rounded-full"
                />
              </div>
              <div className="p-6 text-center">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold mb-2">
                  {topper.rank}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {topper.name}
                </h3>
                <p className="text-gray-600">{topper.year}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 