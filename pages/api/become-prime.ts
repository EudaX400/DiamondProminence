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

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { prime: true },
      });

      res.status(200).json({ user });
    } catch (error) {
      console.error("Error updating user to prime:", error);
      res.status(500).json({ error: "Error updating user to prime", details: error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
