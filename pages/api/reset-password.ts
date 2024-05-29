import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Importación corregida
import { hash } from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { code, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { ottCode: code },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        ottCode: null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
}
