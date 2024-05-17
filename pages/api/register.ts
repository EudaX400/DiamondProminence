import prisma from "../../lib/prisma";
import { hash } from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { name, lastName, email, username, country, password } = req.body;

    if (!name || !lastName || !email || !username || !country || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashed_password = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        lastName,
        username,
        country,
        password: hashed_password,
      },
    });

    return res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        username: user.username,
        country: user.country,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}
