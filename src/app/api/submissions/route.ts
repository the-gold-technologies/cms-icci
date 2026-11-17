import { NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/auth-check";
import nodemailer from "nodemailer";

const TEXT_FIELDS = [
  "formType",
  "fullName",
  "email",
  "phone",
  "organisation",
  "membershipCategory",
  "state",
  "subject",
  "message",
] as const;

type SubmissionFields = Partial<Record<(typeof TEXT_FIELDS)[number], string>>;

function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  const port = Number(process.env.SMTP_PORT) || 465;
  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user, pass },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** The website posts JSON or form data (no file uploads on the ICCI forms). */
async function readSubmission(req: Request): Promise<SubmissionFields> {
  const fields: SubmissionFields = {};
  if ((req.headers.get("content-type") || "").includes("form-data")) {
    const data = await req.formData();
    for (const key of TEXT_FIELDS) {
      const value = data.get(key);
      if (typeof value === "string") fields[key] = value.trim();
    }
    return fields;
  }
  const body = await req.json();
  for (const key of TEXT_FIELDS) {
    if (typeof body?.[key] === "string") fields[key] = body[key].trim();
  }
  return fields;
}

// Name, email and phone sit in the contact card at the top, so the details table skips them
const DETAIL_FIELDS: { key: keyof SubmissionFields; label: string }[] = [
  { key: "organisation", label: "Organisation / Company" },
  { key: "membershipCategory", label: "Membership Category" },
  { key: "state", label: "State" },
  { key: "subject", label: "Subject" },
];

const FORM_TYPE_LABELS: Record<string, string> = {
  membership: "Membership Enquiry",
  contact: "Contact Enquiry",
};

// The CMS inbox has one page per form type
const CMS_INBOX_PATHS: Record<string, string> = {
  membership: "/submissions/membership",
  contact: "/submissions/contact",
};

const BRAND = "#ee6a2c";
const BRAND_DARK = "#d4561b";
const GOLD = "#dfae19";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function formTypeLabel(formType: string) {
  return FORM_TYPE_LABELS[formType] || "Website Enquiry";
}

function button(href: string, label: string, primary: boolean) {
  const bg = primary ? BRAND : "#ffffff";
  const color = primary ? "#ffffff" : BRAND;
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:4px 8px 4px 0;padding:11px 20px;background:${bg};color:${color};border:1px solid ${BRAND};border-radius:8px;font-family:${FONT};font-size:14px;font-weight:600;text-decoration:none;">${label}</a>`;
}

