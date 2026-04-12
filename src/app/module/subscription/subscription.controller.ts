import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { SubscriptionService } from "./subscription.service";
import Stripe from "stripe";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { plan } = req.body; // 'MONTHLY' or 'YEARLY'

    const checkoutUrl = await SubscriptionService.createCheckoutSession(
      userId as string,
      plan,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Checkout session created successfully",
      data: checkoutUrl,
    });
  },
);

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = Stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  await SubscriptionService.handleWebhook(event);

  res.json({ received: true });
});

export const SubscriptionController = {
  createCheckoutSession,
  stripeWebhook,
};
