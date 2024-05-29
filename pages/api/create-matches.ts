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
          participants: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      const participants = tournament.participants;

      if (participants.length < 2) {
        return res.status(400).json({ error: "Not enough participants" });
      }

      const shuffledParticipants = participants.sort(() => Math.random() - 0.5);
      const matches = [];

      for (let i = 0; i < shuffledParticipants.length; i += 2) {
        if (i + 1 < shuffledParticipants.length) {
          const match = await prisma.match.create({
            data: {
              tournamentId: tournament.id,
              player1Id: shuffledParticipants[i].userId,
              player2Id: shuffledParticipants[i + 1].userId,
              player1Score: 0,
              player2Score: 0,
            },
          });
          matches.push(match);
        }
      }

      res.status(200).json({ message: "Matches created successfully", matches });
    } catch (error) {
      console.error("Error creating matches:", error);
      res.status(500).json({ error: "Error creating matches", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
