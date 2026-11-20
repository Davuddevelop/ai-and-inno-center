# The hackathon playbook

For the team, on the day. Print it. Keep it on the table. **If the event's official rules disagree with this page, the rules win.**

Everything here comes from the eight weeks. When you are lost, find the line and do it.

---

## The week before

- [ ] Every teammate can log in to GitHub, the host, and any AI tool you need.
- [ ] `main` is deployed. The URL opens in a **private window**, on a **phone**, on **mobile data**.
- [ ] Keys are in the host's **Secrets**, not in the repo.
- [ ] A **60-second backup video** of the working product, on two phones. Screenshots in a folder.
- [ ] **Laptops, chargers, a hotspot,** headphones. Everyone has the team's phone numbers.
- [ ] Food, water, and a plan for sleep.
- [ ] You wrote **five agreements** in the README: who decides, when you stop building, what you do when stuck, who submits, when you eat and sleep.
- [ ] Everyone has said the pitch out loud **twice**, with a timer.

---

## The first fifteen minutes

Do not touch a keyboard until you have done these.

1. **Read the official rules,** out loud, together. Write down: team size, theme, what you must submit, the deadline hour and time zone, which tools and AI are allowed, how you are judged.
2. **Assign the roles** from the list you were given. Say them aloud.
3. **List problems,** one per sticky note, no judging, for ten minutes.
4. **Apply the three filters:** Can we build the hero flow in six hours? Can a judge see it in sixty seconds? Does a stranger care in ten?
5. **Score the top three** with the idea scorer. If the top two are close, pick the one you can demo.
6. **Write one sentence:** *Our app helps ___ do ___ so that ___.*

---

## The clock

| Hour | Phase | Must be true |
|---|---|---|
| **0 to 2** | Pick the problem, cut the scope | One sentence, one user, one hero flow |
| **2 to 4** | **Deploy a skeleton** | A hello-world page on a real URL. Repo, issues, `main` protected |
| **4 to 14** | Build the hero flow | The one thing the demo needs |
| **14 to 18** | Polish and fix | Empty states, errors, phone layout |
| **18 to 21** | **Freeze. Record** | No new features. A backup demo recorded |
| **21 to 23** | Rehearse the pitch | Out loud, with a timer, twice |
| **23 to 24** | **Submit, with a buffer** | Every link tested in a private window |

### Checkpoints, and what to cut

| By hour | This must be true | If it is not |
|---|---|---|
| **4** | A skeleton page is live | Stop building. Fix deployment. Nothing else matters until it works |
| **10** | The hero flow works on your laptop, with fake data | Cut the AI part. Hard-code the answer. Finish the screens |
| **14** | The hero flow works on the live URL | Cut every screen except the one the demo needs |
| **18** | Nothing half-finished on `main` | Revert or delete the unfinished part. Freeze |

If you are behind: **ship less.** A smaller product that works beats a bigger one that does not.

---

## What each role does

| Role | Start of the day | Middle | End |
|---|---|---|---|
| **Product Lead** | Writes the one-sentence scope. Makes the board | Cuts scope. Decides when the team is stuck | Pitch and submission text |
| **Interface Builder** | Wireframes three screens. Builds the skeleton page | Hero flow with all four states. Tests on a phone | Polish. Phone test |
| **AI Engineer** | Picks the API. Tests one call | Prompt, data and glue code. **Offline fallback** | Freezes the prompts |
| **Platform Captain** | Creates the repo and board. Protects `main`. First deploy | Reviews and merges PRs. Watches the deploy and secrets | Runs the release check |
| **Demo Producer** | Collects assets. Outlines the script | Screenshots, README, pitch draft | Records the video. Runs the rehearsals. Submits |

Roles decide who **owns** a decision. Everyone helps everyone. In a team of three or four, some people hold two.

---

## Working rules

- **Every change goes through a branch and a pull request.** Nobody pushes straight to `main`.
- **Someone else reviews your PR and runs it.** Use `question:`, `nit:`, and `blocking:`.
- **Squash and merge,** with a clear title.
- **Keys live in `.env` locally, and in the host's Secrets online.** Never in the repo.
- **Keep an AI log** in the README: prompts that worked, mistakes the AI made, what you changed.
- **Stuck for 15 minutes?** Ask the team. Then ask the AI with the exact error text.
- **Small PRs.** A PR you can review in five minutes will be reviewed. A PR that takes thirty will wait.
- **Write a spec first** for anything you hand to an AI: *Done when: 1, 2, 3.* Then read what comes back.

---

## The pitch: three minutes

| Seconds | What | Notes |
|---|---|---|
| **0 to 25** | **The problem** | One person, one pain, a real situation |
| **25 to 45** | **The idea in one sentence** | What it is, and for whom |
| **45 to 130** | **Live demo** | One flow, on a phone. Say what you are doing |
| **130 to 155** | How it works, what is next | One sentence on the tech. One on what you would build next |
| **155 to 175** | Why this team | What you built and learned in this time |
| **175 to 180** | **Close** | Say the URL. Repeat the one sentence |

- Write the **first and last sentence word for word.** Know them cold.
- About **400 words** fits three minutes at a calm pace. Time yourself.
- Show every judging criterion: new, working, needed, well made, well explained.
- Have the backup video ready, and a second laptop logged in.

---

## Submission checklist

- [ ] The submission includes everything the rules ask for: repo, link, video, slides, description.
- [ ] The **live URL** opens in a **private window**, signed out, on a **phone**, on **mobile data**.
- [ ] **Two people** have tested the final link, separately.
- [ ] The README has the live URL on line three, who did what, the AI log, and what you cut.
- [ ] The repo is public, or access is granted as the rules say. There are **no secrets** in the history.
- [ ] The video plays with the sound off, and with the sound on.
- [ ] You submitted **at least 30 minutes before** the deadline.

---

## When it goes wrong

| What happened | Do this |
|---|---|
| A merge conflict | Do not panic. Open the file, read both sides, decide together |
| The deploy fails | Read the last lines of the build log. Missing package? Wrong capitals? Missing secret? |
| Works locally, breaks online | A file name with different capitals. A missing environment variable |
| The AI gives broken code | Paste the exact error back. Re-read the spec. **Read the code before you run it** |
| The live demo fails on stage | Say "let me show the recorded version." Start the video. Keep going |
| A teammate disappears | Cut a role, cut the scope, ship the smaller thing |
| Two of you disagree | Five minutes. Then **the person who decides** decides, as you agreed |
| You are stuck and tired | Eat. Drink water. Walk for five minutes. Then come back |

---

## The five agreements (fill in)

1. **Who decides** when we disagree: ______
2. **We stop building at hour** ______. Then we only fix, record, and rehearse.
3. **When stuck for fifteen minutes,** we ______.
4. **Who submits,** and who double-checks: ______ and ______.
5. **We eat, drink and sleep at:** ______.
