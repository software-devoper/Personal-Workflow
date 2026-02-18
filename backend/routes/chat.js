import { Router } from "express";
import { supabase } from "../services/supabaseClient.js";
import { generateResponse } from "../services/geminiService.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { session_id: sessionId, message } = req.body ?? {};

    if (!sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "session_id is required and must be a string." });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message is required and must be a non-empty string." });
    }

    const trimmedMessage = message.trim();

    let history = [];

    const { error: userInsertError } = await supabase.from("chat_messages").insert({
      session_id: sessionId,
      role: "user",
      message: trimmedMessage
    });
    if (userInsertError) {
      // Keep chat available even when DB limits are reached.
      console.warn(`Supabase user insert skipped: ${userInsertError.message}`);
    }

    const { data: historyRows, error: historyError } = await supabase
      .from("chat_messages")
      .select("role, message, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (historyError) {
      console.warn(`Supabase history fetch skipped: ${historyError.message}`);
    } else {
      history = (historyRows ?? []).reverse();
    }

    const reply = await generateResponse(trimmedMessage, history);

    const { error: assistantInsertError } = await supabase.from("chat_messages").insert({
      session_id: sessionId,
      role: "assistant",
      message: reply
    });

    if (assistantInsertError) {
      console.warn(`Supabase assistant insert skipped: ${assistantInsertError.message}`);
    }

    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({
      error: "Unable to process chat request.",
      details: error.message
    });
  }
});

export default router;
