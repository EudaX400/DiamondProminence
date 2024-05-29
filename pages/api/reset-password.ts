import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Importación corregida
import { hash } from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { code, password, confirmPassword } = req.body;

  // Validación de contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, and one number.",
    });
  }

  // Confirmación de la contraseña
  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match.",
    });
  }

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
