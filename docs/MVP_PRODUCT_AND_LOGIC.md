# Threadline Navigator MVP - Product and Logic Brief

This document explains the MVP as a product: what it is, who it is for, what is
in scope, and the logic that controls the current front-end prototype.

Use this alongside:

- `docs/PRODUCT_OVERVIEW.md` for the fuller Navigator product vision.
- `docs/APP_STRUCTURE_AND_CHILD_STATUS_LOGIC.md` for a developer-oriented route and child-status reference.
- `docs/BETWEEN_SESSION_STRATEGY.md` for the trust-loop strategy after a clinician session.

## 1. MVP Summary

Threadline Navigator MVP is a parent-facing assessment preparation dashboard for
families seeking developmental or neurodevelopmental clarity for a child.

The MVP is not trying to be the complete long-term Navigator Care product. It is
focused on one high-value journey:

1. Create or select a child profile.
2. Register the child for the Diagnostic Assessment path.
3. Complete a structured parent questionnaire.
4. Invite teacher input.
5. Upload supporting documents.
6. Track readiness for clinical review.
7. Show the assessment/report state once clinical review is complete.

The promise is simple: Threadline helps a family turn scattered observations,
school input, and documents into a structured assessment package that a clinician
can review.

## 2. Product Positioning

### User

The primary user is a parent, guardian, or carer who is worried about a child's
development, learning, attention, emotional regulation, sleep, school experience,
or everyday functioning.

The secondary user is someone who contributes evidence or context, such as a
teacher, partner, family member, or carer.

The clinician is central to the product promise, but does not log in to this MVP
as an app user. The interface repeatedly frames the app as preparation for a
clinician-led assessment, not as an autonomous diagnostic tool.

### Problem

Before assessment, families often have fragmented evidence:

- parent observations,
- school notes,
- prior GP or paediatric letters,
- psychology, speech, or OT reports,
- uncertainty about what matters clinically,
- uncertainty about what to prepare next.

The MVP gives this preparation a shape. It shows the family what is missing, what
is already captured, and what will help the clinician produce a stronger review.

### Value Proposition

For the parent:

- "I know what to do next."
- "My observations are captured in a structured way."
- "The teacher and documents are part of the same assessment package."
- "I can see whether the assessment is ready for review."

For the clinician:

- Parent context is structured before the session.
- Teacher input and supporting documents are tracked.
- The assessment package has visible completion states.
- The family is prepared without needing extra manual coordination.

## 3. MVP Scope

### In Scope

The MVP includes:

- Family overview across child profiles.
- Child profile selection and creation.
- Diagnostic Assessment workflow.
- MVP questionnaire modules derived from `MVP_WORKFLOW_QUESTIONS`.
- Teacher questionnaire invitation flow.
- Document upload/share visibility through the document locker.
- Assessment preparation checklist.
- Assessment progress states, including submitted and report-ready demo states.
- Global quick access to Resources and Documents.
- Settings for family/profile/access controls and internal display toggles.

### Out of Scope

The MVP intentionally de-emphasizes or hides fuller Navigator Care surfaces:

- Home as the main day-to-day plan surface.
- Understanding page.
- Priorities page.
- Reviews page.
- Diary.
- Emerging details.
- Clinical Path reflection deck.
- Full post-assessment 90-day plan management.

These surfaces still exist in code for the broader prototype, but MVP mode
redirects or hides them from the primary experience.

## 4. MVP Mode Logic

MVP mode is controlled by `DisplayModeContext`.

Default values:

- `displayMode`: always `"parent-clarity"`.
- `isMvp`: defaults to `true`.
- `questionnaireModuleView`: defaults to `"cards"`.
- `preparationChecklistView`: defaults to `"changed"`.

Storage keys:

- `threadline-is-mvp`
- `threadline-questionnaire-module-view`
- `threadline-questionnaire-card-view`
- `threadline-preparation-checklist-view`
- `threadline-display-defaults-version`

When `isMvp` is true:

- `/assessment` becomes the main child workspace.
- Switching a child from the family overview opens Assessment instead of Home.
- `/home` is redirected to Assessment by the top bar effect.
- `/understanding`, `/priorities`, `/reviews`, `/what-you-noticed`, and `/diary`
  are hidden from navigation or redirected.
