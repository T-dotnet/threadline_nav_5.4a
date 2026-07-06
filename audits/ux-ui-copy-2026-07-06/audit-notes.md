# Threadline UX/UI/Copy Audit

Date: 2026-07-06
Scope: Current local app at `http://127.0.0.1:3001/`, with emphasis on overview, new-child preview, setup intake, questionnaire, assessment, navigation shell, and mobile behavior.

## Tooling Notes

- Product Design audit skill used.
- Live screenshots captured from the in-app browser and inspected before acceptance.
- Mobbin is configured on disk at `/Users/danielenicoletti/.codex/config.toml` with `https://api.mobbin.com/mcp`, but the `mcp__mobbin` tools were not exposed to this active thread, so no live Mobbin MCP calls could be made in this run.

## Screenshots

1. `screenshots/01-all-children-overview-viewport.png` - default MVP overview.
2. `screenshots/02-full-mode-all-children-overview.png` - profile menu and display controls.
3. `screenshots/03-tom-new-child-preview.png` - Tom new-child preview, desktop.
4. `screenshots/04-setup-welcome.png` - setup welcome.
5. `screenshots/05-setup-journey-step.png` - setup journey step.
6. `screenshots/06-setup-questionnaire-overview.png` - setup questionnaire overview.
7. `screenshots/07-questionnaire-modal-question.png` - one-question modal.
8. `screenshots/08-assessment-page.png` - assessment page.
9. `screenshots/09-mobile-new-child-preview.png` - Tom preview, mobile.
10. `screenshots/10-mobile-questionnaire-overview.png` - questionnaire overview, mobile.

## Step Health

1. Default overview - healthy visual system, mixed orientation.
2. Profile menu - useful controls, accessibility/copy risk.
3. New-child preview - visually polished, message hierarchy confused.
4. Setup welcome - strong, reassuring, parent-friendly.
5. Journey step - clean and low-friction, options need more context.
6. Questionnaire overview - clear structure, polish and mobile layout issues.
7. Question modal - warm and focused, viewport clipping risk.
8. Assessment page - strong clarity, higher clinical-claim risk.
9. Mobile new-child preview - readable, action priority drops below fold.
10. Mobile questionnaire overview - needs responsive layout repair.

## Strengths

- The visual language is consistent with the Threadline design guidelines: calm green palette, serif display headings, warm clinical tone, generous whitespace, and expressive card corners.
- Setup welcome is especially strong. It explains time, pausing, saved progress, and clinician accountability without feeling cold or defensive.
- The one-question modal uses supportive microcopy: "Let's start with what already helps" and "Choose the closest fit. It does not need to be perfect."
- The app has a good state model for different child journeys: intake, diagnostic, assessment pending, booked session, established care, and global overview.
- Desktop layout has a premium, low-stress feeling that fits a parent/clinical product better than a dense dashboard.

## Findings

### 1. First-viewport status language conflicts on new-child profiles

Evidence: `03-tom-new-child-preview.png`, `09-mobile-new-child-preview.png`

Tom is labeled "Intake in progress" in the top profile chip, but the page headline says "Diagnostic Assessment underway" and the right-side card says "Choose your path." These messages imply three different states: still collecting intake, already in diagnostic assessment, and not yet chosen.

Recommendation: Pick one parent-facing state and make every surface echo it. For example:

- Top chip: "Intake in progress"
- H1: "Let's finish Tom's intake."
- Hero quote: "Start with the questionnaire. Then we'll help you choose the right pathway."
- Pathway card: "Choose a pathway after intake"

### 2. Overview copy is more clinical than the parent task requires

Evidence: `01-all-children-overview-viewport.png`, `02-full-mode-all-children-overview.png`

"Family Synthesis," "dynamic clinical profiles," "clinician synthesis summary," and "credentials" create a clinician/workspace tone at the point where a parent likely wants simple orientation.

Recommendation: Keep clinical precision inside deeper pages, but make the overview scan like a family task board:

- "All Children at a glance" -> keep.
- Description: "See what needs attention next for each child, from intake to appointments and follow-up."
- "Clinician Synthesis Summary" -> "Current summary" or "What matters now."
- "Manage profile settings & credentials" -> "Manage account and profiles."

