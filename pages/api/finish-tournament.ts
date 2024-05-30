import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { tournamentId } = req.body;

  if (!tournamentId) {
    return res.status(400).json({ message: "Tournament ID is required" });
  }

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

    const finalMatch = tournament.matches.find(match => match.phase === getCurrentPhase(tournament.matches) - 1);

    if (!finalMatch || finalMatch.player1Score === null || finalMatch.player2Score === null) {
      return res.status(400).json({ message: "Tournament cannot be finalized without a final match result" });
    }

    const winnerId = finalMatch.player1Score > finalMatch.player2Score ? finalMatch.player1Id : finalMatch.player2Id;
    
    const winner = await prisma.user.findUnique({
      where: { id: winnerId },
      select: { username: true },
    });

    await prisma.tournament.update({
      where: { id: tournamentId },
      data: {
        winnerId: winnerId,
        finishedAt: new Date(),
      },
    });

    return res.status(200).json({ message: "Tournament finalized successfully", winner: winner.username });
  } catch (error) {
    console.error("Error finalizing tournament:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Utilidad para obtener la fase actual
function getCurrentPhase(matches) {
  if (matches.length === 0) return 1;
  const maxPhase = matches.reduce((max, match) => Math.max(max, match.phase), 1);
  const currentPhaseMatches = matches.filter(match => match.phase === maxPhase);
  const allCurrentPhaseMatchesCompleted = currentPhaseMatches.every(match => match.winnerId);
  return allCurrentPhaseMatchesCompleted ? maxPhase + 1 : maxPhase;
}
