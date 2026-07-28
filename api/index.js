require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Utility routes (No MongoDB / Mongoose - 100% Supabase database architecture)
const emailRoutes = require('../api-lib/routes/email');
const paymentRoutes = require('../api-lib/routes/payment');

app.use('/api/messages', emailRoutes); // Fallback for /send-email
app.use('/api/email', emailRoutes);
app.use('/api/payment', paymentRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 NGO Backend API Server running on port ${PORT} (100% Supabase - No MongoDB needed)`);
  });
}

module.exports = app;
