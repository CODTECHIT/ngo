// Email Invoice, Registration & Certificate Sending Service
// Simulates Gmail / Email delivery with beautiful HTML templates, persistent inbox history,
// and real-time custom notification banners.

export interface EmailNotification {
  id: string;
  to: string;
  subject: string;
  date: string;
  type: 'donation' | 'registration' | 'certificate';
  htmlContent: string;
  metadata?: Record<string, any>;
  read?: boolean;
}

const STORAGE_KEY = 'ngo_sent_emails_history';

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const getSentEmails = (): EmailNotification[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveEmailToHistory = (email: EmailNotification) => {
  try {
    const emails = getSentEmails();
    const updated = [email, ...emails];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch real-time event
    window.dispatchEvent(new CustomEvent('ngo-new-email', { detail: email }));

    // Dispatch real email to actual user email address
    sendRealEmail(email);

    // Show visual confirmation toast on screen
    showEmailSentToast(email);
  } catch (err) {
    console.error('Failed to save email notification:', err);
  }
};

export const sendRealEmail = async (email: EmailNotification) => {
  try {
    const res = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email.to,
        subject: email.subject,
        html: email.htmlContent,
        message: email.htmlContent,
        recipient_name: email.metadata?.name || email.to,
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.warn('Backend SMTP email dispatch note:', errData);

      // Fallback to EmailJS if configured
      const emailJsServiceId = (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID;
      const emailJsTemplateId = (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID;
      const emailJsPublicKey = (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY;

      if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: emailJsServiceId,
            template_id: emailJsTemplateId,
            user_id: emailJsPublicKey,
            template_params: {
              to_email: email.to,
              subject: email.subject,
              message: email.htmlContent,
              recipient_name: email.metadata?.name || email.to,
            }
          })
        });
      }
    } else {
      console.log('Real SMTP email dispatched successfully via backend.');
    }
  } catch (err) {
    console.warn('Real email dispatch note:', err);
  }
};

export const markEmailAsRead = (id: string) => {
  try {
    const emails = getSentEmails();
    const updated = emails.map(e => e.id === id ? { ...e, read: true } : e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('ngo-email-updated'));
  } catch (err) {
    console.error(err);
  }
};

export const getUnreadEmailCount = (): number => {
  return getSentEmails().filter(e => !e.read).length;
};

