const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Lightweight in-memory rate limiter: per-IP quota for email dispatch
const EMAIL_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const EMAIL_MAX_PER_WINDOW = 10;
const ipHits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > EMAIL_WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }
  entry.count += 1;
  ipHits.set(ip, entry);
  return entry.count > EMAIL_MAX_PER_WINDOW;
}

function getClientIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function isValidEmail(value) {
  return typeof value === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) &&
    value.length <= 254;
}

// Origin/referer sanity check - only accept requests from this site
function isTrustedOrigin(req) {
  const origin = req.headers.origin || req.headers.referer || '';
  if (!origin) return true; // allow non-browser callers (dev tools, curl)
  try {
    const host = new URL(origin).hostname;
    const allowed = (process.env.ALLOWED_ORIGINS || 'localhost,127.0.0.1')
      .split(',')
      .map((h) => h.trim().toLowerCase());
    return allowed.some((a) => host === a || host.endsWith('.' + a));
  } catch {
    return false;
  }
}

// Send Email via SMTP (server-only credentials)
router.post('/send', async (req, res) => {
  try {
    if (!isTrustedOrigin(req)) {
      return res.status(403).json({ error: 'Request origin not allowed.' });
    }
    if (rateLimited(getClientIp(req))) {
      return res.status(429).json({ error: 'Too many emails sent. Please try again later.' });
    }

    const { to, subject, html, message } = req.body;
    const htmlContent = html || message || `<div style="padding: 20px;">${subject || ''}</div>`;

    if (!to) {
      return res.status(400).json({ error: 'Recipient email address is required.' });
    }
    if (!isValidEmail(to)) {
      return res.status(400).json({ error: 'Invalid recipient email address.' });
    }
    if (typeof htmlContent === 'string' && htmlContent.length > 500_000) {
      return res.status(413).json({ error: 'Email content too large.' });
    }

    // Server-only SMTP credentials - never VITE_-prefixed (those leak to browsers)
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || user || 'noreply@srishreevision.org';

    if (!user || !pass) {
      console.warn('SMTP credentials not configured in environment variables.');
      return res.status(500).json({ error: 'SMTP credentials missing on server.' });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
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
    res.status(500).json({ error: 'Failed to send email via SMTP.' });
  }
});

// Alias for compatibility
router.post('/send-email', (req, res, next) => {
  req.url = '/send';
  router.handle(req, res, next);
});

module.exports = router;