### 3. Primary action is not consistently first on mobile

Evidence: `09-mobile-new-child-preview.png`

The mobile Tom preview spends the first viewport on a long heading and quote. The first actionable next step is partly below the fold, while the floating quick-note button competes with the card.

Recommendation: On new-child mobile previews, place a compact action strip immediately under the page description:

- "Next: start questionnaire"
- Button: "Start questionnaire"
- Secondary: "Upload documents"

Also suppress or move the floating note button on setup/intake-first states where the parent has not yet reached a diary use case.

### 4. Questionnaire overview breaks down on mobile

Evidence: `10-mobile-questionnaire-overview.png`

Section names wrap one word per line because the row reserves space for the number, action pill, and chevron. The mobile stepper also says "Step 4 of 4" while the page label says "Step 4 of 5."

Recommendation: Use a mobile-specific row layout:

- Row top: number + section title.
- Row second line: question count + status/action.
- Chevron aligned to the right edge.
- Fix the step count source so the setup shell and page label agree.

### 5. The questionnaire has visible grammar and affordance polish issues

Evidence: `06-setup-questionnaire-overview.png`

"Development & history" shows "1 questions." The "Start section" pills are very low contrast and read more like disabled labels than actions.

Recommendation:

- Pluralize question count.
- If the whole row is clickable, make the action label stronger: "Start" or "Continue."
- Consider replacing the pale pill with a right-aligned text action plus chevron.

### 6. The one-question modal clips content at common desktop height

Evidence: `07-questionnaire-modal-question.png`

At the captured viewport height, the fourth answer option is partially hidden under the sticky footer. This makes the modal feel less trustworthy and could cause missed options.

Recommendation: Reserve bottom padding equal to the footer height in the scrollable modal body, or move the footer outside the option list only when all options remain visible.

### 7. Assessment claim copy may overpromise

Evidence: `08-assessment-page.png`

"We determine whether ADHD is likely, unlikely, or there is more to explore" is very direct. It may be correct for the intended clinical model, but it sits near less formal product wording and could read as an automated diagnosis promise.

Recommendation: Tie the promise back to clinician review:

"A clinician reviews the information and explains whether ADHD looks likely, unlikely, or whether more information is needed - with clear next steps."

### 8. Profile menu controls need accessible names

Evidence: `02-full-mode-all-children-overview.png`

The "Show Quick Access Icons" and "MVP Mode" controls rendered as switches without accessible labels in the captured DOM. Sighted users see nearby text, but assistive tech may encounter unlabeled switches.

Recommendation: Use a semantic label association or give each switch an `aria-label` matching the visible setting name.

### 9. Full-mode/product-mode controls are visible to end users

Evidence: `02-full-mode-all-children-overview.png`

"MVP Mode," "Design System," and "Preparation Checklist" view controls feel like internal product controls. In a parent-facing product, they reduce trust and make the workspace feel unfinished.

Recommendation: Move internal/demo controls behind a development-only flag, or rename parent-facing controls if they are truly part of the product.

### 10. Journey choices need consequence hints

Evidence: `05-setup-journey-step.png`

"Noticing concerns," "Waiting for assessment," and "Diagnosed, need next steps" are clear, but the screen does not explain what changes after selection.

Recommendation: Add one short consequence line per option:

- "We'll keep the tone exploratory."
- "We'll help prepare for assessment."
- "We'll focus on support planning."

Keep it subtle so the step stays light.

## Highest-Impact Improvements

1. Align new-child state language across chip, H1, hero quote, and pathway card.
2. Repair mobile questionnaire rows and step count mismatch.
3. Move the new-child mobile primary CTA above the fold.
4. Replace internal/clinical overview labels with parent task language.
5. Add accessible labels to switches and verify keyboard focus in topbar/menu/modal.

## Evidence Limits

- This was a screenshot and DOM/text inspection audit, not a full WCAG test.
- Keyboard traversal, screen reader output, form validation, and full appointment booking behavior still need dedicated verification.
- Mobbin MCP was configured locally but unavailable as a callable tool in this thread, so comparator references were not used as live evidence.
