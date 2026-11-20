# The curriculum

An eight-week program that turns beginner developers into a **hackathon-ready team** by January 20. It teaches **tools, workflow and strategy**. It does **not** teach programming languages.

---

## The idea in one paragraph

Hackathons are won by teams that pick a small idea they can finish, work together without breaking each other's code, put something real on a URL, and explain it clearly in three minutes. AI tools now write much of the code, so the scarce skills are **judgment** (what to build, whether the output is right), **workflow** (Git, pull requests, deployment) and **communication** (the demo and the pitch). This program trains those, in the order a hackathon uses them.

## Who it is for

Beginner developers, comfortable with a computer, mostly high school age. Assumed to have a laptop, a GitHub account (made in Week 1) and no earlier experience of Git, deployment or team development. A little programming exposure helps and is not required.

## What a student can do by January 14

1. Read a hackathon rubric and say what a judge will look for.
2. Save and share work with **Git and GitHub**, and keep secrets out of it.
3. Ship through a **pull request**, review a teammate's work, and resolve a **merge conflict**.
4. Use **AI tools as a teammate**: write a spec, check what comes back, and call a model from Python.
5. Design a screen for **one flow**, and put it on a **real URL** that opens on a phone.
6. Run a **three-hour sprint** with a team and hand it in on time.
7. **Choose an idea** with a score they can defend, and **pitch** it in three minutes.
8. Say which **role** they want on a team, and why.

## What it deliberately does not teach

- A programming language from scratch. Python appears in Week 4 for 20 minutes, as glue.
- A web framework. The decks use plain HTML, Streamlit and an API call.
- Machine learning. Students use models through APIs and tools.
- Design theory. Week 5 covers rules a beginner can check, not taste.

---

## The eight weeks

| Wk | Date | Title | The question it answers | Lab | Tasks due |
|---|---|---|---|---|---|
| 1 | Nov 26 | **How hackathons are won** | What does winning take? | Set up the machine, first repo, first AI-assisted build, access check | Wed Dec 2 |
| 2 | Dec 3 | **Git and GitHub from zero** | How do we save and share work safely? | Clone, branch, commit, push to `git-gym` | Wed Dec 9 |
| 3 | Dec 10 | **Shipping together** | How do five people change one project? | Conflict on purpose, then a three-PR mini sprint | Wed Dec 16 |
| 4 | Dec 17 | **AI as a teammate** | How do we use AI without trusting it blindly? | `weather.py`, then a Streamlit page | Wed Dec 23 |
| 5 | Dec 24 | **Make it real** | How does it look, and how does it go online? | GitHub Pages, then Streamlit Community Cloud | Wed Dec 30 |
| 6 | Dec 31 | **Take-home sprint** | Can our team ship alone, in three hours? | The whole sprint, at home | Wed Jan 6 |
| 7 | Jan 7 | **Strategy and the pitch** | What do we build, and how do we say it? | Idea scoring, a 90-second practice pitch | Wed Jan 13 |
| 8 | Jan 14 | **Demo Day** | Are we ready, and what is left? | Pitch rounds with scoring | Tue Jan 19 |

Tasks are due **the day before the next meeting**, so students arrive with the last one finished.

### How the weeks build on each other

```
Wk 1  Win condition    -> what to aim at
Wk 2  Git, GitHub      -> a safe place for work
Wk 3  PRs, reviews     -> five people, one project
Wk 4  AI, Python       -> speed, and checking it
Wk 5  Interfaces       -> something a judge can see
Wk 6  Sprint           -> all of it, once, in order
Wk 7  Strategy, roles  -> choose well, say it clearly
Wk 8  Demo Day         -> rehearse under the real rules
```

- **Weeks 1 to 5** teach one capability each, with a lab and tasks.
- **Week 6** uses all five at once, with no teacher in the room, to **find the weak spot while it is safe**.
- **Weeks 7 and 8** turn the weak spots into decisions and practice.

---

## Week by week

### Week 1: How hackathons are won (Nov 26)
**Outcomes.** Know what judges score and the three ways teams lose. Machine set up. A GitHub account with a first repo and two commits. A first AI-assisted page. An honest check of which AI tools they may use.
**Evidence.** `hello-yourname` repo with a README and `index.html`; the filled access table; a screenshot of four version commands.
**Key idea.** Judges see the product, the pitch and the potential. They rarely read the code.

### Week 2: Git and GitHub from zero (Dec 3)
**Outcomes.** Explain commit, branch, push, pull. Clone, branch, commit and push. Read the history. Keep secrets out of a repo with `.gitignore`. Recover from common mistakes.
**Evidence.** A branch pushed to `git-gym`; a `.gitignore` that hides `.env`; `git log --oneline --graph` output they can explain.
**Key idea.** A branch is a label, not a copy.

