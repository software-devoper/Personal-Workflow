import { GoogleGenerativeAI } from "@google/generative-ai";
import { portfolioContext } from "../data/portfolioContext.js";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
const fallbackModelName = (process.env.GEMINI_FALLBACK_MODEL || "").trim();

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY in backend environment.");
}

const genAI = new GoogleGenerativeAI(apiKey);

function buildPortfolioContextBlock() {
  const projectLines = portfolioContext.projects.map(
    (project, index) => `${index + 1}. ${project.title} (Tech: ${project.tech.join(", ")})`
  );

  return `
Name: ${portfolioContext.name}
Title: ${portfolioContext.title}
Summary: ${portfolioContext.summary}
Frontend Skills: ${portfolioContext.skills.frontend.join(", ")}
Backend Skills: ${portfolioContext.skills.backend.join(", ")}
Database: ${portfolioContext.skills.database.join(", ")}
Tools: ${portfolioContext.skills.tools.join(", ")}
Projects:
${projectLines.join("\n")}
  `.trim();
}

const SYSTEM_PROMPT = `You are the personal AI assistant for Subhadip Mondal.
Only answer questions about:
- his skills
- his projects
- his education
- his interests
- his technologies
- his experience

Use only the portfolio data provided below. Do not invent details.
If a question is outside scope, politely redirect to Subhadip Mondal.
Keep answers professional and concise.

Portfolio Data:
${buildPortfolioContextBlock()}`;

function buildSafeContents(history = []) {
  const mapped = history
    .filter((entry) => entry && typeof entry.message === "string" && entry.message.trim())
    .map((entry) => ({
      role: entry.role === "assistant" ? "model" : "user",
      parts: [{ text: entry.message.trim() }]
    }));

  while (mapped.length > 0 && mapped[0].role !== "user") {
    mapped.shift();
  }

  const normalized = [];
  for (const item of mapped) {
    const prev = normalized[normalized.length - 1];
    if (prev && prev.role === item.role) {
      normalized[normalized.length - 1] = item;
    } else {
      normalized.push(item);
    }
  }

  return normalized;
}

async function generateWithModel(contents, targetModel) {
  const model = genAI.getGenerativeModel({
    model: targetModel,
    systemInstruction: SYSTEM_PROMPT
  });
  const result = await model.generateContent({ contents });
  return result.response.text()?.trim() || "";
}

function formatGeminiError(error) {
  const raw = String(error?.message || "");
  const lower = raw.toLowerCase();
  const isQuota = lower.includes("429") || lower.includes("quota") || lower.includes("rate limit");

  if (isQuota) {
    const retryMatch = raw.match(/retry in\s+([\d.]+)s/i);
    const retryHint = retryMatch ? ` Try again in about ${Math.ceil(Number(retryMatch[1]))}s.` : "";
    return `Gemini quota limit reached for ${modelName}.${retryHint}`;
  }

  if (lower.includes("404") && lower.includes("model")) {
    return `Gemini model "${modelName}" is unavailable for this API key/version.`;
  }

  return `Gemini request failed. ${raw}`;
}

export async function generateResponse(message, history = []) {
  const contents = buildSafeContents(history);

  const shouldAppendMessage =
    contents.length === 0 ||
    contents[contents.length - 1].role !== "user" ||
    contents[contents.length - 1].parts[0].text !== message;

  if (shouldAppendMessage) {
    contents.push({ role: "user", parts: [{ text: message }] });
  }

  let response = "";
  try {
    response = await generateWithModel(contents, modelName);
  } catch (errorPrimary) {
    const text = String(errorPrimary?.message || "").toLowerCase();
    const retryable = text.includes("429") || text.includes("quota") || text.includes("rate limit") || text.includes("503");

    if (retryable && fallbackModelName && fallbackModelName !== modelName) {
      try {
        response = await generateWithModel(contents, fallbackModelName);
      } catch (fallbackError) {
        throw new Error(formatGeminiError(fallbackError));
      }
    } else {
      throw new Error(formatGeminiError(errorPrimary));
    }
  }

  if (!response) {
    throw new Error("Gemini returned an empty response.");
  }

  return response;
}
