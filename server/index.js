const express = require('express');
const cors = require('cors');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow any localhost origin or no origin (Postman, Thunder Client)
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Server is running ✅'));
app.use('/api/leaderboard', leaderboardRoutes);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)); 