### Week 3: Shipping together (Dec 10)
**Outcomes.** Run the team loop: issue, branch, pull request, review, merge. Write a clear PR. Review with `question:`, `nit:` and `blocking:`. Resolve a merge conflict calmly.
**Evidence.** A team repo with five merged PRs from three people, each reviewed; a resolved conflict; a reflection PR in `classwork`.
**Key idea.** A conflict is a question about what the team meant.

### Week 4: AI as a teammate (Dec 17)
**Outcomes.** Use the build loop: spec, generate, run, read. Write a spec and a prompt. Check AI output. Call an API from Python. Show the same data as a web page. Keep keys in `.env`.
**Evidence.** `weather.py` and a Streamlit page in `week4/yourname/`; an AI log of three corrections; a five-line spec.
**Key idea.** Never trust, always check. The reading step is what makes you a developer.

### Week 5: Make it real (Dec 24)
**Outcomes.** Scope one flow into three screens. Plan four states per screen. Judge an interface in ten seconds. Put a page on GitHub Pages and a Python app on Streamlit. Keep secrets online. Test like a judge.
**Evidence.** Two live URLs that open on a phone; a wireframe; two critiques; a deploy-path test by Platform Captain candidates.
**Key idea.** If `main` always works, the live site always works.

### Week 6: Take-home sprint (Dec 31)
**Outcomes.** Take an idea from nothing to a live URL in three hours as a team. Use hats. Cut scope at the checkpoints. Write a README, record a 60-second demo, run a retro.
**Evidence.** A live URL; a team repo with a README, the AI log and what was cut; a demo video; a five-answer retro; one merged PR and one review per person.
**Key idea.** A smaller product that works beats a bigger one that does not.

### Week 7: Strategy and the pitch (Jan 7)
**Outcomes.** Turn a vague problem into a specific one. Filter and score ideas. Make every judging criterion visible. Build a backup plan. Pitch in three minutes. Rank the five roles by curiosity.
**Evidence.** A one-sentence idea with a user story and three screens; a fixed sprint product; a pitch draft; a role ranking.
**Key idea.** The demo is the pitch.

### Week 8: Demo Day (Jan 14)
**Outcomes.** Pitch under the real clock. Score peers on the five criteria and write one useful comment. Agree five team rules. Run a pre-flight check. Know what to do each day until January 20.
**Evidence.** A scored pitch; top three fixes; the five agreements in the README; a ticked pre-flight list.
**Key idea.** Fix, rehearse, rest.

---

## How students are assessed

There are **no grades**. Students are working toward a team result.

- **Tasks** are due the day before each meeting. They are evidence, and they feed the five signals in [ROLES.md](ROLES.md).
- **Repository history** is the record of teamwork: who opened issues, who reviewed, who merged.
- **The Week 6 sprint** and **Demo Day** are the closest thing to a test, and they are scored for learning, not ranking.
- **Roles** are assigned with the [team board](team-board.html) on Jan 8, using **what was observed** and **what each student wants**, equally.

## The shape of a deck

Weeks 2 to 5 and Week 7 follow one pattern, so students know what to expect. Week 1 opens with the plan instead of a recap. Week 6 is a self-guided reading deck. Week 8 is a rehearsal built around the pitch rounds.

1. A **cover** with the days left to January 20.
2. Two **quick-check questions** from last week.
3. **What you can do by the end**, with a time plan.
4. **Teaching sections**, each ending in something to do.
5. A **lab** that fills about a third of the session.
6. **Tasks**, with due date and what each one shows.
7. **Next week**.

Every slide has **speaker notes** in three parts: what to **say**, what to **do**, and what to **watch for**. Weeks 1 to 5, 7 and 8 are planned to 75 to 95 minutes. Week 6 is a self-guided reading deck for the take-home sprint.

## Assumptions to test

These are the assumptions the program rests on. If one is false, tell it so.

| Assumption | If false |
|---|---|
| Every student has a laptop that can install Git, Python and VS Code | Pair students, or run the labs in the browser with GitHub Codespaces, if the school allows |
| The room network allows GitHub, Streamlit and the weather API | Use the offline fallback in `code/week4` and a mobile hotspot |
| There are 12 to 25 students, in teams of 3 to 5 | Fewer than 9: use two teams. More than 25: add a second facilitator for the labs |
| January 20 is a 24-hour event | Re-plan Week 1's clock and Week 6's sprint to the real length |
| Students can use at least one AI tool legally and with consent | The program still works: teach the build loop with your own approved account on the projector, and use the offline fallback in `code/week4` |

## After January 20

Run a retro with the students: what they would teach differently, which week was weakest, which tool failed. Update the decks, rebuild, and keep the retro in a **private** place, since it names people.
