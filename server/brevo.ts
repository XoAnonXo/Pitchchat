// PitchChat Email Service using Brevo API
// 15 transactional email templates with consistent design

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BASE_URL = process.env.PRODUCTION_URL || 'https://pitchchat.ai';

interface EmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  replyTo?: string;
}

// Shared email styles
const emailStyles = {
  wrapper: `font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif; background: #ffffff; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; line-height: 1.6;`,
  logo: `display: flex; align-items: center; gap: 10px; margin-bottom: 28px;`,
  logoIcon: `width: 36px; height: 36px; background: #000; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 13px; text-align: center; line-height: 36px;`,
  logoText: `font-weight: 600; font-size: 15px; letter-spacing: -0.01em;`,
  h1: `font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 12px 0; line-height: 1.25; color: #000;`,
  p: `color: rgba(0,0,0,0.65); font-size: 15px; margin: 0 0 16px 0; line-height: 1.6;`,
  highlightBox: `background: #f8f9fa; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid rgba(0,0,0,0.05);`,
  highlightBoxDark: `background: #000; border-radius: 12px; padding: 20px; margin: 20px 0; color: white;`,
  highlightBoxWarning: `background: #fffbeb; border-left: 3px solid #f59e0b; border-radius: 0 12px 12px 0; padding: 20px; margin: 20px 0;`,
  highlightBoxDanger: `background: #fef2f2; border-left: 3px solid #ef4444; border-radius: 0 12px 12px 0; padding: 20px; margin: 20px 0;`,
  highlightBoxSuccess: `background: #f0fdf4; border-left: 3px solid #22c55e; border-radius: 0 12px 12px 0; padding: 20px; margin: 20px 0;`,
  highlightBoxInfo: `background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 12px 12px 0; padding: 20px; margin: 20px 0;`,
  btn: `display: inline-block; background: #000; color: white; padding: 14px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center;`,
  btnDanger: `display: inline-block; background: #ef4444; color: white; padding: 14px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center;`,
  btnOutline: `display: inline-block; background: white; color: #000; padding: 14px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px; text-align: center; border: 1.5px solid rgba(0,0,0,0.12);`,
  footer: `margin-top: 32px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.06); color: rgba(0,0,0,0.4); font-size: 13px;`,
  infoRow: `display: flex; padding: 10px 0; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 14px;`,
  infoLabel: `font-weight: 500; min-width: 100px; color: rgba(0,0,0,0.45);`,
  infoValue: `color: #000; font-weight: 500;`,
};

// Logo HTML component
const logoHtml = `
  <div style="${emailStyles.logo}">
    <div style="${emailStyles.logoIcon}">PC</div>
    <span style="${emailStyles.logoText}">PitchChat</span>
  </div>
`;

// Footer HTML component
const footerHtml = (text: string = 'Best regards,', links?: { label: string; url: string }[]) => `
  <div style="${emailStyles.footer}">
    <p style="margin: 0;">${text}<br><strong style="color: rgba(0,0,0,0.55);">The PitchChat Team</strong></p>
    ${links ? `<div style="margin-top: 16px; font-size: 12px;">${links.map(l => `<a href="${l.url}" style="color: rgba(0,0,0,0.4); text-decoration: none; margin-right: 16px;">${l.label}</a>`).join('')}</div>` : ''}
  </div>
`;

