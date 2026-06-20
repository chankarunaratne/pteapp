# Project Rules & Guidelines

This document outlines the rules, style guidelines, and constraints for development in this workspace.

## Coding Style & Standards
- Follow modern TypeScript and React best practices.
- Prefer functional components and React hooks.
- Use clean, semantic HTML5 elements.

## Design & UI Guidelines
- Maintain the application's established design system.
- Utilize tailwindcss classes or standard CSS variables defined in design tokens.
- Maintain responsive layouts and ensure vibrant, accessible typography and colors.

## Workflow & Documentation
- Document any major architectural decisions or new task type layouts.
- Keep comments concise and preserve existing docstrings.

## Question Implementation & Consistency
- **Layout & Structure**: Ensure all question types follow a consistent visual hierarchy:
  - Instructions at the top (with Sinhala translations provided inside an `InfoPopover`).
  - The question prompt and interactive input sections in the middle.
  - A **"Teacher feedback"** panel at the bottom (shown after submission) containing scores and dual English/Sinhala explanations.
  - A dedicated **Session Summary** view rendered at the end of the question sequence.
- **Reusability**: Reuse existing components (such as score overviews, feedback panels, audio players, and summaries) across different question types instead of implementing custom, duplicate components.

