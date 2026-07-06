# Threadline Navigator — Product Overview

*A reference for developers and designers. It explains what the product is, how it
is organised (information architecture), and how its data and state logic work.*

> Scope note: This repository is a **front-end prototype / clinical demo**. There is no
> backend API for product data — every "record" is seeded in code and persisted to the
> browser's `localStorage`. The personas, copy, and clinical numbers are illustrative.
> The architecture below is real and is what you build on.

---

## 1. Introduction

### What it is
**Threadline Navigator** is a calm, parent-facing web app that helps families navigate a
child's developmental assessment and support journey. It sits between the messy reality of
"something feels hard with my child" and a structured, clinician-led plan.

The product brand is *Threadline* / "Safe Harbor". The app a parent uses day-to-day is the
**Navigator** dashboard.

### The problem it solves
Families exploring neurodevelopmental concerns (attention, emotions, learning, sleep,
communication, etc.) typically face fragmented information: school reports here, a
paediatrician note there, their own observations everywhere. Threadline pulls all of this
into **one place**, helps the parent notice what matters, prepares them for a clinician
session, and then turns the outcome into a **ranked, plain-language plan** (Now / Next /
Later) they can actually act on.

### Who uses it
- **Primary user — the parent/guardian/carer.** The whole UI is written in their voice:
  warm, non-clinical, reassuring. Copy deliberately avoids jargon ("parent-clarity" mode).
- **Secondary users — partner, teacher, family member, carer.** Invited into a child's
  workspace with **full** or **partial** access (see §6.5).
- **The clinician** (e.g. "Dr. Naomi Clark") is *referenced* throughout but does not log
  into this app. A core product principle is that **a registered clinician leads
  everything and reviews every result before the parent sees it.**

### Core product principles (these drive the UX and the data model)
1. **Clinician-led, human-accountable.** Threadline does the structured work behind the
   scenes; a person is always accountable. Reflected in copy and gating logic.
2. **Evidence → formulation.** Insights are traced to sources and carry an *evidence level*
   (Initial → Emerging → Strong). The app is honest about uncertainty ("more to explore" is
   a valid result).
3. **Parent observations are kept separate from clinical conclusions.** What a parent enters
   is intake *context*, never relabelled as a diagnosis.
4. **Ranked, not exhaustive.** The product refuses to hand over a giant to-do list. It
   ranks what matters by real impact and shows the reasoning (Now / Next / Later).
5. **Progressive disclosure.** Pages and sections unlock as the family completes intake and
   passes through assessment — nothing heavy is shown before it's earned.

---

## 2. Information Architecture

