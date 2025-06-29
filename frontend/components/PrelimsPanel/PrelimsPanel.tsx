import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChevronRightIcon, HeartIcon } from '@heroicons/react/24/outline';

interface PrelimsOffer {
  title: string;
  subtitle: string;
  price: string;
  oldPrice: string;
  likes: number;
}

interface PrelimsData {
  [key: string]: PrelimsOffer[];
}

const prelimsModules = [
  "Prelims Test Series",
  "Prelims CA",
  "Prelims Crash Course"
];

const prelimsData: PrelimsData = {
  "Prelims Test Series": [
    {
      title: "Prelims Test Series",
      subtitle: "Comprehensive Prelims Practice (NCERT + Sectionals + Simulators)",
      price: "₹2,999",
      oldPrice: "₹6,999",
      likes: 413
    }
  ],
  "Prelims CA": [
    {
      title: "Prelims 2026 CA Notes",
      subtitle: "Ensure 40+ Marks in Prelims 2025!",
      price: "₹599",
      oldPrice: "₹1,099",
      likes: 44
    },
    {
      title: "Current Affairs Program 2026 (CAP)",
      subtitle: "One Stop Reliable Solution for Prelims Current Affairs",
      price: "₹1,199",
      oldPrice: "₹3,099",
      likes: 146
    }
  ],
  "Prelims Crash Course": [
    {
      title: "Economics Crash Course",
      subtitle: "Secure 40+ Marks in Prelims in just 25 Hours (Comprehensive Video Lectures + Notes)",
      price: "₹599",
      oldPrice: "₹1,999",
      likes: 178
    }
  ]
};

interface PrelimsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrelimsPanel({ isOpen, onClose }: PrelimsPanelProps) {
  const [selectedModule, setSelectedModule] = useState(prelimsModules[0]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-y-0 right-0 w-full max-w-7xl bg-white shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Prelims Modules</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex h-[calc(100vh-64px)]">
              {/* Left Sidebar */}
              <div className="w-64 border-r bg-gray-50 p-4 overflow-y-auto">
                <nav className="space-y-1">
                  {prelimsModules.map((module) => (
                    <button
                      key={module}
                      onClick={() => setSelectedModule(module)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedModule === module
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{module}</span>
                      {selectedModule === module && (
                        <ChevronRightIcon className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Right Panel */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prelimsData[selectedModule].map((offer, index) => (
                    <motion.div
                      key={offer.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {offer.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {offer.subtitle}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-purple-600">
                              {offer.price}
                            </span>
                            <span className="ml-2 text-gray-400 line-through">
                              {offer.oldPrice}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-500">
                            <HeartIcon className="w-5 h-5 mr-1" />
                            <span className="text-sm">{offer.likes}</span>
                          </div>
                        </div>

                        <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200">
                          View Details & Subscribe
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 