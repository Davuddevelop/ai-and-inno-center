# Roles, and who is best for each

This is how the program decides who does what on hackathon day. It is a **method you can inspect and overrule**, not a verdict about anyone. The [team board](team-board.html) does the arithmetic. You make the decision.

Read this once before Week 7. Rate students as you go from Week 1, while the evidence is fresh.

---

## The five roles

Roles decide who **owns a decision**, not who does the work. Everyone helps everyone.

| Role | Owns | Hours 0 to 4 | Hours 4 to 18 | Hours 18 to 24 |
|---|---|---|---|---|
| **Product Lead** | Scope, the story, the final call | One-sentence scope, the board | Cuts scope, answers "what are we building?" | Pitch, submission text |
| **Interface Builder** | What the user sees and touches | Wireframe, skeleton page | Hero flow, the four states, phone layout | Polish, phone test |
| **AI Engineer** | The model, the data, the glue code | Pick the API, test one call | Prompt, data, offline fallback | Freeze the prompts |
| **Platform Captain** | The repo, PRs, deploys, secrets | Repo, board, protect `main`, first deploy | Reviews, merges, deploy health | Release check, private-window test |
| **Demo Producer** | The video, slides, assets, README | Collect assets, script outline | Screenshots, README, pitch draft | Video, rehearsals, submission |

**What a role is not.** It is not a promise that the person only does that. A Platform Captain still writes some code. An AI Engineer still helps test the phone layout.

---

## The five signals

Each student gets a 1 to 5 rating on five signals. The signals are things you can **see**, not traits.

| Signal | What you are looking for | Where you will see it |
|---|---|---|
| **Decides** | Scopes, cuts, makes a call and explains it | Week 3 mini sprint, Week 6 hats and cuts, Week 7 idea scoring |
| **Interface** | Clear screens, flow, the four states, a critical eye | Week 5 wireframe and critiques, Week 6 screens |
| **Technical** | Reads and debugs AI output and code, makes an API call work | Week 4 API lab and Streamlit page, Week 6 build |
| **Reliable** | Finishes on time, clean PRs, useful reviews, notices breakage | Every task due date, PRs, Week 6 hand-in |
| **Story** | A clear pitch, a README someone can follow, a good video | Week 6 README and video, Week 7 practice pitch |

### Scoring anchors

Rate from these anchors, not from a general feeling.

| Signal | 1 | 3 | 5 |
|---|---|---|---|
| **Decides** | Waits to be told. Avoids choosing | Decides when asked. Accepts the team's call | Proposes a cut or a decision unprompted, says why, and the team follows |
| **Interface** | Screens are unclear. Ignores empty and error states | Clean layout. Misses some states | Covers all four states. Spots problems in other people's screens. Tests on a phone |
| **Technical** | Pastes AI output without reading it | Runs it and fixes simple errors | Reads the output, finds a bug and explains it. Makes an API call work with a fallback |
| **Reliable** | Tasks late or missing. Pushes to `main` | Usually on time. Decent PRs | Always on time. Reviews others usefully. Notices a broken deploy first |
| **Story** | The point gets lost | Clear but flat | The room remembers one sentence. The README works without a video |

### The rules for rating

- **Rate only what you saw.** If you did not see it, leave it **blank**. The board counts blank as a neutral 3 and flags it. A neutral guess is better than an invented number.
- **One signal at a time.** Do not let a strong signal lift the others.
- **Write one line of evidence** in the note field for any rating of 1 or 5. If you cannot, change it to 2 or 4.
- **Check for these before you finish:**
  - Confident is not the same as capable. A loud student is easy to rate high.
  - A quiet student can be strong. Look at their work, not their volume.
  - Fluent English is not the same as a good idea. Rate what the person understood, not how they said it.
  - A friendship pulls ratings up. Re-read the ones you like most with the anchors beside you.
- **Rate again after the sprint (Week 6).** Early impressions are the least reliable.

---

## What students want

On a slip in Week 7, each student ranks the five roles from **1 (most curious)** to **5**, with one sentence on why their first choice. The board turns rank 1 into 5 points, rank 2 into 4, and so on down to 1.

**Why "want" counts as much as "observed" (50 / 50).** This is a judgment, and you can change it on the board. The reasoning: these are beginners, and a person who is curious and trying hard learns fast. A person put in a role they did not want, with no say, is likely to disengage. The cost is that some people will ask for a role they are not yet good at. That is a good problem on a team that has a rehearsal week.

