import { Router } from 'express';
import Stripe from 'stripe';
import { isAuthenticated } from '../customAuth';
import { storage } from '../storage';
import { SUBSCRIPTION_PRICING } from '../pricing';
import { sendPaymentReceipt, sendPaymentFailed, sendSubscriptionCanceled } from '../brevo';

const router = Router();

// Initialize Stripe lazily so only checkout/purchase require it
let stripeClient: Stripe | null = null;
const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });
  }
  return stripeClient;
};
const getBaseUrl = (req: any) => {
  const configuredBaseUrl = process.env.PRODUCTION_URL || process.env.PUBLIC_BASE_URL;
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, '');
  }

  const allowedHosts = (process.env.REPLIT_DOMAINS ?? '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);
  const host = req.get('host');
  const protocol = req.get('x-forwarded-proto') || 'https';

  if (host && allowedHosts.includes(host)) {
    return `${protocol}://${host}`;
  }

  return 'http://localhost:5000';
};

/**
 * Create a Stripe checkout session for subscription
 * POST /api/subscriptions/create-checkout
 */
router.post('/create-checkout', isAuthenticated, async (req: any, res) => {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(503).json({ message: 'Stripe is not configured' });
    }

    const { priceType } = req.body; // 'monthly' or 'annual'
    const user = req.user;

    const pricing = SUBSCRIPTION_PRICING[priceType as keyof typeof SUBSCRIPTION_PRICING];
    if (!pricing || priceType === 'oneTime') {
      return res.status(400).json({ message: 'Invalid subscription type' });
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;
      await storage.updateUserSubscription(user.id, { stripeCustomerId });
    }

    // Get the correct domain from request headers
    const baseUrl = getBaseUrl(req);

    console.log('Creating checkout with redirect URLs:', {
      success: `${baseUrl}/?subscription=success`,
      cancel: `${baseUrl}/settings?subscription=cancel`,
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: pricing.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId: user.id,
          isAnnual: priceType === 'annual' ? 'true' : 'false',
        },
      },
      success_url: `${baseUrl}/?subscription=success`,
      cancel_url: `${baseUrl}/settings?subscription=cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

/**
 * Cancel subscription at end of billing period
 * POST /api/subscriptions/cancel
 */
router.post('/cancel', isAuthenticated, async (req: any, res) => {
  try {
    const stripe = getStripeClient();
    if (!stripe) {
      return res.status(503).json({ message: 'Stripe is not configured' });
    }

    const user = req.user;

    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ message: 'No active subscription' });
    }

    // Cancel subscription at period end
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    }) as any;

    await storage.updateUserSubscription(user.id, {
      subscriptionStatus: 'canceled',
    });

    // Send subscription canceled email
    const accessUntil = new Date(subscription.current_period_end * 1000);
    sendSubscriptionCanceled(user.email, accessUntil).catch(err =>
      console.error('Failed to send subscription canceled email:', err)
    );

    res.json({
      message: 'Subscription will be canceled at the end of the billing period',
      endsAt: accessUntil,
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
});

/**
 * Stripe webhook handler
 * POST /api/stripe/webhook
 */
router.post('/webhook', async (req, res) => {
  const stripe = getStripeClient();
  if (!stripe) {
    return res.status(503).json({ message: 'Stripe is not configured' });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event;

  // If webhook secret is not configured, skip verification (development mode)
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({ message: 'Stripe webhook secret not configured' });
    }

    console.log('Warning: STRIPE_WEBHOOK_SECRET not configured, skipping webhook verification');
    event = req.body;
    res.json({ received: true, warning: 'Webhook not verified' });
    return;
  }

  try {
    const rawBody = (req as any).rawBody ?? req.body;
    if (!rawBody && process.env.NODE_ENV === 'production') {
      return res.status(400).json({ message: 'Missing raw webhook body' });
    }

    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const userId = session.subscription_metadata?.userId || session.customer_metadata?.userId;

        if (userId && session.subscription) {
          // Fetch subscription details
          const subscription = await stripe.subscriptions.retrieve(session.subscription) as any;
          const isAnnual = subscription.metadata.isAnnual === 'true';

          // Update user subscription
          await storage.updateUserSubscription(userId, {
            stripeSubscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            subscriptionIsAnnual: isAnnual,
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription) as any;
          const userId = subscription.metadata.userId;

          if (userId) {
            // Update subscription period end
            await storage.updateUserSubscription(userId, {
              subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              subscriptionStatus: subscription.status,
            });

            // Send payment receipt email
            const user = await storage.getUser(userId);
            if (user?.email) {
              const planName = subscription.items.data[0]?.price?.id === process.env.STRIPE_ANNUAL_PRICE_ID
                ? 'PitchChat Pro (Annual)'
                : 'PitchChat Pro (Monthly)';

              sendPaymentReceipt(user.email, {
                amount: invoice.amount_paid / 100,
                planName,
                date: new Date(invoice.created * 1000),
                invoiceId: invoice.id.slice(-8).toUpperCase(),
                cardLast4: invoice.payment_intent?.payment_method?.card?.last4 || '****',
                nextBillingDate: new Date(subscription.current_period_end * 1000),
              }).catch(err => console.error('Failed to send payment receipt:', err));
            }
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription) as any;
          const userId = subscription.metadata.userId;

          if (userId) {
            const user = await storage.getUser(userId);
            if (user?.email) {
              const planName = subscription.items.data[0]?.price?.id === process.env.STRIPE_ANNUAL_PRICE_ID
                ? 'PitchChat Pro (Annual)'
                : 'PitchChat Pro (Monthly)';

              // Retry in 3 days
              const retryDate = new Date();
              retryDate.setDate(retryDate.getDate() + 3);

              sendPaymentFailed(user.email, {
                amount: invoice.amount_due / 100,
                planName,
                cardLast4: invoice.payment_intent?.payment_method?.card?.last4 || '****',
                retryDate,
              }).catch(err => console.error('Failed to send payment failed email:', err));
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const userId = subscription.metadata.userId;

        if (userId) {
          await storage.updateUserSubscription(userId, {
            subscriptionStatus: subscription.status,
            subscriptionCurrentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : undefined,
          });
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ message: 'Webhook handler failed' });
  }
});

export default router;
