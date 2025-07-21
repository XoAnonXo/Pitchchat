import * as SibApiV3Sdk from '@sendinblue/client';

if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY environment variable must be set");
}

// Initialize the API client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  senderName?: string;
  senderEmail?: string;
}

export async function sendBrevoEmail(params: EmailParams): Promise<boolean> {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    
    sendSmtpEmail.subject = params.subject;
    sendSmtpEmail.htmlContent = params.htmlContent;
    sendSmtpEmail.sender = {
      name: params.senderName || "PitchChat Builder",
      email: params.senderEmail || "noreply@pitchchat.app"
    };
    sendSmtpEmail.to = [
      {
        email: params.to,
        name: params.to.split('@')[0]
      }
    ];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Brevo email sent successfully:', result.response?.statusCode);
    return true;
  } catch (error) {
    console.error('Brevo email error:', error);
    return false;
  }
}

export async function sendInvestorEngagementAlert(
  userEmail: string,
  projectName: string,
  investorEmail: string,
  conversationId: string
): Promise<boolean> {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2152FF;">New Investor Engagement!</h2>
          
          <p>Great news! An investor has started engaging with your pitch room for <strong>${projectName}</strong>.</p>
          
          <div style="background: #f8fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Investor Email:</strong> ${investorEmail}</p>
            <p><strong>Project:</strong> ${projectName}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>The investor is now chatting with your AI assistant. You can view the full conversation and any contact details they provide in your dashboard.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pitchchat.app/conversations" 
               style="background: #2152FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Conversation
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The PitchChat Builder Team
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendBrevoEmail({
    to: userEmail,
    subject: `🚀 New Investor Engagement - ${projectName}`,
    htmlContent,
  });
}

export async function sendWeeklyReport(
  userEmail: string,
  analytics: {
    totalQuestions: number;
    activeLinks: number;
    monthlyCost: number;
    weeklyConversations: number;
    topPerformingProject?: string;
  }
): Promise<boolean> {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2152FF;">Your Weekly PitchChat Report</h2>
          
          <p>Here's your weekly summary of investor engagement and platform activity.</p>
          
          <div style="background: linear-gradient(135deg, #2152FF 0%, #5C8AF7 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0;">This Week's Highlights</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <div style="font-size: 24px; font-weight: bold;">${analytics.weeklyConversations}</div>
                <div style="opacity: 0.9;">New Conversations</div>
              </div>
              <div>
                <div style="font-size: 24px; font-weight: bold;">${analytics.totalQuestions}</div>
                <div style="opacity: 0.9;">Total Questions Asked</div>
              </div>
            </div>
          </div>
          
          <div style="background: #f8fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1A1A26;">Platform Statistics</h3>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid #e0e3eb;">
                <strong>Active Links:</strong> ${analytics.activeLinks}
              </li>
              <li style="padding: 8px 0; border-bottom: 1px solid #e0e3eb;">
                <strong>Monthly Usage Cost:</strong> $${analytics.monthlyCost.toFixed(2)}
              </li>
              ${analytics.topPerformingProject ? `
              <li style="padding: 8px 0;">
                <strong>Top Performing Project:</strong> ${analytics.topPerformingProject}
              </li>
              ` : ''}
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pitchchat.app/analytics" 
               style="background: #2152FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              View Full Analytics
            </a>
            <a href="https://pitchchat.app/conversations" 
               style="background: transparent; color: #2152FF; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; border: 2px solid #2152FF;">
              View Conversations
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Keep up the great work! Your AI-powered pitch rooms are making impressive connections with investors.
          </p>
          
          <p style="color: #666; font-size: 14px;">
            Best regards,<br>
            The PitchChat Builder Team
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendBrevoEmail({
    to: userEmail,
    subject: `📊 Your Weekly PitchChat Report - ${analytics.weeklyConversations} New Conversations`,
    htmlContent,
  });
}

export async function sendPasswordResetEmail(
  userEmail: string,
  resetToken: string
): Promise<boolean> {
  const resetLink = `${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'http://localhost:5000'}/reset-password/${resetToken}`;
  
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2152FF;">Reset Your Password</h2>
          
          <p>You requested to reset your password for your PitchChat Builder account.</p>
          
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you didn't request this, please ignore this email. Your password won't be changed.
          </p>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetLink}" style="color: #2152FF; word-break: break-all;">${resetLink}</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            The PitchChat Builder Team
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendBrevoEmail({
    to: userEmail,
    subject: 'Reset Your PitchChat Password',
    htmlContent,
  });
}

export async function sendWelcomeEmail(
  userEmail: string,
  userName?: string
): Promise<boolean> {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2152FF;">Welcome to PitchChat Builder! 🎉</h2>
          
          <p>Hi${userName ? ` ${userName}` : ''},</p>
          
          <p>Thank you for joining PitchChat Builder! You're now ready to transform your startup documentation into engaging AI-powered pitch rooms.</p>
          
          <div style="background: #f8fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1A1A26;">Get Started in 3 Easy Steps:</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">
                <strong>Create Your First Project</strong><br>
                <span style="color: #666;">Upload your pitch deck, business plan, or any documents</span>
              </li>
              <li style="margin-bottom: 10px;">
                <strong>Generate a Shareable Link</strong><br>
                <span style="color: #666;">Create custom links for different investors</span>
              </li>
              <li style="margin-bottom: 10px;">
                <strong>Track Investor Engagement</strong><br>
                <span style="color: #666;">See what questions investors ask and how they interact</span>
              </li>
            </ol>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pitchchat.app" 
               style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          
          <div style="background: linear-gradient(135deg, #2152FF 0%, #5C8AF7 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">🎁 Welcome Bonus</h3>
            <p style="margin: 0;">You've been credited with <strong>1,000 free tokens</strong> to get started!</p>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Need help? Check out our documentation or reply to this email.<br><br>
            Best regards,<br>
            The PitchChat Builder Team
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendBrevoEmail({
    to: userEmail,
    subject: 'Welcome to PitchChat Builder!',
    htmlContent,
  });
}

export async function sendPasswordChangedEmail(
  userEmail: string
): Promise<boolean> {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2152FF;">Password Changed Successfully</h2>
          
          <p>This email confirms that your PitchChat Builder password has been changed.</p>
          
          <div style="background: #f8fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Changed on:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>If you did not make this change, please contact us immediately.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pitchchat.app/auth" 
               style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Sign In to Your Account
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            For security reasons, if you didn't change your password, please reset it immediately and contact support.<br><br>
            Best regards,<br>
            The PitchChat Builder Team
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendBrevoEmail({
    to: userEmail,
    subject: 'Your PitchChat Password Has Been Changed',
    htmlContent,
  });
}

export async function sendAccountDeletionEmail(
  userEmail: string
): Promise<boolean> {
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2152FF;">Account Deletion Confirmed</h2>
          
          <p>Your PitchChat Builder account has been successfully deleted.</p>
          
          <div style="background: #f8fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>What this means:</strong></p>
            <ul style="margin: 0; padding-left: 20px; color: #666;">
              <li>All your projects and documents have been removed</li>
              <li>Your shared pitch links are no longer accessible</li>
              <li>Your conversation history has been deleted</li>
              <li>This action cannot be undone</li>
            </ul>
          </div>
          
          <p>We're sorry to see you go. If you have any feedback about your experience, we'd love to hear from you.</p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Thank you for trying PitchChat Builder.<br><br>
            Best regards,<br>
            The PitchChat Builder Team
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendBrevoEmail({
    to: userEmail,
    subject: 'Your PitchChat Account Has Been Deleted',
    htmlContent,
  });
}