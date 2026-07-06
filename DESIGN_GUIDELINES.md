# Threadline Design Guidelines

This document captures the existing design language from the established Home, Understanding, Priorities, and Roadmap pages. New child and questionnaire surfaces should follow these rules. The reference audit intentionally excludes the new child pages.

## Reference Scope

- Home: daily energy, synthesis, timeline, insight sections, quick links.
- Understanding: clinical picture, hero synthesis, guide cards, area rows, questionnaire-to-understanding patterns in the established page shell.
- Priorities: priority explanation, timeline, connected priorities, weighting and resource patterns.
- Roadmap: plan hero, timeline steps, strategies, supports, footer CTA.

## Typography

### Fonts

- Sans: `Inter`, used for body text, labels, navigation, buttons, cards, metadata, forms, and most section titles.
- Serif: `Fraunces` by default, with optional `Frank Ruhl Libre` via the classic theme. Used for page H1s, hero quotes, large numeric/date moments, and some card titles.

### Hierarchy

- Page H1: serif, regular, `2.2rem` mobile, `2.6rem` xs, `3.2rem` sm, `4rem` md, line-height `1.15`, tracking about `-0.075rem`, max width usually `16ch` to `22ch`.
- Hero quote: serif, regular, `1.55rem`, line-height `1.34`, tight tracking, max width `34ch` to `38ch`.
- Section title: sans, regular, `2rem`, line-height `1.05`, tracking about `-1.12px`, color `--color-thread-heading`, margin-bottom `2rem`.
- Card title: sans medium around `1.12rem`, line-height `1.3`, tracking-tight, or serif regular around `1.45rem` when a card is more editorial.
- Body: sans, `0.92rem` to `1rem`, line-height relaxed, color `--color-thread-gray`.
- Metadata: `0.78rem`, gray, often paired with an uppercase label.
- Kicker and section labels: `0.75rem`, uppercase, `0.1em` tracking, medium, `--color-thread-mid-green`.
- Tiny card labels: `0.6rem` to `0.66rem`, uppercase, `0.12em` to `0.16em` tracking, medium, green or muted gray.
- Buttons: sans medium, primary buttons `0.82rem`, large slate buttons `0.98rem`, min height `44px` or `48px`.
- Forms: label `0.875rem` medium, input text `0.95rem`, placeholder `--color-thread-placeholder`.

Avoid bold-heavy labels in setup flows. Use medium weights unless something needs clear emphasis.

## Color System

### Core Tokens

- Heading / primary text: `--color-thread-heading` (`#0B4636` energetic theme).
- Dark body text: `--color-thread-dark-slate` (`#1F2937`).
- Muted body text: `--color-thread-gray` (`#6B7280`).
- Placeholder / disabled text: `--color-thread-placeholder` (`#9CA3AF`).
- Brand green: `--color-thread-mid-green` (`#108560`).
- Light mint: `--color-thread-light-green` (`#E6F4ED`).
- App background: `--color-thread-off-white` (`#F5F7F6`).
- Warm accent surface: `--color-thread-cream` (`#EEE9D9`).
- Borders: `black/5` for cards and panels, `black/10` for dividers and inputs, `black/15` only where stronger form separation is needed.

### Usage

- Use white cards on off-white page backgrounds.
- Use mint for supportive selected states, status chips, and light primary CTAs.
- Use brand green for active indicators, focus rings, icons, and primary filled CTAs.
- Use slate/dark text for readable content, not black.
- Use amber/rose sparingly for warnings or destructive actions only.

## Spacing

- Page shell: `pt-16 pb-16`.
- Main container: `max-w-5xl mx-auto px-6 sm:px-8 md:px-12`.
- Page header spacing: usually `mb-24`, reduced to `mb-12` or `mb-14` for intake/preview states.
- Major sections: `mb-24`; supporting lower sections often `mb-16`.
- Card padding: `p-6`, `p-7.5`, or `p-10` for hero cards.
- Form group spacing: `space-y-6` to `space-y-8`.
- Grid gaps: `gap-6` for cards, `gap-4` for tabs/list buttons, `gap-2.5` for chips.
- Timeline spacing: grid gap `4.5`, item bottom padding `6.5`.

