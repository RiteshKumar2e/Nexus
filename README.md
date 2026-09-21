# NEXUS — Adaptive Intelligence for Disaster Response

> "When the situation changes, the response changes."

NEXUS is an AI-assisted disaster response coordination and decision-support platform built for a hackathon demonstration. It simulates a flood emergency in Patna, Bihar, and shows how a command center can detect changing conditions — a blocked road, an overloaded hospital, a full shelter — and automatically produce an updated, human-approved response plan in real time.

**This is a simulation. No real emergency infrastructure is monitored or controlled by this application.**

---

## 1. The problem

Disaster response plans are built on assumptions — an open road, a hospital with spare beds, a shelter with room. Those assumptions expire quickly. A fixed plan doesn't know when a road floods, a hospital fills up, or a rescue team becomes unavailable. By the time a human notices and manually re-plans, the response has already fallen behind the disaster.

## 2. The solution

NEXUS keeps a live model of the operational environment — incidents, roads, response teams, hospitals, shelters, and resources — and reacts to it:

```
OBSERVE → UNDERSTAND → PRIORITIZE → PLAN → ASSIGN → MONITOR → DETECT CHANGE → REPLAN → ACT
```

When a monitored condition changes (a road is blocked, a hospital goes critical, a shelter fills, a team drops out), a **deterministic replanning engine** — not an LLM — recalculates the affected plan: it finds an alternate route via Dijkstra's algorithm over the live road graph, checks resource and capacity constraints, and produces a new response plan. Every transition is written to an auditable decision log. AI (Groq, with Gemini as fallback) is used only to *explain* the decision in plain language and to answer natural-language operator questions — never to invent the underlying facts.

## 3. Why adaptive response matters

A response plan that can't adapt is a liability disguised as a plan. NEXUS's core demonstration is the full adaptive loop:

**Road R1 blocks → the plan using R1 is invalidated → the route engine finds R3→R7 → Team Alpha is rerouted → a new plan is activated → the map, event stream, and decision log all update live** — with no manual intervention required to detect or resolve the conflict. A human operator approves, modifies, or rejects the result; NEXUS never acts on real infrastructure autonomously.

---

## 4. Architecture

### Frontend — `frontend/`
React 18 + Vite (JavaScript, no TypeScript) + Tailwind CSS + React Router + Axios + Socket.IO client + Leaflet/React Leaflet + Recharts + Framer Motion + Lucide React.

```
frontend/src/
  api/          axios instance with auth interceptor
  services/     one file per REST resource (incidents, teams, plans, simulation, ai, ...)
  context/      AuthContext (JWT session), SocketContext (Socket.IO connection)
  hooks/        useApi, useSocketEvent, useLiveOperationalData
  layouts/      MarketingLayout (landing), DashboardLayout (command center)
  features/     landing/ (marketing sections), map/ (Leaflet map + icons),
                commandCenter/ (metrics, event stream, active plan), copilot/
  pages/        one file per route
  data/zones.js static node registry mirroring the backend's road graph, for map coordinates
```

### Backend — `backend/`
Node.js + Express + SQLite/Sequelize + Socket.IO + JWT + bcrypt + Helmet + CORS + express-rate-limit + multer + dotenv.

```
backend/src/
  config/       db.js (Sequelize/SQLite connection), zones.js (road-graph node registry)
  models/       User, Incident, ResponseTeam, Resource, Hospital, Shelter, Road,
                ResponsePlan, PlanAction, DecisionLog, SimulationEvent, SimulationState
                (associations.js wires all foreign keys and exports syncModels())
  middleware/   auth (JWT + RBAC), errorHandler, rateLimiter, upload (multer)
  controllers/  one per resource, thin — delegate to services
  routes/       one per resource, mounted under /api
  services/     routeEngine.service.js (Dijkstra), replanning.service.js
                (deterministic state-transition engine), counters.service.js
  simulation/   engine.js — resolves sensible default targets for each
                simulation event button
  ai/           groq.service.js, gemini.service.js, ai.service.js (fallback
                orchestration), prompts.js
  socket/       Socket.IO server + emitEvent() helper
  seed/         data.js (fictional scenario data) + seed.js (seedDatabase())
```

### AI architecture

| Provider | Role |
|---|---|
| **Groq** (`llama-3.3-70b-versatile`) | Primary: fast reasoning for the AI Response Copilot and decision explanations |
| **Gemini** (`gemini-1.5-flash`) | Vision: field-evidence photo analysis. Also the text fallback if Groq fails |
| **Deterministic fallback** | If both providers fail, the copilot returns a live data summary instead of an AI narrative — the dashboard never breaks because an AI provider is down |

The AI layer is **read-only over structured context**: `gatherOperationalContext()` queries the database for the current incidents, teams, hospitals, shelters, roads, active plans, and recent decisions, and that JSON is the *only* thing the model is allowed to reason over. The system prompt explicitly forbids inventing facts not present in the context.

### Multi-agent framing

The replanning engine is organized around named responsibilities that show up throughout the UI and decision log — **Situation, Risk, Route, Resource, Planning, and Replanning Agents**. In this implementation they are deterministic functions within `replanning.service.js` and `routeEngine.service.js`, not separate LLM calls; this keeps state transitions reliable and fully explainable, per the "do not depend entirely on an LLM" requirement.

### Route engine

`routeEngine.service.js` builds a weighted graph from the `Road` collection (`BASE`, `ZoneA`–`ZoneE` as nodes) and runs Dijkstra's algorithm, where `CONGESTED`/`DANGEROUS` roads carry a time penalty and `BLOCKED` roads are excluded entirely. This is pure graph logic — the LLM never computes a route.

