# Between-Session Strategy — Staying Useful Without Adding Work

*A product-strategy reference for the ~90-day gap between clinician sessions. It explains
the reasoning (why), the logic (how the model works), and gives practical examples you can
build from. Pair with [`PRODUCT_OVERVIEW.md`](PRODUCT_OVERVIEW.md) — this doc assumes the
lifecycle, questionnaire engine, and clinician-led principle described there.*

> Scope note: This is a **strategy and design-rationale** document, not an implementation
> spec. Examples use the seeded personas (Maya, Liam, Noah, Ava, Tom) from
> `PRODUCT_OVERVIEW.md §3.3`. Nothing here requires the backend that doesn't yet exist —
> it describes the behaviour to build toward.

---

## 1. The problem

A family has a clinician session roughly every **90 days**. After each session, the
**Understanding** and **Priorities** pages update with the clinician's new formulation and
plan. Between those two points, Navigator currently goes quiet.

The fear: **the family loses touch with the product over 90 days** — they forget it exists,
the plan goes stale, and they walk into the next session having done little and remembered
less.

The trap: the obvious fix is "drive engagement" — journals, daily tracking, streaks,
reminders. **For this audience that fix is actively harmful.** Our families are already
overwhelmed, effectively acting as project managers for their child's care, and are often
neurodiverse themselves. Asking them to do *more* work is the opposite of help.

This document is the reasoning for a different approach.

---

## 2. The core reframe: it's not engagement, it's trust

**"Engagement" is the wrong North Star here.** Engagement is a consumer-app metric — it
makes sense when *usage is the value* (a game, a social feed). Navigator is a
clinically-tethered tool. Optimising for "opens the app between sessions" leads to features
that betray this audience.

What we actually want between sessions is three things, none of which is engagement:

| Goal | What it means | Why it matters |
|---|---|---|
| **Continuity** | The plan stays alive and gets *acted on*, instead of forgotten by day 10. | The plan only works if the family follows it. |
| **Signal capture** | The next review is never a cold start — the clinician walks in with real data, not "I think mornings got worse? maybe?" | Makes the expensive 90-day session far more valuable. |
| **Trust / accompaniment** | The family feels *carried*, not abandoned for three months. | Trust is the durable asset; it's why they come back. |

> **The sharp version:** a parent who opens Navigator **zero times** between sessions but
> walks into the review prepared — because of two well-timed touches — is a **success
> case, not a failure case.** If we measure between-session DAU, we will build the wrong
> things. Measure *quality of the next review* and *problems caught early* instead, and the
> right design falls out almost automatically.

This aligns with the product's existing principles (`PRODUCT_OVERVIEW.md §1`):
*clinician-led, human-accountable* and *ranked, not exhaustive*. The between-session system
is the same philosophy extended across time.

---

## 3. The model: the trust loop

The mental model we are **moving away from** is the engagement habit loop:

```
Use Navigator  →  Record journal  →  Come back tomorrow
   (product-triggered, daily, work-based)
```

The model we are **building toward** is value-first and event-triggered:

```
Something happens  →  Navigator helps  →  Parent feels lighter  →  Navigator becomes trusted
   (world-triggered, occasional, work-removing)
```

Two deliberate moves make this work:

1. **The trigger moves from the product to the world.** Navigator doesn't ask to be used;
   it shows up *because something happened* (a med started two weeks ago, a report arrived,
   a review is approaching). This is what kills the journal/streak trap at the root.
2. **The loop ends in *trusted*, not *engaged*.** Trust is the durable outcome; engagement
   is a vanity proxy.

### 3.1 The hidden step — and the bootstrap problem

There is a gap between "something happens" and "Navigator helps": **how does Navigator find
out something happened?** There are only two paths, and they create a chicken-and-egg:

- **Parent brings it (pull):** requires the parent to *think of Navigator in the moment* —
  which only happens once Navigator is already trusted. But trust is the *output* of the
  loop, not the input. The loop can't cold-start itself.
- **Navigator anticipates it (push):** Navigator predicts the likely event from the plan
  (*"meds started two weeks ago — this is when side effects show"*) and reaches out first.

**So there are really two loops, and you bootstrap from one into the other:**

