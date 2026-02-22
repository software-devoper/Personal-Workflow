import { Router } from "express";
import { supabase } from "../services/supabaseClient.js";

const router = Router();
const ALLOWED_EVENTS = new Set(["page_view", "project_click", "video_open", "contact_submit"]);

router.post("/event", async (req, res) => {
  try {
    const {
      event_type: eventType,
      page_path: pagePath = "",
      project_id: projectId = null,
      visitor_id: visitorId = "",
      session_id: sessionId = "",
      metadata = {}
    } = req.body ?? {};

    if (!eventType || typeof eventType !== "string" || !ALLOWED_EVENTS.has(eventType)) {
      return res.status(400).json({ error: "event_type is required and must be a supported value." });
    }

    if (!visitorId || typeof visitorId !== "string") {
      return res.status(400).json({ error: "visitor_id is required." });
    }

    const { error } = await supabase.from("analytics_events").insert({
      event_type: eventType,
      page_path: typeof pagePath === "string" ? pagePath : "",
      project_id: typeof projectId === "string" ? projectId : null,
      visitor_id: visitorId,
      session_id: typeof sessionId === "string" ? sessionId : "",
      user_agent: req.get("user-agent") || "",
      referrer: req.get("referer") || "",
      metadata: typeof metadata === "object" && metadata ? metadata : {}
    });

    if (error) {
      throw new Error(`Failed to save analytics event: ${error.message}`);
    }

    return res.status(201).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Unable to record analytics event.", details: error.message });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
    const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from("analytics_events")
      .select("event_type, page_path, project_id, visitor_id, created_at")
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: true })
      .limit(20000);

    if (error) {
      throw new Error(`Failed to fetch analytics summary: ${error.message}`);
    }

    const rows = data ?? [];
    const byEventType = { page_view: 0, project_click: 0, video_open: 0, contact_submit: 0 };
    const uniqueVisitors = new Set();
    const dailyPageViews = {};
    const projectClicks = {};

    for (const row of rows) {
      if (row.event_type in byEventType) byEventType[row.event_type] += 1;
      if (row.visitor_id) uniqueVisitors.add(row.visitor_id);

      if (row.event_type === "page_view") {
        const day = String(row.created_at).slice(0, 10);
        dailyPageViews[day] = (dailyPageViews[day] || 0) + 1;
      }

      if (row.event_type === "project_click" && row.project_id) {
        projectClicks[row.project_id] = (projectClicks[row.project_id] || 0) + 1;
      }
    }

    const dailyViews = Object.entries(dailyPageViews).map(([date, count]) => ({ date, count }));
    const topProjects = Object.entries(projectClicks)
      .map(([project_id, count]) => ({ project_id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return res.status(200).json({
      days,
      totals: {
        events: rows.length,
        visits: byEventType.page_view,
        unique_visitors: uniqueVisitors.size
      },
      by_event_type: byEventType,
      daily_views: dailyViews,
      top_projects: topProjects
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch analytics summary.", details: error.message });
  }
});

export default router;
