import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { tournamentId } = req.body;

  try {
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        matches: true,
        participants: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const finalMatch = tournament.matches.length === 1 ? tournament.matches[0] : null;

    if (!finalMatch || finalMatch.player1Score === null || finalMatch.player2Score === null) {
      return res.status(400).json({ message: "Final match not completed" });
    }

    const winner = await prisma.user.findUnique({
      where: { id: finalMatch.winnerId },
    });

    if (!winner) {
      return res.status(404).json({ message: "Winner not found" });
    }

    const participantUpdates = tournament.participants.map((participant) => {
      let position;
      if (participant.user.id === finalMatch.winnerId) {
        position = "Winner";
      } else if (participant.user.id === finalMatch.player1Id || participant.user.id === finalMatch.player2Id) {
        position = "Finalist";
      } else {
        position = "Participant";
      }

      return {
        where: { tournamentId_userId: { tournamentId: tournament.id, userId: participant.user.id } },
        data: { position: position },
      };
    });

    await prisma.$transaction(
      participantUpdates.map((update) => prisma.tournamentParticipant.update(update))
    );

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: { finishedAt: new Date() },
    });

    return res.status(200).json({ winner: winner });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error finalizing tournament" });
  }
}
