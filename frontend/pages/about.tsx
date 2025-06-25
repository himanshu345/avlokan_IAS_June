import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Dr. Rajiv Sharma',
      role: 'Founder & CEO',
      bio: 'Former IAS officer with 15 years of administrative experience. Passionate about education and making quality UPSC preparation accessible to all aspirants.',
      image: '/images/testimonials/testimonial-1.svg'
    },
    {
      name: 'Priya Mathur',
      role: 'Chief Academic Officer',
      bio: 'UPSC topper (AIR 9) with expertise in developing structured study material and evaluation frameworks that align with UPSC requirements.',
      image: '/images/testimonials/testimonial-2.svg'
    },
    {
      name: 'Amit Verma',
      role: 'Head of Technology',
      bio: 'Tech veteran with 12+ years of experience building educational platforms. Leads the development of our innovative answer evaluation system.',
      image: '/images/testimonials/testimonial-3.svg'
    },
    {
      name: 'Dr. Meenakshi Kumar',
      role: 'Subject Expert - Geography',
      bio: 'PhD in Geography with 10+ years of teaching experience. Specializes in making complex geographical concepts understandable and memorable.',
      image: '/images/testimonials/testimonial-1.svg'
    },
    {
      name: 'Prof. Alok Mishra',
      role: 'Subject Expert - Economics',
      bio: 'Former professor at Delhi School of Economics. Brings academic rigor and practical insights to economic concepts relevant for UPSC.',
      image: '/images/testimonials/testimonial-2.svg'
    },
    {
      name: 'Vikram Singh',
      role: 'Content & Strategy Director',
      bio: 'UPSC mentor with expertise in current affairs analysis and strategic preparation planning. Helps aspirants navigate the vast UPSC syllabus efficiently.',
      image: '/images/testimonials/testimonial-3.svg'
    }
  ];

  // Statistics data
  const stats = [
    { value: '10,000+', label: 'Active Students' },
    { value: '85%', label: 'Success Rate' },
    { value: '50+', label: 'Expert Mentors' },
    { value: '1,200+', label: 'Successful Candidates' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-background">
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission is Your Success</h1>
              <p className="text-lg md:text-xl opacity-90 mb-8">
                avlokanias was founded with a simple yet powerful vision: to democratize UPSC preparation and 
                make quality guidance accessible to every aspirant, regardless of their background.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/subscription" className="btn btn-accent">Join Our Community</a>
                <a href="#our-story" className="btn btn-outline border-white text-white hover:bg-white/10">
                  Read Our Story
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="our-story" className="py-20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4">
                  <p>
                    avlokanias began in 2015 when Dr. Rajiv Sharma, a former IAS officer, recognized a critical gap 
                    in UPSC preparation: the lack of personalized feedback and structured guidance for aspirants.
                  </p>
                  <p>
                    After years in civil service, Dr. Sharma saw firsthand how many brilliant candidates were 
                    unsuccessful simply because they lacked proper guidance on answer writing and interview skills – 
                    aspects that are crucial for UPSC success but often overlooked in traditional coaching.
                  </p>
                  <p>
                    What started as a small mentorship program with 50 students has grown into a comprehensive 
                    platform serving thousands of aspirants across India. Our innovative approach combines technology 
                    with expert guidance to provide personalized feedback at scale.
                  </p>
                  <p>
                    Today, avlokanias continues to evolve with the changing patterns of UPSC examinations, but our 
                    core mission remains the same: to guide aspirants not just in what to study, but how to present 
                    their knowledge effectively.
                  </p>
                </div>
              </div>
              <div className="relative h-96 bg-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium">Founder's image would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-text-muted">
                These principles guide everything we do at avlokanias, from content creation to student interactions.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Excellence</h3>
                <p className="text-text-muted">
                  We strive for excellence in every aspect of our platform, from the quality of our study materials to the 
                  precision of our answer evaluations. We believe that excellence is a habit, not an act.
                </p>
              </div>
              
              <div className="card p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Inclusivity</h3>
                <p className="text-text-muted">
                  We believe that quality UPSC guidance should be accessible to all aspirants, regardless of their 
                  background, location, or financial resources. Our platform is designed to be inclusive and adaptable to diverse needs.
                </p>
              </div>
              
              <div className="card p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-text-muted">
                  We continuously innovate to enhance the learning experience. By combining human expertise with 
                  technology, we create solutions that address the real challenges faced by UPSC aspirants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-text-muted">
                Our team consists of experienced civil servants, academic experts, and technology professionals, 
                all united by a passion for education and excellence in UPSC preparation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="card overflow-hidden">
                  <div className="h-64 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary text-sm font-medium mb-4">{member.role}</p>
                    <p className="text-text-muted text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-text-muted mb-6">
                In addition to our core team, we have a network of over 50 subject experts and mentors who provide 
                specialized guidance across various UPSC subjects.
              </p>
              <a href="/contact" className="btn btn-primary">Join Our Team</a>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
              <p className="text-text-muted">
                The success stories of our students are our greatest achievement. Here's what some of them have to say 
                about their experience with avlokanias.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-8">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Rahul Sharma</h3>
                    <p className="text-sm text-primary">IAS Officer (AIR 25, 2022)</p>
                  </div>
                </div>
                <p className="text-text-muted">
                  "The answer writing program at avlokanias was a game-changer for me. After two unsuccessful attempts, I realized 
                  my knowledge was adequate but my presentation was lacking. The detailed feedback from experts helped me structure 
                  my answers effectively, which made all the difference in my third attempt."
                </p>
              </div>
              
              <div className="card p-8">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 mr-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Aisha Patel</h3>
                    <p className="text-sm text-primary">IPS Officer (AIR 78, 2023)</p>
                  </div>
                </div>
                <p className="text-text-muted">
                  "Being from a small town, access to quality UPSC coaching was a major challenge for me. avlokanias's online 
                  platform bridged that gap. The personalized study plan and regular evaluation of my answers gave me the 
                  structure and feedback I needed. The mentors were always available to clear my doubts."
                </p>
              </div>
            </div>
            
            <div className="text-center mt-10">
              <a href="/testimonials" className="text-primary font-medium hover:underline">
                Read More Success Stories →
              </a>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-4">Begin Your Journey to Success</h2>
            <p className="max-w-2xl mx-auto mb-8 opacity-90">
              Join thousands of successful candidates who have transformed their UPSC preparation with avlokanias. 
              Start your journey today and take the first step toward your dream career in civil services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/subscription" className="btn bg-white text-primary hover:bg-gray-100">
                Explore Our Plans
              </a>
              <a href="/contact" className="btn btn-outline border-white text-white hover:bg-white/10">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About; 