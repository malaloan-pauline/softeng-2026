const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// GET top 3 for a specific game
router.get("/:game", async (req, res) => {
  const { game } = req.params;
  const scores = await prisma.score.findMany({
    where: { game },
    orderBy: { metric: "desc" },
    take: 3,
    include: { player: true },
  });
  res.json(scores);
});

// POST a new score
router.post("/", async (req, res) => {
  const { pseudo, uuid, game, metric } = req.body;

  // Find or create the player
  let player = await prisma.player.findUnique({ where: { uuid } });
  if (!player) {
    player = await prisma.player.create({
      data: { pseudo, uuid },
    });
  }

  // Save the score
  const score = await prisma.score.create({
    data: { playerId: player.id, game, metric },
  });

  res.json({ score, player });
});

module.exports = router;