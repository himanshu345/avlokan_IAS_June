const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
}

/**
 * Sends an email. Throws if EMAIL_USER/EMAIL_PASS are not configured or the send fails.
 */
async function sendEmail({ to, subject, html, text }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email is not configured: missing EMAIL_USER/EMAIL_PASS');
  }
  await getTransporter().sendMail({
    from: `"Avlokan IAS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });
}

module.exports = { sendEmail };