### 2.1 Tech stack (for the dev)
| Concern | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build/dev | Vite 6 (`npm run dev`, port 3000) |
| Routing | React Router 7 (`BrowserRouter`) |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite`) + CSS custom-property theming |
| Animation | `motion` (Framer Motion successor) |
| Charts | `recharts` |
| Icons | `lucide-react` |
| Class utils | `clsx` + `tailwind-merge` (wrapped in `lib/utils.ts` `cn()`) |
| AI (optional) | `@google/genai` — powers the `AICopilotBar`; needs `GEMINI_API_KEY` |
| Serve (prod) | `express` static server |

State is **React Context + `localStorage`**. There is no Redux, no server data layer.

### 2.2 Entry & routing
```
index.html → src/main.tsx → <App/>
```
`App.tsx` mounts the provider stack, then `AppContent` defines routes. Routing is two-level:

```
<BrowserRouter>
 ├─ /setup ............. AddChildFlow (full-page intake wizard, no dashboard chrome)
 └─ /* ................. DashboardLayout (Sidebar + TopBar + scroll area)
       ├─ /              → AllChildrenPage      (family overview — the true "home")
       ├─ /home          → HomePage             (guarded*)
       ├─ /preview       → NewChildPreviewPage
       ├─ /what-you-noticed → WhatYouNoticedPage (new child only, else → /home)
       ├─ /understanding → UnderstandingPage
       ├─ /priorities    → PrioritiesPage
       ├─ /roadmap       → RoadmapPage          (redirects by lifecycle, see §4)
       ├─ /reviews       → ReviewsPage          (guarded*)
       ├─ /resources     → ResourcesPage
       ├─ /documents     → DocumentsPage
       ├─ /settings      → SettingsPage
       ├─ /emerging-details → EmergingDetailsPage (guarded*)
       └─ /style-guide   → StyleGuidePage       (living design reference)
```
\* **Pre-assessment guard** (`withPreAssessmentGuard` in `App.tsx`): if the current child is
still `isNew`, `/home`, `/reviews`, and `/emerging-details` render the
`NewChildPreviewPage` instead of the assessed view. This is how the app stops a parent
seeing clinical content before the first session + clinical review.

The canonical page list is the `Page` union in [`src/types.ts`](src/types.ts). Allowed pages
per lifecycle live in [`src/navigation.ts`](src/navigation.ts) (`assessmentPages`,
`newChildAllowedPages`).

**Utility:** appending `?reset=1` to the URL clears all Threadline `localStorage` keys and
reloads — the demo "factory reset".

### 2.3 The page map (what each surface is for)
| Page | Audience state | Purpose |
|---|---|---|
| **All Children** (`/`) | always | Family overview. Carousel of "live updates" + a profile card per child (synthesis quote + plan/session card). The hub you navigate from. |
| **Home** (`/home`) | assessed | The daily "where to put your energy today" view: key synthesis, this-quarter plan progress, Now/Next/Later timeline, watchlist (e.g. Sleep), activities locker, AI copilot. For new children it shows setup progress + "what unlocks next". |
| **What you noticed** | new child | Mirrors the parent's intake answers (hardest areas, observations) back to them before the session. |
| **Understanding** | both | The clinical picture: strengths, areas affecting the day, evidence/sources. For new children, sections are **locked** until the matching questionnaire section is complete. |
| **Priorities** | both | Explains *how* Threadline ranks support (Now/Next/Later) and shows the ranked list with reasoning. |
| **Roadmap** | new child ("current") | The concrete plan / setup steps. |
| **Reviews** | assessed | Progress over time (charts, milestones, review rhythm). |
| **Emerging details** | assessed | Deep-dive on the current primary focus / watchlist topic. |
| **Resources** | both | Personalised guides, templates, videos, classroom packs. |
| **Documents** | both | The encrypted "Documents locker" — reports & notes, with sharing. |
| **Settings** | always | Profiles, secondary-user access, and the design/theme controls. |
| **New child preview** | new child | A read-only teaser of the dashboard the family will unlock after assessment. |
| **Style guide** | dev/design | Living catalogue of the UI kit and tokens. |

### 2.4 Navigation chrome
- **Sidebar** ([`Sidebar.tsx`](src/components/Sidebar.tsx)) — the nav item set is
  **state-dependent** (see §4.3). Collapsible; auto-collapses on All-Children; Settings
  pinned at the bottom; the logo returns to All-Children.
- **TopBar** ([`TopBar.tsx`](src/components/TopBar.tsx)) — child switcher, "add child",
  mobile menu, and the new-child *experience* toggle.
- **DashboardLayout** — `Sidebar + TopBar + <AnimatePresence>` scroll region.

---

## 3. Data Structure Logic

### 3.1 The central entity: `Child`
Everything orbits the currently-selected child. From [`src/types.ts`](src/types.ts):

```ts
interface Child {
  id?: string;
  name: string;
  age: number;
  initial: string;          // avatar letter
  isNew?: boolean;          // true = still in intake/pre-assessment
  intake?: {
    relation?: string;                 // Parent / Guardian / Carer
    journeyStage?: string;             // drives "tone" (see §3.4)
    availableInfo?: string[];          // existing reports the family has
    notices?: string[];                // "hardest right now" areas (≤3)
    notes?: string;
    sessionDay?: string;               // booking
    sessionTime?: string;
    sessionCancelled?: boolean;
    questionnaireAnswers?: Record<string, unknown>;   // keyed by question id
    completedQuestionnaireSections?: string[];         // section names
  };
}
```

The **`isNew` flag is the master switch** for the whole experience:
- `isNew: true` → intake / pre-assessment world (setup, locked content, preview).
- `isNew: false` → assessed world (full clinical dashboard).

`intake` only exists while `isNew`. It is the bag that the setup wizard fills.

Other domain types in `types.ts`: `Priority` (tag Now/Next/Later + impact/risk/burden/
capacity/progress/dependencies), `Strategy`, `Resource`, `DocFile`, plus component-prop
interfaces. Most clinical content for assessed children is **not** stored on the child — it
is looked up by name in `data.ts` (§3.3).

### 3.2 State management — the Context stack
Providers are nested in `App.tsx` (outer → inner):

```
ChildProvider
 └─ LockerProvider
     └─ DisplayModeProvider
         └─ NewChildExperienceProvider
             └─ SecondaryUsersProvider
```

| Context | File | Owns | Persisted key(s) |
|---|---|---|---|
| **ChildContext** | `context/ChildContext.tsx` | `childrenList`, `currentChild`, CRUD, `createNewChild` | `threadline-children`, `threadline-current-child`, `threadline-demo-data-version` |
| **LockerContext** | `context/LockerContext.tsx` | document files, search/filter, share toggle | *(in-memory only)* |
| **DisplayModeContext** | `context/DisplayModeContext.tsx` | display mode (hardcoded `parent-clarity`) | *(none)* |
| **NewChildExperienceContext** | `context/NewChildExperienceContext.tsx` | `current` vs `review` experience | `threadline-new-child-experience` |
| **SecondaryUsersContext** | `context/SecondaryUsersContext.tsx` | invited users + access level | `threadline-secondary-users` |

Pattern in each provider: read seed/`localStorage` lazily on init → keep in `useState` →
mirror back to `localStorage` in a `useEffect`. All storage access is wrapped in
try/catch so the app still works in restricted contexts (it just falls back to in-memory
defaults).

### 3.3 Seed data & demo personas
`ChildContext` ships five seeded children that demonstrate every lifecycle state:

| Child | id | `isNew` | Represents |
|---|---|---|---|
| **Tom** | `child-tom` | ✅ | Brand-new, empty intake (nothing started) |
| **Ava** | `child-ava` | ✅ | Intake fully filled + session booked (ready for assessment) |
| **Maya** | `child-maya` | — | Assessed, plan **on track** (65%) |
| **Liam** | `child-liam` | — | Assessed, plan **complete / maintenance** (100%) |
| **Noah** | `child-noah` | — | Assessed, plan **not started** (0%) |

A sixth persona, **Sophia** (steady, 58%), exists in the copy/data layer (`data.ts`,
`AllChildrenPage`) but is not in the seed list — a latent profile.

**Clinical content for assessed children is keyed by name**, not stored on the record.
`getChildData(child)` in [`src/data.ts`](src/data.ts) returns a `ChildData` object
(`home`, `understanding`, `priorities` copy blocks) via a `name` switch, defaulting to Maya.
This is why renaming a seeded child changes its dashboard content.

**Demo reseed / migration logic** (important when debugging "why did my data reset"):
- `DEMO_DATA_VERSION` (`'quarter-zero-noah-v1'`) — bumping it wipes stored children so new
  seed data appears.
- `CANONICAL_CHILDREN_BY_ID` re-hydrates seeded children to their canonical definition.
- `LEGACY_CANONICAL_ID_ALIASES` maps old ids (`child-new`, `child-maya-1`, …) to current
  ones, so previously-saved `localStorage` keeps working.
- `normalizeChildren()` guarantees Noah is always present.

### 3.4 Derived state (computed, never stored)
The app prefers **deriving** lifecycle facts from the `Child` record over storing flags.
Two helper modules do this:

**[`lib/childStatus.ts`](src/lib/childStatus.ts):**
- `getChildSessionStatus` → `'booked' | 'cancelled' | 'not-booked'`
- `isSessionBooked`, `getSessionDate(child, 'short'|'long')`
- `isMaintenancePhase(child)` → `name === 'Liam'` (plan complete)
- `isPlanNotStarted(child)` → `name === 'Noah'` (0% plan)
- `isNewChildOnboardingComplete(child)` → `isNew && all sections complete && session booked`
- `getChildSubheading(child)` → the status line under a name ("Intake in progress",
  "Assessment pending", "Session cancelled", or "Age N")

> Note: maintenance/not-started phases are currently keyed off **persona name** (Liam/Noah).
> This is a demo shortcut, intentionally centralised here so there is one place to replace
> with a real status field later.

**[`lib/journeyCopy.ts`](src/lib/journeyCopy.ts):** maps `intake.journeyStage` to a
**tone** — `'exploring' | 'waiting' | 'diagnosed'` — and returns tone-specific copy for the
setup, home, and understanding surfaces. `hasReportContext(availableInfo)` toggles
report-vs-gentle messaging. This is how the same screens feel different for a family just
noticing concerns vs one already holding a diagnosis.

### 3.5 The questionnaire engine
[`src/questionnaire.ts`](src/questionnaire.ts) is a small data-driven survey engine.

- `QUESTIONS` is a `Record<sectionName, Question[]>` with **4 sections**:
  1. *What's going well* (3 questions)
  2. *What you're seeing* (3)
  3. *At school* (2)
  4. *Development & history* (1 multi-select)
- `Question` = `{ id, text, subtext?, type: 'choice'|'multiple-choice'|'text', options?, placeholder? }`.
  Question text supports `${childName}` interpolation, filled at render time.
- Answers are stored flat on `intake.questionnaireAnswers`, keyed by `question.id`
  (e.g. `attention_focus: 'Creative or play activities'`).
- Completion is **computed**: `getCompletedQuestionnaireSections(answers)` returns the
  sections where every question is answered; `getAnsweredCount`, `isAnswered`,
  `formatAnswer` support partial states.
- `normalizeQuestionnaireSectionName` migrates a renamed legacy section
  ("What we're seeing" → "What you're seeing").

This single source of truth drives three different surfaces: the setup wizard (step 4),
the in-page `QuestionnaireModal`, and the progressive unlock on the Understanding page.

### 3.6 Persistence summary (all `localStorage` keys)
```
threadline-children                 // Child[]
threadline-current-child            // active child id (or name)
threadline-demo-data-version        // demo reseed guard
threadline-new-child-experience     // 'current' | 'review'
threadline-secondary-users          // SecondaryUser[]
thread-theme                        // 'energetic' | 'classic'
thread-font                         // 'modern-serif' | 'classic-serif'
thread-hero-style                   // 'white' | 'green'
thread-secondary-style              // 'light' | 'dark'
threadline-zero-progress-moment-*   // sessionStorage: one-time Noah welcome modal
```
The Documents locker is **not** persisted (resets on reload).

---

## 4. The Child Lifecycle (the real "state machine")

Understanding this is the key to understanding the product. A child moves through phases,
and almost every screen branches on where they are.

```
            NEW CHILD  (isNew = true)                  ASSESSED CHILD (isNew = false)
 ┌───────────────────────────────────────────┐   ┌──────────────────────────────────┐
 │  intake {} → questionnaire → book session  │   │  plan phases:                    │
 │                                            │   │   • not started (Noah, 0%)       │
 │  session: not-booked → booked → cancelled  │ ⇒ │   • on track   (Maya, 65%)       │
 │                                            │   │   • steady     (Sophia, 58%)     │
 │  onboarding complete =                     │   │   • complete / maintenance       │
 │    all 4 sections done  AND  session booked│   │       (Liam, 100%)               │
 └───────────────────────────────────────────┘   └──────────────────────────────────┘
        guarded → NewChildPreviewPage                 full clinical dashboard
```

The transition from new → assessed (after the first session + clinical review) is a
**demo seed change**, not an in-app action — there is no "mark assessed" button.

### 4.1 New-child sub-states
Driven by `getChildSessionStatus` + questionnaire completion:
- **Intake in progress** — questionnaire incomplete.
- **Assessment pending** — `isNewChildOnboardingComplete` (all sections + booked).
- **Session cancelled** — `sessionCancelled` with no booking.

### 4.2 The two new-child *experiences* (`NewChildExperienceContext`)
A new child is shown in one of two framings, toggled from the TopBar and defaulting to
`review`:
- **`current`** — "first time through" framing → nav includes **What you noticed** and
  **Roadmap**.
- **`review`** — "coming back for a review" framing → nav swaps to a **Reviews**/Documents
  shape and `/roadmap` redirects to `/home`.

