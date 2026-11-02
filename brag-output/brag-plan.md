# TuitionOne — brag plan (polished, vertical 1080×1920, 30fps)

**What it is:** Online video courses for Leaving Cert and Junior Cycle Maths, taught by a teacher who also corrects the State exams.
**For:** Irish secondary students (and the parents paying). Watch topic-by-topic exam walkthroughs, pause and rewind, from €150.
**Sets it apart:** "Learn from someone who knows the exam from both sides": 10+ years in the classroom, and an SEC exam corrector.
**Visual hook:** The site's own hero calculator typing 43770 and flipping it to HELLO, an in-joke every student knows.
**Share caption:** Learn the method. Master the exam.

## Angle
Calm and confident, like a good teacher. Use the site's real chalkboard green, cream paper, Fraunces serif and orange-soft italics. No hype. Each claim is copied word for word from the site.

## Music
90 BPM (beat = 0.667s, bar = 2.667s), D major, 8 bars = **21.33s**. Soft electric-piano chords (Dmaj9, Bm9, Gmaj9, A6sus) over a warm pad. A felt kick and shaker come in at bar 3. A bell motif plays in D major. Calculator keys tick on 8th notes in the hook. Every cut lands on a bar line with a soft chime pitched in key.

## Storyboard
| # | Time | Beat | On screen (real source) |
|---|---|---|---|
| 1 | 0.00–5.33 (bars 1–2) | Hook | Chalkboard gradient. The hero calculator SVG (`Hero.tsx`), scaled up, types 4-3-7-7-0 on 8th notes, flips to HELLO and flashes. From bar 2: eyebrow "Expert online exam preparation" and the headline **"Learn the method. / *Master the exam.*"** settle in while the calculator drifts up. |
| 2 | 5.33–10.67 (bars 3–4) | Reveal | Dip to cream. Eyebrow "Why parents choose us"; title **"Learn from someone who knows the exam from both sides"**. The three `ValueProps` cards rise in one per beat: 10+ years in the classroom · Exam insight from the inside · Built to win marks. |
| 3 | 10.67–16.00 (bars 5–6) | In use | Paper background. The `ModulesGrid` card "Higher Level Maths" (Maths banner, "Full access") gets tapped. A `VideoList` row "Module 1 — Foundations — Lesson" opens, and play is pressed. The player shows a chalkboard walkthrough drawing a worked answer, with a scrubber that rewinds once. Caption: **"Watch every step."** then *"Pause, rewind, revisit."* |
| 4 | 16.00–21.33 (bars 7–8) | Outro | Dip to deep chalkboard. `CtaBand`: **"Master the exam, *one topic* at a time"**, then "Leaving Cert & Junior Cycle Maths · from €150", the logo and a "Start learning" button. Hold. |

Data: the course and lesson names are the seed data's demo titles. No real student names or testimonials are used.