---

## How a role's fit is scored

```
fit(person, role) = (1 - w) x observed(person, role) + w x want(person, role)
```

- `w` is how much **want** counts. Default 0.5.
- `observed(person, role)` is a weighted average of the five signals, using the row for that role below.
- `want(person, role)` is 5 for rank 1, down to 1 for rank 5. Unranked counts as 3.

### Which signals each role needs (the defaults)

| | Decides | Interface | Technical | Reliable | Story |
|---|---|---|---|---|---|
| **Product Lead** | 0.50 | | | 0.20 | 0.30 |
| **Interface Builder** | | 0.60 | 0.25 | 0.15 | |
| **AI Engineer** | 0.15 | | 0.65 | 0.20 | |
| **Platform Captain** | 0.15 | | 0.25 | 0.60 | |
| **Demo Producer** | | 0.25 | | 0.15 | 0.60 |

**These numbers are a judgment, not a measurement.** They say, for example, that a Product Lead is mostly about deciding and telling the story, and that a Platform Captain is mostly about being reliable. A different teacher could reasonably set them differently. The board lets you edit every cell. If the output feels wrong, change the weights and see whether it feels right, then ask why.

---

## Team sizes

The board tries every way of giving each person one slot and picks the highest total fit. Smaller teams combine roles.

| Team of | Slots |
|---|---|
| **5** | Each role separately |
| **4** | Product Lead + Demo Producer, then the other three separately |
| **3** | Product Lead + Demo Producer, Interface Builder, AI Engineer + Platform Captain |
| **2 or fewer, 6 or more** | Not supported. Re-form the team |

Why these combinations: Product Lead and Demo Producer both work with words and story, so one person can carry both. AI Engineer and Platform Captain both work close to the code, so one person can carry both better than they could carry the Interface. If your team has different strengths, change the combinations in `BUNDLES` at the top of the script in `src/board.html`.

---

## Forming the teams

Roles come second. **Teams come first.** The board does not form teams. Use these rules by hand:

1. **Spread strong technical people.** Do not put everyone with a Technical 4 or 5 on one team.
2. **Every team needs every role covered.** Look for at least one person with a decent Interface, one with a decent Technical, and one with a decent Story.
3. **One friend pairing per student at most.** Friends talk to each other, which helps. A whole team of friends skips the hard conversations.
4. **Aim for 4 or 5.** A team of 3 combines roles and is more brittle if one person is absent.
5. **Check the result with the board.** If a team has two students who both want the same role first, that is fine, but you should have a conversation.

---

## Using the output

The board shows the best arrangement, the next two, and flags. **Treat it as a second opinion.**

- **If the top two arrangements are within 0.15 points**, the board says so. That means it is your call, not the board's.
- **If someone is placed in a role they ranked 4th or 5th**, talk to them before you publish.
- **If someone has no ranking or many blank signals**, the suggestion is weaker for them. Say so.

### Telling a student they did not get their first choice

Say all three: what you saw that made you choose the role for them, what you need from them in that role, and what they can ask for. For example:

> "I put you as Platform Captain, not AI Engineer. In the sprint you were the one who fixed the deploy and wrote the review that caught the bug. The team needs that on the day. If you want AI Engineer for a later project, tell me, and you can pair with whoever holds that role on the model part for this one."

### Changes

- Each student can **ask for one change** after you publish the teams. Explain your decision, then decide.
- **No role swaps on the day** unless the team agrees and tells the Product Lead.
- After January 20, ask the students what they would change. That is the best data for the next group.

---

## What the board cannot know

- Who works well together.
- Who is shy, tired, or having a hard month.
- Who has a good idea that nobody has noticed.
- Whether a student is doing well in this subject but not showing it in a team.

Those matter more than a point of fit. If your gut says the board is wrong, say why out loud and trust what you can name.

---

## Privacy

The board stores names and ratings of students, many of whom are minors.

- It keeps data **only in the browser's local storage**. Nothing is sent anywhere.
- **Export files are never committed.** `docs/curriculum/.gitignore` blocks `team-board-*.json`. Do not rename them to get around it.
- **Share ratings with a student only about that student.** Do not show one student another's ratings.
- **Clear all data when the program ends.** Delete exports with it.
- Check what your school or the organizers require about keeping records of minors.