// Base email sender using fetch
export async function sendBrevoEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY environment variable not set');
    return false;
  }

  const emailData = {
    sender: { name: 'PitchChat', email: 'noreply@pitchchat.ai' },
    to: [{ email: params.to, name: params.to.split('@')[0] }],
    replyTo: params.replyTo ? { email: params.replyTo } : { email: 'support@pitchchat.ai' },
    subject: params.subject,
    htmlContent: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin: 0; padding: 0; background: #f5f5f7;"><div style="${emailStyles.wrapper}">${params.htmlContent}</div></body></html>`,
  };

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Brevo API error:', error);
      return false;
    }

    console.log(`Email sent successfully to ${params.to}: ${params.subject}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// ============================================
// AUTHENTICATION & SECURITY EMAILS
// ============================================

// 1. Welcome Email
export async function sendWelcomeEmail(userEmail: string, userName?: string): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Welcome to PitchChat!</h1>
    <p style="${emailStyles.p}">Hi${userName ? ` ${userName}` : ''}, you're all set to create AI-powered pitch rooms that answer investor questions 24/7.</p>

    <div style="${emailStyles.highlightBox}">
      <h2 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">Quick Start Checklist</h2>
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px;">
        <span style="width: 20px; height: 20px; background: rgba(0,0,0,0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: rgba(0,0,0,0.4); font-size: 11px;">1</span>
        Create your first project
      </div>
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px;">
        <span style="width: 20px; height: 20px; background: rgba(0,0,0,0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: rgba(0,0,0,0.4); font-size: 11px;">2</span>
        Upload pitch deck & documents
      </div>
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px;">
        <span style="width: 20px; height: 20px; background: rgba(0,0,0,0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: rgba(0,0,0,0.4); font-size: 11px;">3</span>
        Generate a shareable link
      </div>
      <div style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
        <span style="width: 20px; height: 20px; background: rgba(0,0,0,0.1); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: rgba(0,0,0,0.4); font-size: 11px;">4</span>
        Share with investors
      </div>
    </div>

    <a href="${BASE_URL}/dashboard" style="${emailStyles.btn}">Go to Dashboard &rarr;</a>
    ${footerHtml('Best regards,', [{ label: 'Help Center', url: `${BASE_URL}/help` }, { label: 'Unsubscribe', url: `${BASE_URL}/settings` }])}
  `;

  return sendBrevoEmail({ to: userEmail, subject: 'Welcome to PitchChat!', htmlContent });
}

// 2. Email Verification
export async function sendEmailVerification(userEmail: string, verificationCode: string, verificationLink: string): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Verify Your Email</h1>
    <p style="${emailStyles.p}">Please confirm your email address to complete your PitchChat account setup.</p>

    <div style="background: #f8f9fa; border: 1px dashed rgba(0,0,0,0.15); border-radius: 8px; padding: 16px; text-align: center; font-family: monospace; font-size: 24px; font-weight: 600; letter-spacing: 0.1em; margin: 20px 0;">
      ${verificationCode}
    </div>

    <p style="font-size: 13px; color: rgba(0,0,0,0.5); margin: 0 0 16px 0;">Or click the button below:</p>

    <a href="${verificationLink}" style="${emailStyles.btn}">Verify Email Address &rarr;</a>

    <div style="${emailStyles.highlightBoxWarning}; margin-top: 24px;">
      <p style="margin: 0; font-size: 13px;"><strong>This code expires in 10 minutes.</strong> If you didn't create an account, you can safely ignore this email.</p>
    </div>
    ${footerHtml()}
  `;

  return sendBrevoEmail({ to: userEmail, subject: 'Verify Your PitchChat Email', htmlContent });
}

// 3. Password Reset
export async function sendPasswordResetEmail(userEmail: string, resetToken: string): Promise<boolean> {
  const resetLink = `${BASE_URL}/reset-password/${resetToken}`;

  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Reset Your Password</h1>
    <p style="${emailStyles.p}">We received a request to reset your password. Click below to create a new one.</p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${resetLink}" style="${emailStyles.btn}">Reset Password &rarr;</a>
    </div>

    <div style="${emailStyles.highlightBoxWarning}">
      <p style="margin: 0; font-size: 13px;"><strong>Expires in 1 hour.</strong> If you didn't request this, ignore this email. Your password won't change.</p>
    </div>
    ${footerHtml()}
  `;

  return sendBrevoEmail({ to: userEmail, subject: 'Reset Your PitchChat Password', htmlContent });
}

