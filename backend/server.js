import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import chatRoute from "./routes/chat.js";
import contactRoute from "./routes/contact.js";
import analyticsRoute from "./routes/analytics.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "https://personal-workflow.onrender.com";
const allowedOrigins = frontendOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function normalizeOrigin(origin) {
  const value = String(origin || "").trim();
  if (!value) return "";
  try {
    const parsed = new URL(value);
    const portPart = parsed.port ? `:${parsed.port}` : "";
    return `${parsed.protocol}//${parsed.hostname}${portPart}`.toLowerCase();
  } catch {
    return value.replace(/\/+$/, "").toLowerCase();
  }
}

const normalizedAllowedOrigins = allowedOrigins.map(normalizeOrigin);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const incoming = normalizeOrigin(origin);
      const isConfiguredOrigin = normalizedAllowedOrigins.includes(incoming);
      const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

      if (isConfiguredOrigin || isLocalhost) {
        return callback(null, true);
      }

      return callback(new Error("CORS blocked for this origin."));
    }
  })
);
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/chat", chatRoute);
app.use("/api/contact", contactRoute);
app.use("/api/analytics", analyticsRoute);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: "Internal server error", details: err.message });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
