import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "../../lib/auth";

export default async function handle(req, res) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { tournamentId } = req.body;

    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: {
          matches: {
            where: { winnerId: { not: null } },
            include: {
              winner: true,
            },
          },
        },
      });

      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      const winners = tournament.matches.map(match => match.winner);
      if (winners.length < 2) {
        return res.status(400).json({ error: "Not enough winners to advance" });
      }

      const newMatches = [];
      for (let i = 0; i < winners.length; i += 2) {
        if (i + 1 < winners.length) {
          const match = await prisma.match.create({
            data: {
              tournamentId: tournament.id,
              player1Id: winners[i].id,
              player2Id: winners[i + 1].id,
              player1Score: 0,
              player2Score: 0,
            },
          });
          newMatches.push(match);
        }
      }

      res.status(200).json({ matches: newMatches });
    } catch (error) {
      console.error("Error advancing phase:", error);
      res.status(500).json({ error: "Error advancing phase", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