```
EARLY (push loop):    Navigator anticipates  →  helps  →  trust grows
                                                              │
                                                              ▼
LATER (pull loop):    Parent brings it  →  Navigator helps  →  trust deepens  ──┐
                          ▲                                                      │
                          └──────────────────────────────────────────────────────┘
```

The well-timed email is **not engagement bait** — it is the *seed crystal* for a loop that
can't otherwise start. Over time, each good anticipated touch builds enough trust that the
parent starts bringing things *to* Navigator unprompted, and the loop becomes
self-sustaining. **A rising rate of parent-initiated captures is the real signal that trust
is forming** (see §9).

### 3.2 "Helps" must give something back *now*

"Navigator helps" carries enormous weight, and it's where the journal sneaks back in. If
"helps" quietly means "lets you record it," we've rebuilt the journal with nicer copy.
**Storage is not help — the parent feels no lighter.** Help has to be one of a small set of
verbs that return something in the moment:

| Verb | What Navigator does | Example response |
|---|---|---|
| **Absorbs** | Takes the thing off the parent's mind. | "Noted, saved for Dr. Clark. You can stop holding this." |
| **Reassures** | Normalises with context. | "This is common at week two — here's why." |
| **Directs** | Gives the *one* next action. | "Here's how to raise this with the school." |
| **Routes** | Sends it to the human. | "Flagged for your clinician ahead of the review." |

Test every interaction against: *what is the parent **lighter by**, the second after they
respond?* If the answer is "nothing, but we stored it," it fails.

> **Note on wording:** the emotional payoff is **lighter / less alone / on top of it**, not
> "organised." *Organised* implies the parent did organising work. The whole pitch is that
> they didn't have to. Aim for **relief**, not tidiness.

### 3.3 Close the loop through the clinician

The deepest version of the loop doesn't return to the parent — it routes through the
clinician and *then* back:

```
Something happens
   ↓
Navigator absorbs it            ← (anticipated at first, then parent-initiated)
   ↓
It surfaces in the review / the clinician acts on it
   ↓
Parent sees their daily life actually reached their child's care
   ↓
Navigator becomes trusted       → (so next time, they bring it themselves)
```

If the loop closes parent → app → parent, we've built a pleasant org tool. If it closes
**parent → app → clinician → parent**, we've built the moat: the parent isn't trusting an
app, they're trusting that the app *faithfully carries their world to the human who
matters.* This is the natural extension of the existing *clinician-led, human-accountable*
principle.

---

## 4. The governing design principles

These constrain **every** between-session idea. They are the difference between "helpful
guide" and "one more thing nagging me."

1. **Nothing that can be "missed."** No streaks, no red unread badges, no "you haven't
   checked in for 5 days," no progress bars that go backwards. Every one of those generates
   **guilt**, and guilt is the most toxic thing you can hand a parent who already feels like
   they're failing their child.
2. **Silence is a valid output.** Most engagement designers can't stomach this; for this
   audience it's the core discipline. *When in doubt, send nothing.*
3. **Trust is asymmetric — it compounds slowly and breaks fast.** One pointless ping, or one
   "it made me do work," erodes more than ten good touches build. Therefore the bar per
   touch is brutal: **better to do nothing than something mediocre.**
4. **Every touch must do a named job.** Each interaction must either *reduce* cognitive load
   or *capture* a specific, useful piece of signal for the next review. A touch with no job
   is noise.
5. **Never punish non-response.** If a parent ignores touches, you *quietly reduce*
   frequency (behavioural throttling) — you never chase, never reference a non-response.
6. **Conduit, not advisor.** Navigator carries the clinician's words accurately; it does not
   invent clinical opinions (see §7).

---

## 5. The 90 days have a *shape*

The instinct to send a flat weekly drip ("here's this week's tip") should be rejected — a
generic tip is exactly the noise we're avoiding, and it's the first thing that reads as
spam. The period has a **natural arc**, and cadence should be **dense at the edges,
near-silent in the middle.**

