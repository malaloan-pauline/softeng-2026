const express = require('express');
const cors = require('cors');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Server is running ✅'));
app.use('/api/leaderboard', leaderboardRoutes);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)); 