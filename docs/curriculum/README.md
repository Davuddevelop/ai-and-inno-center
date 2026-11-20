# Classes: from beginner to hackathon-ready

Eight Thursdays, November 26 to January 14, then the hackathon on January 20. One interactive slide deck per meeting, a team-assignment tool, and everything around them. It teaches **tools, workflow and strategy**, not programming languages.

## Start here

**Open `slides/index.html`** (double-click it). It lists every week, with the next session highlighted. Nothing needs installing, and nothing needs the internet.

| I want to | Go to |
|---|---|
| Teach next Thursday | [`slides/index.html`](slides/index.html), then press **P** for presenter notes |
| See the whole plan | [CURRICULUM.md](CURRICULUM.md) |
| Prepare, and know what to check | [FACILITATOR.md](FACILITATOR.md) |
| Decide who does what | [ROLES.md](ROLES.md) and [team-board.html](team-board.html) |
| Give teams a day-of guide | [PLAYBOOK.md](PLAYBOOK.md) |
| Copy a PR template, scorecard, retro, etc. | [templates/](templates/) |
| Run the Week 4 code | [code/week4/](code/week4/README.md) |

**Read FACILITATOR.md first.** It lists the decisions only you can make, and the repositories you need to create before Week 2.

## What is in this folder

```
docs/curriculum/
  README.md           this file
  CURRICULUM.md       the 8-week program, week by week
  FACILITATOR.md      setup, weekly prep, deployment pre-flight, safeguarding
  ROLES.md            the five roles, the signals, how the scoring works
  PLAYBOOK.md         for teams, on hackathon day (print it)
  team-board.html     the role-fit tool (built from src/board.html)
  templates/          PR, issue, README, retro, pitch, scorecard, slips
  code/week4/         weather.py, the Streamlit page, an offline fallback
  slides/             the built decks, index.html, fonts, logo
    index.html        the launcher
    week-01-... to week-08-...   one deck per meeting
  src/                the source. Edit here, then rebuild
    decks/w1.py ... w8.py        one file per deck
    lib.py            the building blocks (cards, tables, widgets, ...)
    engine.css        the design system
    engine.js         navigation, presenter view, widgets
    build.py          builds everything and checks it
    board.html        source of the team board
    launcher.html     source of the launcher
    config.py         values the decks print (the GitHub org name)
    qa.mjs, test-*.mjs  layout and interaction tests
```

## The decks

Open one in a browser. Press **?** for help.

| Key | Action |
|---|---|
| Right, Space, Enter | Next step or slide |
| Left | Back |
| **P** | Presenter view: speaker notes, timer, next slide, in a second window |
| **G** | Slide overview |
| **H** | Handout mode: a plain page to read or print (automatic on a phone) |
| **F** | Fullscreen |

Interactive pieces: a **Git sandbox** (commit, branch, merge, and see fast-forward versus merge commits), a **merge-conflict resolver**, an **idea scorer**, **quizzes**, **checklists that remember what is ticked**, copy buttons, and **timers** for pitch rounds.

The design matches the website: dark navy ground, a single light-green accent, Fraunces for headlines, Geist for text, Geist Mono for labels.

## Changing a deck

The decks are Python files that call small building blocks. Open `src/decks/w4.py` to see the pattern.

```bash
python3 docs/curriculum/src/build.py            # rebuild every deck, the launcher, and the board
python3 docs/curriculum/src/build.py --sample   # also build the component test deck
```

Edit a file in `src/decks/`, rebuild, reload the browser. **Do not edit the HTML in `slides/` by hand.** It is overwritten on every build.

The build **checks your work**. It fails if a slide has no speaker notes, if a character is missing from the bundled fonts, or if a live deck's planned time is outside 75 to 95 minutes.

**Inline markup:** `**bold**`, `` `code` ``, `==accent==`, `[[key]]`, and `_italic_` in titles.

**Values to change:** the GitHub organization name the decks print is `ORG` in `src/config.py`. Change it, then rebuild.

### Testing

The tests drive real decks in a headless browser.

```bash
npm i -D playwright && npx playwright install chromium     # once

node docs/curriculum/src/qa.mjs                 # every slide, at 1280x720: nothing spills outside the safe area
node docs/curriculum/src/qa.mjs --shots DIR      # also save a screenshot of every slide
node docs/curriculum/src/test-interactions.mjs   # navigation, quizzes, git sandbox, conflict, scorer, timers, presenter sync, phone
node docs/curriculum/src/test-board.mjs          # the team board: scoring, team sizes, imports, persistence
node docs/curriculum/src/test-launcher.mjs       # the launcher: links, next-session highlight, phone
```

Run `build.py --sample` before `test-interactions.mjs`: it tests the sample deck.

## Privacy

The **team board holds student names and ratings.** It stores them only in your browser. Nothing is sent anywhere. Exported files are blocked from git by `docs/curriculum/.gitignore`. Clear the data when the program ends. See [ROLES.md](ROLES.md#privacy).

## Known limits

Read these before you rely on the program.

- **The live weather API call in Week 4 was not verified from the build environment.** The host was blocked there. The code was tested with a mock and against the offline version, so it should work, but **run it once on your own network first.**
- **Deployment hosts change.** Week 5 teaches GitHub Pages and Streamlit Community Cloud. Whether Streamlit connects to a repo owned by an organization was not verified. Do the [deployment pre-flight](FACILITATOR.md#deployment-pre-flight) before Week 5.
- **AI tool age and consent rules change, and sources conflicted.** The decks tell students to check the rules themselves. Confirm with the school.
- **The role weights are a judgment,** not a measurement. They are editable on the board, and [ROLES.md](ROLES.md) says why they are what they are.
- **January 20 is assumed to be a 24-hour event.** Week 8 has a slide for reading the official rules.
- **The slides are in English.** Task slides are the first to translate.
- **Timing is planned, not measured.** Expect to adjust after Week 1.
- **Fonts:** Fraunces and Geist are published under the SIL Open Font License. They are bundled in `slides/fonts/` as Latin and Latin Extended subsets. If you add a language that needs other glyphs, the build will refuse the deck and tell you which character is missing.
