import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Blog = () => {
  // Blog categories
  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'strategy', name: 'Strategy & Tips' },
    { id: 'current-affairs', name: 'Current Affairs' },
    { id: 'subject-guides', name: 'Subject Guides' },
    { id: 'success-stories', name: 'Success Stories' },
    { id: 'analysis', name: 'Exam Analysis' }
  ];

  // Active category state
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Strategy Guide',
      excerpt: 'A comprehensive guide to UPSC strategy.',
      category: 'strategy',
      author: 'Author Name',
      authorRole: 'Expert',
      date: '2023-01-01',
      readingTime: '10 min read',
      image: '/images/testimonials/testimonial-1.svg',
      isFeatured: false
    },
    {
      id: 2,
      title: 'Education Policy',
      excerpt: 'Insights into the latest education policy.',
      category: 'policy',
      author: 'Author Name',
      authorRole: 'Expert',
      date: '2023-01-02',
      readingTime: '8 min read',
      image: '/images/testimonials/testimonial-2.svg',
      isFeatured: false
    },
    {
      id: 3,
      title: 'Mastering Indian Polity: Subject Guide for UPSC Aspirants',
      excerpt: 'Essential concepts, approaches, and tips to excel in the Indian Polity section of UPSC examinations.',
      category: 'subject-guides',
      author: 'Priya Mathur',
      authorRole: 'IAS Officer (AIR 9, 2019)',
      date: 'October 3, 2023',
      readingTime: '15 min read',
      image: '/images/testimonials/testimonial-3.svg',
      isFeatured: false
    },
    {
      id: 4,
      title: 'My UPSC Journey: From Failure to AIR 25',
      excerpt: 'The inspiring journey of an aspirant who failed in two attempts but secured AIR 25 in the third attempt.',
      category: 'success-stories',
      author: 'Rahul Sharma',
      authorRole: 'IAS Officer (AIR 25, 2022)',
      date: 'July 12, 2023',
      readingTime: '8 min read',
      image: '/images/testimonials/testimonial-1.svg',
      isFeatured: true
    },
    {
      id: 5,
      title: 'Analysis of UPSC CSE Prelims 2023: Trends and Insights',
      excerpt: 'A detailed analysis of the UPSC Prelims 2023 paper, highlighting trends, important topics, and future preparation strategy.',
      category: 'analysis',
      author: 'Vikram Singh',
      authorRole: 'UPSC Mentor',
      date: 'June 30, 2023',
      readingTime: '14 min read',
      image: '/images/testimonials/testimonial-2.svg',
      isFeatured: false
    },
    {
      id: 6,
      title: 'Geography Through Maps: A Visual Approach to UPSC Preparation',
      excerpt: 'Learn how to use maps effectively for Geography preparation in UPSC CSE.',
      category: 'subject-guides',
      author: 'Dr. Meenakshi Kumar',
      authorRole: 'Geography Expert',
      date: 'September 2, 2023',
      readingTime: '11 min read',
      image: '/images/testimonials/testimonial-3.svg',
      isFeatured: false
    },
    {
      id: 7,
      title: 'Current Affairs: Important Events of September 2023',
      excerpt: 'A monthly compilation of important national and international events relevant for UPSC preparation.',
      category: 'current-affairs',
      author: 'Editorial Team',
      authorRole: 'AvlokanIAS Research',
      date: 'October 1, 2023',
      readingTime: '20 min read',
      image: '/images/testimonials/testimonial-1.svg',
      isFeatured: false
    },
    {
      id: 8,
      title: 'Economics Simplified: Understanding Complex Concepts for UPSC',
      excerpt: 'Breaking down complex economic concepts and theories in simple language for UPSC aspirants.',
      category: 'subject-guides',
      author: 'Prof. Alok Mishra',
      authorRole: 'Economics Professor',
      date: 'August 10, 2023',
      readingTime: '13 min read',
      image: '/images/testimonials/testimonial-2.svg',
      isFeatured: false
    }
  ];

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.isFeatured);
  
  // Filter posts based on active category
  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-background py-12">
        {/* Featured Posts Section */}
        <section className="container-custom mb-16">
          <h1 className="text-4xl font-bold mb-10 text-center">avlokanias Blog</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post, index) => (
              <div 
                key={post.id} 
                className={`relative rounded-xl overflow-hidden shadow-lg ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <div className="relative aspect-video">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/90 text-white">{post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{post.title}</h2>
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span>{post.date}</span>
                    <span>{post.readingTime}</span>
                  </div>
                </div>
                
                <Link href={`/blog/${post.id}`} className="absolute inset-0" aria-label={`Read ${post.title}`}>
                  <span className="sr-only">Read article</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* All Blog Posts Section */}
        <section className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">All Articles</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8 border-b border-gray-200 overflow-x-auto">
            <div className="flex space-x-1 pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-text-muted hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {filteredPosts.map((post) => (
              <div key={post.id} className="card hover:shadow-lg transition-shadow overflow-hidden">
                {/* Post Image */}
                <div className="relative h-48 bg-gray-200 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                
                {/* Post Content */}
                <div className="p-1">
                  <div className="mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">{post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                  <p className="text-text-muted text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{post.author}</p>
                        <p className="text-xs text-text-muted">{post.date}</p>
                      </div>
                    </div>
                    <span className="text-xs text-text-muted">{post.readingTime}</span>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <Link href={`/blog/${post.id}`} className="text-primary text-sm font-medium hover:underline">
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-text-muted">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPosts.length}</span> of <span className="font-medium">{filteredPosts.length}</span> articles
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-text-muted hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-text-muted hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Next
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter Subscribe */}
        <section className="mt-20 bg-primary py-12 text-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl font-bold mb-3">Stay Updated with UPSC Insights</h2>
                <p className="max-w-2xl opacity-90">
                  Subscribe to our newsletter for weekly updates on UPSC preparation strategies, 
                  current affairs digests, and exclusive content from toppers.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <div className="flex flex-col sm:flex-row">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full sm:w-64 px-4 py-2 rounded-l-md focus:outline-none text-gray-900"
                  />
                  <button className="bg-accent text-white px-4 py-2 rounded-r-md font-medium mt-2 sm:mt-0">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs mt-2 opacity-80">We respect your privacy. Unsubscribe at any time.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog; 