### 4.3 Nav set by state (`Sidebar.tsx`)
| State | Sidebar items |
|---|---|
| Assessed | Home · Understanding · Priorities · Reviews · Resources · Documents |
| New child — *current* | Home · What you noticed · Understanding · Priorities · Roadmap · Resources |
| New child — *review* | Home · Understanding · Priorities · Reviews · Resources · Documents |

`/roadmap` route logic captures the lifecycle branching well:
`isNew && current → Roadmap` · `isNew && review → /home` · `assessed → /reviews`.

---

## 5. Key Flows

### 5.1 Setup / intake wizard — `AddChildFlow.tsx`
The single most complex component (~1.5k lines). Renders either **full-page** (`/setup`) or
**as a modal** (opened from a dashboard via `onOpenSetup(step)`).

Steps: **Welcome → 1 Journey → 2 Your child → 3 Hardest right now → 4 Questionnaire →
5 Your session → Done.**

- **Step 1 – Journey:** `journeyStage` (Noticing concerns / Waiting for assessment /
  Diagnosed, need next steps) → sets the *tone* for all copy.
- **Step 2 – Your child:** first name, year of birth, relation.
- **Step 3 – Hardest right now:** up to **3** `notices` chips.
- **Step 4 – Questionnaire:** lists the 4 sections with progress ring; each opens a
  **one-question-at-a-time modal** with Typeform-style keyboard nav (↑/↓/Enter, A/B/C to
  pick options), auto-advance on choice, and a review state at the end.
