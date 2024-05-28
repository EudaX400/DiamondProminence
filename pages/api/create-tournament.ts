// api/create-tournament.js
import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "../../lib/auth";

export default async function handle(req, res) {
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userId = session.user.id;

    // Verificar si el usuario es prime
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.prime) {
      return res.status(403).json({ error: "You must be a prime user to create a tournament" });
    }

    const {
      title,
      category,
      participants,
      startDate,
      endDate,
      description,
      private: isPrivate,
      privatePassword,
    } = req.body;

    try {
      const result = await prisma.tournament.create({
        data: {
          title,
          category,
          numPlayers: parseInt(participants),
          createdAt: new Date(startDate),
          finishedAt: new Date(endDate),
          description,
          private: isPrivate,
          privatePassword: isPrivate ? privatePassword : null,
          ownerId: userId, 
        },
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error creating tournament:", error);
      res
        .status(500)
        .json({ error: "Error creating tournament", details: error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
