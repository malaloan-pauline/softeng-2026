const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET global leaderboard: top 3 players by total points
router.get("/", async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      orderBy: { totalPoints: "desc" },
      take: 3,
    });
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// POST a new score: adds points to the player's total
router.post("/", async (req, res) => {
  try {
    const { pseudo, uuid, game, metric, points } = req.body;

    // Find or create the player
    let player = await prisma.player.findUnique({ where: { uuid } });
    if (!player) {
      player = await prisma.player.create({
        data: { pseudo, uuid },
      });
    }

    // Save the individual game score
    const score = await prisma.score.create({
      data: { playerId: player.id, game, metric },
    });

    // Add points to the player's total
    player = await prisma.player.update({
      where: { uuid },
      data: { totalPoints: { increment: points } },
    });

    res.json({ score, player });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// GET player profile by uuid
router.get('/player/:uuid', async (req, res) => {
  try {
    const player = await prisma.player.findUnique({
      where: { uuid: req.params.uuid },
      select: { id: true, pseudo: true, uuid: true, totalPoints: true, createdAt: true },
    });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// PATCH -> update player pseudo by uuid
router.patch('/player', async (req, res) => {
  try {
    const { uuid, pseudo } = req.body;
    const player = await prisma.player.update({
      where: { uuid },
      data: { pseudo },
    });
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update username' });
  }
});

module.exports = router;