| Phase | Window | Job | What Navigator does |
|---|---|---|---|
| **Implementation** | Weeks 1–2 after session | Make sure the plan actually *starts*. | One gentle, plan-aware nudge on the first concrete action. This is where plans die — highest leverage point in the whole cycle. |
| **Living it** | Weeks 3–10 | Light-touch signal capture + early problem-catching. | One or two *plan-anchored* single questions, only about what the family is actively living through. |
| **Preparation** | Last ~2 weeks before next session | Turn scattered captures into a prepared parent + a richer review. | A pre-review summary: "here's what changed since last time — anything to add?" |

Mapped to email (§6), that's roughly **4–6 touches per 90 days** total — not a weekly
cadence. The arc, not the calendar, decides when Navigator speaks.

### 5.1 Worked example — Noah (plan *not started*, 0%)

Noah's persona is "assessed, plan not started." This is the exact case the **Implementation**
phase exists for:

- **Day 10, single email:** *"Quick one about Noah — were you able to get started on the
  first step (booking the OT)? 👍 Done · 🕐 Not yet · 😕 Hit a snag"*
- Parent taps **"Hit a snag"** → tiny page: *"No problem. Want me to flag this for Dr. Clark
  so she can help at the review? [Flag it]"* → **Routes.**
- The plan-stall is caught on day 10 instead of surfacing as a wasted quarter on day 90.

### 5.2 Worked example — Maya (on track, 65%)

- **~Week 6, plan-anchored question:** Maya's current priority is sleep. Navigator re-asks
  the *one* highest-signal sleep question from intake (see §8): *"Back at the start, bedtime
  was a real struggle most nights. How's it feeling now? 😴 Still hard · 😐 Mixed ·
  🙂 Better"*
- Answer is recorded as a **delta against baseline** — meaningful to the parent *and* the
  clinician — and the parent gets back: *"Saved for the review. Nice to see it trending the
  right way."* → **Absorbs + reassures.**

### 5.3 Worked example — Liam (maintenance, 100%)

- Almost silent through the middle. The main touch is the **Preparation** email two weeks
  out: *"Your review with Dr. Clark is on the 14th. Things have looked steady. Here's the
  one note you flagged last month — want to add anything before you meet?"* → low frequency
  matches a maintenance-phase family who needs reassurance, not activity.

---

## 6. The channel: email

It's a web app, so we can't push native notifications. The channel is **email** (with SMS
considered for the one or two most time-critical touches — see §6.4). Email changes the
design more than it first appears.

### 6.1 The email *is* the product surface — not a doorway to it

The failure mode is "Dr. Clark updated your plan — **log in to see.**" An overwhelmed parent
won't make that trip. **Put the value in the email body**, and make the single question
**answerable inside the email itself**:

> *How are mornings feeling?*  **😴 Rough · 😐 Same · 🙂 Better**

Three buttons that record the answer on click and drop the parent on a tiny "thanks — saved
for Dr. Clark" page. No login, no blank page, five seconds, done. Email is the one channel
where friction can collapse to a single tap — lean all the way into it. The web app becomes
the place they go when they *choose* to go deeper, not a toll gate.

### 6.2 The real risk moves from "guilt" to "the unsubscribe cliff"

Email is actually *better* on guilt — no badge silently accumulating. But it has a worse
failure: **one annoyed unsubscribe and the only channel is permanently gone.** With a native
app you can re-engage; with email, that door locks. Mitigations:

- **Give a dial, not just an exit.** Every footer: *"Too much? Send me less · Just the
  pre-review prep."* Let them turn it down instead of off.
- **Behavioural throttling, never punitive** (principle §4.5): ignore three in a row →
  quietly reduce frequency. Never "we noticed you haven't…" — that sentence is an
  unsubscribe.

### 6.3 It must not smell like a newsletter

These families are drowning in email — NDIS, school, appointment reminders. Ours has to look
like none of those:

- **From a named human** ("Dr. Clark via Navigator" or a named care coordinator), not "The
  Navigator Team."
- **Subject lines that read like a person:** *"Quick one about Liam's mornings"* — not
  *"Your weekly Navigator update ✨."* The instant it looks marketed, trust is gone.
- **Watch deliverability as a real signal, not vanity.** If we land in Promotions/spam, the
  parent thinks we abandoned them and we think we're reaching them — the trust goal fails
  *silently*. Ask them to whitelist the sender at onboarding; treat a falling open rate as a
  **deliverability alarm**, not an engagement disappointment.

### 6.4 SMS for the time-critical touch (a deliberate exception)

