import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

// Configura la API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;

    // Verifica que todos los campos estén completos
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
      // Envía el email utilizando SendGrid
      await sgMail.send({
        to: process.env.RECIPIENT_EMAIL,
        from: process.env.RECIPIENT_EMAIL,  // Usa un remitente autorizado por SendGrid
        replyTo: email,  // Para poder responder al correo del remitente
        subject: subject,
        text: `Nombre: ${name}\nCorreo: ${email}\n\n${message}`,
        html: `<p>Nombre: ${name}</p><p>Correo: ${email}</p><p>${message}</p>`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default sendEmail;
