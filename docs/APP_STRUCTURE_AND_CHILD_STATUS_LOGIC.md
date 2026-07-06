# App Structure and Child Status Page Logic

Developer reference for the current Threadline Navigator front-end prototype.

This app is a React/Vite single-page app. There is no backend data contract in this checkout; the child records are seeded in `src/context/ChildContext.tsx` and persisted in `localStorage`.

## 1. App Structure

### Runtime Entry

```txt
index.html
  -> src/main.tsx
    -> src/App.tsx
```

`src/App.tsx` owns the top-level route tree and wraps the app with context providers:

```tsx
<BrowserRouter>
  <ChildProvider>
    <LockerProvider>
      <DisplayModeProvider>
        <SecondaryUsersProvider>
          <AppContent />
        </SecondaryUsersProvider>
      </DisplayModeProvider>
    </LockerProvider>
  </ChildProvider>
</BrowserRouter>
```

### Main Layout

Most pages render inside `DashboardLayout`:

```txt
DashboardLayout
  -> Sidebar
  -> TopBar
  -> scrollable page content
  -> QuickNoteComposer, unless suppressed
```

Important layout files:

| File | Role |
| --- | --- |
| `src/App.tsx` | Route tree, setup modal, reflection deck modal, pre-assessment guard. |
| `src/components/DashboardLayout.tsx` | Shared dashboard chrome and quick-note visibility. |
| `src/components/Sidebar.tsx` | Desktop navigation, child-state-aware nav item set. |
| `src/components/TopBar.tsx` | Child switcher, all-children selector, alerts, mobile nav, profile menu. |
| `src/context/ChildContext.tsx` | Seed children, current child, child CRUD, localStorage persistence. |
| `src/lib/childStatus.ts` | Central status helper functions used across pages. |
| `src/types.ts` | `Page`, `Child`, diary, priority, and shared data interfaces. |

### Route Map

`src/App.tsx` treats `/setup` as a full-page intake flow outside the dashboard chrome. Everything else renders under `DashboardLayout`.

| Route | Page component | Notes |
| --- | --- | --- |
| `/` | `AllChildrenPage` | Family overview and the current equivalent of a child-status overview. |
| `/setup` | `AddChildFlow` | Intake/setup flow. Can also be opened as a modal from `AppContent`. |
| `/home` | `HomePage` | Guarded for new children. Shows `NewChildPreviewPage` while pre-assessment. |
| `/assessment` | `AssessmentPage` | Diagnostic/Navigator assessment surface. Not currently guarded in `App.tsx`. |
| `/preview` | `NewChildPreviewPage` | Explicit preview route for intake/pre-assessment profiles. |
| `/what-you-noticed` | `WhatYouNoticedPage` | New-child-only route; assessed children redirect to `/home`. |
| `/understanding` | `UnderstandingPage` | Uses current-child content and questionnaire completion state. |
| `/priorities` | `PrioritiesPage` | Uses current-child priority/data copy. |
| `/roadmap` | redirect | New children go to `/home`; assessed children go to `/reviews`. |
| `/reviews` | `ReviewsPage` | Guarded for new children. |
| `/resources` | `ResourcesPage` | Available for both global and child contexts. |
| `/documents` | `DocumentsPage` | Available for both global and child contexts. |
| `/diary` | `DiaryPage` | Available for both global and child contexts. |
| `/settings` | `SettingsPage` | Child/profile/app settings. |
| `/emerging-details` | `EmergingDetailsPage` | Guarded for new children. |
| `/style-guide` | `StyleGuidePage` | Dev/design reference; hides sidebar. |
| `*` | `AllChildrenPage` | Fallback inside dashboard route tree. |

There is no dedicated `/children-status` route in this checkout. The child-status view is folded into `/` via `AllChildrenPage`, with shared lifecycle logic centralized in `src/lib/childStatus.ts`.

## 2. Child Data Model

The central entity is `Child` from `src/types.ts`:

