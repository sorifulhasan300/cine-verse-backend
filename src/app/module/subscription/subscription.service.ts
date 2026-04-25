import { envVars } from "../../../config/config";
import AppError from "../../utils/AppError";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import sendResponse from "../../utils/sendResponse";
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
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
  });
  if (activeSub) {
    throw new AppError(400, "You already have an active subscription!");
  }

  if (!user) throw new AppError(404, "User not found!");

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
    subscription_data: {
      metadata: {
        userId: userId,
        plan: plan,
      },
    },
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
  switch (event.type) {
    case "checkout.session.completed":
    case "customer.subscription.created": {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan as "MONTHLY" | "YEARLY";
      console.log("meta data and userid and plan", userId, plan);
      const stripeSubscriptionId = session.subscription || session.id;
      const stripeCustomerId = session.customer as string;

      if (!userId || !plan) {
        console.error("Missing userId or plan in metadata");
        return;
      }
      console.log("successfully pass from userId and plan");
      const subscription = (await stripe.subscriptions.retrieve(
        stripeSubscriptionId,
      )) as any;
      const periodEnd = new Date(subscription.current_period_end * 1000);
      console.log("successfully pass from subscription");

      const res = await prisma.subscription.upsert({
        where: { userId: userId },
        update: {
          stripeSubscriptionId,
          stripeCustomerId,
          plan,
          status: "ACTIVE",
          currentPeriodEnd: periodEnd,
        },
        create: {
          userId: userId,
          stripeSubscriptionId,
          stripeCustomerId,
          plan,
          status: "ACTIVE",
          currentPeriodEnd: periodEnd,
        },
      });
      console.log(
        "successfully pass from prisma.subscription.upsert and result is ",
        res,
      );

      try {
        console.log("Starting User table update for ID:", userId);

        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            plan: plan as any,

            currentPeriodEnd: periodEnd,
          },
        });
      } catch (error: any) {
        console.error("Error during User table update:", error.message);
      }

      console.log(
        "successfully update user plan and period end for User: " + userId,
      );

      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any;
      const subscriptionId = invoice.subscription as string;

      if (subscriptionId) {
        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId,
        )) as any;
        const periodEnd = new Date(subscription.current_period_end * 1000);

        const subRecord = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscriptionId },
        });

        if (subRecord) {
          await prisma.subscription.update({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              status: "ACTIVE",
              currentPeriodEnd: periodEnd,
            },
          });

          await prisma.user.update({
            where: { id: subRecord.userId },
            data: {
              currentPeriodEnd: periodEnd,
            },
          });
        }
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;

      const subRecord = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (subRecord) {
        await prisma.user.update({
          where: { id: subRecord.userId },
          data: {
            plan: "FREE",
            currentPeriodEnd: null,
          },
        });

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "CANCELED" },
        });

        console.log(`Subscription canceled for User: ${subRecord.userId}`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
};

export const checkSubscriptionStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      plan: true,
      currentPeriodEnd: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  if (user.plan !== "FREE") {
    return {
      success: true,
      status: "verified",
      message: "Subscription verified successfully!",
      data: {
        plan: user.plan,
        currentPeriodEnd: user.currentPeriodEnd,
      },
    };
  }

  return {
    success: false,
    status: "processing",
    message: "Payment is being processed, please wait...",
    data: null,
  };
};

export const SubscriptionService = {
  createCheckoutSession,
  handleWebhook,
  checkSubscriptionStatus,
};
