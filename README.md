# SWARM // OVERLORD-9

A self-contained **WebXR cyber wave-shooter**. Defend a neon grid arena from OVERLORD-9's
drone swarm — playable **in a VR headset** (Meta Quest browser → *Enter VR*) or **right in
your browser** with mouse + keyboard.

▶ **Play: https://ashur0.github.io/overlord-swarm/**

No install, no login. It's a single `index.html` (raw WebXR + WebGL, zero dependencies).

## Controls
- **VR** — aim with either controller, squeeze the **trigger** to fire. Haptic rumble on hits.
- **Desktop** — **move mouse** to aim, **click** to fire. Press **M** to mute music.

## Features
- Ramping waves, **boss cores** every 5th wave, combo multiplier, hull integrity.
- Enemy variety: straight-flyers, tanky, teal **strafers**, violet **bosses**.
- **Weapon heat** — sustained fire overheats and briefly vents; pace your shots.
- **Pickups** — destroyed drones sometimes drop **+Hull** (green) or **Rapid Fire** (cyan).
- Synth **music + SFX**, muzzle flash + tracers, particle explosions.
- **Leaderboard** with arcade callsign entry (local by default; global with the step below).

## Update the game
```bash
# edit index.html, then:
git add -A && git commit -m "tweak" && git push
# GitHub Pages redeploys in ~1 minute (same URL)
```

## Global leaderboard (optional, ~2 minutes, free)
By default the leaderboard is **local** (saved in each player's browser). To make it a shared
**global** board, deploy the included `worker.js` on Cloudflare's free tier:

1. **Cloudflare dashboard → Workers & Pages → Create → Worker.** Paste the contents of
   `worker.js`, click **Deploy**. Copy the worker URL (`https://….workers.dev`).
2. **Storage & Databases → KV → Create namespace** (name it `swarm-scores`).
3. Back in the Worker → **Settings → Bindings → Add → KV namespace**:
   set **Variable name** to `SCORES` and pick the `swarm-scores` namespace. Save & deploy.
4. In `index.html`, set the `LB_URL` constant to your worker URL:
   ```js
   const LB_URL = "https://your-worker.workers.dev";
   ```
   Commit and push. Scores now post to the shared board (server-side validated + top-10).

The board falls back to local automatically if `LB_URL` is empty or the worker is unreachable,
so the game never breaks.