// 4. Password Changed
export async function sendPasswordChangedEmail(userEmail: string): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Password Changed</h1>
    <p style="${emailStyles.p}">Your PitchChat password was successfully updated.</p>

    <div style="${emailStyles.highlightBoxDanger}">
      <p style="margin: 0; font-size: 13px;"><strong>Wasn't you?</strong> If you didn't make this change, please reset your password immediately and contact support.</p>
    </div>

    <a href="${BASE_URL}/dashboard" style="${emailStyles.btn}">Go to Dashboard &rarr;</a>
    ${footerHtml()}
  `;

  return sendBrevoEmail({ to: userEmail, subject: 'Your PitchChat Password Has Been Changed', htmlContent });
}

// ============================================
// BILLING & SUBSCRIPTION EMAILS
// ============================================

// 5. Payment Receipt
export async function sendPaymentReceipt(
  userEmail: string,
  payment: {
    amount: number;
    planName: string;
    date: Date;
    invoiceId: string;
    cardLast4: string;
    nextBillingDate: Date;
  }
): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Payment Received</h1>
    <p style="${emailStyles.p}">Thanks for your payment. Here's your receipt.</p>

    <div style="${emailStyles.highlightBox}">
      <div style="text-align: center; margin-bottom: 16px;">
        <div style="font-size: 36px; font-weight: 700; letter-spacing: -0.02em;">$${payment.amount.toFixed(2)}</div>
        <div style="font-size: 13px; color: rgba(0,0,0,0.5);">${payment.planName}</div>
      </div>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Date</span>
        <span style="${emailStyles.infoValue}">${payment.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Invoice</span>
        <span style="${emailStyles.infoValue}">#${payment.invoiceId}</span>
      </div>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Card</span>
        <span style="${emailStyles.infoValue}">&bull;&bull;&bull;&bull; ${payment.cardLast4}</span>
      </div>
      <div style="${emailStyles.infoRow}; border-bottom: none;">
        <span style="${emailStyles.infoLabel}">Next billing</span>
        <span style="${emailStyles.infoValue}">${payment.nextBillingDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>

    <a href="${BASE_URL}/settings/billing" style="${emailStyles.btn}">Download Invoice (PDF) &rarr;</a>
    ${footerHtml('Best regards,', [{ label: 'Manage Subscription', url: `${BASE_URL}/settings/billing` }, { label: 'Billing History', url: `${BASE_URL}/settings/billing` }])}
  `;

  return sendBrevoEmail({ to: userEmail, subject: `Payment Receipt - $${payment.amount.toFixed(2)}`, htmlContent });
}

// 6. Payment Failed (Dunning)
export async function sendPaymentFailed(
  userEmail: string,
  payment: {
    amount: number;
    planName: string;
    cardLast4: string;
    retryDate: Date;
  }
): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Payment Failed</h1>
    <p style="${emailStyles.p}">We couldn't process your payment of <strong>$${payment.amount.toFixed(2)}</strong> for your ${payment.planName} subscription.</p>

    <div style="${emailStyles.highlightBoxDanger}">
      <p style="margin: 0; font-size: 13px;"><strong>Action required.</strong> Please update your payment method within 3 days to avoid service interruption.</p>
    </div>

    <div style="${emailStyles.highlightBox}">
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Amount</span>
        <span style="${emailStyles.infoValue}">$${payment.amount.toFixed(2)}</span>
      </div>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Card</span>
        <span style="${emailStyles.infoValue}">&bull;&bull;&bull;&bull; ${payment.cardLast4} (Declined)</span>
      </div>
      <div style="${emailStyles.infoRow}; border-bottom: none;">
        <span style="${emailStyles.infoLabel}">Retry date</span>
        <span style="${emailStyles.infoValue}">${payment.retryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>

    <a href="${BASE_URL}/settings/billing" style="${emailStyles.btnDanger}">Update Payment Method &rarr;</a>
    ${footerHtml('Questions? Reply to this email.')}
  `;

  return sendBrevoEmail({ to: userEmail, subject: 'Payment Failed - Action Required', htmlContent, replyTo: 'support@pitchchat.ai' });
}

// 7. Trial Expiring
export async function sendTrialExpiring(
  userEmail: string,
  userName: string,
  expiryDate: Date,
  trialProgress: {
    projectsCreated: number;
    documentsUploaded: number;
    linksGenerated: number;
    conversations: number;
  }
): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Your Trial Ends in 3 Days</h1>
    <p style="${emailStyles.p}">Hi ${userName}, your free trial of PitchChat Pro expires on <strong>${expiryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.</p>

    <div style="${emailStyles.highlightBox}">
      <h2 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">Your Trial Progress</h2>
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px;">
        <span style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 11px;">&#10003;</span>
        Created ${trialProgress.projectsCreated} projects
      </div>
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px;">
        <span style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 11px;">&#10003;</span>
        Uploaded ${trialProgress.documentsUploaded} documents
      </div>
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px;">
        <span style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 11px;">&#10003;</span>
        Generated ${trialProgress.linksGenerated} shareable links
      </div>
      <div style="padding: 8px 0; display: flex; align-items: center; gap: 10px;">
        <span style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 11px;">&#10003;</span>
        ${trialProgress.conversations} investor conversations
      </div>
    </div>

    <p style="${emailStyles.p}">Upgrade now to keep your pitch rooms active and continue capturing investor interest.</p>

    <a href="${BASE_URL}/settings/billing" style="${emailStyles.btn}">Upgrade to Pro &mdash; $29/mo &rarr;</a>
    ${footerHtml()}
  `;

  return sendBrevoEmail({ to: userEmail, subject: 'Your PitchChat Trial Ends in 3 Days', htmlContent });
}

