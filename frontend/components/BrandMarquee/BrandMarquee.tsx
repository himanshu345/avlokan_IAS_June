import { motion } from 'framer-motion';

const brands = [
  { name: 'TechCorp', logo: '/images/brands/techcorp.svg' },
  { name: 'InnovateX', logo: '/images/brands/innovatex.svg' },
  { name: 'GrowthCo', logo: '/images/brands/growthco.svg' },
  { name: 'FutureTech', logo: '/images/brands/futuretech.svg' },
  { name: 'SmartSolutions', logo: '/images/brands/smartsolutions.svg' },
];

export default function BrandMarquee() {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-2xl font-semibold text-gray-900"
          >
            Trusted by Industry Leaders
          </motion.h2>
        </div>

        <div className="relative">
          <div className="flex space-x-12 animate-marquee">
            {[...brands, ...brands].map((brand, index) => (
              <motion.div
                key={`${brand.name}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <div className="h-12 w-32 flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-600">{brand.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 