- Some seeded demo profiles are filtered out with `shouldHideInMvpMode`.
- The Clinical Path action is hidden.
- Global quick access icons can move Resources and Documents into the top bar.

## 5. Core Routes

| Route | MVP role | Logic |
| --- | --- | --- |
| `/` | Family overview | Lists child profiles, live updates, and profile action cards. |
| `/assessment` | Main MVP workspace | Shows registration, questionnaire, teacher, documents, session, and report states. |
| `/questionnaire` | Parent questionnaire | Saves responses directly onto the current child intake. |
| `/documents` | Document locker | Shows seeded and uploaded document records; can share/unshare files. |
| `/resources` | Support library | Global reference surface available in MVP. |
| `/settings` | Profile/access/settings | Manages child profiles, secondary users, visual/internal controls. |
| `/setup` | Add-child/setup flow | Used for profile setup and direct session booking entry points. |
| `/style-guide` | Design reference | Internal design/dev surface. |

Routes that are part of the broader product but not the MVP primary journey are
kept in code and usually hidden or redirected when MVP mode is on.

## 6. Data Model

The central object is `Child`.

```ts
interface Child {
  id?: string;
  name: string;
  age: number;
  initial: string;
  isNew?: boolean;
  diaryEntries?: DiaryEntry[];
  intake?: {
    relation?: string;
    journeyStage?: string;
    availableInfo?: string[];
    notices?: string[];
    notes?: string;
    sessionDay?: string;
    sessionTime?: string;
    sessionCancelled?: boolean;
    questionnaireAnswers?: Record<string, unknown>;
    completedQuestionnaireSections?: string[];
  };
}
```

Important fields:

- `isNew`: broad lifecycle switch. `true` means intake/pre-assessment.
- `intake.questionnaireAnswers`: source for questionnaire progress.
- `intake.completedQuestionnaireSections`: source for module/section completion.
- `intake.sessionDay` and `intake.sessionTime`: source for booked session state.
- `intake.sessionCancelled`: source for cancelled session state when no booking is active.
- `diaryEntries`: broader Navigator Care data, not central to MVP mode.

## 7. State and Persistence

The app is a front-end prototype. There is no product backend in this checkout.
State is held in React context and browser `localStorage`.

| Context | Owns | Persistence |
| --- | --- | --- |
| `DisplayModeContext` | MVP mode, questionnaire layout, preparation checklist layout | `localStorage` |
| `ChildContext` | children list, current child, add/update/delete child, global icons | `localStorage` |
| `LockerContext` | document locker files, filters, sharing toggle | in-memory only |
| `SecondaryUsersContext` | invited secondary users and access level | `localStorage` |

Reset logic:

- Visiting with `?reset=1` clears Threadline storage keys and reloads the seeded demo state.
- `DEMO_DATA_VERSION` in `ChildContext` forces reseeding when the demo dataset changes.

## 8. Seed Personas and Lifecycle States

The MVP uses seeded children to demonstrate product states.

| Child | State | Product meaning |
| --- | --- | --- |
| Tom | `isNew: true`, intake empty | New intake / choose or begin path. |
| Leo | `isNew: true`, Diagnostic Assessment profile | Diagnostic path selected, questionnaire not started. |
| Isla | Diagnostic profile, partial MVP questionnaire | Assessment preparation in progress. |
| Chloe | Diagnostic profile, full MVP questionnaire and booked session | Waiting for clinical review. |
| Noah | Diagnostic profile, completed assessment report | Report-ready / assessment complete state. |
| Maya | Navigator Care, hidden in MVP | Broader post-assessment plan example. |
| Liam | Navigator Care maintenance, hidden in MVP | Broader post-assessment maintenance example. |
| Ava | Assessment pending, hidden in MVP | Legacy assessment-pending example. |

Some behavior is profile-mapped through `src/lib/childStatus.ts`. The app now uses
child ids for known seeded profiles where possible, which is safer than relying
only on display names. Renaming user-created children still falls back to generic
logic.

## 9. Child Status Logic

`src/lib/childStatus.ts` is the source of truth for child status.

### Session Status

`getChildSessionStatus(child)` returns:

1. `"booked"` if `intake.sessionDay` and `intake.sessionTime` exist.
2. `"cancelled"` if `intake.sessionCancelled` is true and no booking exists.
3. `"not-booked"` otherwise.

`getSessionDate(child, format)` returns a formatted June session date only when
the session is booked.

