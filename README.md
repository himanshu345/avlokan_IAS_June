# avlokanias Platform

A comprehensive UPSC preparation platform that helps aspirants with answer writing practice, evaluation, and resources.

## Project Structure

The project is organized into two main directories:

- **frontend**: Contains the Next.js frontend application.
- **backend**: Contains the Express.js backend API.

## Technology Stack

### Frontend
- Next.js 12
- React 18
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas)

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env.local file with the following variables
# NEXT_PUBLIC_API_URL=http://localhost:5000
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
# NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Run the development server
npm run dev
```

The frontend will be available at http://localhost:3000.

### Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file with the following variables (see backend/.env.example)
# PORT=5000
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret_key
# ALLOWED_ORIGIN=http://localhost:3000
# AWS_ACCESS_KEY_ID=your_aws_access_key_id
# AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
# AWS_REGION=your_aws_region
# AWS_S3_BUCKET=your_s3_bucket_name
# RAZORPAY_KEY_ID=your_razorpay_key_id
# RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Run the development server
npm run dev
```

The backend API will be available at http://localhost:5000.

## Features

- User Authentication (Register, Login, Profile Management)
- Answer Writing and Submission
- Answer Evaluation System
- Study Resources (Notes, Videos, Previous Year Questions)
- Subscription Plans

## API Documentation

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/google-auth` - Register/login via Google OAuth
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `POST /api/users/profile-picture` - Upload profile picture (protected)
- `GET /api/users` - Get all users (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

### Payment Routes
- `POST /api/payment/create-order` - Create a Razorpay order
- `POST /api/payment/verify-payment` - Verify a Razorpay payment signature (protected)
- `POST /api/payment/activate-subscription` - Activate a user's subscription after payment (protected)
- `GET /api/payment/plans` - List active subscription plans

### Order Routes
- `GET /api/orders/my-orders` - Get the logged-in user's orders (protected)

### Resources Routes
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get specific resource
- `POST /api/resources` - Create resource (admin only)
- `PUT /api/resources/:id` - Update resource (admin only)
- `DELETE /api/resources/:id` - Delete resource (admin only)

### Evaluation Routes
- `POST /api/evaluations/submit-answer` - Submit answer for evaluation
- `GET /api/evaluations/my-submissions` - Get user's submissions
- `GET /api/evaluations/submission/:id` - Get specific submission
- `GET /api/evaluations/stats` - Get evaluation statistics
- `GET /api/evaluations/pending` - Get pending evaluations (evaluator only)
- `POST /api/evaluations/evaluate/:id` - Submit evaluation (evaluator only)
- `PUT /api/evaluations/evaluate/:id` - Update evaluation (evaluator only)
- `POST /api/evaluations/evaluate/:id/evaluated-pdf` - Upload the evaluated PDF (evaluator only)
- `GET /api/evaluations` - Get all submissions (admin only)
- `GET /api/evaluations/download` - Get a signed download URL for a submission's file (protected)

## License

This project is licensed under the MIT License. # avlokan_IAS_June


## Push on Github
- git add . && git commit -m "Your commit message" && git push