The spacing scale is Tailwind-based with recurring 4px increments. Keep vertical rhythm airy and predictable.

## Layout

- Use `PageContainer` for standard pages.
- Reference pages use a single-column page rhythm with hero cards followed by full-width sections.
- Cards are grouped in 2-column or 3-column grids that collapse to one column on mobile.
- Timelines use a left rail with circular step markers and a thin `black/10` line.
- Hero/image bands can sit directly above a hero quote card with rounded top corners.
- Avoid nested card-in-card layouts. Panels should be page sections, cards, modals, or timeline rows.
- Responsive behavior should preserve hierarchy: header, hero, sections, then footer CTA.

## Components

### Buttons

- Primary light CTA: `Button variant="mint"` for standard action prompts.
- Strong CTA: `Button variant="forest"` when the action completes or advances a flow.
- Secondary: `Button variant="muted"` for optional or lower-priority actions.
- Link action: `ActionLink` for row/card actions.
- Buttons are pill shaped, min `40px` to `48px` high, medium weight, and use lucide icons when helpful.

### Cards

- Default card: white, `border border-black/5`, soft premium shadow when elevated, one expressive corner such as `rounded-tr-[32px]`.
- Hero card: `HeroQuoteCard`, white or green, `rounded-tr-[36px]`, `p-10`, subtle ring motif.
- Guide card: image optional, white, expressive corner, title/body/action hierarchy.
- Value card: mint, cream, white, or green; used for compact explanatory points.

### Forms

- Inputs use `Input` where possible.
- Textareas should mirror `Input`: off-white translucent fill, `border-black/10`, `rounded-xl` or an expressive `rounded-tr-[24px]`, `0.95rem` text, mint focus ring.
- Select controls use the same border, fill, and focus treatment as inputs.
- Choice chips use rounded pills, white idle state, mint selected state, and medium text.
- Avoid dense survey styling, square keyboard badges, and heavy font-mono unless a technical value is required.

### Navigation

- Side navigation and top navigation use medium sans text, quiet icons, and active states in green/mint.
- Setup steppers should use the same typography as section labels plus compact step descriptions.

### Progress

- Progress bars are thin, green, and animated.
- Circular progress indicators use a pale green track, green progress stroke, and centered small medium text.
- Status pills use tiny uppercase medium labels.

### Badges, Chips, Tooltips

- Evidence and status badges are small, rounded, uppercase or compact labels.
- Chips are useful for selected filters and intake tags.
- Tooltips should be plain, short, and attached to icon-only controls.

### Dialogs

- Modals use white surfaces, `border-black/5`, `shadow-modal`, and a single expressive rounded corner.
- Modal actions should reuse `Button`.
- Overlays should be calm and unobtrusive, usually white/watercolor with light blur.

### Empty And Loading States

- Empty states should explain what will appear and provide one clear next action.
- Loading should use subtle progress or spinner treatment inside existing card or button styles.

### Icons And Images

- Use `lucide-react` icons, stroke around `1.7` to `2`.
- Icons sit in circular mint or green containers.
- Use real or existing watercolor/photo assets. Do not create CSS-only decorative illustrations.

## Visual Language

- Personality: calm, professional, warm, parent-friendly, lightly clinical.
- Radius: expressive single-corner radii are common (`rounded-tr-[32px]`, `rounded-br-[36px]`), while controls use full pills or `rounded-xl`.
- Shadows: soft premium shadows only when elevation helps; many cards stay flat with a thin border.
- Borders: thin, low contrast, usually black at 5-10 percent opacity.
- Motion: small fades and y-offsets, `0.3s` to `0.5s`, gentle hover scale or translate only.
- Hover: slightly stronger border, subtle background tint, small icon movement.
- Active: mint fill, green icon/text, or green circular marker.
- Disabled: reduced opacity and placeholder gray.

