import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Importación corregida
import { sendResetEmail } from '../../lib/sendEmail'; // Implementa esta función para enviar correos

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: 'No user found with this email' });
    }

    const ottCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generar código OTP de 6 dígitos
    await prisma.user.update({
      where: { email },
      data: { ottCode },
    });

    await sendResetEmail(email, ottCode); // Implementa esta función para enviar correos

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
}
