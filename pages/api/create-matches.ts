import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "../../lib/auth";

export default async function handle(req, res) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      console.error("Not authenticated");
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { tournamentId } = req.body;

    console.log("Tournament ID received:", tournamentId); // Log para verificar el ID del torneo recibido

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
        console.error("Tournament not found");
        return res.status(404).json({ error: "Tournament not found" });
      }

      const participants = tournament.participants;

      if (participants.length < 2) {
        console.error("Not enough participants");
        return res.status(400).json({ error: "Not enough participants" });
      }

      console.log("Participants:", participants); // Log para verificar los participantes

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
              phase: 1, // Inicializamos la fase en 1
            },
          });
          matches.push(match);
        }
      }

      console.log("Matches created:", matches); // Log para verificar los partidos creados

      res.status(200).json({ message: "Matches created successfully", matches });
    } catch (error) {
      console.error("Error creating matches:", error);
      res.status(500).json({ error: "Error creating matches", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