```ts
export interface Child {
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

High-level meaning:

| Field | Meaning |
| --- | --- |
| `isNew` | Master lifecycle switch. `true` means intake/pre-assessment. Falsy means assessed or diagnostic/Navigator profile. |
| `intake.sessionDay` + `intake.sessionTime` | Session is booked. |
| `intake.sessionCancelled` | Session status is cancelled unless booked data is also present. |
| `intake.completedQuestionnaireSections` | Used to decide whether the setup questionnaire is complete. |
| `intake.questionnaireAnswers` | Used by setup preview, understanding, and reflection logic. |

`ChildContext` stores:

| State | Source | Persistence |
| --- | --- | --- |
| `childrenList` | `INITIAL_CHILDREN` or `localStorage` | `threadline-children` |
| `currentChild` | stored child id/name or first child | `threadline-current-child` |
| demo seed version | constant in `ChildContext` | `threadline-demo-data-version` |
| global quick icons flag | `localStorage` | `threadline-show-global-icons` |

The demo seed currently includes these lifecycle examples:

| Child | Key state | Intended scenario |
| --- | --- | --- |
| Tom | `isNew: true`, empty intake | Intake in progress. |
| Ava | `isNew: false`, assessment-style intake complete, booked session | Assessment pending / first-session-ready profile. |
| Leo | `isNew: true`, name-mapped diagnostic pathway | Diagnostic pathway chosen, not started. |
| Nick | `isNew: false`, diagnostic pathway, booked session | Diagnostic assessment active. |
| Noah | `isNew: false`, diagnostic pathway, completed report flag | Diagnostic assessment complete / report ready. |
| Maya | assessed, on-track copy | Navigator Care, steady progress. |
| Liam | assessed, maintenance flag | Navigator Care, maintenance phase. |

## 3. Child Status Source of Truth

Use `src/lib/childStatus.ts` for lifecycle decisions. Avoid duplicating name checks or session logic inside page components.

### Name-Mapped Profile Flags

`CHILD_PROFILE_STATUS` maps seeded demo child names to profile-level flags:

| Flag | Helper | Meaning |
| --- | --- | --- |
| `subheading` | `getChildSubheading` | Label shown in the child switcher, All Children page, and headers. |
| `maintenancePhase` | `isMaintenancePhase` | Plan is complete and in maintenance mode. |
| `planNotStarted` | `isPlanNotStarted` | First quarter plan exists but progress is still zero. |
| `diagnosticPathway` | `isDiagnosticPathway` | Child is on Diagnostic Assessment path. |
| `suppressQuickNote` | `shouldSuppressQuickNote` | Hide `QuickNoteComposer` for that child. |
| `sessionPreviewUnavailable` | `isSessionPreviewUnavailable` | Prevent session preview from looking booked/active. |
| `assessmentCardProfile` | `usesAssessmentCard` | Assessment page should use assessment-pathway cards. |
| `completedAssessmentReport` | `usesCompletedAssessmentReport` | Assessment page should show completed-report UI. |
| `reviewDate` | `getChildReviewDate` | Review date displayed in cards and progress summaries. |

Because these flags are name-mapped, seeded demo behavior changes if a seeded child is renamed.

### Session Status

```ts
getChildSessionStatus(child)
```

Status priority:

1. If `intake.sessionDay` and `intake.sessionTime` exist, return `"booked"`.
2. Else if `intake.sessionCancelled` is true, return `"cancelled"`.
3. Else return `"not-booked"`.

`getSessionDate(child, month)` returns a formatted `"Thu {day} Jun"` or `"Thu {day} June"` string only when the child is booked.

### New-Child Onboarding Completion

```ts
isNewChildOnboardingComplete(child)
```

Returns true only when all of the following are true:

1. `child.isNew` is true.
2. Normalized `completedQuestionnaireSections` covers every `QUESTIONNAIRE_SECTIONS` item.
3. `getChildSessionStatus(child) === "booked"`.

This represents "setup complete, assessment pending." It does not mean clinical content is unlocked.

### Subheading Logic

```ts
getChildSubheading(child)
```

Decision order:

1. If the child name has a mapped `subheading`, return it.
2. If `!child.isNew`, return `"Navigator Care"`.
3. If session status is `"cancelled"`, return `"Choose your path"`.
4. If `isNewChildOnboardingComplete(child)`, return `"Assessment pending"`.
5. Otherwise return `"Intake in progress"`.

This label is used by `TopBar`, `AllChildrenPage`, `SettingsPage`, `ReflectionDeck`, `RoadmapPage`, and multiple child-specific pages.

## 4. Status To Page Logic

### Global Family Overview: `/`

`AllChildrenPage` is the overview/status page for all children.

For each child it computes `getChildSynthesisData(child)` and renders:

1. A top carousel slide with the child live update.
2. A profile section containing:
   - synthesis card (`HeroQuoteCard`)
   - session card (`FirstSessionCard`) or plan card (`PlanProgressCard`)

Important decision helpers:

| Helper | Effect in `AllChildrenPage` |
| --- | --- |
| `getChildSessionStatus` | Chooses booked/cancelled/not-booked copy and session card state. |
| `getChildSubheading` | Labels new/intake/assessment-pending status. |
| `isDiagnosticPathway` | Uses diagnostic copy and booking actions. |
| `isMaintenancePhase` | Shows 100% complete / maintenance copy. |
| `isPlanNotStarted` | Shows 0% first-actions-ready copy. |
| `isAssessmentPendingProfile` | Shows assessment-pending copy even if the profile is not `isNew`. |
| `isNewChildOnboardingComplete` | For new children, swaps setup CTA to insight/open action. |
| `shouldShowNewChildSetupAction` | Hides setup action for diagnostic pathway children. |
| `shouldUseFirstSessionCard` | Uses `FirstSessionCard` for new children and active diagnostic profiles. |

CTA behavior:

| Child state | Primary behavior |
| --- | --- |
| Regular assessed child | `setChild(child)` then navigate to `/home`. |
| New intake child | Usually open `/setup` or focus child depending on helper result. |
| Diagnostic child needing booking | Navigate to `/setup?step=5&directSession=1`. |
| Booked diagnostic child | Reschedule also uses `/setup?step=5&directSession=1`. |

### Child Switcher and Top Bar

`TopBar` uses `childrenList`, `currentChild`, and `getChildSubheading`.

Child switching rules:

1. If switching from All Children, go to `/home`.
2. If switching to a new child from a disallowed page, go to `/home`.
3. If switching to an assessed child from `/preview` or `/what-you-noticed`, go to `/home`.
4. Otherwise keep the current page.

All Children updates in the alerts panel use:

| Condition | Update status |
| --- | --- |
| manually marked read | `read` |
| `child.isNew && !sessionBooked` | `new` |
| otherwise | `unread` |

### Sidebar Navigation

`Sidebar` chooses nav items from `currentChild.isNew`.

Assessed profiles see:

```txt
home, assessment, understanding, priorities, reviews, resources, documents, diary
```

New children see:

```txt
home, assessment, understanding, priorities, what-you-noticed, resources, documents, diary
```

When `showGlobalIcons` is true, `resources`, `documents`, and `diary` are removed from the sidebar and shown as global quick-access icons in the top bar.

All Children mode collapses the sidebar to icon width and hides child-specific navigation.

### Pre-Assessment Guard

`App.tsx` defines:

```tsx
const withPreAssessmentGuard = (element: ReactElement) => (
  currentChild.isNew
    ? <NewChildPreviewPage ... />
    : element
);
```

Guarded routes:

| Route | New-child render |
| --- | --- |
| `/home` | `NewChildPreviewPage` |
| `/reviews` | `NewChildPreviewPage` |
| `/emerging-details` | `NewChildPreviewPage` |

This is the main clinical-content gate. It prevents pre-assessment users from seeing mature assessment/review content before the app considers the child assessed.

### New Child Preview

`NewChildPreviewPage` is the read-only preview/status surface for intake/pre-assessment children.

It uses:

| Helper/data | Purpose |
| --- | --- |
| `getCompletedQuestionnaireSections` | Determines preview completion and timeline state. |
| `getChildSessionStatus` | Session card booked/cancelled/not-booked state. |
| `isNewChildOnboardingComplete` | Shows setup-complete evidence state. |
| `isDiagnosticPathway` | Uses Diagnostic Assessment copy and booking action. |
| `isAssessmentPendingProfile` | Hides preparation guides for assessment-pending profiles. |
| `isIntakeProfile` | Hides preparation guides for mapped intake-only profile. |
| `getJourneyHomeCopy` | Journey-stage-aware copy. |

### Home Page

`HomePage` is shared across several lifecycle states, but guarded new children normally see `NewChildPreviewPage` instead.

Status-specific behavior:

| State | UI behavior |
| --- | --- |
| Diagnostic path with unavailable preview | Shows "assessment has not started" copy, zero progress, no booked session. |
| Diagnostic path with booking | Shows booked telehealth assessment copy and session details. |
| Maintenance phase | Shows 100% progress and maintenance copy. |
| Plan not started | Shows 0% progress and a one-time session modal. |
| Assessment pending / Nick / Ava copy path | Uses journey-aware first-session copy. |
| Default assessed child | Uses Navigator Care progress and `getChildData` content. |

### Assessment Page

`AssessmentPage` is where Diagnostic Assessment and assessment-report surfaces live.

Important helpers:

| Helper | Effect |
| --- | --- |
| `isDiagnosticPathway` | Chooses diagnostic pathway state/copy. |
| `usesAssessmentCard` | Shows assessment pathway card profile behavior. |
| `usesCompletedAssessmentReport` | Branches into completed report UI, currently for Noah. |
| `getChildSessionStatus` | Drives telehealth/session steps. |
| `getSessionDate` | Formats session date in the assessment flow. |

If `usesCompletedAssessmentReport(currentChild)` is true, the page returns early with completed diagnostic report UI.

### Quick Note Suppression

`DashboardLayout` hides `QuickNoteComposer` when:

```ts
shouldSuppressQuickNote(currentChild) || showGlobalIcons
```

Mapped diagnostic profiles can suppress quick notes, and global resource/document/diary mode suppresses them too.

## 5. Implementation Rules For Future Dev Work

1. Put new lifecycle/status logic in `src/lib/childStatus.ts` first.
2. Import helpers into pages instead of repeating child-name or `isNew` checks.
3. If adding a route, update both `src/types.ts` (`Page`) and `src/App.tsx`.
4. If new children should access that route, update `src/navigation.ts`.
5. If the route should be hidden or renamed by lifecycle, update `Sidebar.tsx` and the mobile nav in `TopBar.tsx`.
6. If the route shows clinical content, decide whether it needs `withPreAssessmentGuard`.
7. If seed data changes, update `DEMO_DATA_VERSION` in `ChildContext.tsx` so existing localStorage does not mask the new demo state.
8. When adding a new seeded demo status, update both:
   - `INITIAL_CHILDREN` in `ChildContext.tsx`
   - `CHILD_PROFILE_STATUS` in `childStatus.ts`, if the status is name-mapped

## 6. Common Debug Checklist

If a page shows the wrong child status:

1. Reset local demo state with `?reset=1`.
2. Inspect `currentChild` and `childrenList` from `ChildContext`.
3. Check whether `CHILD_PROFILE_STATUS[child.name]` overrides normal computed logic.
4. Check `intake.sessionDay`, `intake.sessionTime`, and `intake.sessionCancelled`.
5. Check whether `completedQuestionnaireSections` uses normalized section names.
6. Confirm the route is not being replaced by `withPreAssessmentGuard`.
7. Confirm `TopBar.handleChildSwitch` did not redirect after switching child.

If All Children looks inconsistent with child pages, compare:

| Surface | Main logic location |
| --- | --- |
| Family overview cards | `AllChildrenPage.getChildSynthesisData` |
| Shared lifecycle helpers | `src/lib/childStatus.ts` |
| Current child data copy | `src/data.ts` |
| Route guard | `src/App.tsx` |
| Child switcher redirects | `src/components/TopBar.tsx` |
