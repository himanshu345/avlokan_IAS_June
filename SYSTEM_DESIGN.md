# System Design Document: AvlokanIAS Platform

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack](#technology-stack)
4. [System Components](#system-components)
5. [Data Models](#data-models)
6. [API Design](#api-design)
7. [Authentication & Authorization](#authentication--authorization)
8. [File Management](#file-management)
9. [Security Considerations](#security-considerations)
10. [Scalability & Performance](#scalability--performance)
11. [Deployment Architecture](#deployment-architecture)
12. [Monitoring & Logging](#monitoring--logging)
13. [Future Enhancements](#future-enhancements)

## System Overview

### Purpose
AvlokanIAS is a comprehensive UPSC (Union Public Service Commission) preparation platform designed to help civil service aspirants with answer writing practice, evaluation, and resource management. The platform provides a complete ecosystem for IAS preparation including answer submission, expert evaluation, study resources, and progress tracking.

### Key Features
- **User Management**: Registration, authentication, profile management
- **Answer Writing**: Submit answers for evaluation with file uploads
- **Evaluation System**: Expert evaluation with detailed feedback
- **Resource Management**: Study materials, notes, videos, PYQs
- **Subscription Plans**: Tiered access to premium features
- **Progress Tracking**: Analytics and performance metrics
- **Payment Integration**: Secure payment processing

## Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │   File Storage  │    │   Authentication│
│   Assets        │    │   (Local/Cloud) │    │   (JWT/OAuth)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### System Flow
1. **User Registration/Login**: OAuth (Google) + JWT authentication
2. **Answer Submission**: File upload + metadata storage
3. **Evaluation Process**: Expert review + feedback generation
4. **Resource Access**: Role-based content delivery
5. **Payment Processing**: Secure transaction handling

## Technology Stack

### Frontend
- **Framework**: Next.js 13 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Context
- **HTTP Client**: Axios
- **Authentication**: @react-oauth/google
- **Build Tool**: Webpack (Next.js default)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **File Handling**: Multer
- **Validation**: Express-validator

### Database
- **Primary**: MongoDB Atlas/Compass
- **ODM**: Mongoose
- **Indexing**: Compound indexes for performance
- **Backup**: Automated daily backups

### Infrastructure
- **Version Control**: Git/GitHub
- **Environment**: Development/Staging/Production
- **Deployment**: Vercel (Frontend) + Railway/Heroku (Backend)
- **Monitoring**: Built-in logging + external monitoring

## System Components

### 1. Frontend Components

#### Core Components
- **Navbar**: Navigation + authentication status
- **Hero Section**: Landing page introduction
- **Features Section**: Platform capabilities showcase
- **Pricing Section**: Subscription plans display
- **Contact Form**: User inquiry handling

#### User Interface Components
- **Login/Register Forms**: Authentication interfaces
- **Dashboard**: User overview and navigation
- **Answer Submission**: File upload interface
- **Evaluation Display**: Results and feedback viewer
- **Resource Browser**: Content discovery interface

#### Layout Components
- **Footer**: Site information and links
- **Sidebar**: Navigation for authenticated users
- **Modal Components**: Overlay interactions
- **Loading States**: User feedback during operations

### 2. Backend Components

#### API Routes
```
/api/users/          - User management
/api/auth/           - Authentication
/api/evaluations/    - Answer evaluation
/api/resources/      - Study materials
/api/payment/        - Subscription handling
/api/upload/         - File management
```

#### Controllers
- **UserController**: User CRUD operations
- **EvaluationController**: Answer processing
- **ResourceController**: Content management
- **PaymentController**: Subscription handling

#### Middleware
- **AuthMiddleware**: JWT verification
- **RoleMiddleware**: Permission checking
- **ValidationMiddleware**: Input sanitization
- **ErrorMiddleware**: Exception handling

#### Models
- **User**: User profiles and authentication
- **Evaluation**: Answer submissions and feedback
- **Resource**: Study materials and content
- **SubscriptionPlan**: Payment tiers and access

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  googleId: String (OAuth),
  role: String (enum: ['user', 'evaluator', 'admin']),
  subscriptionPlan: ObjectId (ref: SubscriptionPlan),
  subscriptionExpiry: Date,
  evaluationsRemaining: Number,
  evaluationsUsed: Number,
  profilePicture: String,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Evaluation Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  question: String,
  answer: String (file path),
  subject: String,
  topic: String,
  status: String (enum: ['pending', 'evaluated', 'rejected']),
  score: Number,
  feedback: String,
  evaluatorId: ObjectId (ref: User),
  evaluatedAt: Date,
  submittedAt: Date
}
```

### Resource Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  type: String (enum: ['note', 'video', 'question']),
  subject: String,
  topic: String,
  fileUrl: String,
  thumbnailUrl: String,
  accessLevel: String (enum: ['free', 'premium']),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## API Design

### RESTful Endpoints

#### Authentication
```
POST   /api/users/register     - User registration
POST   /api/users/login        - User login
POST   /api/users/google-auth  - OAuth authentication
GET    /api/users/profile      - Get user profile
PUT    /api/users/profile      - Update profile
```

#### Evaluations
```
POST   /api/evaluations/submit-answer    - Submit answer
GET    /api/evaluations/my-submissions   - User submissions
GET    /api/evaluations/submission/:id   - Get submission
GET    /api/evaluations/pending          - Pending evaluations
POST   /api/evaluations/evaluate/:id     - Submit evaluation
PUT    /api/evaluations/evaluate/:id     - Update evaluation
```

#### Resources
```
GET    /api/resources          - List resources
GET    /api/resources/:id      - Get resource
POST   /api/resources          - Create resource (admin)
PUT    /api/resources/:id      - Update resource (admin)
DELETE /api/resources/:id      - Delete resource (admin)
```

### Response Format
```javascript
{
  success: Boolean,
  data: Object/Array,
  message: String,
  error: String (if applicable)
}
```

## Authentication & Authorization

### Authentication Flow
1. **Registration**: Email/password or Google OAuth
2. **Login**: Credential verification + JWT generation
3. **Token Management**: Refresh token rotation
4. **Session Handling**: Secure cookie storage

### Authorization Levels
- **Public**: Landing page, registration, login
- **User**: Dashboard, answer submission, resource access
- **Evaluator**: Answer evaluation, feedback submission
- **Admin**: User management, content management, analytics

### Security Measures
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Short expiration + refresh tokens
- **CORS Configuration**: Domain-specific access
- **Rate Limiting**: API request throttling
- **Input Validation**: Sanitization and validation

## File Management

### Upload System
- **File Types**: PDF, DOC, DOCX, images
- **Size Limits**: 10MB per file
- **Storage**: Local filesystem with cloud backup
- **Security**: Virus scanning + file validation

### File Processing
```javascript
// Upload flow
1. File validation (type, size, content)
2. Virus scanning (optional)
3. File storage (local/cloud)
4. Database record creation
5. Access URL generation
```

### Storage Strategy
- **Development**: Local filesystem
- **Production**: Cloud storage (AWS S3/Google Cloud)
- **Backup**: Automated daily backups
- **CDN**: Static asset delivery

## Security Considerations

### Data Protection
- **Encryption**: HTTPS/TLS for all communications
- **Sensitive Data**: Environment variables for secrets
- **Database Security**: Connection encryption
- **File Security**: Access control + encryption

### API Security
- **Rate Limiting**: Prevent abuse
- **Input Validation**: SQL injection prevention
- **CORS**: Cross-origin request control
- **Helmet**: Security headers

### User Privacy
- **GDPR Compliance**: Data protection regulations
- **Data Retention**: Automatic cleanup policies
- **User Consent**: Privacy policy acceptance
- **Data Portability**: Export capabilities

## Scalability & Performance

### Horizontal Scaling
- **Load Balancing**: Multiple server instances
- **Database Sharding**: Partitioned data storage
- **CDN**: Global content delivery
- **Caching**: Redis for session management

### Performance Optimization
- **Database Indexing**: Optimized queries
- **Image Optimization**: WebP format + compression
- **Code Splitting**: Lazy loading components
- **Caching Strategy**: Browser + server caching

### Monitoring
- **Application Metrics**: Response times, error rates
- **Database Performance**: Query optimization
- **User Analytics**: Usage patterns, feature adoption
- **Error Tracking**: Real-time error monitoring

## Deployment Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   localhost:3000│    │  localhost:5001 │    │   MongoDB       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Load Balancer │    │   Application   │
│   (Vercel)      │◄──►│   (Cloudflare)  │◄──►│   Servers       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Static Assets │    │   API Gateway   │    │   Database      │
│   (Images, CSS) │    │   (Rate Limit)  │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### CI/CD Pipeline
1. **Code Push**: GitHub repository
2. **Automated Testing**: Unit + integration tests
3. **Build Process**: Frontend + backend compilation
4. **Deployment**: Staging → Production
5. **Health Checks**: Automated monitoring

## Monitoring & Logging

### Application Monitoring
- **Error Tracking**: Sentry integration
- **Performance Monitoring**: Response time tracking
- **User Analytics**: Google Analytics
- **Server Monitoring**: Uptime monitoring

### Logging Strategy
```javascript
// Log levels
ERROR   - System errors, security issues
WARN    - Performance warnings, deprecated usage
INFO    - User actions, business events
DEBUG   - Development debugging information
```

### Alert System
- **Critical Errors**: Immediate notification
- **Performance Issues**: Threshold-based alerts
- **Security Events**: Real-time security monitoring
- **System Health**: Automated health checks

## Future Enhancements

### Phase 2 Features
- **AI-Powered Evaluation**: Machine learning feedback
- **Video Conferencing**: Live tutoring sessions
- **Mobile Application**: React Native app
- **Advanced Analytics**: Detailed performance insights

### Technical Improvements
- **Microservices**: Service decomposition
- **GraphQL**: Flexible data querying
- **Real-time Features**: WebSocket integration
- **Progressive Web App**: Offline capabilities

### Business Expansion
- **Multi-language Support**: Regional language content
- **Partner Integration**: Third-party content providers
- **Enterprise Features**: Corporate training programs
- **International Markets**: Global expansion

---

## Conclusion

The AvlokanIAS platform is designed as a scalable, secure, and user-friendly system for UPSC preparation. The architecture supports current requirements while providing a foundation for future growth and feature expansion. The modular design allows for easy maintenance and enhancement of individual components without affecting the overall system stability.

### Key Success Factors
- **User Experience**: Intuitive interface and smooth workflows
- **Performance**: Fast response times and reliable service
- **Security**: Robust protection of user data and system integrity
- **Scalability**: Ability to handle growing user base and content
- **Maintainability**: Clean code structure and comprehensive documentation 