## UX Patterns

- Pages begin with a kicker, large H1, and optional metadata row.
- Important context appears in a hero quote card before detailed content.
- Sections begin with `SectionLabel` and `SectionTitle`.
- Cards are grouped in clean grids, not dense dashboards.
- CTAs appear at the end of hero cards, timeline descriptions, or footer CTA bands.
- Timelines communicate sequence and status with a left rail and concise row copy.
- Forms are split into short steps with reassuring copy and visible progress.
- Clinical interpretation stays separate from parent-entered observations.

## Accessibility Considerations

- Keep text contrast high by using thread heading/dark slate for primary copy and gray only for secondary copy.
- Maintain at least `40px` interactive target height; prefer `44px`.
- Use visible focus rings in green.
- Do not rely on color alone for status; pair color with text, icons, or labels.
- Buttons and selectable cards need semantic button roles.
- Preserve keyboard access in questionnaire modals and make save/exit actions visible.
- Avoid excessive motion; transitions should be short and functional.
- Validate actual accessibility with keyboard and screen reader checks before claiming compliance.

## Correct Usage

- Page section: `SectionLabel` + `SectionTitle` + content grid with `gap-6`.
- Primary setup action: `Button variant="mint"` for continue/review, `forest` for final confirmation.
- Intake card: white background, `border-black/5`, expressive rounded corner, `0.92rem` gray description.
- Questionnaire option: white card with thin border, mint selected state, medium text, check icon.

## Incorrect Usage

- Using bold `text-xs` uppercase labels for every step header.
- Mixing square survey controls with pill CTAs and expressive Threadline cards.
- Adding new colors outside the thread tokens for normal states.
- Using dense nested cards or heavy shadows inside existing cards.
- Making new child pages look like a separate onboarding product.
- Editing Home, Understanding, Priorities, or Roadmap to force consistency.

## New Child Audit Before Refactor

The following inconsistencies were found in the questionnaire and new child surfaces before the refactor:

- Questionnaire shell used a generic rounded wizard container (`rounded-3xl` / `rounded-tr-[48px]`) instead of the established `rounded-tr-[36px]` card language.
- Step headers used bold `text-xs` labels instead of Threadline section label typography.
- Step H1s were smaller and less aligned to the established page hierarchy.
- Helper panels used generic `rounded-2xl` surfaces without the thin border and expressive corner pattern.
- Select controls were white with stronger borders instead of matching the shared input surface.
- Choice chips and date/time options used ad hoc selected states and inconsistent radii.
- Step 4 section rows felt like a standalone survey list rather than Threadline cards.
- Questionnaire progress summary used heavier text and less consistent card treatment.
- The internal questionnaire modal used a generic large rounded modal and custom button styles instead of `shadow-modal`, expressive corner radius, and shared `Button` variants.
- Question options used square keyboard badges and survey-style emphasis that did not match the app's calm card language.
- Modal footer helper text used animated/pulsing instruction copy, which was visually noisy compared with the reference pages.
- Upload and completion states used generic rounded panels rather than the established white/off-white card surfaces.
- New child preview cards were mostly aligned but needed to continue following the white card, thin border, muted metadata, and mint status pattern.
- What You Noticed was structurally aligned with Roadmap and should keep using PageHeader, watercolor band, HeroQuoteCard, AreaItem, StrategyCard, and PageFooterCTA patterns.

## Refactor Rules For New Child Pages

- Do not edit Home, Understanding, Priorities, or Roadmap as part of new-child alignment work.
- Keep new-child pages inside the same page shell and section rhythm as the established pages.
- Reuse shared UI components before writing new one-off styles.
- If a one-off is required inside the questionnaire, define a small local style helper that uses existing tokens.
- Use parent observations as intake context, not clinical conclusions.
- Keep empty states calm and action-oriented.
