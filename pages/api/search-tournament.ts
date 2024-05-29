import prisma from '../../lib/prisma';

export default async function handle(req, res) {
  const { code, name } = req.body;

  try {
    const searchResults = await prisma.tournament.findMany({
      where: {
        AND: [
          code ? { id: code } : {},
          name ? { title: { contains: name, mode: 'insensitive' } } : {},
        ],
      },
      include: {
        owner: {
          select: { name: true },
        },
      },
    });

    // Convertir las fechas a strings
    const serializedResults = searchResults.map((tournament) => ({
      ...tournament,
      createdAt: tournament.createdAt.toISOString(),
      finishedAt: tournament.finishedAt.toISOString(),
    }));

    res.json(serializedResults);
  } catch (error) {
    console.error("Error searching tournaments:", error);
    res.status(500).json({ error: "Error searching tournaments" });
  }
}