For the single most time-critical touch — the **week-1 "did the plan actually start?"**
nudge — SMS dramatically out-performs email on open and response, and it doesn't land in the
paperwork pile. It costs money and needs tighter consent, so it's not for everything. But
for the one or two touches where *catching a dropped plan early* genuinely matters, a text
may be worth far more than an email. Decide this deliberately rather than defaulting.

### 6.5 The Preparation email is the artifact email was made for

Two weeks out, an email can carry the **actual pre-filled agenda** for the next review and
let the parent edit it in one click:

> *Your review with Dr. Clark is on the 14th. Since last time:*
> - *The rash you flagged (week 3) — noted for her.*
> - *Mornings: trending better (you said 🙂 last week).*
> - *School contact: still open.*
>
> *Anything to add? [Add a note]*

This makes the parent feel **prepared instead of blindsided**, and hands the clinician real
data. **If we ship only one email in the whole 90 days, ship this one.**

---

## 7. The data we have, and what each part is *for*

The system holds data from three sources: **clinical sessions**, the **questionnaire**, and
**documents**. They map onto the loop, but each does a *different* job — be precise about
which.

| Source | Role in the loop | What it enables |
|---|---|---|
| **Questionnaire** (`questionnaire.ts`, 4 sections) | **Baseline** | Turns "How are mornings?" from a vibe into a **delta**. "Bedtime was a struggle at intake" makes "how is it now?" a real, comparable signal — for parent *and* clinician. |
| **Clinical session** (Understanding / Priorities / plan) | **The plan + its timing** | Drives **anticipation** (meds started June 1 → ask June 14 = the push loop) and **relevance** (only ever surface a *currently active* Now/Next/Later priority). This is *why* a single question can be relevant at all. A generic app cannot do this. |
| **Documents** (the locker) | **The load itself — and a trigger** | A document *arriving* is a "something happens" event. Digesting it ("the two things this report asks you to do: 1… 2…") is the purest cognitive-offload help we can offer. |

### 7.1 The reframe that sets build order

**All three sources are *snapshots*.** Sessions update every ~90 days; the questionnaire is
intake; documents arrive sporadically. They tell us **what to ask and when** — they do
**not** tell us **how it's actually going** day to day. That live signal doesn't exist yet;
**it is exactly what the loop collects.** So:

> Existing data = the **questions.**  The loop = the **answers.**  The next review = where
> they **meet.**

### 7.2 Two concrete things this unlocks

1. **The micro-question shouldn't be ad hoc — it should be a re-administered questionnaire
   item** (see §8). Re-asking a *real* `Question` tied to the current priority yields a
   clinically meaningful, structured delta against baseline — not a freeform feeling.
2. **Before any notification, narrate the change at the landing moment.** We have
   session-over-session data, so when a parent lands after a review, don't just show changed
   pages — *narrate the diff*: *"Since last time, Dr. Clark moved the focus from sleep to
   school anxiety, because…"* Pure offload, zero work, no email required. A trust seed that
   costs the parent nothing. (Today the pages just silently change — see
   `PRODUCT_OVERVIEW.md §2.3`.)

---

## 8. The micro-question engine = the existing questionnaire

The most important practical insight: **we don't need to invent a question engine — we
already have one.** `questionnaire.ts` (`PRODUCT_OVERVIEW.md §3.5`) is a data-driven survey
of 4 sections, with answers stored flat on `intake.questionnaireAnswers` keyed by
`question.id`, and `${childName}` interpolation already built in.

The between-session micro-question is simply: **re-administer the single highest-signal
questionnaire item tied to the current active priority**, and store the new answer with a
timestamp so it can be compared to the intake baseline.

Why this is the right move:

- **Clinically legible.** The clinician already understands these items; the answer slots
  straight into the review in a form they trust.
- **Structured, comparable data** — a delta against a known baseline, not a vibe.
- **Already built and interpolated** — reuse, don't reinvent (consistent with the design
  system's "reuse before adding one-offs" rule).
- **Naturally rate-limited** — there are only a handful of items, so we *can't* over-ask.

Practical shape:

```
priority (from session)  →  pick the linked questionnaire item  →  re-ask it (email, 1 tap)
        →  store answer + timestamp  →  delta vs intake baseline  →  surface in next review
```

