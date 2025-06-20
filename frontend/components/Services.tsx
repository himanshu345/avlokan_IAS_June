import { motion } from 'framer-motion';

const services = [
  {
    title: 'Digital Strategy',
    description: 'Crafting comprehensive digital strategies to help businesses grow and succeed in the digital age.',
    icon: '🎯'
  },
  {
    title: 'Web Development',
    description: 'Building modern, responsive, and scalable web applications using cutting-edge technologies.',
    icon: '💻'
  },
  {
    title: 'UI/UX Design',
    description: 'Creating intuitive and engaging user experiences that delight users and drive business results.',
    icon: '🎨'
  }
];

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">What We Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="card-hover bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 