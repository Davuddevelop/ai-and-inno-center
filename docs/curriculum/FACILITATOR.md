# Facilitator guide

For the person standing in front of the room. The decks carry speaker notes (press **P** for presenter view). This guide covers everything around them: setup, what to prepare, what goes wrong, and what is yours to decide.

**Read first:** [Decisions only you can make](#decisions-only-you-can-make). Several things in the decks depend on them.

---

## Contents

1. [Decisions only you can make](#decisions-only-you-can-make)
2. [Before the first class](#before-the-first-class)
3. [Repositories to create](#repositories-to-create)
4. [Running a Thursday](#running-a-thursday)
5. [Week by week: before, during, after](#week-by-week)
6. [Deployment pre-flight](#deployment-pre-flight)
7. [Tools and rules: what to verify](#tools-and-rules-what-to-verify)
8. [Tracking what you see](#tracking-what-you-see)
9. [Safeguarding and privacy](#safeguarding-and-privacy)
10. [When you fall behind](#when-you-fall-behind)

---

## Decisions only you can make

These are open. The decks make a reasonable assumption for each, shown below. Change the assumption if it is wrong, in the deck source, then rebuild (see [README](README.md)).

| Decision | What the decks assume | What to do |
|---|---|---|
| **Practice teams.** Week 3 needs a team repo, but no deck says how teams are chosen | Practice teams of 3 to 5 exist from Week 3 and are used through Week 7. **Hackathon teams are published on Jan 8** and may differ | Form practice teams by **Dec 3** using the rules in [ROLES.md](ROLES.md#forming-the-teams). Tell students plainly that the hackathon teams may change |
| **What Jan 20 is.** Event day, or a submission deadline? | Event day, 24 hours | Ask the organizers. Week 8 has a slide for the official rules. If it is a deadline for a longer build, Weeks 7 and 8 still work but the 24-hour clock in Week 1 does not |
| **School calendar.** Is the school open on **Dec 24**? Dec 31 and Jan 1 to 2 are non-working days | Dec 24 is held, conditionally. Dec 31 is a take-home sprint with no meeting | Check by Dec 10. If Dec 24 is closed, move Week 5 to a day that works and keep the Dec 30 due date |
| **Approved AI tools.** Which can students use, and with whose consent? | The decks name categories and examples, with the age rules students must check themselves | Ask the school contact **in Week 1**. Week 4 expects the answer |
| **Language.** Slides are in English | English, with plain wording. Students are beginners | Offer to translate the task slides first. Do not translate technical terms the tools show in English |
| **Guest judges for Demo Day** | Optional | Invite one or two by Jan 7 |
| **Devices.** Does every student have a laptop? | Yes | Find out in Week 1. Pair students if not, and check the school can lend machines |

---

## Before the first class

**By Nov 25**

- [ ] **Run the check yourself on a clean machine:** `git --version`, `python3 --version`, `node --version`, `code --version`. Install what is missing.
- [ ] **Create the GitHub organization** (the name is `ORG` in `src/config.py`, default `ai-innovation-center`). Set **base permissions to Read**, and invite yourself and any co-teacher as owners.
- [ ] **Create the repositories** listed below.
- [ ] **Open every deck once** on the projector you will use. Check fonts, the **P** presenter window, fullscreen, and that the cover shows the right countdown.
- [ ] **Test the room's Wi-Fi.** Open `github.com`, `api.open-meteo.com` and `share.streamlit.io` on the room network. Anything blocked now will be blocked in class.
- [ ] **Ask the school** which AI tools are approved. Week 4 needs the answer.
- [ ] **Tell students what to bring:** a charged laptop, the charger, and a phone.
- [ ] **Send the Week 1 deck** to the group so absent students have it.

**Equipment:** projector, a whiteboard or large paper, a second screen or tablet for presenter notes if you have one, spare chargers, a mobile hotspot as a backup.

---

## Repositories to create

All inside the organization. The decks assume these names exactly.

### `git-gym` (needed Week 2)

A practice repo where every student can push a branch.

- A `README.md` explaining it is for practice and anything goes.
- A few small text files to edit, such as `notes.txt`.
- **Invite every student as a collaborator with Write access** before Dec 3. A student without access cannot do the lab.
- Issues enabled. Students open one in Week 2.

### `conflict-lab` (needed Week 3)

- One file, `team-motto.md`, with a single line: `Our team motto: ` followed by a few words.
- Teams of three edit the **same line** differently on purpose.
- Make a copy per team (`conflict-lab-<team>`) or let each team fork it. A shared repo with fifteen people editing one line is chaos.

### `classwork` (needed Week 3 and 4)

- Folders: `week3/` and `week4/`.
- `.github/pull_request_template.md` from [templates/pull_request_template.md](templates/pull_request_template.md).
- A short `README.md` with the exact folder rule: **`week3/yourname.md`** and **`week4/yourname/`**. A wrong folder wastes your Friday.

### Team repos (needed Week 3, again in Weeks 6 to 8)

One **public** repo per team, named `team-<name>`. Public repos let you protect `main` and use GitHub Pages on a free organization.

- A `README.md` (use [templates/README-template.md](templates/README-template.md)).
- `.github/pull_request_template.md`.
- Issue templates from [templates/](templates/).
- Branch protection on `main`: require a pull request, no direct pushes. Check **Settings, Rules** in each repo.

> **Hackathon team repos.** On Jan 8 you publish the final teams. Make new repos, or move people. Do not rename the old ones: students will need their sprint history.

---

## Running a Thursday

Each session is 90 minutes. The decks are planned to **75 to 95 minutes**, shown in the presenter view timer.

| Block | Min | What happens |
|---|---|---|
| Recap | about 10 | Two quick-check questions from last week |
| Teach | about 25 | The slides, with step reveals |
| Build | about 30 | The lab. This is the most important block |
| Review | about 15 | Show a few results, fix common faults |
| Tasks | about 10 | Read the task slide aloud. Post it as text |

### Keys

| Key | Action |
|---|---|
| Right, Space, Enter | Next step or slide |
| Left | Back |
| **P** | Presenter view (notes, timer, next slide), opens in a second window |
| **G** | Slide overview |
| **H** | Handout / reading mode (also automatic on a phone) |
| **F** | Fullscreen |
| Home, End | First or last slide |

Open the presenter view **before** you start. It syncs with the main window. It works from a local file, no internet needed.

### Principles

1. **The lab is the lesson.** If you are short of time, cut teaching, not lab.
2. **Walk the room during every lab.** Look at screens, not faces. The notes list what to look for.
3. **Do it live first.** Show each step on your own account on the projector, then let them go.
4. **Post the task slide as text** in the group. Nobody should have to photograph the screen.
5. **Beginners need something that works early.** If a lab fails for the whole room, switch to the fallback in the notes and say why.
6. **Say "I do not know" when you do not.** Then find out.

### Mixed levels

- Pair a student who is ahead with one who is behind. They both learn.
- Give a fast finisher a harder task from the same lab: a third city in Week 4, a second page in Week 5.
- Never let a student sit stuck for more than five minutes. Ask a neighbour, then you.

### Absent students

Send the deck link and the task slide on the day. Tell them what the lab was and ask them to do it at home. The decks open in a browser from a file, with no sign-in.

---

## Week by week

What to prepare, and what to do afterwards. The speaker notes in each deck hold the detail.

### Week 1, Nov 26: How hackathons are won
**Before:** accounts and repos ready. Print the access table or share it as text.
**During:** setup lab (10 min), GitHub profile, first repo and commit, first AI-assisted build, access check.
**After:** post tasks. Start the [tracking sheet](#tracking-what-you-see). Ask the school about AI tools.
**Watch:** terminals that were not reopened after an install.

### Week 2, Dec 3: Git and GitHub from zero
**Before:** `git-gym` exists and every student is a collaborator. Form practice teams.
**During:** git sandbox, then clone, branch, commit, push. `.gitignore` and secrets.
**After:** check every student pushed a branch. Fix anyone who could not **before** Week 3.
**Watch:** cloning inside another repo; being on the wrong branch; a rejected push.

### Week 3, Dec 10: Shipping together
**Before:** `conflict-lab`, team repos with a README and the PR template, a project board per team.
**During:** model one PR and review live. Conflict lab (17 min), mini sprint (22 min).
**After:** collect the reflection PRs in `classwork`. **Take notes on who reads code carefully, communicates, finishes.**
**Watch:** conflict markers left in the file; forgetting `git add`; resolving on `main`.

### Week 4, Dec 17: AI as a teammate
**Before:** run `code/week4/weather.py` once **on the school network**. Bring the answer on approved AI tools.
**During:** API call lab and the Streamlit page.
**After:** check PRs arrived in `week4/yourname/`. Confirm Dec 24 with the school and tell students.
**Watch:** `pip` failing; blocked hosts. The offline files in `code/week4` are the fallback. If students cannot reach this repo, paste them in the group.
**Note:** the live Open-Meteo call was **not verified from the build environment** (the host was blocked). It was tested with a mock and against the offline version. Run it yourself first.

### Week 5, Dec 24: Make it real
**Before:** confirm the school is open. **Do the [deployment pre-flight](#deployment-pre-flight)** and test both labs from a fresh account.
**During:** wireframe, design basics, GitHub Pages lab, Streamlit lab, secrets.
**After:** send the Week 6 deck to the group. Ask who volunteered as Platform Captain candidates.
**Watch:** Pages 404 (private repo, or no `index.html`); Streamlit build failures (a missing line in `requirements.txt`).

### Week 6, Dec 31: Take-home sprint (no meeting)
**Before:** send the deck by Dec 24. Test both repo options with a test repo and two committers. **Tell teams when you will check messages.**
**During:** be reachable for the three-hour window. Do not intervene unless asked.
**After:** check each repo from Jan 1 to 6, so a stuck team is found early. Read every retro before Jan 7.

### Week 7, Jan 7: Strategy and the pitch
**Before:** read every retro. Fill in the [team board](team-board.html) with your observations. Print role-ranking slips ([templates/role-ranking-slip.md](templates/role-ranking-slip.md)).
**During:** retro round, scoring ideas, pitch practice, role ranking.
**After:** enter the slips into the board that evening. **Publish teams on Jan 8**, with a reason for each role, before you publish anything else.
**Watch:** a team that has not finished the sprint. Use their retro. Do not punish.

### Week 8, Jan 14: Demo Day
**Before:** order of pitches, projector and screen mirror tested, scorecards printed ([templates/scorecard.md](templates/scorecard.md)), rosters ready, guests briefed.
**During:** tech check, pitches with a hard stop, scorecards, debrief.
**After:** post the common problems. **Be fast in the group chat all week.**
**Watch:** a team whose URL does not open. They found their first fix.

---

## Deployment pre-flight

**Why:** two hosts are named in the decks. Free plans change. You have to know what works **before** Week 5, because students will try it live.

Do this by **Dec 17**, again by **Dec 29**, with a **fresh GitHub account** that is not an owner of your organization, so you see what a student sees.

### A. GitHub Pages

1. Create a public repo in the organization with an `index.html`.
2. **Settings, Pages**: deploy from branch `main`, folder `/ (root)`.
3. Open the URL on a phone, on mobile data.
4. Add a second committer. Push a change from each. Confirm both deploy.

### B. Streamlit Community Cloud

1. Put `code/week4/app.py` and `requirements.txt` (`streamlit` and `requests`) in a public repo.
2. At `share.streamlit.io`, sign in with GitHub and create the app.
3. **Repeat with a repo in the organization.** Streamlit may need an organization owner to approve its access. Note exactly what it says.
4. Add a secret in the app settings and read it with `st.secrets`.
5. Leave it a day. Open it again. Note how long it takes to wake.

### C. If you plan to teach Vercel

Check the current terms for the free plan, personal and non-commercial limits, and whether it connects to **organization-owned** repos and multiple committers. The decks do **not** depend on it.

### Record the result

| Test | Worked? | What it said or did |
|---|---|---|
| Pages, personal repo | | |
| Pages, org repo | | |
| Pages, two committers | | |
| Streamlit, personal repo | | |
| Streamlit, org repo | | |
| Secrets online | | |

If a row failed, use the fallback: **personal public repos owned by one teammate, with the others as collaborators.** The Week 6 deck already has this as option B.

---

## Tools and rules: what to verify

These facts were checked while building the program. **Free plans, ages and terms change. Verify each against the provider's current page before telling students it is true.**

| Topic | What was found | Verify at |
|---|---|---|
| **GitHub Student Developer Pack** | Students 13 or older at a school that grants degrees or diplomas can apply. Whether a given high school qualifies is the school's question | `education.github.com` |
| **GitHub Pages** | Free on public repos for personal accounts and free organizations | GitHub Docs |
| **Streamlit Community Cloud** | Deploys from GitHub. Needs `requirements.txt`. Secrets in an app settings box. Free apps sleep when idle | `docs.streamlit.io` |
| **Vercel Hobby plan** | Free, but for personal and non-commercial use, with limits on team and organization repositories | `vercel.com/docs` |
| **AI tool age rules** | **Vary by tool and change often.** Findings: Claude requires 18+. ChatGPT, 13+ with parental permission under 18. Gemini, 13+ for personal accounts (school accounts depend on the school's admin). Google AI Studio reported 18+, with conflicting sources | Each provider's terms |
| **Judging** | Most hackathons score product, pitch and potential. Few read the code | The event's published rubric |
| **Dates** | Dec 31 is an official non-working day in Azerbaijan; Jan 1 and 2 are holidays | The official calendar |

Tell students to **check the minimum age and consent rules themselves**, in Week 1, and fill in the access table. Do not make the call for them, and do not tell a student to lie about their age to get an account.

---

## Tracking what you see

Rate students as you go. [ROLES.md](ROLES.md) explains the five signals and the scoring anchors. The simplest working habit is **two lines per student after each session**.

| Date | Name | What I saw | Signal |
|---|---|---|---|
| Dec 10 | | Read a teammate's PR line by line, asked a real question | Technical, Reliable |

Move the ratings into the [team board](team-board.html) before Week 7. Remember: **rate only what you saw, and write a line of evidence for any 1 or 5.**

Never keep the sheet in the repository.

---

## Safeguarding and privacy

Many students are minors. Check your school's policy before Week 1 and follow it where it is stricter.

- **Parental consent** for AI tools and for accounts, where a tool or the school requires it.
- **No real personal data** in any project, test or demo. Use made-up names and examples.
- **Photos and video.** Demo videos show faces and voices. Ask for consent from students, and from parents for under-18s, before recording the room. Voice-only screen recordings avoid most of this.
- **Public repositories** are public. Never put a student's real name, school, address, phone number or photo in one without consent. A GitHub username is enough.
- **Keys and tokens.** Never share, screenshot or paste one. Rotate it if it leaks.
- **The Week 6 sprint happens outside class.** If teams meet on a video call, use a platform your school approves and follow its rules on adult supervision. Tell parents the sprint is happening and when.
- **Student ratings** (the team board) are private. Share a student's own ratings only with them.
- **A concern about a student's safety** goes to the school's designated contact, not into a group chat.

---

## When you fall behind

Cut in this order. Never cut the lab.

| Week | If you are behind, drop |
|---|---|
| 1 | The "make your GitHub account count" step. Do it as a task |
| 2 | "Play with history". Keep the clone, branch, commit, push lab |
| 3 | The standup slide. Keep the conflict lab |
| 4 | The Streamlit page. Keep the API call |
| 5 | The design basics slide. Keep both labs |
| 7 | The traps slide. Keep the practice pitch |
| 8 | The look-back slide. Keep the pitch rounds and debrief |

If the **whole program** is behind by Week 5, merge Weeks 5 and 6 into one session and use Dec 31 as a catch-up, not a sprint. Then Week 7 uses the sprint as a lab.
