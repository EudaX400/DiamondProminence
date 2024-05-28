import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "../../lib/auth";

export default async function handle(req, res) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { matchId, player1Score, player2Score } = req.body;

    try {
      const match = await prisma.match.update({
        where: { id: matchId },
        data: {
          player1Score,
          player2Score,
          winnerId: player1Score > player2Score ? undefined : undefined,
        },
      });

      // Determine the winner
      const winnerId = player1Score > player2Score ? match.player1Id : match.player2Id;

      // Update the winner's position in the tournament
      await prisma.match.update({
        where: { id: matchId },
        data: { winnerId },
      });

      res.status(200).json({ message: "Score updated successfully", match });
    } catch (error) {
      console.error("Error updating score:", error);
      res.status(500).json({ error: "Error updating score", details: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