> Open question to resolve (decides build order): is the questionnaire *ever re-administered*
> today, or is it strictly intake-only? If we can re-ask even a 1–2 item slice between
> sessions, the micro-interaction engine is **already built and clinically legible** — and we
> don't have to design a single new question.

---

## 9. How to measure it (and what *not* to measure)

The metrics follow directly from §2: we are not chasing engagement.

**Measure:**

| Metric | What it tells us |
|---|---|
| **Quality of the next review** (clinician-rated: "did you have useful between-session signal?") | Whether continuity + signal capture are working. The headline metric. |
| **Problems caught early** (issues routed to the clinician before the review) | Whether the safety/early-catch value is real. |
| **Rate of parent-initiated captures over time** | Whether **trust is forming** — the push loop converting into the self-sustaining pull loop (§3.1). |
| **Email health** (open rate as deliverability signal, unsubscribe rate, "send me less" rate) | A *guardrail*, not a success metric — watch the unsubscribe cliff (§6.2). |

**Do not measure as success:** between-session DAU/WAU, session length, "opens per week."
These will push the team to build the journal/streak features this whole strategy exists to
avoid.

---

## 10. Risks & guardrails

| Risk | Why it's serious here | Guardrail |
|---|---|---|
| **Faithless extraction of clinical content** | The moment Navigator *paraphrases* a report/note to a scared parent, one error breaks trust the fastest way possible — and with meds or safety language, that's not just trust, it's harm. | Anything shown to the parent that's derived from a clinical doc/note must be **verifiably extracted** (linked to the source line they can see) **or clinician-reviewed** — never an LLM's unsupervised summary presented as fact. Reinforces the existing *"clinician reviews every result before the parent sees it"* principle. |
| **Becoming an advisor instead of a conduit** | If Navigator starts giving clinical opinions, it steps on the clinician relationship and assumes liability it shouldn't. | Stay a **faithful conduit** — carry the clinician's words, don't invent them (§3.3, §4.6). |
| **The unsubscribe cliff** | One annoyed opt-out permanently kills the only channel. | Dial-not-exit, behavioural throttling, human-not-newsletter framing (§6.2–6.3). |
| **Guilt mechanics creeping in** | A growth-minded iteration adds a streak/badge "to boost engagement" and quietly poisons the audience. | The §4 principles are a hard line, not preferences. Review every new touch against them. |
| **Long feedback loop feels extractive** | If a question's only payoff is "useful at the review in 90 days," it feels like surveillance. | Every answer closes a loop the parent can *see now* (§3.2). |

---

## 11. What to test first

**The riskiest assumption** under everything is that *any* push is welcome — that even a
perfect, well-timed single question is received as "helpful" and not "another ping." For
this audience that is not obvious, and it's cheap to test *before* building a notification
engine.

**Cheapest test:** sit with 5–6 of these families and ask:

> *"In the last 90 days, when did you wish Navigator had said something to you — and when
> would it have made things worse?"*

You'll learn the real cadence ceiling, the welcome triggers, and the forbidden ones in an
afternoon — before writing any code.

**Then, smallest buildable slice (uses only what exists):**

1. The **Preparation email** (§6.5) — highest value, draws purely on session +
   questionnaire data already in the system.
2. The **landing-moment "what changed and why"** narration (§7.2) — no email, no new
   channel, pure offload from session-over-session data.
3. One **re-administered questionnaire item** (§8) for an active priority, answer-in-email.

---

## 12. Explicitly set aside (and why)

Recording the divergent ideas we chose *not* to pursue, so they aren't re-litigated:

- **Journals / daily logs** — adds work; recreates the project-manager burden we're trying
  to remove.
- **Streaks, badges, gamification** — guilt mechanics; toxic for this audience (§4.1).
- **Daily/weekly generic tips** — noise; the first thing to read as spam (§5).
- **"Log in to see your update" emails** — the trip won't be made; value must be *in* the
  email (§6.1).
- **Between-session DAU as a goal** — the metric that quietly rebuilds everything above (§9).

---

*Compiled 2026-06-29 from a product brainstorming session. This is design rationale, not a
committed roadmap — the §11 user test should precede build.*
