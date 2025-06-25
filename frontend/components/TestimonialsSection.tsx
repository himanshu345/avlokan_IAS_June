import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Rajat Sharma',
      position: 'AIR 25, UPSC CSE 2022',
      image: '/images/testimonials/testimonial-1.svg',
      quote: 'The personalized feedback from AvlokanIAS evaluators was instrumental in improving my answer writing skills. Their detailed comments helped me understand my weak areas and work on them effectively.',
    },
    {
      name: 'Priya Patel',
      position: 'AIR 45, UPSC CSE 2022',
      image: '/images/testimonials/testimonial-2.svg',
      quote: 'The study resources and answer evaluation service by AvlokanIAS significantly enhanced my preparation. Their quick turnaround time for evaluations helped me improve rapidly.',
    },
    {
      name: 'Amit Kumar',
      position: 'AIR 112, UPSC CSE 2022',
      image: '/images/testimonials/testimonial-3.svg',
      quote: 'I attribute a significant part of my success to AvlokanIAS. Their expert evaluators provided me with actionable insights that transformed my answer writing approach completely.',
    },
    {
      name: 'Sneha Reddy',
      position: 'AIR 67, UPSC CSE 2021',
      image: '/images/testimonials/testimonial-1.svg',
      quote: 'AvlokanIAS provided me with a structured approach to preparing for the UPSC exam. Their comprehensive resources and evaluation services were crucial for my success.',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="max-w-3xl mx-auto text-text-muted">
            Hear from our students who achieved their UPSC dreams with avlokanias's expert guidance and evaluation services.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow relative overflow-hidden">
              {/* Accent Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 -mr-10 -mt-10 transform rotate-45"></div>
              
              {/* Quote Icon */}
              <div className="text-primary/20 mb-4">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              
              <blockquote className="mb-6 text-text">
                <p className="italic">{testimonial.quote}</p>
              </blockquote>
              
              <div className="flex items-center mt-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                  {/* This would be an actual image in production */}
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">{testimonial.name}</h4>
                  <p className="text-sm text-primary">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="btn btn-outline border-primary">Read More Success Stories</button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 