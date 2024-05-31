import { authOptions } from "../../lib/auth";
import { compare, hash } from "bcryptjs";
import prisma from "../../lib/prisma";
import { getServerSession } from "next-auth";

export default async function changePassword(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { email, password, newPassword } = req.body;

  // Verificar si se recibieron todos los campos necesarios
  if (!email || !password || !newPassword) {
    return res.status(400).json({ message: "Missing fields" });
  }

  // Validación de contraseña
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: "Password 6 characters max. and one uppercase letter, one lowercase letter, and one number.",
    });
  }

  // Obtener el usuario de la base de datos
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Verificar si el usuario existe y la contraseña actual es válida
  if (!user || !(await compare(password, user.password))) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  // Hashear la nueva contraseña y actualizarla en la base de datos
  const hashedPassword = await hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  res.status(200).json({ message: "Password changed successfully" });
}
