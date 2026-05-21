const express = require('express');
const cors = require('cors');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: function(origin, callback) {
    if (
      !origin ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('http://192.168.') ||
      origin.startsWith('http://10.') ||
      origin.includes('vercel.app') ||
      origin.includes('railway.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

app.get('/', (req, res) => res.send('Server is running ✅'));
app.use('/api/leaderboard', leaderboardRoutes);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));