// 8. Subscription Canceled
export async function sendSubscriptionCanceled(userEmail: string, accessUntil: Date): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Subscription Canceled</h1>
    <p style="${emailStyles.p}">Your PitchChat Pro subscription has been canceled as requested.</p>

    <div style="${emailStyles.highlightBoxInfo}">
      <p style="margin: 0; font-size: 13px;"><strong>Access until ${accessUntil.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</strong> You'll retain Pro features until your current billing period ends.</p>
    </div>

    <div style="${emailStyles.highlightBox}">
      <h2 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">What happens next</h2>
      <ul style="margin: 12px 0 0 0; padding-left: 16px; font-size: 14px; color: rgba(0,0,0,0.65);">
        <li style="margin-bottom: 8px;">Your data remains safe and accessible</li>
        <li style="margin-bottom: 8px;">Links will become inactive after expiry</li>
        <li>You can reactivate anytime</li>
      </ul>
    </div>

    <p style="${emailStyles.p}">Changed your mind?</p>
    <a href="${BASE_URL}/settings/billing" style="${emailStyles.btn}">Reactivate Subscription &rarr;</a>
    ${footerHtml("We'd love your feedback.")}
  `;

  return sendBrevoEmail({ to: userEmail, subject: 'Your PitchChat Subscription Has Been Canceled', htmlContent });
}

// ============================================
// INVESTOR ENGAGEMENT EMAILS
// ============================================

// 9. Investor Engagement Alert
export async function sendInvestorEngagementAlert(
  userEmail: string,
  projectName: string,
  investorEmail: string,
  conversationId: string
): Promise<boolean> {
  const now = new Date();
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">New Investor Engagement</h1>
    <p style="${emailStyles.p}">An investor started chatting with your pitch room for <strong>${projectName}</strong>.</p>

    <div style="${emailStyles.highlightBox}">
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Investor</span>
        <span style="${emailStyles.infoValue}">${investorEmail}</span>
      </div>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Project</span>
        <span style="${emailStyles.infoValue}">${projectName}</span>
      </div>
      <div style="${emailStyles.infoRow}; border-bottom: none;">
        <span style="${emailStyles.infoLabel}">Time</span>
        <span style="${emailStyles.infoValue}">${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
      </div>
    </div>

    <a href="${BASE_URL}/conversations" style="${emailStyles.btn}">View Conversation &rarr;</a>
    ${footerHtml('Best regards,', [{ label: 'Notification Settings', url: `${BASE_URL}/settings` }])}
  `;

  return sendBrevoEmail({ to: userEmail, subject: `New investor engagement on ${projectName}`, htmlContent });
}