// Toast notification when email is triggered
const showEmailSentToast = (email: EmailNotification) => {
  const toastId = 'ngo-email-toast';
  const existing = document.getElementById(toastId);
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = toastId;
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 99998;
    background: #02042B; color: #ffffff; padding: 16px 20px; border-radius: 16px;
    box-shadow: 0 20px 35px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.15);
    display: flex; align-items: center; gap: 14px; max-width: 420px;
    animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  `;

  let icon = '📄';
  if (email.type === 'donation') icon = '💖';
  if (email.type === 'registration') icon = '🎟️';
  if (email.type === 'certificate') icon = '🎓';

  toast.innerHTML = `
    <div style="font-size: 28px; background: rgba(255,255,255,0.1); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
      ${icon}
    </div>
    <div style="flex-grow: 1; overflow: hidden;">
      <div style="font-size: 11px; font-weight: 700; color: #4CAF50; text-transform: uppercase; letter-spacing: 0.5px;">Email Dispatched to Recipient</div>
      <div style="font-size: 13px; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(email.subject)}</div>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">Sent to: <strong>${escapeHtml(email.to)}</strong></div>
    </div>
  `;

  if (!document.getElementById('ngo-toast-anim')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'ngo-toast-anim';
    styleEl.innerHTML = `
      @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
    `;
    document.head.appendChild(styleEl);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    if (document.getElementById(toastId)) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 6000);
};

// 1. Send Donation Invoice & Receipt Email
export const sendDonationInvoiceEmail = (details: {
  name: string;
  email: string;
  amount: number;
  cause: string;
  transactionId: string;
  pan?: string;
}) => {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const html = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; color: #1E293B;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0F6E6E, #02042B); color: #ffffff; padding: 32px 24px; text-align: center;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #4CAF50; margin-bottom: 8px;">Official Tax Invoice & Receipt</div>
        <h1 style="margin: 0; font-size: 26px; font-weight: 800;">Srishree Vision Foundation</h1>
        <p style="margin: 8px 0 0; font-size: 13px; opacity: 0.8;">Registered NGO under Section 80G of Income Tax Act</p>
      </div>

      <!-- Body -->
      <div style="padding: 32px 24px;">
        <h2 style="font-size: 20px; font-weight: 700; color: #0F6E6E; margin-top: 0;">Thank You for Your Generosity, ${escapeHtml(details.name)}! 🙏</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #475569;">
          We have gratefully received your donation. Your support directly funds our ground-level initiatives and brings vision, health and empowerment to those who need it most.
        </p>

        <!-- Invoice Box -->
        <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #CBD5E1; padding-bottom: 12px; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Receipt Number</span>
            <span style="font-weight: 700; color: #0F6E6E; font-family: monospace;">INV-${details.transactionId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #CBD5E1; padding-bottom: 12px; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Date & Time</span>
            <span style="font-weight: 600; color: #1E293B; font-size: 13px;">${dateStr}</span>
          </div>
          <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #CBD5E1; padding-bottom: 12px; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Supported Cause</span>
            <span style="font-weight: 600; color: #0F6E6E; font-size: 13px;">${escapeHtml(details.cause)}</span>
          </div>
          ${details.pan ? `
          <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #CBD5E1; padding-bottom: 12px; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Donor PAN</span>
            <span style="font-weight: 700; color: #1E293B; font-family: monospace;">${escapeHtml(details.pan)}</span>
          </div>` : ''}
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 4px;">
            <span style="font-weight: 700; color: #1E293B; font-size: 15px;">Total Donated Amount</span>
            <span style="font-weight: 800; color: #4CAF50; font-size: 24px;">₹${details.amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <!-- 80G Badge -->
        <div style="background: #F0FDFA; border-left: 4px solid #0F6E6E; padding: 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
          <div style="font-weight: 700; color: #0F6E6E; font-size: 13px; margin-bottom: 4px;">🎯 80G Tax Exemption Certified</div>
          <div style="font-size: 12px; color: #475569; line-height: 1.5;">
            Donations made to Srishree Vision Foundation are eligible for 50% tax deduction under Section 80G of the Indian Income Tax Act. Please retain this invoice as your official tax receipt.
          </div>
        </div>

        <p style="font-size: 13px; color: #64748B; text-align: center; margin-bottom: 0;">
          For queries, contact us at <strong>info@srishreevision.org</strong> or WhatsApp <strong>+91 97011 00974</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #F1F5F9; padding: 20px; text-align: center; font-size: 11px; color: #64748B; border-top: 1px solid #E2E8F0;">
        &copy; ${new Date().getFullYear()} Srishree Vision Foundation. All rights reserved.<br/>
        2-2-108/3, Ambedkar Chowk, Khagaznagar, Asifabad District, Telangana, 504296
      </div>
    </div>
  `;

  const notification: EmailNotification = {
    id: 'mail_inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    to: details.email || 'donor@example.com',
    subject: `💖 Official Tax Invoice & Receipt - ₹${details.amount.toLocaleString('en-IN')} Donation to Srishree Vision`,
    date: new Date().toISOString(),
    type: 'donation',
    htmlContent: html,
    metadata: details
  };

  saveEmailToHistory(notification);
  return notification;
};

