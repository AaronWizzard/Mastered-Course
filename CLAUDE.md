# CLAUDE.md

Claude reads this file at the start of every session. It's your project's standing brief: who it's for, what it is, and the house rules. Fill in the sections marked ✏️ before you ask Claude to build anything, and update them as the project changes.

## ✏️ About this project

- **What we're building:** A public **demo** of the Wizzard Personal Development Plan dashboard. It shows how one consistent development framework works for one made-up member of the Scientific Services team. It's a showcase, not the real tool. Real plans live in a private claude.ai page shared only with each employee and their manager, and they never come here.
- **Who it's for:** Bootcamp colleagues opening the link on a desktop or laptop at home. It should still work on a phone.
- **What "done" looks like today:** One made-up employee's plan (for example, a fictional Medical Writer) with:
  - a profile: name, role, framework level, line manager and start date;
  - the skills and behaviours rated on their scales (below);
  - a few goals;
  - a switch between **Employee view** and **Manager view**, so people can see who fills in what.

## ✏️ The framework (approved to show publicly)

Aaron has agreed that the real Wizzard framework, including the Scientific Services job descriptions, can appear on this public site. The employee and everything about them must still be made up.

- **Skills (4), rated 1–9** in three bands: **Improving** (1–3), **Expected** (4–6) and **Advanced** (7–9). The skills are Stakeholder engagement, Delivery and ownership, Quality and craft, and Contribution to Wizzard's growth. Each skill has a descriptor at four levels: Junior, Mid-Level, Senior and Director.
- **Behaviours (6), rated Developing, Consistent or Role model.** The behaviours are Curious and always learning, Collaborative, Clear and honest, Positive and resilient, Brave with ideas, and Helps others grow. Each one has a one-line definition and three "what it looks like" examples.
- **Roles and levels:** Graduate, Associate and Medical Writer are Junior. Senior Medical Writer is Mid-Level. Principal Medical Writer and Scientific Lead are Senior. Director of Scientific Services is Director.
- **Goals** follow the SMART format (Specific, Measurable, Achievable, Relevant, Time-bound), and each goal links to a skill or behaviour.
- **Source:** the full wording, descriptors and job descriptions come from Aaron's private Personal Development Plan page on claude.ai. Ask Aaron for the link when you need the exact text. Never copy any person's data or notes from it, only the framework and job descriptions.

## ✏️ Look and feel

- **Brand:** Wizzard's new 2026 brand.
  - Fonts: **Inter** (Black or ExtraBold) for headings and **Montserrat** for body text.
  - Colours: navy `#041E4B`, hot pink `#FF2EA6` for highlights, and a pink → violet → blue gradient (about `#FF2EA6` → `#8A12D8` → `#3D06F0` → `#4F86F7`) used sparingly as a feature accent. Backgrounds are off-white `#F7F8F8` and white, and text is `#333333`.
  - Style: big bold headlines with one or two words in pink, a short pink rule under headings, and navy cards with rounded corners.
  - Logo: don't copy the real logo file. Draw a simple "W" mark in SVG if one is needed.
- **Tone:** Warm and encouraging, like a good manager. Talk to the employee as "you", celebrate progress and frame gaps as next steps.
- **Reference:** the Wizzard credentials deck (Sept 2026) for the brand, and the private Personal Development Plan page for structure and content.

## About me

I'm not a developer. Explain what you're doing in plain English, keep explanations short, and avoid jargon. If you use a technical term, explain it in a few words.

## House rules

### How the project is built
- Plain HTML, CSS and JavaScript only. No frameworks, no build step and no npm packages unless I ask for them.
- `index.html` is the home page. Keep the project to a handful of files.
- The site is hosted on Vercel, which serves these files exactly as they are. Nothing needs installing or compiling.
- There is no server or database. If something needs saving, use the browser's localStorage, and tell me plainly that it only saves on this device and this browser.

### Data and safety
- This site is public. Anyone with the link can see it, and the code is on GitHub.
- Use made-up data only. Never add real client, product, patient or colleague information, even if I paste it in by mistake. If I do, stop and point it out. The one exception is the Wizzard framework and job descriptions described above, which are approved to show. No real person's ratings, goals, notes or appraisal details ever go here.
- Never add passwords, API keys or other secrets.
- Keep the footer line that says this is a training exercise.

### Quality
- Make it work well on a phone as well as a laptop.
- Make it accessible: good colour contrast, alt text on images, real headings and buttons.
- Fonts from Google Fonts are fine. Images should be ones you draw yourself (SVG or CSS) or plain placeholders.

### How to work with me
- Before a big change, tell me what you plan to do in two or three bullet points.
- After each change, tell me in one or two sentences what changed and how to see it.
- Commit with short, clear messages that a non-developer would understand.
- If I ask for something that breaks these rules, say so and suggest the nearest thing that doesn't.