// 10. Founder Contact Alert
export async function sendFounderContactAlert(
  userEmail: string,
  projectName: string,
  conversationId: string,
  contactDetails: {
    email: string;
    name?: string;
    phone?: string;
    company?: string;
    website?: string;
  }
): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Investor Shared Contact</h1>
    <p style="${emailStyles.p}">Great news! An investor shared their details for <strong>${projectName}</strong>.</p>

    <div style="${emailStyles.highlightBoxDark}">
      <h2 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0; color: white;">Contact Information</h2>
      <div style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 14px; display: flex;">
        <span style="min-width: 100px; color: rgba(255,255,255,0.5); font-weight: 500;">Email</span>
        <span style="color: white; font-weight: 500;">${contactDetails.email}</span>
      </div>
      ${contactDetails.name ? `<div style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 14px; display: flex;">
        <span style="min-width: 100px; color: rgba(255,255,255,0.5); font-weight: 500;">Name</span>
        <span style="color: white; font-weight: 500;">${contactDetails.name}</span>
      </div>` : ''}
      ${contactDetails.phone ? `<div style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 14px; display: flex;">
        <span style="min-width: 100px; color: rgba(255,255,255,0.5); font-weight: 500;">Phone</span>
        <span style="color: white; font-weight: 500;">${contactDetails.phone}</span>
      </div>` : ''}
      ${contactDetails.company ? `<div style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 14px; display: flex;">
        <span style="min-width: 100px; color: rgba(255,255,255,0.5); font-weight: 500;">Company</span>
        <span style="color: white; font-weight: 500;">${contactDetails.company}</span>
      </div>` : ''}
      ${contactDetails.website ? `<div style="padding: 10px 0; font-size: 14px; display: flex;">
        <span style="min-width: 100px; color: rgba(255,255,255,0.5); font-weight: 500;">Website</span>
        <span style="color: white; font-weight: 500;">${contactDetails.website}</span>
      </div>` : ''}
    </div>

    <p style="${emailStyles.p}"><strong>Tip:</strong> Review conversation history before reaching out.</p>

    <a href="${BASE_URL}/conversations" style="${emailStyles.btn}">View Full Conversation &rarr;</a>
    ${footerHtml('Good luck!')}
  `;

  return sendBrevoEmail({
    to: userEmail,
    subject: `Investor Contact: ${contactDetails.company || contactDetails.name || contactDetails.email} - ${projectName}`,
    htmlContent
  });
}

// 11. Investor Contact Email (sent to investor)
export async function sendInvestorContactEmail(
  investorEmail: string,
  projectName: string,
  linkSlug: string,
  contactDetails: {
    name?: string;
    phone?: string;
    company?: string;
    website?: string;
  }
): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Contact Details Shared</h1>
    <p style="${emailStyles.p}">Your contact information for <strong>${projectName}</strong> has been shared with the team.</p>

    <div style="${emailStyles.highlightBoxSuccess}">
      <p style="margin: 0; font-size: 13px;"><strong>The team has been notified.</strong> Expect to hear back within 1-2 business days.</p>
    </div>

    <div style="${emailStyles.highlightBox}">
      <h2 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">Details You Shared</h2>
      ${contactDetails.name ? `<div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Name</span>
        <span style="${emailStyles.infoValue}">${contactDetails.name}</span>
      </div>` : ''}
      ${contactDetails.company ? `<div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Company</span>
        <span style="${emailStyles.infoValue}">${contactDetails.company}</span>
      </div>` : ''}
      ${contactDetails.phone ? `<div style="${emailStyles.infoRow}; border-bottom: none;">
        <span style="${emailStyles.infoLabel}">Phone</span>
        <span style="${emailStyles.infoValue}">${contactDetails.phone}</span>
      </div>` : ''}
    </div>

    <a href="${BASE_URL}/chat/${linkSlug}" style="${emailStyles.btn}">Continue Conversation &rarr;</a>
    ${footerHtml()}
  `;

  return sendBrevoEmail({ to: investorEmail, subject: `Contact details received - ${projectName}`, htmlContent });
}

// ============================================
// ACTIVITY & USAGE EMAILS
// ============================================

