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
    const { pseudo, uuid, game, metric, points, avatarUrl } = req.body;
    const avatar = avatarUrl ?? '/src/assets/users/default.png';

    let player = await prisma.player.findUnique({ where: { uuid } });
    if (!player) {
      player = await prisma.player.create({
        data: { pseudo, uuid, avatarUrl: avatar },
      });
    } else {
      player = await prisma.player.update({
        where: { uuid },
        data: { pseudo, avatarUrl: avatar },
      });
    }

    const score = await prisma.score.create({
      data: { playerId: player.id, game, metric },
    });

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
      select: { id: true, pseudo: true, uuid: true, avatarUrl: true, totalPoints: true, createdAt: true },
    });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// PATCH -> update player pseudo and avatarUrl by uuid
router.patch('/player', async (req, res) => {
  try {
    const { uuid, pseudo, avatarUrl } = req.body;
    const data = { pseudo };
    if (avatarUrl) data.avatarUrl = avatarUrl;
    const player = await prisma.player.update({
      where: { uuid },
      data,
    });
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update player' });
  }
});

module.exports = router;