- **Step 5 – Your session:** "ready to book?" gate → day/time picker → 45-min telehealth
  with the named clinician. Supports **reschedule** and **cancel** (with confirm). Deep-link
  `/setup?step=5&directSession=1` jumps straight here.

Writes go to `currentChild.intake` via `buildIntake()` + `updateChild()` (or `addChild`).
Progress is saved as you go, so the flow is resumable. Query params (`step`, `section`,
`directSession`) allow deep-linking into any step.

### 5.2 Progressive unlock — Understanding page (new child)
`UnderstandingPage.tsx` for a new child renders each content block only if its source
questionnaire section is complete; otherwise it shows a `LockedQuestionnaireSection`
card ("Answer all N questions to open it here"). The inline `QuestionnaireModal` lets the
parent fill/edit answers in place and **auto-advances to the next incomplete section** on
save. This is the same questionnaire data from §3.5, surfaced as live, unlockable content.

### 5.3 Secondary-user sharing — Settings
`SettingsPage.tsx` (via `SecondaryUsersContext`) lets the parent invite a partner / teacher
/ family member / carer with **full** (mirrors parent's view) or **partial** (selected
areas) access, change access, or remove them. Seeded with James (full) and Ms. Carter
(partial).

---

## 6. Design System (for the designer)

### 6.1 Source of truth
- **[`DESIGN_GUIDELINES.md`](DESIGN_GUIDELINES.md)** — the written spec (typography, colour,
  spacing, components, do/don't). Read this first.
- **`StyleGuidePage`** (`/style-guide`) — the living, rendered catalogue.
- **`src/components/ui/`** — ~45 reusable primitives (Button, Card, HeroQuoteCard,
  GuideCard, ValueCard, AreaItem, TimelineItem, EvidenceBadge/Meter, ProgressBar,
  PageHeader/Container/FooterCTA, QuestionnaireModal, …). **Reuse before adding one-offs.**

### 6.2 Theming via CSS custom properties (`src/index.css`)
Theming is **attribute-driven** on `<html>`. `App.tsx` reads the persisted choices on load
and sets the attributes; `SettingsPage` changes them live.

| `data-` attribute | Values | Effect |
|---|---|---|
| `data-theme` | `energetic` (default) · `classic` | Green palette + neutrals |
| `data-font` | (modern Fraunces, default) · `classic-serif` (Frank Ruhl Libre) | Serif family |
| `data-hero-style` | `white` (default) · `green` | Hero card surface |
| `data-hero-secondary` | `light` · `dark` | Secondary hero accent |
| `data-display-mode` | `parent-clarity` (fixed) | Plain-language vs clinical copy |
| `data-new-child-experience` | `current` · `review` | (see §4.2) |

> Implementation note for the dev: `App.tsx` defaults `thread-font` to `'modern-serif'`, but
> the CSS only overrides on `data-font='classic-serif'`. The default (Fraunces) is the base
> `:root` value, so this is consistent — just be aware the "modern" value is the absence of
> an override.

### 6.3 Core tokens (energetic theme)
| Token | Value | Use |
|---|---|---|
| `--color-thread-heading` | `#0B4636` | Headings / primary text |
| `--color-thread-mid-green` | `#108560` | Brand green: active, icons, CTAs |
| `--color-thread-light-green` | `#E6F4ED` | Mint: selected states, chips |
| `--color-thread-off-white` | `#F5F7F6` | App background |
| `--color-thread-cream` | `#EEE9D9` | Warm accent surface |
| `--color-thread-dark-slate` | `#1F2937` | Body text |
| `--color-thread-gray` | `#6B7280` | Secondary text |

Fonts: **Inter** (sans — body, UI) + **Fraunces / Frank Ruhl Libre** (serif — H1s, hero
quotes, big numbers). Shadows are soft "premium" elevation tokens (`--shadow-premium`,
`--shadow-modal`, …).

### 6.4 Visual language (in one breath)
Calm, professional, warm, lightly clinical. Expressive **single-corner radii**
(`rounded-tr-[32px]`), thin `black/5–10` borders, mostly-flat cards, mint selected states,
gentle `motion` fades/translations (0.3–0.5s), green focus rings, and **evidence/status
badges** everywhere (the *evidence level* 1→3 = Initial → Emerging → Strong formulation).
Don't rely on colour alone for status; pair with text/icon.

### 6.5 Accessibility commitments
≥44px targets, visible green focus rings, keyboard access preserved in the questionnaire
modal (with a visible Save & exit), high-contrast text, restrained motion. Validate with
real keyboard/screen-reader passes before claiming compliance.

---

## 7. Code Map (quick reference)
```
src/
├─ App.tsx                 # providers + routing + pre-assessment guard
├─ main.tsx                # React root
├─ types.ts                # Page union + Child, Priority, … domain types
├─ navigation.ts           # which pages are allowed per lifecycle
├─ data.ts                 # per-persona clinical copy (getChildData)
├─ questionnaire.ts        # survey schema + completion helpers
├─ index.css               # theme tokens + data-* theming
├─ context/                # 5 providers (Child, Locker, DisplayMode, NewChildExperience, SecondaryUsers)
├─ lib/
│   ├─ childStatus.ts      # derived lifecycle/session helpers
│   ├─ journeyCopy.ts      # tone → copy mapping
│   ├─ utils.ts            # cn()
│   └─ motion-presets.ts
├─ components/             # one file per page + DashboardLayout/Sidebar/TopBar
│   └─ ui/                 # ~45 reusable design-system primitives
└─ assets/images/          # watercolor backgrounds, clinician/photo assets
```

---

## 8. Notes, Caveats & Where to Extend
- **No backend.** To make this real you'd replace the seed/`localStorage` layer in the
  contexts with API calls, and move per-persona content out of `data.ts` onto the record.
- **Lifecycle is partly name-keyed.** `isMaintenancePhase`/`isPlanNotStarted` switch on
  persona name. Replace with an explicit `planStatus`/`phase` field on `Child` — they're
  centralised in `lib/childStatus.ts` for exactly this reason.
- **`new → assessed` has no in-app trigger.** It's a seed change today; a real product needs
  a clinician-side action to flip `isNew`.
- **DisplayMode is fixed** to `parent-clarity` (the `classic` clinical voice is latent).
- **Documents locker is ephemeral** (not persisted).
- **Adjacent folders** `app/`, `home/`, `correct-threadline-nav-work/` are alternate/backup
  copies — the live app is `src/`.

---

*Generated from the codebase on 2026-06-29. Pair this with `DESIGN_GUIDELINES.md` (design
detail) and the `/style-guide` route (rendered components).*
