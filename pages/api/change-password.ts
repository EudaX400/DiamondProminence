import { getSession } from "next-auth/react";
import { compare, hash } from "bcryptjs";
import prisma from "../../lib/prisma";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { email, password, newPassword } = req.body;

  if (!email || !password || !newPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  const hashedPassword = await hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  res.status(200).json({ message: "Password changed successfully" });
};
