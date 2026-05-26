const express = require('express');
const cors = require('cors');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => res.send('Server is running ✅'));
app.use('/api/leaderboard', leaderboardRoutes);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));