import { motion } from 'framer-motion';
import { useState } from 'react';

const contactMethods = [
  {
    icon: '📞',
    label: 'Phone',
    value: '+91 7838724075',
    link: 'tel:+917838724075'
  },
  {
    icon: '📱',
    label: 'Telegram',
    value: '@AvlokanIAS',
    link: 'https://t.me/AvlokanIAS'
  },
  {
    icon: '💬',
    label: 'WhatsApp',
    value: '+91 7838724075',
    link: 'https://wa.me/917838724075'
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'avlokanias.info@gmail.com',
    link: 'mailto:avlokanias.info@gmail.com'
  }
];

const socialLinks = [
  { icon: '📱', label: 'Telegram', link: 'https://t.me/AvlokanIAS' },
  { icon: '📸', label: 'Instagram', link: 'https://instagram.com/avlokanias' },
  { icon: '👥', label: 'Facebook', link: 'https://facebook.com/avlokanias' }
];

const quickLinks = [
  { label: 'Terms & Conditions', link: '/terms' },
  { label: 'Privacy Policy', link: '/privacy' },
  { label: 'Refund Policy', link: '/refund' },
  { label: 'Shipping Policy', link: '/shipping' }
];

export default function ContactAndFooter() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Contact Options Row */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <motion.a
                key={method.label}
                href={method.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center p-4 rounded-lg hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-3xl mb-2">{method.icon}</span>
                <span className="font-medium text-gray-800">{method.label}</span>
                <span className="text-sm text-gray-600 mt-1">{method.value}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Left Side */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AvlokanIAS</h3>
              <p className="text-gray-600 mb-6">
                Empowering UPSC aspirants with comprehensive answer evaluation and personalized feedback to help them achieve their dreams.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <span className="text-2xl">{social.icon}</span>
                  </a>
                ))}
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-2 gap-4">
                {quickLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.link}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Your Mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-center text-gray-600">
              ©2025 - AvlokanIAS (FATFRUIT ANALYSIS & EVALUATION PRIVATE LIMITED). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
} 