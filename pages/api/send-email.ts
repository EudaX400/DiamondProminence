import { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

// Configura la API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const sendEmail = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { name, mail, subject, message } = req.body;

    // Verifica que todos los campos estén completos
    if (!name || !subject || !message) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    const msg = {
      to: process.env.RECIPIENT_EMAIL, // El mismo correo que el remitente
      from: process.env.SENDER_EMAIL, // Correo verificado
      subject: subject,
      text: `Nombre: ${name}\n Email: ${mail}\n\n${message}`,
      html: `<p>Nombre: ${name}</p> <p>Email: ${mail}</p> <p>${message}</p>`,
    };

    try {
      // Envía el email utilizando SendGrid
      await sgMail.send(msg);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);

      if (error.response) {
        console.error('Error response body:', error.response.body);
        return res.status(500).json({ error: 'Error sending email', details: error.response.body });
      }

      res.status(500).json({ error: 'Error sending email' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default sendEmail;
