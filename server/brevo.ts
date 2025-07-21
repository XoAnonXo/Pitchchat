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