// SWARM // OVERLORD-9 — global leaderboard backend (Cloudflare Worker + KV)
// Free tier is plenty. Deploy steps are in README.md → "Global leaderboard".
//
// It validates and clamps everything server-side (name sanitized to 3 chars,
// score clamped, top-10 kept) so a tampered client can't store garbage.

export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });

    if (req.method === "GET") {
      const data = (await env.SCORES.get("board")) || '{"scores":[]}';
      return new Response(data, { headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (req.method === "POST") {
      let body;
      try { body = await req.json(); } catch { return new Response("bad json", { status: 400, headers: cors }); }
      const clean = (Array.isArray(body.scores) ? body.scores : [])
        .filter((x) => x && typeof x.n === "string" && typeof x.s === "number")
        .map((x) => ({
          n: (x.n.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3)) || "AAA",
          s: Math.max(0, Math.min(9_999_999, Math.floor(x.s))),
          w: Math.max(0, Math.floor(x.w || 0)),
        }))
        .sort((a, b) => b.s - a.s)
        .slice(0, 10);
      await env.SCORES.put("board", JSON.stringify({ scores: clean }));
      return new Response(JSON.stringify({ scores: clean }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    return new Response("method not allowed", { status: 405, headers: cors });
  },
};