function renderNotification(fields: SubmissionFields) {
  const formType = fields.formType || "";
  const title = formTypeLabel(formType);
  const name = fields.fullName || "";
  const email = fields.email || "";
  const phone = fields.phone || "";
  const receivedAt = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const cmsBase = (process.env.NEXTAUTH_URL || "").replace(/\/$/, "");
  const inboxUrl = cmsBase ? `${cmsBase}${CMS_INBOX_PATHS[formType] || "/submissions"}` : "";
  const details = DETAIL_FIELDS.filter(({ key }) => fields[key]);
  const message = fields.message || "";

  const detailRows = details
    .map(
      ({ key, label }, i) => `
        <tr>
          <td style="padding:12px 16px;width:40%;vertical-align:top;font-size:13px;color:#6b6b6b;${i ? "border-top:1px solid #fbe6dc;" : ""}">${label}</td>
          <td style="padding:12px 16px;vertical-align:top;font-size:14px;color:#1f1f1f;font-weight:600;${i ? "border-top:1px solid #fbe6dc;" : ""}">${escapeHtml(fields[key]!)}</td>
        </tr>`,
    )
    .join("");

  const sectionHeading = (text: string) =>
    `<p style="margin:28px 0 10px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND};">${text}</p>`;

  const actions = [
    email ? button(`mailto:${email}`, "Reply by Email", true) : "",
    phone ? button(`tel:${phone.replace(/[^\d+]/g, "")}`, "Call " + escapeHtml(phone), false) : "",
  ].join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#fdf3ee;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(`${title} from ${name}${message ? ` — ${message.slice(0, 90)}` : ""}`)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fdf3ee;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:${FONT};">
          <tr>
            <td style="background:${BRAND_DARK};border-radius:14px 14px 0 0;padding:24px 28px;border-bottom:4px solid ${GOLD};">
              <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${GOLD};font-weight:700;">Indian Chamber of Construction Industry</p>
              <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">New ${escapeHtml(title)}</h1>
              <p style="margin:6px 0 0;font-size:13px;color:#f9d7c6;">Received ${escapeHtml(receivedAt)} IST via the website</p>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:28px;border-radius:0 0 14px 14px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fef8f5;border:1px solid #fbe1d4;border-radius:12px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0;font-size:12px;color:#6b6b6b;text-transform:uppercase;letter-spacing:1px;">From</p>
                    <p style="margin:4px 0 10px;font-size:20px;font-weight:700;color:#1f1f1f;">${escapeHtml(name)}</p>
                    ${email ? `<p style="margin:0 0 4px;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:${BRAND};text-decoration:none;">&#9993;&nbsp; ${escapeHtml(email)}</a></p>` : ""}
                    ${phone ? `<p style="margin:0;font-size:14px;"><a href="tel:${escapeHtml(phone.replace(/[^\d+]/g, ""))}" style="color:${BRAND};text-decoration:none;">&#9742;&nbsp; ${escapeHtml(phone)}</a></p>` : ""}
                  </td>
                </tr>
              </table>
              ${actions ? `<div style="margin-top:16px;">${actions}</div>` : ""}
              ${
                details.length
                  ? `${sectionHeading("Enquiry Details")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #fbe1d4;border-radius:12px;border-collapse:separate;">${detailRows}
              </table>`
                  : ""
              }
              ${sectionHeading("Message")}
              <div style="padding:16px 18px;background:#fafafa;border-left:4px solid ${GOLD};border-radius:0 10px 10px 0;font-size:14px;line-height:1.65;color:#2b2b2b;">${
                message
                  ? escapeHtml(message).replace(/\r?\n/g, "<br />")
                  : `<span style="color:#9a9a9a;font-style:italic;">No message was added.</span>`
              }</div>
              ${
                inboxUrl
                  ? `<div style="margin-top:28px;padding-top:20px;border-top:1px solid #eee;text-align:center;">
                ${button(inboxUrl, "Open in CMS Inbox", false)}
              </div>`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:18px 12px;text-align:center;font-size:12px;line-height:1.6;color:#8a8a8a;">
              Replying to this email goes straight to ${escapeHtml(name || "the sender")}.<br />
              This is an automated alert from the ICCI website.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `New ${title}`,
    `Received ${receivedAt} IST`,
    "",
    `Name: ${name}`,
    ...(email ? [`Email: ${email}`] : []),
    ...(phone ? [`Phone: ${phone}`] : []),
    ...details.map(({ key, label }) => `${label}: ${fields[key]}`),
    "",
    "Message:",
    message || "No message was added.",
    ...(inboxUrl ? ["", `Open in CMS: ${inboxUrl}`] : []),
  ].join("\n");
  return { html, text };
}

export async function GET(req: Request) {
  try {
    const authCheck = await checkAdminSession();
    if (!authCheck.authorized) return authCheck.response;

    const { searchParams } = new URL(req.url);
    const formType = searchParams.get("formType");
    const status = searchParams.get("status");

    const where: any = {};
    if (formType && formType !== "all") where.formType = formType;
    if (status && status !== "all") where.status = status;

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: submissions });
  } catch (error) {
    console.error("Submissions fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-cms-secret");
    const sharedSecret = process.env.CMS_SHARED_SECRET;

    // Verify request is from website or admin
    if (!sharedSecret || secret !== sharedSecret) {
      const authCheck = await checkAdminSession();
      if (!authCheck.authorized) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
      }
    }

    const fields = await readSubmission(req);
    const { formType, fullName, email } = fields;

    if (!formType || !(formType in FORM_TYPE_LABELS) || !fullName || !email) {
      return NextResponse.json(
        { success: false, error: "Form type (membership or contact), name and email are required" },
        { status: 400 },
      );
    }

    const submission = await prisma.submission.create({
      data: {
        formType,
        fullName,
        email,
        phone: fields.phone || null,
        organisation: fields.organisation || null,
        membershipCategory: fields.membershipCategory || null,
        state: fields.state || null,
        subject: fields.subject || null,
        message: fields.message || "",
        status: "New",
      },
    });

    // Send the admin notification after the response so the website isn't kept waiting
    const transporter = getSmtpTransporter();
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER;
    if (transporter && adminEmail) {
      const { html, text } = renderNotification(fields);
      after(async () => {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || `"ICCI Website" <${process.env.SMTP_USER}>`,
            to: adminEmail,
            replyTo: email,
            subject: `New ${formTypeLabel(formType)} from ${fullName}`,
            html,
            text,
          });
        } catch (err) {
          console.error("[SMTP Alert] Could not send lead notification:", err);
        }
      });
    } else {
      console.warn(
        "[SMTP Alert] SMTP_HOST/SMTP_USER/SMTP_PASS not set; lead notification not sent",
      );
    }

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error("Submission intake error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to record submission" },
      { status: 500 },
    );
  }
}
