import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_FROM,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendApprovalEmail(
  to: string,
  name: string,
  businessName: string,
  registrationLink: string
) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: #000000; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; }
    .header p { color: #DC2626; margin: 8px 0 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; }
    .body { padding: 40px; }
    .body h2 { color: #000000; font-size: 22px; margin: 0 0 16px; }
    .body p { color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
    .cta { display: block; background: #DC2626; color: #ffffff; text-decoration: none; text-align: center; padding: 16px 32px; border-radius: 6px; font-weight: 700; font-size: 15px; letter-spacing: 1px; text-transform: uppercase; margin: 32px 0; }
    .footer { background: #000000; padding: 24px 40px; text-align: center; }
    .footer p { color: #555555; font-size: 12px; margin: 0; }
    .footer span { color: #DC2626; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DRIVE CONNECT</h1>
      <p>Drive Network Partner Program</p>
    </div>
    <div class="body">
      <h2>Congratulations, ${name}!</h2>
      <p>Your application for <strong>${businessName}</strong> has been approved. Welcome to the Drive Network.</p>
      <p>You are now part of a trusted operator network built for independent rental businesses. You own the cars — you should control the business.</p>
      <p>To get started, complete your account setup and create your first vehicle listing:</p>
      <a href="${registrationLink}" class="cta">Complete Your Account Setup</a>
      <p style="font-size: 13px; color: #888888;">This link expires in 72 hours. If you did not apply to Drive Connect, please disregard this email.</p>
    </div>
    <div class="footer">
      <p>DRIVE CONNECT IS PRINCIPLED</p>
      <p><span>Fairness</span> * <span>Integrity</span> * <span>Trust</span> * <span>Independence</span> * <span>Accountability</span> * <span>Shared Success</span></p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Drive Connect" <${process.env.EMAIL_FROM || "noreply@driveconnect.com"}>`,
    to,
    subject: "Your Drive Network Partner Application Has Been Approved",
    html,
    text: `Congratulations ${name}! Your application for ${businessName} has been approved. Complete your account setup at: ${registrationLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function sendRejectionEmail(
  to: string,
  name: string,
  businessName: string,
  notes?: string
) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: #000000; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; }
    .body { padding: 40px; }
    .body h2 { color: #000000; font-size: 22px; margin: 0 0 16px; }
    .body p { color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
    .footer { background: #000000; padding: 24px 40px; text-align: center; }
    .footer p { color: #555555; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DRIVE CONNECT</h1>
    </div>
    <div class="body">
      <h2>Application Update — ${name}</h2>
      <p>Thank you for your interest in the Drive Network Partner Program for <strong>${businessName}</strong>.</p>
      <p>After reviewing your application, we are unable to move forward at this time.</p>
      ${notes ? `<p><strong>Notes from our team:</strong> ${notes}</p>` : ""}
      <p>We appreciate your interest in Drive Connect and encourage you to reapply in the future as your business grows.</p>
    </div>
    <div class="footer">
      <p>Drive Connect — Built For Operators. Designed For Travelers.</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Drive Connect" <${process.env.EMAIL_FROM || "noreply@driveconnect.com"}>`,
    to,
    subject: "Drive Network Partner Application — Status Update",
    html,
    text: `Thank you for your interest in Drive Connect. After reviewing your application for ${businessName}, we are unable to move forward at this time.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  resetLink: string
) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { background: #000000; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; }
    .body { padding: 40px; }
    .body h2 { color: #000000; font-size: 22px; margin: 0 0 16px; }
    .body p { color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
    .cta { display: block; background: #DC2626; color: #ffffff; text-decoration: none; text-align: center; padding: 16px 32px; border-radius: 6px; font-weight: 700; font-size: 15px; letter-spacing: 1px; text-transform: uppercase; margin: 32px 0; }
    .footer { background: #000000; padding: 24px 40px; text-align: center; }
    .footer p { color: #555555; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>DRIVE CONNECT</h1>
    </div>
    <div class="body">
      <h2>Password Reset Request</h2>
      <p>Hi ${name}, we received a request to reset your Drive Network Partner account password.</p>
      <a href="${resetLink}" class="cta">Reset My Password</a>
      <p style="font-size: 13px; color: #888888;">This link expires in 1 hour. If you did not request a password reset, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>Drive Connect — Platforms should create trust. Not control.</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Drive Connect" <${process.env.EMAIL_FROM || "noreply@driveconnect.com"}>`,
    to,
    subject: "Drive Connect — Password Reset Request",
    html,
    text: `Hi ${name}, reset your password at: ${resetLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}