### Diagnostic Pathway

`isDiagnosticPathway(child)` comes from the seeded profile status map.

Diagnostic profiles drive:

- assessment card copy,
- whether a child uses a standalone questionnaire,
- whether quick notes are suppressed,
- whether the completed report UI appears,
- whether an assessment progress card appears.

### MVP Visibility

`shouldHideInMvpMode(child)` hides profiles that belong to the fuller Navigator
Care story rather than the narrowed MVP assessment story.

Currently hidden examples include Maya, Liam, and Ava.

### New-Child Onboarding Completion

`isNewChildOnboardingComplete(child)` returns true only when:

1. `child.isNew` is true,
2. all classic setup questionnaire sections are complete, and
3. a session is booked.

This is broader setup logic, not the main MVP questionnaire-completion rule. In
the MVP, assessment readiness is primarily determined by questionnaire progress,
teacher status, and document count on the Assessment page.

### Subheading

`getChildSubheading(child)` uses this order:

1. seeded profile subheading if one exists,
2. `"Navigator Care"` for non-new generic children,
3. `"Choose your path"` for cancelled new-child sessions,
4. `"Assessment pending"` if new-child onboarding is complete,
5. `"Intake in progress"` otherwise.

## 10. Assessment Workflow Logic

The Assessment page is the MVP center of gravity.

It calculates:

- whether the child is Diagnostic or Navigator,
- whether the assessment path card should show,
- whether the child has a completed assessment report,
- questionnaire progress,
- teacher questionnaire status,
- document count,
- readiness for clinical review,
- follow-up/report completion state.

### Preparation Checklist

The checklist contains these core jobs:

1. Clinical Questionnaire.
2. Ask teacher to complete questionnaire.
3. Document Upload.
4. Telehealth session / clinical follow-up, depending on state.

The exact presentation can vary by internal setting:

- timeline,
- cards,
- rows.

The default MVP setting is rows (`"changed"`).

### Questionnaire Progress

In MVP mode, progress uses all questions inside `MVP_WORKFLOW_QUESTIONS`.

```txt
answered MVP questions / total MVP questions = questionnaireProgress
```

If the child is a completed-report profile, progress is forced to 100%.

For non-MVP mode, the older setup questionnaire section count is used instead.

### Teacher Questionnaire

Teacher status is local UI state backed by per-child storage keys:

- `teacher-status-{child.id}`
- `teacher-name-{child.id}`
- `teacher-email-{child.id}`
- `teacher-message-{child.id}`

States:

- `todo`: no invite sent.
- `sent`: invitation sent and waiting.
- `completed`: teacher response completed.

Seeded profiles can also be treated as complete for demo purposes.

### Documents

Document count comes from `LockerContext` files associated with the child.

Assessment readiness expects at least one document unless the seeded completed
report state overrides it.

### Ready for Clinical Review

The page treats a child as ready for clinical review when:

```txt
questionnaireProgress === 100
and teacher checklist is done
and documentCount > 0
```

For Chloe, this becomes the waiting-for-clinical-review demo state.

For Noah, the completed report flag shows the assessment complete/report-ready
state in MVP.

## 11. Questionnaire Logic

There are two questionnaire systems in the codebase:

### Classic Setup Questionnaire

Defined in `src/questionnaire.ts`.

Sections:

- What's going well.
- What you're seeing.
- At school.
- Development & history.

This is used by the broader add-child setup flow and old pre-assessment logic.

### MVP Assessment Questionnaire

Defined in `src/lib/familyJourneyQuestionBank.ts`.

It converts a row-based assessment question bank into structured modules:

1. Child & Family Profile.
2. Development & Medical History.
3. Parent ADHD Questionnaire.
4. Teacher Questionnaire.
5. Emotional Wellbeing.
6. Child's Own Perspective.
7. Daily Life & Functioning.
8. Supporting Evidence.
9. Assessment Review.

Each row becomes either:

- a choice question when choices can be inferred from the answer format, or
- a text question with a placeholder.

Answers are written to:

```txt
currentChild.intake.questionnaireAnswers[question.id]
```

Completed modules are recalculated after each answer and written to:

```txt
currentChild.intake.completedQuestionnaireSections
```

The questionnaire autosaves by calling `updateChild`. There is no server submit
in this prototype. The final "Submit Questionnaire" UI confirms completion in
the front end.

