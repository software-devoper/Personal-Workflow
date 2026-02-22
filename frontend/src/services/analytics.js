const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://pulse-music-phiq.onrender.com";
const VISITOR_KEY = "portfolio_visitor_id";
const SESSION_KEY = "session_id";

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = createId("visitor");
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = createId("session");
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export async function trackEvent(eventType, payload = {}) {
  try {
    await fetch(`${apiBaseUrl}/api/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        ...payload
      }),
      keepalive: true
    });
  } catch {
    // Keep analytics non-blocking.
  }
}