// 12. Weekly Report
export async function sendWeeklyReport(
  userEmail: string,
  analytics: {
    totalQuestions: number;
    activeLinks: number;
    monthlyCost: number;
    weeklyConversations: number;
    topPerformingProject?: string;
    conversationChange?: number;
    questionChange?: number;
  }
): Promise<boolean> {
  const convChange = analytics.conversationChange ?? 0;
  const qChange = analytics.questionChange ?? 0;

  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Your Weekly Report</h1>
    <p style="${emailStyles.p}">Here's how your pitch rooms performed this week.</p>

    <div style="${emailStyles.highlightBoxDark}">
      <h2 style="font-size: 15px; font-weight: 600; margin: 0 0 16px 0; color: white;">This Week's Highlights</h2>
      <div style="display: flex; text-align: center;">
        <div style="flex: 1;">
          <div style="font-size: 32px; font-weight: 700; letter-spacing: -0.02em; color: white;">${analytics.weeklyConversations}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px;">New Conversations</div>
          ${convChange !== 0 ? `<div style="font-size: 11px; color: ${convChange > 0 ? '#22c55e' : '#ef4444'}; margin-top: 4px;">${convChange > 0 ? '↑' : '↓'} ${Math.abs(convChange)}% vs last week</div>` : ''}
        </div>
        <div style="flex: 1;">
          <div style="font-size: 32px; font-weight: 700; letter-spacing: -0.02em; color: white;">${analytics.totalQuestions}</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px;">Questions Asked</div>
          ${qChange !== 0 ? `<div style="font-size: 11px; color: ${qChange > 0 ? '#22c55e' : '#ef4444'}; margin-top: 4px;">${qChange > 0 ? '↑' : '↓'} ${Math.abs(qChange)}% vs last week</div>` : ''}
        </div>
      </div>
    </div>

    <div style="${emailStyles.highlightBox}">
      <h2 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">Platform Statistics</h2>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Active Links</span>
        <span style="${emailStyles.infoValue}">${analytics.activeLinks}</span>
      </div>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Monthly Cost</span>
        <span style="${emailStyles.infoValue}">$${analytics.monthlyCost.toFixed(2)}</span>
      </div>
      ${analytics.topPerformingProject ? `<div style="${emailStyles.infoRow}; border-bottom: none;">
        <span style="${emailStyles.infoLabel}">Top Project</span>
        <span style="${emailStyles.infoValue}">${analytics.topPerformingProject}</span>
      </div>` : ''}
    </div>

    <a href="${BASE_URL}/analytics" style="${emailStyles.btn}">View Full Analytics &rarr;</a>
    ${footerHtml('Keep up the great work!', [{ label: 'Unsubscribe from weekly reports', url: `${BASE_URL}/settings` }])}
  `;

  return sendBrevoEmail({ to: userEmail, subject: `Your Weekly PitchChat Report - ${analytics.weeklyConversations} New Conversations`, htmlContent });
}

// 13. Document Processed
export async function sendDocumentProcessed(
  userEmail: string,
  document: {
    fileName: string;
    projectName: string;
    pagesProcessed: number;
    tokensUsed: number;
    projectId: string;
  }
): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Document Ready</h1>
    <p style="${emailStyles.p}">Your document has been processed and is now ready for investor Q&A.</p>

    <div style="${emailStyles.highlightBoxSuccess}">
      <p style="margin: 0; font-size: 13px;"><strong>AI training complete.</strong> Your pitch room can now answer questions about this document.</p>
    </div>

    <div style="${emailStyles.highlightBox}">
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Document</span>
        <span style="${emailStyles.infoValue}">${document.fileName}</span>
      </div>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Project</span>
        <span style="${emailStyles.infoValue}">${document.projectName}</span>
      </div>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Pages</span>
        <span style="${emailStyles.infoValue}">${document.pagesProcessed} pages processed</span>
      </div>
      <div style="${emailStyles.infoRow}; border-bottom: none;">
        <span style="${emailStyles.infoLabel}">Tokens</span>
        <span style="${emailStyles.infoValue}">${document.tokensUsed.toLocaleString()} tokens used</span>
      </div>
    </div>

    <a href="${BASE_URL}/documents/${document.projectId}" style="${emailStyles.btn}">View Project &rarr;</a>
    ${footerHtml()}
  `;

  return sendBrevoEmail({ to: userEmail, subject: `Document processed: ${document.fileName}`, htmlContent });
}

