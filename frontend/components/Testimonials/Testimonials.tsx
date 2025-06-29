import { motion } from 'framer-motion';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'UPSC Aspirant',
    testimonial: 'avlokanias has transformed my preparation strategy. The personalized feedback and guidance have been invaluable.',
    image: '/images/testimonials/testimonial-1.svg'
  },
  {
    name: 'Michael Chen',
    role: 'Civil Services Student',
    testimonial: 'The quality of evaluation and the depth of feedback is exceptional. It has helped me identify and work on my weak areas.',
    image: '/images/testimonials/testimonial-2.svg'
  },
  {
    name: 'Priya Sharma',
    role: 'IAS Aspirant',
    testimonial: 'The mentors are incredibly supportive and knowledgeable. Their insights have been crucial for my preparation.',
    image: '/images/testimonials/testimonial-3.svg'
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="testimonial-card"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.testimonial}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 