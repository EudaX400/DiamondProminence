import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "../../lib/auth";

export default async function handle(req, res) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { tournamentId, userId, password } = req.body;

    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: {
          participants: true,  // Include participants to check their count
        },
      });

      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }

      // Check if the tournament is private and if the password is correct
      if (tournament.private && tournament.privatePassword !== password) {
        return res.status(403).json({ error: "Incorrect password" });
      }

      // Check if the tournament is full
      if (tournament.participants.length >= tournament.numPlayers) {
        return res.status(403).json({ error: "Tournament is full" });
      }

      // Add the user to the tournament participants
      const participant = await prisma.tournamentParticipant.create({
        data: {
          tournamentId,
          userId,
        },
      });

      res.status(200).json(participant);
    } catch (error) {
      console.error("Error joining tournament:", error);
      res.status(500).json({ error: "Error joining tournament", details: error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
