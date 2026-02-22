import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function StatCard({ title, value }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-cyan-200">{value}</p>
    </div>
  );
}

function Bars({ data = [], labelKey, valueKey }) {
  const max = useMemo(() => Math.max(1, ...data.map((item) => item[valueKey] || 0)), [data, valueKey]);

  return (
    <div className="space-y-3">
      {data.length === 0 ? <p className="text-sm text-slate-400">No data yet.</p> : null}
      {data.map((item) => (
        <div key={item[labelKey]} className="space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>{item[labelKey]}</span>
            <span>{item[valueKey]}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-300"
              style={{ width: `${Math.max(6, (item[valueKey] / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${apiBaseUrl}/api/analytics/summary?days=${days}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.details || data?.error || "Failed to load analytics");
        }
        setSummary(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [days]);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-cyan-200 sm:text-4xl">Admin Analytics</h1>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="input-glow rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
        <p className="mt-2 text-slate-300">Track visits, interactions, and engagement across your portfolio.</p>
      </motion.div>

      {loading ? <p className="mt-6 text-slate-300">Loading analytics...</p> : null}
      {error ? <p className="mt-6 text-red-300">{error}</p> : null}

      {summary ? (
        <div className="mt-8 space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Events" value={summary.totals.events} />
            <StatCard title="Portfolio Visits" value={summary.totals.visits} />
            <StatCard title="Unique Visitors" value={summary.totals.unique_visitors} />
            <StatCard title="Contact Submits" value={summary.by_event_type.contact_submit} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-cyan-200">Events by Type</h2>
              <div className="mt-4">
                <Bars
                  data={[
                    { label: "Page Views", value: summary.by_event_type.page_view },
                    { label: "Project Clicks", value: summary.by_event_type.project_click },
                    { label: "Video Opens", value: summary.by_event_type.video_open },
                    { label: "Contact Submits", value: summary.by_event_type.contact_submit }
                  ]}
                  labelKey="label"
                  valueKey="value"
                />
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-cyan-200">Top Project Clicks</h2>
              <div className="mt-4">
                <Bars data={summary.top_projects} labelKey="project_id" valueKey="count" />
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-cyan-200">Daily Visits</h2>
            <div className="mt-4">
              <Bars data={summary.daily_views} labelKey="date" valueKey="count" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
