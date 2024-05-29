import prisma from '../../lib/prisma';

export default async function handle(req, res) {
  const { tournamentId, userId } = req.body;

  try {
    const participant = await prisma.tournamentParticipant.create({
      data: {
        tournamentId,
        userId,
      },
    });

    res.json({ message: "Successfully joined the tournament!", tournamentId });
  } catch (error) {
    console.error("Error joining tournament:", error);
    res.status(500).json({ error: "Error joining tournament" });
  }
}
