import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendResetEmail(email: string, code: string) {
  const msg = {
    to: email,
    from: process.env.SENDER_EMAIL,
    subject: 'Password Reset Verification Code',
    text: `Your verification code is ${code}`,
    html: `<p>Your verification code is <strong>${code}</strong></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
