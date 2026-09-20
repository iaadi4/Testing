import { getSiteUrl } from "@/lib/site";

interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

function isMailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_APP_PASSWORD);
}

export async function sendMail(message: MailMessage) {
  if (!isMailConfigured()) {
    console.warn("[mailer] SMTP is not configured; skipping email:", message.subject);
    return { sent: false };
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"twitterbanner.lol" <${process.env.SMTP_USER}>`,
      ...message,
    });
    return { sent: true };
  } catch (error) {
    console.error("[mailer] Failed to send email:", error);
    return { sent: false };
  }
}

export async function emailCreatorBookingReceived(opts: {
  to: string;
  creatorName: string;
  brandName: string;
  amountPaid: number;
  durationWeeks: number;
}) {
  const dashboard = `${getSiteUrl()}/dashboard`;
  return sendMail({
    to: opts.to,
    subject: `Action required: approve ${opts.brandName}'s banner booking`,
    text: `Hi ${opts.creatorName},\n\n${opts.brandName} paid $${opts.amountPaid} for a ${opts.durationWeeks}-week banner sponsorship.\n\nReview and approve or reject the creative here: ${dashboard}\n\nThe banner will not go live until you approve it.`,
  });
}

export async function emailAdvertiserReceipt(opts: {
  to: string;
  buyerName: string;
  brandName: string;
  creatorUsername: string;
  amountPaid: number;
  durationWeeks: number;
}) {
  const storefront = `${getSiteUrl()}/${opts.creatorUsername}`;
  return sendMail({
    to: opts.to,
    subject: `Receipt: ${opts.brandName} banner booking on twitterbanner.lol`,
    text: `Hi ${opts.buyerName},\n\nWe received $${opts.amountPaid} for a ${opts.durationWeeks}-week banner on @${opts.creatorUsername}.\n\nThe creator now reviews your creative. You will get another email when it is approved or rejected.\n\nStorefront: ${storefront}`,
  });
}

export async function emailAdvertiserDecision(opts: {
  to: string;
  buyerName: string;
  brandName: string;
  creatorUsername: string;
  approved: boolean;
}) {
  return sendMail({
    to: opts.to,
    subject: opts.approved
      ? `${opts.brandName} is approved on @${opts.creatorUsername}`
      : `${opts.brandName} was declined by @${opts.creatorUsername}`,
    text: opts.approved
      ? `Hi ${opts.buyerName},\n\n@${opts.creatorUsername} approved your banner. They will upload the 1500×500 graphic to their X header. Track the live storefront at ${getSiteUrl()}/${opts.creatorUsername}.`
      : `Hi ${opts.buyerName},\n\n@${opts.creatorUsername} declined the ${opts.brandName} creative. A refund is now due and will be processed manually. Reply to this email if you need help.`,
  });
}
