import { getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { authOptions } from "../../lib/auth";

export default async function handle(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ isPrime: false });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { prime: true },
    });

    res.status(200).json({ isPrime: user.prime });
  } catch (error) {
    console.error("Error checking prime status:", error);
    res.status(500).json({ error: "Error checking prime status", details: error });
  }
}
