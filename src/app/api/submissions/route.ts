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
const GREEN = "#138808";
const SLATE_DARK = "#0f172a";
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

function formTypeLabel(formType: string) {
  return FORM_TYPE_LABELS[formType] || "Website Enquiry";
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

  const initials =
    (name || "IC")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "IC";

  const cmsBase = (process.env.NEXTAUTH_URL || "").replace(/\/$/, "");
  const inboxUrl = cmsBase ? `${cmsBase}${CMS_INBOX_PATHS[formType] || "/submissions"}` : "";
  const details = DETAIL_FIELDS.filter(({ key }) => fields[key]);
  const message = fields.message || "";

  const detailRows = details
    .map(
      ({ key, label }, i) => `
        <tr>
          <td style="padding:12px 18px;width:38%;vertical-align:top;font-size:13px;color:#64748b;font-weight:500;background:#fafbfc;${i ? "border-top:1px solid #f1f5f9;" : ""}">${label}</td>
          <td style="padding:12px 18px;vertical-align:top;font-size:13px;color:#0f172a;font-weight:600;${i ? "border-top:1px solid #f1f5f9;" : ""}">${escapeHtml(fields[key]!)}</td>
        </tr>`,
    )
    .join("");

  const sectionHeading = (text: string) =>
    `<div style="margin:26px 0 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND};">${text}</div>`;

  const phoneClean = phone.replace(/[^\d+]/g, "");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(`${title} from ${name}${message ? ` — ${message.slice(0, 90)}` : ""}`)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f1f5f9;">
    <tr>
      <td align="center" style="padding:36px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:${FONT};background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 4px 20px -2px rgba(15,23,42,0.08);">
          <!-- Tricolour Accent Line -->
          <tr>
            <td style="padding:0;line-height:0;font-size:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="33.33%" height="4" style="background:${BRAND};font-size:1px;line-height:1px;">&nbsp;</td>
                  <td width="33.34%" height="4" style="background:${GOLD};font-size:1px;line-height:1px;">&nbsp;</td>
                  <td width="33.33%" height="4" style="background:${GREEN};font-size:1px;line-height:1px;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Header -->
          <tr>
            <td style="background:${SLATE_DARK};padding:28px 32px 26px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:rgba(238,106,44,0.18);border:1px solid rgba(238,106,44,0.35);border-radius:20px;padding:3px 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#fb923c;">
                    Indian Chamber of Construction Industry
                  </td>
                </tr>
              </table>
              <h1 style="margin:12px 0 6px;font-size:24px;font-weight:700;color:#ffffff;line-height:1.25;letter-spacing:-0.3px;">New ${escapeHtml(title)}</h1>
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.4;">
                <span style="color:#22c55e;font-size:14px;vertical-align:middle;margin-right:4px;">&#9679;</span>Received ${escapeHtml(receivedAt)} IST via website
              </p>
            </td>
          </tr>
          <!-- Content Body -->
          <tr>
            <td style="background:#ffffff;padding:28px 32px 32px 32px;">
              <!-- Sender Profile Card -->
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px 22px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="48" valign="top" style="vertical-align:top;width:48px;">
                      <div style="width:46px;height:46px;border-radius:50%;background:${BRAND};color:#ffffff;font-size:16px;font-weight:700;line-height:46px;text-align:center;letter-spacing:0.5px;">${initials}</div>
                    </td>
                    <td valign="top" style="vertical-align:top;padding-left:16px;">
                      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Enquiry From</div>
                      <div style="font-size:18px;font-weight:700;color:#0f172a;margin:2px 0 6px;letter-spacing:-0.2px;">${escapeHtml(name)}</div>
                      ${fields.organisation ? `<div style="font-size:13px;color:#475569;margin-bottom:8px;font-weight:500;">&#127970;&nbsp; ${escapeHtml(fields.organisation)}</div>` : ""}
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          ${
                            email
                              ? `<td style="padding-right:16px;padding-top:2px;">
                                  <a href="mailto:${escapeHtml(email)}" style="font-size:13px;color:${BRAND};text-decoration:none;font-weight:600;">
                                    <span style="font-size:14px;">&#9993;</span>&nbsp;${escapeHtml(email)}
                                  </a>
                                </td>`
                              : ""
                          }
                          ${
                            phone
                              ? `<td style="padding-top:2px;">
                                  <a href="tel:${escapeHtml(phoneClean)}" style="font-size:13px;color:#475569;text-decoration:none;font-weight:500;">
                                    <span style="font-size:14px;">&#9742;</span>&nbsp;${escapeHtml(phone)}
                                  </a>
                                </td>`
                              : ""
                          }
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Quick Actions -->
              ${
                email || phone
                  ? `<div style="margin-top:14px;">
                      ${
                        email
                          ? `<a href="mailto:${escapeHtml(email)}" style="display:inline-block;padding:10px 20px;background:${BRAND};color:#ffffff;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;margin-right:8px;box-shadow:0 1px 2px rgba(238,106,44,0.25);">Reply by Email</a>`
                          : ""
                      }
                      ${
                        phone
                          ? `<a href="tel:${escapeHtml(phoneClean)}" style="display:inline-block;padding:9px 18px;background:#ffffff;color:#0f172a;border:1px solid #cbd5e1;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Call ${escapeHtml(phone)}</a>`
                          : ""
                      }
                    </div>`
                  : ""
              }

              <!-- Enquiry Details -->
              ${
                details.length
                  ? `${sectionHeading("Enquiry Details")}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#ffffff;border-collapse:separate;">
                ${detailRows}
              </table>`
                  : ""
              }

              <!-- Message Block -->
              ${sectionHeading("Message")}
              <div style="padding:18px 20px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid ${BRAND};border-radius:4px 12px 12px 4px;font-size:14px;line-height:1.7;color:#334155;">
                ${
                  message
                    ? escapeHtml(message).replace(/\r?\n/g, "<br />")
                    : `<span style="color:#94a3b8;font-style:italic;">No message was provided.</span>`
                }
              </div>

              <!-- CMS Inbox Link -->
              ${
                inboxUrl
                  ? `<div style="margin-top:28px;padding:18px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:12px;text-align:center;">
                      <div style="font-size:12px;color:#64748b;margin-bottom:10px;">This submission is archived and manageable in your CMS dashboard.</div>
                      <a href="${escapeHtml(inboxUrl)}" style="display:inline-block;padding:9px 20px;background:${SLATE_DARK};color:#ffffff;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Open in CMS Inbox &rarr;</a>
                    </div>`
                  : ""
              }
            </td>
          </tr>
        </table>
        <!-- Automated Notice Footer -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin-top:16px;">
          <tr>
            <td style="padding:12px 16px;text-align:center;font-family:${FONT};font-size:12px;line-height:1.6;color:#94a3b8;">
              Replying to this notification sends directly to <strong style="color:#64748b;">${escapeHtml(name || "the sender")}</strong>${email ? ` (${escapeHtml(email)})` : ""}.<br />
              Automated notification &bull; <strong>Indian Chamber of Construction Industry</strong>
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
            // Always the SMTP login address: mail servers reject a From address the account doesn't own
            from: { name: process.env.SMTP_FROM_NAME || "", address: process.env.SMTP_USER! },
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
