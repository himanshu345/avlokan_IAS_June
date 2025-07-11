import { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import PrelimsPanel from '../components/PrelimsPanel/PrelimsPanel';

export default function Prelims() {
  const [isPrelimsOpen, setIsPrelimsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PrelimsPanel isOpen={isPrelimsOpen} onClose={() => setIsPrelimsOpen(false)} />
    </div>
  );
} 