### Adaptive replanning engine

`replanning.service.js` exports `recalculateResponsePlan(event)`, handling seven event types (`ROAD_BLOCKED`, `HOSPITAL_OVERLOAD`, `SHELTER_FULL`, `TEAM_UNAVAILABLE`, `FLOOD_RISING`, `SUPPLY_SHORTAGE`, `NEW_INCIDENT`). Each handler mutates the relevant database rows, invalidates affected plans, computes a replacement via the route engine or capacity lookup, creates a new `ResponsePlan` (with its `PlanAction` rows), writes a `DecisionLog` entry, and emits Socket.IO events — synchronously and deterministically. An AI explanation is attached to the decision log asynchronously afterward and never blocks or alters the decision itself.

### Real-time layer

Socket.IO broadcasts: `incident:created/updated`, `road:blocked/updated`, `team:updated`, `hospital:updated`, `shelter:updated`, `plan:created/invalidated/activated/approved/rejected`, `decision:created/explained`, `alert:created`, `simulation:event/state/reset`. The frontend's `useLiveOperationalData` hook and `EventStream` component subscribe directly — no polling.

### Database

SQLite via Sequelize — a single file at `backend/data/nexus.sqlite`, no external database service required. The old MongoDB-style embedded arrays (a plan's actions, a team's route/roadsUsed) are modeled relationally: `ResponsePlan` has many `PlanAction` rows (each optionally linked to a `ResponseTeam`, `Hospital`, or `Shelter`), while small nested structures that are never queried relationally (a team's `currentAssignment`, an incident's `evidence` list) stay as JSON columns. Every model's JSON output includes a stringified `_id` alias alongside its numeric `id`, so the frontend (written against Mongo-style `_id`s) needed no changes. Key indexes/uniques: `roadId`, `planNumber`, `decisionNumber`, `email`; `Incident.severity`/`status`/`createdAt` for filtering; `DecisionLog.createdAt` for the log view.

---

## 5. API summary

All routes are mounted under `/api` and (except `/auth/register`, `/auth/login`) require a `Bearer` JWT. Mutating routes require `COMMANDER` or `OPERATOR`; `VIEWER` is read-only.

`POST /auth/register|login`, `GET /auth/me` · `GET/POST /incidents`, `GET/PATCH /incidents/:id` · `GET /teams`, `PATCH /teams/:id` · `GET /resources`, `PATCH /resources/:id` · `GET /hospitals`, `PATCH /hospitals/:id` · `GET /shelters`, `PATCH /shelters/:id` · `GET /roads`, `PATCH /roads/:id` · `GET /plans`, `GET /plans/:id`, `POST /plans/:id/approve|reject` · `GET /simulation/state`, `POST /simulation/start|pause|resume|reset|event` · `POST /ai/query`, `POST /ai/analyze` (multipart) · `GET /decision-log` · `GET /dashboard/summary`.

---

## 6. Setup

### Prerequisites
- Node.js 18+
- A [Turso](https://turso.tech) database — this app always runs against Turso, local dev included (`turso db create`, `turso db show --url`, `turso db tokens create`)
- Optional: a Groq API key and a Gemini API key (the app runs without them — AI features fall back to deterministic summaries)

### Backend

```bash
cd backend
cp .env.example .env     # set TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, JWT_SECRET, GROQ_API_KEY, GEMINI_API_KEY
npm install
npm run seed              # seeds the Bihar Flood 2026 scenario into the Turso database
npm run dev                # starts on http://localhost:5000
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # starts on http://localhost:5173
```

### Demo accounts (created by `npm run seed`)

| Email | Role | Password |
|---|---|---|
| commander@nexus.io | COMMANDER | password123 |
| operator@nexus.io | OPERATOR | password123 |
| viewer@nexus.io | VIEWER | password123 |

---

## 7. Demo script — Patna Flood Response

1. Sign in as `operator@nexus.io` and open **Command Center**. Note Plan #17: Team Alpha → Zone B via R1, casualties → Hospital H2, evacuees → Shelter S2.
2. Go to **Simulation** and click **Road Blocked**. Watch: Road R1 turns blocked on the map, Plan #17 is invalidated, the route engine finds R3→R7, Team Alpha is rerouted, Plan #18 activates, the event stream and Decision Log update live.
3. Click **Hospital Overloaded** — Hospital H2 goes critical and new patients are redirected to the next hospital with capacity.
4. Click **Shelter Full** — Shelter S2 fills and evacuation is redirected to the shelter with the most free space.
5. Open **AI Planner** and click **Generate** under Risk Assessment to see a live, data-grounded AI narrative.
6. Open **Decision Log** to review the full audit trail, including the AI's plain-language explanation of each deterministic decision.
7. Ask the **AI Response Copilot** ("What changed in the last 10 minutes?") on the Command Center to see natural-language querying grounded in the same live data.

---

## 8. Responsible AI / human oversight

NEXUS is a **decision-support system**, not an autonomous controller of real infrastructure. Every simulated response plan can be **Approved**, **Modified**, or **Rejected** by an authorized operator. The AI layer is constrained to (a) explaining decisions already made by deterministic logic and (b) answering questions using only live, structured data it is given — it is never permitted to invent operational facts or to execute a state change on its own. All data in this application is fictional and clearly scoped to **SIMULATION MODE**.

## 9. Future scope

- Multi-scenario support beyond the Patna flood (wildfire, earthquake, cyclone templates)
- Persisted multi-tenant deployments per emergency-management agency
- Mobile field-operator app with offline-first evidence capture
- Fine-grained audit export (PDF/CSV) of the decision log for after-action review
- Configurable approval workflows (e.g., dual sign-off for high-impact plans)
