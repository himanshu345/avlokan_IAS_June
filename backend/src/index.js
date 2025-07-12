require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const resourceRoutes = require('./routes/resourcesRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const ordersRoutes = require('./routes/orders');
const path = require('path');
const helmet = require('helmet');

const app = express();

app.use(helmet());

// CORS configuration for Vercel frontend and local dev
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN || 'https://avlokanias.com', // Production or env frontend domain
  'http://localhost:3000'  // Local development (fallback)
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Handle preflight requests for all routes
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically
app.use('/uploads/profile-pictures', express.static(path.join(__dirname, '../uploads/profile-pictures')));
app.use('/uploads/evaluated-pdfs', express.static(path.join(__dirname, '../uploads/evaluated-pdfs')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', ordersRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to avlokanias API' });
});

// Print all registered routes for debugging
app._router.stack.forEach(function(r){
  if (r.route && r.route.path){
    console.log(r.route.path)
  }
})

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI;
console.log('Connecting to MongoDB URI:', MONGO_URI);
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Server port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app; 