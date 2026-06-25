import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@driveconnect.com";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://5.161.189.93";

export async function sendApprovalEmail(
  toEmail: string,
  ownerName: string,
  businessName: string,
  approvalToken: string
) {
  const registrationUrl = `${BASE_URL}/host/register?token=${approvalToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drive Connect — Application Approved</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color:#000000;padding:32px 40px;border-bottom:2px solid #C1121F;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;">
                DRIVE CONNECT
              </h1>
              <p style="margin:4px 0 0;color:#888888;font-size:12px;letter-spacing:0.05em;text-transform:uppercase;">
                Drive Network Partner Program
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#C1121F;font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">
                Application Approved
              </h2>
              <p style="margin:0 0 16px;color:#ffffff;font-size:16px;line-height:1.6;">
                Dear ${ownerName},
              </p>
              <p style="margin:0 0 24px;color:#cccccc;font-size:15px;line-height:1.7;">
                Congratulations. Your application for <strong style="color:#ffffff;">${businessName}</strong> has been approved. 
                You are now a Drive Network Partner.
              </p>
              <p style="margin:0 0 32px;color:#cccccc;font-size:15px;line-height:1.7;">
                Click the button below to set up your account and complete your onboarding. 
                This link is unique to your application and expires in 48 hours.
              </p>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="background-color:#C1121F;border-radius:6px;">
                    <a href="${registrationUrl}" 
                       style="display:block;padding:16px 32px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;">
                      Complete Your Registration →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#555555;font-size:13px;">
                If the button doesn't work, copy and paste this link:
              </p>
              <p style="margin:0 0 32px;color:#888888;font-size:12px;word-break:break-all;">
                ${registrationUrl}
              </p>
              <hr style="border:none;border-top:1px solid #222222;margin:0 0 24px;">
              <p style="margin:0;color:#555555;font-size:13px;font-style:italic;text-align:center;">
                "Platforms should create trust. Not control."
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#000000;padding:24px 40px;border-top:1px solid #1a1a1a;">
              <p style="margin:0;color:#333333;font-size:11px;text-align:center;letter-spacing:0.05em;text-transform:uppercase;">
                Drive Connect IS Principled — Fairness · Integrity · Trust · Independence
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Drive Connect" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: "Your Drive Network Partner Application Has Been Approved",
    html,
  });
}

export async function sendRejectionEmail(
  toEmail: string,
  ownerName: string,
  businessName: string
) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Drive Connect — Application Update</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#000000;padding:32px 40px;border-bottom:2px solid #333333;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;">DRIVE CONNECT</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;color:#ffffff;font-size:16px;">Dear ${ownerName},</p>
              <p style="margin:0 0 24px;color:#cccccc;font-size:15px;line-height:1.7;">
                Thank you for your interest in the Drive Network Partner Program. After reviewing your application for 
                <strong style="color:#ffffff;">${businessName}</strong>, we are unable to approve your application at this time.
              </p>
              <p style="margin:0 0 24px;color:#cccccc;font-size:15px;line-height:1.7;">
                We encourage you to reapply in the future as our network grows and requirements evolve.
              </p>
              <hr style="border:none;border-top:1px solid #222222;margin:0 0 24px;">
              <p style="margin:0;color:#555555;font-size:13px;font-style:italic;text-align:center;">
                "Platforms should create trust. Not control."
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#000000;padding:24px 40px;border-top:1px solid #1a1a1a;">
              <p style="margin:0;color:#333333;font-size:11px;text-align:center;letter-spacing:0.05em;text-transform:uppercase;">
                Drive Connect IS Principled
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Drive Connect" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: "Update on Your Drive Network Partner Application",
    html,
  });
}

export async function sendPasswordResetEmail(
  toEmail: string,
  ownerName: string,
  resetToken: string
) {
  const resetUrl = `${BASE_URL}/host/reset-password?token=${resetToken}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Drive Connect — Password Reset</title>
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#111111;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="background-color:#000000;padding:32px 40px;border-bottom:2px solid #C1121F;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;">DRIVE CONNECT</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#ffffff;font-size:18px;font-weight:700;">Password Reset Request</h2>
              <p style="margin:0 0 16px;color:#ffffff;font-size:16px;">Dear ${ownerName},</p>
              <p style="margin:0 0 24px;color:#cccccc;font-size:15px;line-height:1.7;">
                We received a request to reset your password. Click the button below to set a new password. 
                This link expires in 1 hour.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="background-color:#C1121F;border-radius:6px;">
                    <a href="${resetUrl}" style="display:block;padding:16px 32px;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:0.1em;text-transform:uppercase;">
                      Reset Password →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;color:#555555;font-size:13px;">
                If you did not request a password reset, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#000000;padding:24px 40px;border-top:1px solid #1a1a1a;">
              <p style="margin:0;color:#333333;font-size:11px;text-align:center;letter-spacing:0.05em;text-transform:uppercase;">Drive Connect IS Principled</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  await transporter.sendMail({
    from: `"Drive Connect" <${FROM_EMAIL}>`,
    to: toEmail,
    subject: "Drive Connect — Password Reset Request",
    html,
  });
}
