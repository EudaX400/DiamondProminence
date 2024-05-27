import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
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
          privatePassword,
          participants: null, // Dejamos la lista de participantes como null temporalmente
          User: { connect: [] }, // Dejamos la relación con User vacía temporalmente
          PrimeUser: { connect: [] }, // Dejamos la relación con PrimeUser vacía temporalmente
          ownerId: null, // Dejamos la relación con owner vacía temporalmente
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
