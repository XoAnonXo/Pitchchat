// Simple Brevo API implementation using fetch
interface EmailParams {
  to: string;
  subject: string;
  htmlContent: string;
  senderName?: string;
  senderEmail?: string;
}

export async function sendBrevoEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY environment variable must be set");
  }

  const emailData = {
    sender: {
      name: params.senderName || "PitchChat Builder",
      email: params.senderEmail || "noreply@pitchchat.ai"
    },
    to: [{
      email: params.to,
      name: params.to.split('@')[0]
    }],
    subject: params.subject,
    htmlContent: params.htmlContent
  };

  try {
    console.log('Sending email via Brevo API:', {
      to: params.to,
      subject: params.subject,
      apiKeyPrefix: process.env.BREVO_API_KEY.substring(0, 10) + '...'
    });

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Email sent successfully:', result);
      return true;
    } else {
      console.error('Brevo API error:', response.status, result);
      return false;
    }
  } catch (error) {
    console.error('Failed to send email:', error);
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
          <h2 style="color: #000;">New Investor Engagement!</h2>
          
          <p>Great news! An investor has started engaging with your pitch room for <strong>${projectName}</strong>.</p>
          
          <div style="background: #f8fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Investor Email:</strong> ${investorEmail}</p>
            <p><strong>Project:</strong> ${projectName}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p>The investor is now chatting with your AI assistant. You can view the full conversation and any contact details they provide in your dashboard.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pitchchat.ai/conversations" 
               style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
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
    subject: `New investor engagement on ${projectName}`,
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
          <h2 style="color: #000;">Your Weekly PitchChat Report</h2>
          
          <p>Here's your weekly summary of investor engagement and platform activity.</p>
          
          <div style="background: linear-gradient(135deg, #000 0%, #333 100%); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
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
            <a href="https://pitchchat.ai/analytics" 
               style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">
              View Full Analytics
            </a>
            <a href="https://pitchchat.ai/conversations" 
               style="background: transparent; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; border: 2px solid #000;">
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
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #000;">Contact Details Shared Successfully</h2>
          
          <p>Thank you for your interest in <strong>${projectName}</strong>. Your contact information has been shared with the team.</p>
          
          <div style="background: #f8fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1A1A26;">Your Shared Details:</h3>
            ${contactDetails.name ? `<p><strong>Name:</strong> ${contactDetails.name}</p>` : ''}
            ${contactDetails.phone ? `<p><strong>Phone:</strong> ${contactDetails.phone}</p>` : ''}
            ${contactDetails.company ? `<p><strong>Company:</strong> ${contactDetails.company}</p>` : ''}
            ${contactDetails.website ? `<p><strong>Website:</strong> ${contactDetails.website}</p>` : ''}
          </div>
          
          <p>The team has been notified and will reach out to you soon. In the meantime, feel free to continue exploring the pitch room.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pitchchat.ai/share/${linkSlug}" 
               style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Continue Conversation
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
    to: investorEmail,
    subject: `Contact details received - ${projectName}`,
    htmlContent,
  });
}

export async function sendFounderContactAlert(
  founderEmail: string,
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
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #000;">🎉 Investor Shared Contact Details!</h2>
          
          <p>Excellent news! An investor has shared their contact information for <strong>${projectName}</strong>.</p>
          
          <div style="background: #f8fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1A1A26;">Contact Information:</h3>
            <p><strong>Email:</strong> ${contactDetails.email}</p>
            ${contactDetails.name ? `<p><strong>Name:</strong> ${contactDetails.name}</p>` : ''}
            ${contactDetails.phone ? `<p><strong>Phone:</strong> ${contactDetails.phone}</p>` : ''}
            ${contactDetails.company ? `<p><strong>Company:</strong> ${contactDetails.company}</p>` : ''}
            ${contactDetails.website ? `<p><strong>Website:</strong> ${contactDetails.website}</p>` : ''}
          </div>
          
          <p><strong>Pro tip:</strong> Review the conversation history before reaching out to understand their interests and questions.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://pitchchat.ai/conversations" 
               style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Full Conversation
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Good luck with your follow-up!<br>
            The PitchChat Builder Team
          </p>
        </div>
      </body>
    </html>
  `;

  return await sendBrevoEmail({
    to: founderEmail,
    subject: `🎯 Investor Contact: ${contactDetails.company || contactDetails.email} - ${projectName}`,
    htmlContent,
  });
}

