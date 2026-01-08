import { Router } from 'express';
import { isAuthenticated } from '../customAuth';
import { storage } from '../storage';
import {
  sendBrevoEmail,
  sendInvestorEngagementAlert,
  sendInvestorContactEmail,
  sendFounderContactAlert,
  sendWeeklyReport,
} from '../brevo';
import { redactLogPayload } from '../utils/redact';

const router = Router();

/**
 * Send investor engagement notification
 * POST /api/email/investor-engagement
 * Internal endpoint - requires internal API key or authenticated user
 */
router.post('/investor-engagement', async (req, res) => {
  try {
    console.log('Email request:', redactLogPayload({ body: req.body, headers: req.headers }));
    // Check for internal API key (for server-to-server calls)
    const internalKey = req.headers['x-internal-key'];
    const expectedKey = process.env.INTERNAL_API_KEY;

    if (!internalKey || internalKey !== expectedKey) {
      return res.status(401).json({ message: 'Unauthorized - internal API key required' });
    }

    const { conversationId, projectName, investorEmail, messageCount } = req.body;

    const userId = await storage.getUserIdFromConversation(conversationId);
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = await storage.getUserById(userId);
    if (!user?.emailAlerts) {
      return res.json({ sent: false, reason: 'Email alerts disabled' });
    }

    // Send email notification
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #000;">New Investor Engagement! 🎉</h2>
        <p>An investor just started a conversation with your pitch for <strong>${projectName}</strong>.</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Investor Email:</strong> ${investorEmail}</p>
          <p style="margin: 10px 0 0 0;"><strong>Messages Sent:</strong> ${messageCount}</p>
        </div>
        <p>Log in to your PitchChat dashboard to view the full conversation and respond to any questions.</p>
        <a href="${process.env.REPLIT_DOMAINS || 'https://pitchchat.replit.app'}" style="display: inline-block; background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">View Conversation</a>
      </div>
    `;

    console.log(`Sending investor engagement email to ${user.email}`);

    res.json({ sent: true, recipient: user.email });
  } catch (error) {
    console.error('Error sending investor engagement email:', error);
    res.status(500).json({ message: 'Failed to send email notification' });
  }
});

/**
 * Send weekly report
 * POST /api/email/weekly-report
 * Internal endpoint - requires internal API key (for cron jobs)
 */
router.post('/weekly-report', async (req, res) => {
  try {
    console.log('Email request:', redactLogPayload({ body: req.body, headers: req.headers }));
    // Check for internal API key (for cron job calls)
    const internalKey = req.headers['x-internal-key'];
    const expectedKey = process.env.INTERNAL_API_KEY;

    if (!internalKey || internalKey !== expectedKey) {
      return res.status(401).json({ message: 'Unauthorized - internal API key required' });
    }

    const { userId } = req.body;

    const user = await storage.getUserById(userId);
    if (!user?.weeklyReports) {
      return res.json({ sent: false, reason: 'Weekly reports disabled' });
    }

    const analytics = await storage.getDetailedAnalytics(userId);
    const projects = await storage.getUserProjects(userId);

    // Send weekly report using Brevo
    const success = await sendWeeklyReport(user.email, {
      totalQuestions: analytics.overview.totalConversations,
      activeLinks: analytics.overview.activeLinks,
      monthlyCost: analytics.overview.totalCost,
      weeklyConversations: analytics.overview.totalConversations,
      topPerformingProject: analytics.projectBreakdown[0]?.projectName,
    });

    if (success) {
      res.json({ sent: true, recipient: user.email, reportDate: new Date() });
    } else {
      res.status(500).json({ message: 'Failed to send weekly report' });
    }
  } catch (error) {
    console.error('Error sending weekly report:', error);
    res.status(500).json({ message: 'Failed to send weekly report' });
  }
});

/**
 * Simple email test endpoint
 * POST /api/email/test-simple
 */
router.post('/test-simple', isAuthenticated, async (req: any, res) => {
  try {
    console.log('Email request:', redactLogPayload({ body: req.body, userId: req.user?.id }));
    const userId = req.user.id;
    const user = await storage.getUser(userId);

    if (!user?.email) {
      return res.status(400).json({ message: 'No email address found for user' });
    }

    console.log('=== SIMPLE EMAIL TEST ===');
    console.log('Sending to:', user.email);
    console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);

    const testHtml = `
      <html>
        <body>
          <h1>Test Email from PitchChat</h1>
          <p>This is a simple test email to verify Brevo integration is working.</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </body>
      </html>
    `;

    const result = await sendBrevoEmail({
      to: user.email,
      subject: 'Test Email - PitchChat',
      htmlContent: testHtml,
    });

    console.log('Email send result:', result);
    console.log('=== END EMAIL TEST ===');

    res.json({
      success: result,
      sentTo: user.email,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Simple email test error:', error);
    res.status(500).json({
      message: 'Failed to send test email',
    });
  }
});

/**
 * Test all email types
 * POST /api/email/test-all
 */
router.post('/test-all', isAuthenticated, async (req: any, res) => {
  try {
    console.log('Email request:', redactLogPayload({ body: req.body, userId: req.user?.id }));
    const userId = req.user.id;
    const user = await storage.getUser(userId);

    if (!user?.email) {
      return res.status(400).json({ message: 'No email address found for user' });
    }

    const projects = await storage.getUserProjects(userId);
    const testProject = projects[0] || { name: 'Test Project', id: 'test-project-id' };

    const analytics = await storage.getDetailedAnalytics(userId);

    const emailsSent: string[] = [];

    console.log('Sending test emails to:', user.email);

    // 1. Send investor engagement alert
    try {
      const success = await sendInvestorEngagementAlert(
        user.email,
        testProject.name,
        'investor@example.com',
        'test-conversation-id'
      );
      if (success) {
        emailsSent.push('Investor engagement alert');
        console.log('✓ Sent investor engagement alert');
      } else {
        console.error('Failed to send investor engagement alert - returned false');
      }
    } catch (error) {
      console.error('Failed to send investor engagement alert - exception:', error);
    }

    // 2. Send investor contact email
    try {
      const success = await sendInvestorContactEmail(user.email, testProject.name, 'test-link-slug', {
        name: 'John Smith',
        phone: '+1 555-123-4567',
        company: 'Venture Capital Inc.',
        website: 'https://example.vc',
      });
      if (success) {
        emailsSent.push('Investor contact confirmation');
        console.log('✓ Sent investor contact confirmation');
      } else {
        console.error('Failed to send investor contact email - returned false');
      }
    } catch (error) {
      console.error('Failed to send investor contact email - exception:', error);
    }

    // 3. Send founder contact alert
    try {
      const success = await sendFounderContactAlert(user.email, testProject.name, 'test-conversation-id', {
        email: 'investor@example.com',
        name: 'Jane Doe',
        phone: '+1 555-987-6543',
        company: 'Innovation Partners',
        website: 'https://innovationpartners.com',
      });
      if (success) {
        emailsSent.push('Founder contact alert');
        console.log('✓ Sent founder contact alert');
      } else {
        console.error('Failed to send founder contact alert - returned false');
      }
    } catch (error) {
      console.error('Failed to send founder contact alert - exception:', error);
    }

    // 4. Send weekly report
    try {
      const success = await sendWeeklyReport(user.email, {
        totalQuestions: analytics.summary?.totalConversations || 10,
        activeLinks: analytics.charts?.linkPerformance?.length || 5,
        monthlyCost: analytics.summary?.totalCost || 5.0,
        weeklyConversations: 5,
        topPerformingProject: testProject.name,
      });
      if (success) {
        emailsSent.push('Weekly report');
        console.log('✓ Sent weekly report');
      } else {
        console.error('Failed to send weekly report - returned false');
      }
    } catch (error) {
      console.error('Failed to send weekly report - exception:', error);
    }

    res.json({
      message: 'Test emails sent',
      emailsSent,
      sentTo: user.email,
      totalSent: emailsSent.length,
    });
  } catch (error: unknown) {
    console.error('Error sending test emails:', error);
    res.status(500).json({ message: 'Failed to send test emails' });
  }
});

export default router;
