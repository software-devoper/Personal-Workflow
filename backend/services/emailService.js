import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "";
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";
const smtpSecure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const mailFrom = process.env.MAIL_FROM || smtpUser || "no-reply@example.com";
const notifyTo = process.env.CONTACT_NOTIFY_TO || "";
const autoReplyEnabled = String(process.env.CONTACT_AUTOREPLY_ENABLED || "false").toLowerCase() === "true";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!smtpHost || !smtpUser || !smtpPass) return null;

  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  return transporter;
}

export async function sendContactNotification({ name, email, message }) {
  const client = getTransporter();
  if (!client || !notifyTo) {
    return { sent: false, skipped: true, reason: "SMTP not configured or CONTACT_NOTIFY_TO missing." };
  }

  const info = await client.sendMail({
    from: mailFrom,
    to: notifyTo,
    replyTo: email,
    subject: `New Portfolio Contact from ${name}`,
    text: `You received a new contact form submission.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `
      <h2>New Portfolio Contact</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `
  });

  return { sent: true, messageId: info.messageId };
}

export async function sendContactAutoReply({ name, email }) {
  if (!autoReplyEnabled) {
    return { sent: false, skipped: true, reason: "CONTACT_AUTOREPLY_ENABLED is false." };
  }

  const client = getTransporter();
  if (!client) {
    return { sent: false, skipped: true, reason: "SMTP not configured." };
  }

  const info = await client.sendMail({
    from: mailFrom,
    to: email,
    subject: "Thanks for contacting Subhadip Mondal",
    text: `Hi ${name},\n\nThanks for reaching out. Your message has been received. Subhadip will get back to you soon.\n\nRegards,\nSubhadip Mondal Portfolio`,
    html: `
      <p>Hi ${name},</p>
      <p>Thanks for reaching out. Your message has been received. Subhadip will get back to you soon.</p>
      <p>Regards,<br/>Subhadip Mondal Portfolio</p>
    `
  });

  return { sent: true, messageId: info.messageId };
}
