import { Router } from "express";
import { supabase } from "../services/supabaseClient.js";

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

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to submit contact form.",
      details: error.message
    });
  }
});

export default router;