## 12. Add Child and Setup Logic

The Add Child flow is still present and supports the fuller product setup.

In MVP mode:

- The setup progress is shortened.
- Step 4 is skipped.
- Completing step 3 creates or updates a new child profile.
- Direct session booking can still open `/setup?step=5&directSession=1`.

The flow saves:

- name,
- relation,
- journey stage,
- selected notices,
- available info,
- notes,
- session day/time,
- questionnaire answers where applicable.

New child creation from the top bar calls `createNewChild`, then opens setup.

## 13. Navigation Logic

Navigation is intentionally state-dependent.

### Family Overview

`/` shows all visible child profiles. In MVP mode, profiles hidden by
`shouldHideInMvpMode` are removed from the list.

Clicking a child opens:

- `/assessment` in MVP mode,
- `/home` in classic/full mode.

### Sidebar

In MVP mode, Sidebar hides:

- Home,
- Understanding,
- Priorities,
- Reviews,
- What you noticed,
- Diary.

If global quick access icons are enabled, Resources and Documents are also
removed from Sidebar and shown in the top bar.

### Top Bar

Top Bar owns:

- child switcher,
- all-children switcher,
- add child action,
- alert/update menu,
- quick access icons,
- internal display controls in the profile menu.

When MVP mode is on and the current page is Home, Top Bar redirects to
Assessment.

## 14. Document Locker Logic

The document locker is currently in-memory seeded state, not backend storage.

Each file has:

- type id and type name,
- display name,
- date,
- uploader,
- shared flag,
- optional shared-with label,
- optional child name/id.

The locker supports:

- search by file name,
- filter by type/uploader,
- share/unshare toggling,
- adding files in-session.

Assessment uses child-specific locker files as evidence that supporting
documents have been shared.

## 15. Secondary User Logic

Secondary users represent people invited around the child's care context.

Roles:

- Partner.
- Teacher.
- Family member.
- Carer.

Access levels:

- `full`
- `partial`

Secondary users persist to `threadline-secondary-users`.

The MVP uses this as a lightweight model for care-circle permissions. It is not
a real auth or invitation system yet.

## 16. Product Rules

These are the rules the MVP should preserve:

1. The product must never imply it diagnoses without a clinician.
2. Parent answers are intake evidence, not clinical conclusions.
3. The main MVP action is assessment preparation, not daily engagement.
4. Progress should show what is missing, not shame the parent.
5. Teacher input and documents should feel part of the same assessment package.
6. Completed report states should be visibly different from preparation states.
7. Hidden fuller-product surfaces should not distract from the MVP path.
8. Copy should stay calm, plain-language, and parent-facing.
9. Demo profile logic should stay centralized in `childStatus.ts`.
10. Any future backend should preserve the current state distinctions instead of
    flattening everything into a generic profile status.

## 17. What Would Need a Backend

The current checkout is a front-end prototype. A production MVP would need:

- authentication,
- child profile persistence,
- questionnaire persistence,
- teacher invitation tokens,
- secure document upload/storage,
- clinician review dashboard or API,
- report generation and file delivery,
- audit trail,
- role-based access control,
- consent and privacy flows,
- encrypted data handling beyond UI copy.

Until those exist, the MVP is best understood as an interactive product demo and
front-end logic prototype.

## 18. Source Map

| Concern | File |
| --- | --- |
| Route tree and MVP redirects | `src/App.tsx` |
| MVP display mode/defaults | `src/context/DisplayModeContext.tsx` |
| Child seed data and persistence | `src/context/ChildContext.tsx` |
| Child lifecycle/status helpers | `src/lib/childStatus.ts` |
| Assessment page workflow | `src/components/AssessmentPage.tsx` |
| MVP question bank | `src/lib/familyJourneyQuestionBank.ts` |
| Questionnaire page | `src/components/QuestionnairePage.tsx` |
| Classic setup questions | `src/questionnaire.ts` |
| Add child/setup flow | `src/components/AddChildFlow.tsx` |
| Family overview | `src/components/AllChildrenPage.tsx` |
| Navigation shell | `src/components/Sidebar.tsx`, `src/components/TopBar.tsx` |
| Document locker state | `src/context/LockerContext.tsx` |
| Secondary user state | `src/context/SecondaryUsersContext.tsx` |

