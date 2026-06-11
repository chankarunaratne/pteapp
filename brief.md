# brief.md
## Project: PTElanka — PTE Prep App for the Sinhalese Market

**Working name:** PTElanka
**Visual direction:** Modern, clean, readability-first. Generous spacing, clear typographic hierarchy, high contrast. Sinhala text must render crisply (Noto Sans Sinhala).

---

## What We Are Building

A web-based PTE Academic preparation app targeted specifically at Sri Lankan students who speak Sinhala as their first language. Most existing PTE prep tools are entirely in English, which creates a comprehension barrier — students struggle with the meta-language of learning, not just the exam content itself.

Our edge is **comprehension scaffolding**: delivering PTE practice with Sinhala-language explanations, tips, and feedback so students understand *why* an answer is correct, not just *what* the correct answer is.

The app is for students preparing independently at home. No tutor, no classroom. They need structure, daily practice, and clear feedback in a language they fully understand.

---

## Target User

- Sri Lankan students preparing for PTE Academic
- Studying independently at home, no coaching class
- First language is Sinhala
- Comfortable using a web app on desktop or mobile browser
- Motivated but often lost on pattern-based tasks like Write From Dictation due to unfamiliar academic vocabulary at speed

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | Cursor-optimised, fast deployment, great DX |
| Styling | Tailwind CSS | No separate CSS files, fast iteration |
| Fonts | Noto Sans Sinhala (Google Fonts) | Best Sinhala Unicode support, free |
| Audio (v1) | Web Speech API (browser TTS) | Zero cost, no file uploads needed for prototyping |
| Audio (production) | Pre-recorded MP3s or ElevenLabs-generated, served statically | Crystal clear, consistent, one-time generation cost |
| Question bank (v1) | Hardcoded JSON file in the codebase | No backend needed for frontend prototype |
| Auth | None in v1 | Frontend prototype only |
| Database | None in v1 — Supabase when ready | Free tier, Postgres, built-in auth |
| Hosting | Vercel | Free tier, auto-deploy from GitHub, one command deploy |

**Total v1 cost: $0**

---

## V1 Scope — Frontend Only

V1 is a **frontend-only prototype**. No authentication, no backend, no database. The goal is to validate the core user experience and practice loop before building any infrastructure.

### What v1 includes
- A signed-in user state (simulated, no real auth)
- Sidebar navigation with three items: Dashboard, Practice, Profile
- Only the **Practice** page is functional
- One complete user flow: **Write From Dictation (WFD)**
- Hardcoded question bank (JSON) with Sinhala tips per question
- Browser TTS for audio playback
- Frontend scoring logic (word-by-word string comparison)
- Inline result feedback with Sinhala explanation
- Session summary at end of question set

### What v1 explicitly excludes
- Landing page
- Onboarding flow
- Real authentication
- Any backend or database
- Payment or subscription logic
- Any module other than WFD (others visible but locked)
- Mobile-specific optimisation (desktop-first for now)

---

## Information Architecture

```
/dashboard        → Placeholder (sidebar item, not clickable in v1)
/practice         → Main active page — category grid entry point
/practice/wfd     → WFD session — question, result, summary states
/profile          → Placeholder (sidebar item, not clickable in v1)
```

---

## The Primary User Flow (v1)

```
Practice page
  → Category grid (Listening active, Reading/Writing/Speaking locked)
  → User clicks Listening
  → WFD question loads immediately
      → Audio auto-plays once via browser TTS
      → Up to 2 replays allowed, remaining replay count shown
      → User types what they heard
      → User clicks Submit
          → Word-by-word result appears inline (correct / misspelled / missing / extra per word)
          → Score shown (e.g. 5/7 words correct)
          → App-generated feedback appears in Sinhala by default (toggle to English available),
            built from the user's actual mistakes + per-word notes for tricky words they missed
          → Next Question button activates only after Submit is complete
      → User clicks Next Question → next question loads
  → After all 3 questions → Session summary
      → Total score, accuracy %, weak words
      → Try Again or Back to Practice
```

The Next Question button is disabled until the user has submitted their answer and seen the feedback. This ensures every question is reviewed before moving on.

---

## Question Bank Format

Each question in the hardcoded question bank contains the sentence used for audio playback, a difficulty level, and a list of commonly-missed words, each with a short Sinhala (and English) note explaining the tricky vocabulary or common spelling mistake. These notes are surfaced by the marker only when the user actually gets that word wrong.

Start with 3 questions for v1. Enough to validate the full session loop end to end.

---

## Scoring Logic

PTE WFD scoring is word-by-word:
- Each correct word = 1 point
- Spelling must be exact, but case and punctuation are ignored (matches real PTE scoring) — comparison is on normalised words only
- Score = correct words / total words
- Implemented entirely in the frontend — no API calls

## Feedback Model — The App Is the Marker

The app evaluates the user's actual answer and generates feedback from it — it does not just show a static tip. After submission the app:

1. Aligns the user's answer against the correct sentence word-by-word
2. Classifies each word: correct, misspelled (close match), missing, or extra
3. Generates feedback in Sinhala (default, toggleable to English) built from what the user actually got wrong — e.g. naming the words they missed or misspelled
4. Layers in the per-question Sinhala notes for commonly tricky words, when the user got those words wrong

In v1 this is fully rule/template-based on the frontend (no AI calls). In V2+, richer marker-style feedback can be generated via the Claude API.

---

## UI Language Strategy

The app UI is primarily in English. Sinhala is used for post-submission feedback and also for instructional UI copy where it genuinely helps — we are targeting users whose English proficiency is limited, so any instruction, label, or prompt that could cause confusion should be written in Sinhala or presented bilingually.

A feedback language toggle is available on the result view, defaulting to Sinhala. Users can switch to English if preferred. This toggle persists for the session.

- **English**: navigation, buttons, PTE content, answers
- **Sinhala**: post-submission feedback and tips (default, toggleable to English), plus any UI instructions or helper text where Sinhala improves clarity for a low-English-proficiency user

Use judgment on where Sinhala instructions add real value. Not every label needs it — but task instructions, onboarding cues, and error states are good candidates.

This mirrors how a good Colombo tutor would actually teach — English for the exam content, Sinhala to explain the hard parts.

---

## V2 and Beyond (out of scope for now, noted for future reference)

- Real auth (Supabase)
- User progress tracking and streaks
- More PTE modules: Reading, Writing, Speaking
- Pre-recorded or AI-generated audio (ElevenLabs)
- Personalised feedback on Writing/Speaking via Claude API (paid feature)
- Mobile optimisation
- Payment and subscription (one-time pro tier)

---

## What Success Looks Like for V1

A signed-in user can open the app, navigate to Practice, pick Listening, complete a WFD session of 3 questions, see clear word-by-word feedback with a Sinhala tip after each submission, toggle that feedback to English if they want, and reach a session summary — all without any backend, auth, or AI calls. The experience should feel complete enough to show to a real student and get genuine feedback.
