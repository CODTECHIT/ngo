const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Send Email via SMTP
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html, message } = req.body;
    const htmlContent = html || message || `<div style="padding: 20px;">${subject}</div>`;

    if (!to) {
      return res.status(400).json({ error: 'Recipient email address is required.' });
    }

    const host = process.env.VITE_SMTP_HOST || process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.VITE_SMTP_PORT || process.env.SMTP_PORT || '587');
    const user = process.env.VITE_SMTP_USER || process.env.SMTP_USER;
    const pass = process.env.VITE_SMTP_PASS || process.env.SMTP_PASS;
    const from = process.env.VITE_EMAIL_FROM || process.env.EMAIL_FROM || user || 'noreply@srishreevision.org';

    if (!user || !pass) {
      console.warn('SMTP credentials not configured in environment variables.');
      return res.status(500).json({ error: 'SMTP credentials missing on server.' });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject: subject || 'Notification from Srishree Vision Foundation',
      html: htmlContent,
    });

    console.log('Email sent successfully via SMTP:', info.messageId);
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error('Error sending email via SMTP:', err);
    res.status(500).json({ error: err.message || 'Failed to send email via SMTP.' });
  }
});

// Alias for compatibility
router.post('/send-email', (req, res, next) => {
  req.url = '/send';
  router.handle(req, res, next);
});

module.exports = router;
