---
name: ui-ux-pro-max
description: "UI/UX design intelligence workflow for web and mobile work. Use when planning, designing, reviewing, fixing, or improving UI: landing pages, dashboards, admin panels, SaaS, e-commerce, and app screens. Covers accessibility, visual hierarchy, interaction states, layout, typography, color systems, motion, and charts."
argument-hint: "[UI/UX task or screen]"
disable-model-invocation: true
---

# UI/UX Pro Max

Use this skill as an opinionated workflow for UI/UX tasks in Copilot chat.

## When to Use
- Build a new page, section, or component.
- Review UI quality, accessibility, or interaction issues.
- Improve visual polish, responsiveness, motion, or data visualization.
- Choose or refine color, typography, spacing, and design-system rules.

## When Not to Use
- Backend-only tasks.
- API/database-only design.
- Infra/DevOps changes with no UI impact.

## Workflow
1. Analyze request intent.
2. Classify task type: new build, refactor, review, or bug fix.
3. Extract context: product type, audience, stack, constraints, and success criteria.
   - If context is missing or ambiguous, ask the user for the minimum required information before proceeding: (1) product type, (2) target device/breakpoint, (3) tech stack or design system in use. Do not assume defaults silently.
4. Propose UI direction: layout pattern, visual style, color approach, typography approach.
5. Apply priority checks in order:
   - Accessibility first.
   - Interaction and touch targets.
   - Performance and perceived speed.
   - Layout/responsiveness.
   - Typography/color consistency.
   - Motion quality.
   - Form and feedback clarity.
   - Navigation consistency.
   - Chart readability (if relevant).
6. Implement with state coverage by task type:
   - If task is a new build or refactor: apply full state coverage (default, hover, focus, active, disabled, loading, empty, and error).
   - If task is a review or bug fix: cover only states directly implicated in the reported issue.
7. Validate against completion checklist before delivering.

## Decision Branches
- If task is a new page: start with information hierarchy and section order.
- If task is a new component: start with interaction states and accessibility semantics.
- If task is a review/fix: map issue to category first, then patch root causes in the order of the priority checks list (Accessibility > Interaction > Performance > Layout/Responsiveness > Typography/Color > Motion > Form/Feedback > Navigation > Chart).
- If the user asks for dark mode: verify contrast and state parity independently for both themes.
- If charts are present: ensure labels/legend/tooltips plus non-color cues.
- If multiple branches apply simultaneously, execute each branch's starting requirement in the order listed above before proceeding to step 5.

## Completion Checklist
- Text contrast meets WCAG 2.1 AA minimums (4.5:1 for normal text, 3:1 for large text) and focus indicators meet WCAG 2.1 SC 2.4.7.
- Interactive targets are touch-friendly and keyboard reachable where applicable.
- No layout shifts from async content or media loading.
- Responsive behavior verified for phone/tablet/desktop breakpoints.
- Typography scale and spacing rhythm are consistent.
- Motion is purposeful, short, and reduced-motion safe.
- Forms provide clear labels, inline errors, and submit feedback.
- Navigation back-path and active state are predictable.
- Empty, error, and loading states are present where needed.

## Output Format
- For review/fix tasks: deliver a prioritized finding list (issue -> category -> recommended fix), then optionally a code patch.
- For new build/refactor tasks: deliver annotated code with inline comments explaining each decision.
- Always end with a checklist summary showing which items passed and which need follow-up.

## Prompt Starters
- "/ui-ux-pro-max Review this page for UX and accessibility issues."
- "/ui-ux-pro-max Redesign this dashboard with a cleaner hierarchy and better data readability."
- "/ui-ux-pro-max Improve this form flow for mobile completion speed."
- "/ui-ux-pro-max Refactor this component for better states, accessibility, and responsiveness."
