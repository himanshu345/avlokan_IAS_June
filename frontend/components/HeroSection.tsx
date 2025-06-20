import React from 'react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-20">
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Personalized Evaluation for UPSC Success
            </h1>
            <p className="text-lg mb-8 text-white/90">
              ConvertIAS offers professional evaluation of your UPSC Civil Services answers with actionable feedback, personalized insights, and comprehensive resources to enhance your preparation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/subscription" className="btn bg-white text-primary hover:bg-gray-100">
                Start Free Trial
              </Link>
              <Link href="/resources" className="btn btn-outline border-white text-white hover:bg-white/10">
                Explore Resources
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold">10k+</p>
                <p className="text-sm mt-1 text-white/80">Students</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm mt-1 text-white/80">Selections</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">15+</p>
                <p className="text-sm mt-1 text-white/80">Expert Evaluators</p>
              </div>
            </div>
          </div>

          {/* Right Column - Image or Illustration */}
          <div className="lg:flex justify-end hidden">
            <div className="relative">
              <div className="w-full h-full absolute top-4 left-4 bg-accent/20 rounded-lg"></div>
              <div className="relative bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between mb-4">
                  <h3 className="text-text font-bold">Answer Submission</h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Submitted</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <span className="text-xs text-text-muted">Q1.</span>
                    <p className="text-sm text-text">Discuss the role of civil society in strengthening democratic governance in India.</p>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <span className="text-xs text-text-muted">Q2.</span>
                    <p className="text-sm text-text">Critically analyze the impact of climate change on agriculture in South Asia.</p>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <span className="text-xs text-text-muted">Q3.</span>
                    <p className="text-sm text-text">Evaluate the significance of the Non-Aligned Movement in contemporary world politics.</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-text-muted">Average Score</p>
                    <p className="text-text font-bold">8.5/10</p>
                  </div>
                  <button className="btn btn-primary btn-sm">View Feedback</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="75" cy="25" r="20" fill="currentColor" />
          <circle cx="80" cy="75" r="15" fill="currentColor" />
          <circle cx="50" cy="50" r="25" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection; 