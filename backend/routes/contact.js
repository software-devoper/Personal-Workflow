import { Router } from "express";
import { supabase } from "../services/supabaseClient.js";
import { sendContactAutoReply, sendContactNotification } from "../services/emailService.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body ?? {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ error: "name is required." });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ error: "email is required." });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required." });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMessage = message.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ error: "email format is invalid." });
    }

    const { error } = await supabase.from("contact_messages").insert({
      name: normalizedName,
      email: normalizedEmail,
      message: normalizedMessage
    });

    if (error) {
      throw new Error(`Failed to save contact message: ${error.message}`);
    }

    let notification = { sent: false };
    let autoReply = { sent: false };

    try {
      notification = await sendContactNotification({
        name: normalizedName,
        email: normalizedEmail,
        message: normalizedMessage
      });
    } catch (mailError) {
      notification = { sent: false, error: mailError.message };
    }

    try {
      autoReply = await sendContactAutoReply({
        name: normalizedName,
        email: normalizedEmail
      });
    } catch (mailError) {
      autoReply = { sent: false, error: mailError.message };
    }

    return res.status(201).json({
      success: true,
      email: {
        notification_sent: Boolean(notification.sent),
        notification_reason: notification.reason || notification.error || "",
        auto_reply_sent: Boolean(autoReply.sent),
        auto_reply_reason: autoReply.reason || autoReply.error || ""
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to submit contact form.",
      details: error.message
    });
  }
});

export default router;
