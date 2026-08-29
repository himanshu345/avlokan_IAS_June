// Script to seed SubscriptionPlan collection with specific IDs
const mongoose = require('mongoose');
const SubscriptionPlan = require('../src/models/SubscriptionPlan');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const plans = [
  {
    _id: new mongoose.Types.ObjectId('686e8c26c678f9e876818e46'),
    name: 'One Month 2 questions/day',
    description: 'Daily Two Answers(DTA) Program',
    monthlyPrice: 1,
    annualPrice: 14990,
    features: [
      'English',
      'Active for 30 days',
      'Total 60 GS Questions + 4 Essays',
      '2 questions/day, 1 Essay/Week',
      'Select question from any source',
      'Evaluation within 24 working hours',
      'Access to Question Bank'
    ],
    evaluationsPerMonth: 60,
    evaluationsPerDay: 2,
    accessToResources: true,
    accessToVideos: false,
    personalizedFeedback: false,
    mentorshipSessions: 0,
    mockInterviews: 0,
    isPopular: false,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('686e8c26c678f9e876818e47'),
    name: 'One Month 1 questions/day',
    description: 'Daily One Answer(DOA) Program',
    monthlyPrice: 1,
    annualPrice: 7990,
    features: [
      'English',
      'Active for 30 days',
      'Total 60 GS Questions + 2 Essays',
      '1 questions/day, 1 Essay/Week',
      'Select question from any source',
      'Evaluation within 24 working hours',
      'Access to Question Bank'
    ],
    evaluationsPerMonth: 30,
    evaluationsPerDay: 1,
    accessToResources: true,
    accessToVideos: false,
    personalizedFeedback: false,
    mentorshipSessions: 0,
    mockInterviews: 0,
    isPopular: false,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('686e8c26c678f9e876818e49'),
    name: 'Mains 2026',
    description: 'Lakshya Mains 2026',
    monthlyPrice: 1,
    annualPrice: 69990,
    features: [
      'English',
      'Active Till UPSC CSE Mains 2026',
      'Unlimited GS + Essay Evaluation',
      'No Limit on Daily Submissions',
      'Access to Question Bank',
      'Select question from any source',
      'Full length tests covered',
      'Evaluation within 24 working* hours',
      'Complimentary One-on-One Mentorship Calls',
      'Access to Previous Year Toppers Copies'
    ],
    evaluationsPerMonth: 9999,
    evaluationsPerDay: 0,
    accessToResources: true,
    accessToVideos: true,
    personalizedFeedback: true,
    mentorshipSessions: 1,
    mockInterviews: 1,
    isPopular: true,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('686e8c26c678f9e876818e50'),
    name: 'One Month Evaluation with Guided Answer Writing(OMEGA) Program',
    description: 'OMEGA Program',
    monthlyPrice: 1,
    annualPrice: 11990,
    features: [
      'English',
      'Live Weekly Mentorship Sessions',
      'Personalised guidance on structure, content, and presentation',
      'Strategy to handle different GS papers',
      'Doubt-solving & feedback discussion',
      'Active for 30 days',
      'Total 60 GS Questions + 2 Essays',
      '1 questions/day, 1 Essay/Week',
      'Select question from any source',
      'Evaluation within 24 working hours',
      'Access to Question Bank'
    ],
    evaluationsPerMonth: 30,
    evaluationsPerDay: 1,
    accessToResources: true,
    accessToVideos: false,
    personalizedFeedback: true,
    mentorshipSessions: 4,
    mockInterviews: 0,
    isPopular: false,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('686e8c26c678f9e876818e51'),
    name: 'Daily Answer Writing with Nurturing(DAWN) Mentorship Program',
    description: 'DAWN Program',
    monthlyPrice: 1,
    annualPrice: 17490,
    features: [
      'English',
      'Live Weekly Mentorship Sessions',
      'Personalised guidance on structure, content, and presentation',
      'Strategy to handle different GS papers',
      'Doubt-solving & feedback discussion',
      'Active for 30 days',
      'Total 120 GS Questions + 4 Essays',
      '2 questions/day, 1 Essay/Week',
      'Select question from any source',
      'Evaluation within 24 working hours',
      'Access to Question Bank'
    ],
    evaluationsPerMonth: 60,
    evaluationsPerDay: 2,
    accessToResources: true,
    accessToVideos: false,
    personalizedFeedback: true,
    mentorshipSessions: 4,
    mockInterviews: 0,
    isPopular: false,
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId('6a931cc3761454f6ac449b01'),
    name: 'UPPSC Prelims Test Series 2026',
    description: 'Integrated GS Modular Test Series: 1 Sep 2026 - 20 Nov 2026 (81 Days)',
    monthlyPrice: 499,
    annualPrice: 499,
    features: [
      'English',
      '63 Total Tests (5,250+ Questions)',
      '42 Subject-wise Mini Tests (50 Qs each)',
      '10 Subject Full Length Tests (FLTs)',
      '6 Current Affairs Tests (5 Mini + 1 Grand FLT)',
      '5 UP Special Tests',
      '10 Combined Grand Mock Tests (Full UPPSC Simulation)',
      'PYQ-Aligned, High Quality MCQs',
      'Standard 1/3rd Negative Marking',
      'Structure: Subject Mini Tests -> Immediate Subject FLT -> Grand Mocks',
      'Starts 25th August 2026'
    ],
    evaluationsPerMonth: 0,
    evaluationsPerDay: 0,
    accessToResources: true,
    accessToVideos: true,
    personalizedFeedback: false,
    mentorshipSessions: 0,
    mockInterviews: 63,
    isPopular: true,
    isActive: true
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await SubscriptionPlan.deleteMany({ _id: { $in: plans.map(p => p._id) } });
  await SubscriptionPlan.insertMany(plans);
  console.log('Seeded subscription plans with specific IDs.');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 