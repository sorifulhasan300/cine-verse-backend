import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { envVars } from "../../../config/config";
import { env } from "node:process";

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as any,
});

const createCheckoutSession = async (
  userId: string,
  plan: "MONTHLY" | "YEARLY",
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found!");

  const priceId =
    plan === "MONTHLY"
      ? envVars.MONTHLY_PLAN_PRICE_ID
      : envVars.YEARLY_PLAN_PRICE_ID;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${envVars.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.CLIENT_URL}/payment/cancel`,
    metadata: {
      userId: userId,
      plan: plan,
    },
  });

  return session.url;
};

const handleWebhook = async (event: any) => {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan as "MONTHLY" | "YEARLY";
    const stripeSubscriptionId = session.subscription as string;
    const stripeCustomerId = session.customer as string;

    const subscription =
      await stripe.subscriptions.retrieve(stripeSubscriptionId);

    await prisma.subscription.upsert({
      where: { userId: userId },
      update: {
        stripeSubscriptionId,
        stripeCustomerId,
        plan,
        status: "ACTIVE",
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
      create: {
        userId: userId!,
        stripeSubscriptionId,
        stripeCustomerId,
        plan,
        status: "ACTIVE",
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    });
  }
};

export const SubscriptionService = {
  createCheckoutSession,
  handleWebhook,
};