// 14. Usage Limit Warning
export async function sendUsageLimitWarning(
  userEmail: string,
  usage: {
    currentUsage: number;
    limit: number;
    percentUsed: number;
    planName: string;
    resetDate: Date;
  }
): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Approaching Usage Limit</h1>
    <p style="${emailStyles.p}">You've used ${usage.percentUsed}% of your monthly token allowance.</p>

    <div style="${emailStyles.highlightBox}">
      <h2 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">Current Usage</h2>
      <div style="margin: 16px 0;">
        <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
          <span>${usage.currentUsage.toLocaleString()} / ${usage.limit.toLocaleString()} tokens</span>
          <span style="font-weight: 600;">${usage.percentUsed}%</span>
        </div>
        <div style="background: rgba(0,0,0,0.08); border-radius: 4px; height: 8px; overflow: hidden;">
          <div style="background: ${usage.percentUsed >= 90 ? '#ef4444' : '#f59e0b'}; height: 100%; width: ${usage.percentUsed}%; border-radius: 4px;"></div>
        </div>
      </div>
      <div style="${emailStyles.infoRow}">
        <span style="${emailStyles.infoLabel}">Plan</span>
        <span style="${emailStyles.infoValue}">${usage.planName}</span>
      </div>
      <div style="${emailStyles.infoRow}; border-bottom: none;">
        <span style="${emailStyles.infoLabel}">Resets</span>
        <span style="${emailStyles.infoValue}">${usage.resetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>
    </div>

    <p style="${emailStyles.p}">Upgrade your plan to ensure uninterrupted service for your investors.</p>

    <a href="${BASE_URL}/settings/billing" style="${emailStyles.btn}">Upgrade Plan &rarr;</a>
    <a href="${BASE_URL}/analytics" style="${emailStyles.btnOutline}; margin-left: 8px;">View Usage</a>
    ${footerHtml()}
  `;

  return sendBrevoEmail({ to: userEmail, subject: `Usage Alert: ${usage.percentUsed}% of monthly tokens used`, htmlContent });
}

// 15. Account Deletion
export async function sendAccountDeletionEmail(userEmail: string): Promise<boolean> {
  const htmlContent = `
    ${logoHtml}
    <h1 style="${emailStyles.h1}">Account Deleted</h1>
    <p style="${emailStyles.p}">Your PitchChat account has been permanently deleted.</p>

    <div style="${emailStyles.highlightBox}">
      <h2 style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0;">What's Been Removed</h2>
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px; font-size: 14px;">
        <span style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 11px;">&#10003;</span>
        All projects and documents
      </div>
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px; font-size: 14px;">
        <span style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 11px;">&#10003;</span>
        Conversation history
      </div>
      <div style="padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; gap: 10px; font-size: 14px;">
        <span style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 11px;">&#10003;</span>
        Shareable links (now inactive)
      </div>
      <div style="padding: 8px 0; display: flex; align-items: center; gap: 10px; font-size: 14px;">
        <span style="width: 20px; height: 20px; background: #22c55e; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 11px;">&#10003;</span>
        Account data and settings
      </div>
    </div>

    <div style="${emailStyles.highlightBoxInfo}">
      <p style="margin: 0; font-size: 13px;"><strong>Data retention:</strong> Per our privacy policy, anonymized analytics may be retained for 30 days.</p>
    </div>

    <p style="${emailStyles.p}">We're sorry to see you go. You're always welcome back.</p>

    <a href="${BASE_URL}" style="${emailStyles.btn}">Visit PitchChat &rarr;</a>
    ${footerHtml('Best wishes,')}
  `;

  return sendBrevoEmail({ to: userEmail, subject: 'Your PitchChat Account Has Been Deleted', htmlContent });
}