// 2. Send Event Registration Email
export const sendEventRegistrationEmail = (details: {
  name: string;
  email: string;
  eventTitle: string;
  eventDate: string;
  location: string;
  isFree: boolean;
  price?: number;
  transactionId?: string;
}) => {
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const html = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; color: #1E293B;">
      <div style="background: linear-gradient(135deg, #02042B, #0F6E6E); color: #ffffff; padding: 32px 24px; text-align: center;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #29B6F6; margin-bottom: 8px;">Event Registration Ticket</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800;">${escapeHtml(details.eventTitle)}</h1>
        <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Srishree Vision Foundation Community Programs</p>
      </div>

      <div style="padding: 32px 24px;">
        <h2 style="font-size: 18px; font-weight: 700; color: #0F6E6E; margin-top: 0;">Hello ${escapeHtml(details.name)}, Your Spot is Confirmed! 🎟️</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          We are thrilled to have you join us. Here are your official event registration details:
        </p>

        <div style="background: #F8FAFC; border: 2px dashed #0F6E6E; border-radius: 12px; padding: 24px; margin: 24px 0; position: relative;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Event Name</span>
            <span style="font-weight: 700; color: #1E293B; font-size: 14px;">${escapeHtml(details.eventTitle)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Date</span>
            <span style="font-weight: 600; color: #0F6E6E; font-size: 13px;">${new Date(details.eventDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Venue Location</span>
            <span style="font-weight: 600; color: #1E293B; font-size: 13px; max-width: 200px; text-align: right;">${escapeHtml(details.location)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Registration Status</span>
            <span style="background: #DCFCE7; color: #15803D; font-weight: 700; font-size: 12px; padding: 2px 8px; border-radius: 4px;">CONFIRMED</span>
          </div>
          ${!details.isFree ? `
          <div style="display: flex; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 12px; margin-top: 12px;">
            <span style="color: #64748B; font-size: 13px;">Payment Status</span>
            <span style="font-weight: 700; color: #0F6E6E;">PAID ₹${details.price} (${details.transactionId || 'Online'})</span>
          </div>` : ''}

          <!-- Barcode simulation -->
          <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px dashed #CBD5E1;">
            <div style="font-family: monospace; font-size: 20px; letter-spacing: 6px; font-weight: 700; color: #334155;">||| |||| || | ||||| ||||</div>
            <div style="font-size: 11px; color: #64748B; margin-top: 4px;">TICKET ID: REG-${Math.random().toString(36).substring(2, 9).toUpperCase()}</div>
          </div>
        </div>

        <p style="font-size: 13px; color: #64748B; line-height: 1.5;">
          Please present this email or barcode at the registration counter at the venue. Refreshments and certificate of participation will be provided upon completion.
        </p>
      </div>

      <div style="background: #F1F5F9; padding: 16px; text-align: center; font-size: 11px; color: #64748B;">
        Srishree Vision Foundation • Organizing Team • Telangana, India
      </div>
    </div>
  `;

  const notification: EmailNotification = {
    id: 'mail_reg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    to: details.email || 'attendee@example.com',
    subject: `🎟️ Ticket Confirmed: ${escapeHtml(details.eventTitle)} - Srishree Vision Foundation`,
    date: new Date().toISOString(),
    type: 'registration',
    htmlContent: html,
    metadata: details
  };

  saveEmailToHistory(notification);
  return notification;
};

// 3. Send Certificate Completion Email
export const sendCertificateCompletionEmail = (details: {
  name: string;
  email: string;
  eventTitle: string;
  eventDate: string;
}) => {
  const html = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; overflow: hidden; color: #1E293B;">
      <div style="background: linear-gradient(135deg, #4CAF50, #0F6E6E); color: #ffffff; padding: 32px 24px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 8px;">🎓🌟</div>
        <h1 style="margin: 0; font-size: 26px; font-weight: 800;">Congratulations, ${escapeHtml(details.name)}!</h1>
        <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Official Certificate of Participation Awarded</p>
      </div>

      <div style="padding: 32px 24px; text-align: center;">
        <h2 style="font-size: 20px; font-weight: 700; color: #0F6E6E; margin-top: 0;">Thank You for Your Impactful Participation!</h2>
        <p style="font-size: 15px; line-height: 1.6; color: #475569; max-width: 480px; margin: 0 auto 24px;">
          We proudly recognize your active involvement in <strong>${escapeHtml(details.eventTitle)}</strong> organized by Srishree Vision Foundation.
        </p>

        <div style="background: #FEFCE8; border: 2px solid #CA8A04; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
          <div style="font-size: 12px; font-weight: 700; color: #A16207; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">CERTIFICATE OF RECOGNITION</div>
          <div style="font-size: 22px; font-weight: 800; color: #1E293B; margin: 8px 0; font-family: 'Playfair Display', serif;">${escapeHtml(details.name)}</div>
          <div style="font-size: 13px; color: #713F12;">Awarded on ${new Date(details.eventDate || Date.now()).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</div>
        </div>

        <p style="font-size: 13px; color: #64748B; margin-top: 24px;">
          You can download and print your high-resolution official PDF certificate directly from your account dashboard on our website.
        </p>
      </div>

      <div style="background: #F1F5F9; padding: 16px; text-align: center; font-size: 11px; color: #64748B;">
        Srishree Vision Foundation • Empowering Lives Through Vision & Care
      </div>
    </div>
  `;

  const notification: EmailNotification = {
    id: 'mail_cert_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    to: details.email || 'volunteer@example.com',
    subject: `🎓 Congratulations! Your Certificate for ${escapeHtml(details.eventTitle)} is Ready`,
    date: new Date().toISOString(),
    type: 'certificate',
    htmlContent: html,
    metadata: details
  };

  saveEmailToHistory(notification);
  return notification;
};

export const sendEmail = (params: {
  to: string;
  subject: string;
  htmlBody?: string;
  category?: string;
  type?: 'donation' | 'registration' | 'certificate';
}) => {
  const notification: EmailNotification = {
    id: 'mail_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    to: params.to,
    subject: params.subject,
    date: new Date().toISOString(),
    type: params.type || 'donation',
    htmlContent: params.htmlBody || `<div style="padding: 20px;">${escapeHtml(params.subject)}</div>`
  };
  saveEmailToHistory(notification);
  return notification;
};

