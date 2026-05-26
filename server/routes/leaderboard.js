const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// ── Specific routes first ──────────────────

router.put('/player/points', async (req, res) => {
  try {
    const { uuid, totalPoints } = req.body;
    const player = await prisma.player.update({
      where: { uuid },
      data: { totalPoints },
    });
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update total points' });
  }
});

router.post('/player', async (req, res) => {
  try {
    const { uuid, pseudo, avatarUrl, avatarBg } = req.body;
    const player = await prisma.player.upsert({
      where: { uuid },
      create: { uuid, pseudo, avatarUrl, ...(avatarBg && { avatarBg }) },
      update: { pseudo, avatarUrl, ...(avatarBg && { avatarBg }) },
    });
    res.json(player);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register player' });
  }
});

router.post('/player', async (req, res) => {
  try {
    const { uuid, pseudo, avatarUrl, avatarBg } = req.body;
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

// ── Generic routes last ────────────────────

router.get("/", async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      orderBy: { totalPoints: "desc" },
    });
    res.json(players);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

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

module.exports = router;