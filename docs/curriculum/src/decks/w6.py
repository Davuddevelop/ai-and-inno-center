"""Week 6 -- Thu Dec 31: take-home sprint. Self-guided, no meeting (public holiday)."""
from lib import *
from config import ORG

DECK = Deck("w6", 6, "2026-12-31", "Thu, Dec 31", "Take-home sprint", live=False)

DECK.add(
    cover("Take-home sprint", "Three hours, one _product_",
          "No meeting today. Your team ships one tiny product, from idea to live URL, in a single sitting.", 6, "Thu, Dec 31", "2027-01-20",
          notes=NOTES(say=["This deck is for the team to read on their own. Everything they need is in it: the brief, the clock, the rules, what to hand in.",
                           "Dec 31 is a public holiday, so there is no meeting. That is a feature: the team has to run itself, which is what a hackathon is."],
                      do=["Send the link to the group by Dec 24 at the latest, so absent members have it too.",
                          "Be reachable for questions for the three-hour window. Tell the teams exactly when you will check messages.",
                          "Deployment pre-flight: before Dec 31, try a test repo in the center's GitHub organization with Pages and with Streamlit Community Cloud, with two people committing. Know what breaks before they do."],
                      watch=["Some teams will not find a shared three-hour slot over the holidays. The window runs to Jan 5. Do not let a team skip the sprint, but let them choose the day."]), mins=1),

    slide("What this _is_", B(
        UL(["A **rehearsal for January 20**. Every skill from the last five weeks, used once, in order.", "**Graded on whether your team shipped**, together, on time. Not on how clever the idea is.", "Do it in **one sitting of three hours**, any time from Dec 31 to Jan 5, with everyone present, in person or on a call."]),
        CALLOUT("A tiny product that works and is live beats a big one that does not. The point is to learn where your team gets stuck, while it is safe to get stuck.", title="Why we do this")),
        kicker="Start here", mins=2,
        notes=NOTES(say=["Say plainly that it is not a competition between teams. Each team is competing with its own clock.",
                         "The best outcome is a team that discovers a real problem, like a deploy that fails with two committers, and writes it down."],
                    watch=["Do not let a team treat the three hours as a suggestion and spread it across a week. The time pressure is the lesson."])),

    slide("Before you _start_", B(
        CHECK(["Everyone has **Git, VS Code and a GitHub account** that works (Weeks 1 and 2)", "Everyone is in the **team repo** with write access", "Everyone has a **charged laptop**, and the team has one **call link** if anyone is remote", "You agreed **one three-hour window** and put it in everyone's calendar", "You know **where your team repo lives**: see the next slide"], "w6-pre"),
        CALLOUT("Setup problems in hour 1 are normal. Fix them, write down what broke, and carry on. Do not start the clock until all five boxes are ticked.", title="The clock starts later")),
        kicker="Start here", mins=2,
        notes=NOTES(say=["Ticking the boxes is saved in the browser on each person's own device, so each person ticks their own."],
                    watch=["If someone cannot get Git working, pair them with a teammate on one laptop. They still wear a hat."])),

    slide("Where the team repo _lives_", COLS(
        CARD("Try this first", f"Create the repo in the **{ORG}** GitHub organization, public, with a README. Everyone is invited with write access. Connect GitHub Pages or Streamlit to it, exactly as in Week 5.", "option A", hl=True),
        CARD("If the host will not connect", "One teammate creates a **public repo on a personal account** and adds the others as collaborators. The host connects to that person's account. Then tell me what happened.", "option B"),
        kind="c2"),
        kicker="Start here", lede="Hosts treat organization repos and personal repos differently, and free plans change. This is the one thing we cannot be sure of in advance.", mins=2,
        notes=NOTES(say=["This slide exists because it is the most likely thing to go wrong on the real day, and it is cheap to find out now.",
                         "If a team uses option B, ask them to write down exactly what the host said when it refused the organization repo. That text is gold."],
                    do=["Before Dec 31, run both options yourself with a test repo so you can answer the question when it is asked."],
                    watch=["Whichever option they pick, the Wednesday deliverable is the same: a live URL that opens in a private window."])),

    section("01", "The _brief_", "What you are building, and the rules it has to follow.", mins=0,
            notes=NOTES(say=["Short section. Fifteen minutes of the sprint is for choosing, so read this before the clock starts."])),

    slide("Pick one of three, or _propose_ your own", COLS(
        CARD("A. Turn it into a plan", "Paste a messy to-do or homework list, get a clean evening schedule.", "idea A", sm=True),
        CARD("B. Explain it back", "Paste your notes, get five quiz questions to test yourself.", "idea B", sm=True),
        CARD("C. Find it fast", "A short list of places or things near school, filterable in two taps.", "idea C", sm=True),
        kind="c3"),
        kicker="01 — The brief", lede="You may propose your own if the whole team agrees it follows the rules on the next slide. Decide in **15 minutes**. Do not debate for an hour.", mins=2,
        notes=NOTES(say=["The three ideas are deliberately small. They each have one user, one input and one output, so the work is in shipping and not in inventing.",
                         "A team that proposes its own idea should be asked the Week 5 question: what is the one flow, and what are the three screens?"],
                    watch=["The AI feature is optional. If a team wants a model in the product, they can use the Week 4 pattern with the offline fallback. A working product without AI beats a broken one with it."])),

    slide("Rules the product must _follow_", UL([
        "**One user, one flow, three screens.** Start, do the thing, see the result",
        "Works on a **phone**, opens in a **private window**, no login",
        "A real **live URL**, not a localhost link and not a screenshot",
        "An AI feature is welcome and **not required**",
        "**No real personal data** anywhere. Use made-up names and examples when you test",
        "No payments, no accounts, no scraping anyone's website"]),
        kicker="01 — The brief", mins=2,
        notes=NOTES(say=["The no real personal data rule protects them and their friends. Tell them to make up names for every test.",
                         "No login keeps the scope small and keeps a whole class of security mistakes out of a first project."])),

    section("02", "The _clock_", "One sitting. Three hours. Here is how to spend them.", mins=0,
            notes=NOTES(say=["This is the 24-hour hackathon from Week 1, shrunk to three hours. The proportions are the same."])),

    slide("Spend the _three hours_ like this", GANTT([
        (0, 15, "Agree the idea", "One sentence, one user, one flow", True),
        (15, 30, "Repo and skeleton live", "Issues on the board. Hello-world on a real URL", True),
        (30, 120, "Build the hero flow", "At least two PRs, each reviewed by someone else"),
        (120, 150, "Polish and test like a judge", "Empty states, errors, phone, private window"),
        (150, 170, "Freeze. Record the demo", "No new features. 60-second video"),
        (170, 180, "Retro and hand in", "Five questions, then post the links")], 180, unit=" min"),
        kicker="02 — The clock", mins=3,
        notes=NOTES(say=["The two orange bars are where teams usually lose time: choosing an idea for too long, and leaving deployment until the end. A live skeleton in the first half hour means deployment problems show up early, when they are cheap to fix.",
                         "Notice the freeze. After minute 150 nobody adds a feature, no matter how good the idea is."],
                    watch=["Teams will want to spend the first hour choosing. Fifteen minutes. If they cannot agree, flip a coin and move on."])),

    slide("Checkpoints, and what to _cut_", TABLE(["Minute", "This must be true", "If it is not"], [
        ["30", "A skeleton page is live on a real URL", "Stop building. Fix deployment first. Nothing else matters until this works"],
        ["75", "The hero flow works on your own laptop, with fake data", "Cut the AI part. Hard-code the answer and finish the screens"],
        ["120", "The hero flow works on the live URL", "Cut every screen except the one the demo needs"],
        ["150", "Nothing is half-finished on `main`", "Revert or delete the unfinished part. Freeze"]]),
        kicker="02 — The clock", mins=3,
        notes=NOTES(say=["Read the right-hand column aloud to yourself before you start. Cutting scope is a skill, and the middle of a sprint is the worst time to decide when to do it.",
                         "On a real hackathon day these same checkpoints scale up. The rule does not change: if you are behind, cut."],
                    watch=["Cutting the AI part feels like failure. It is not. A judge cares that the product works."])),

    slide("Wear _hats_ for the day", B(
        CARDS([("Product", "Keeps the scope, writes the README, plans the demo.", "hat 1"), ("Interface", "Owns the screens: layout, states, phone.", "hat 2"),
               ("Logic", "Owns the code that does the thing, with AI help.", "hat 3", True), ("Platform", "Owns the repo, PRs, deploys and secrets.", "hat 4"),
               ("Demo", "Owns the video, the checklist and the retro notes.", "hat 5")], kind="c5"),
        CALLOUT("A team of three means some people wear two hats. Pick hats you have **not** tried yet, so you learn something. We use what we see in Week 7 to match people to roles.", title="Not permanent")),
        kicker="02 — The clock", mins=2,
        notes=NOTES(say=["These are the five roles from Week 1 with lighter names, because nobody is assigned to one yet. They are a way to divide ownership, not to divide the work.",
                         "I will read the retros before Week 7, and your hat choices help me see what you are curious about."],
                    watch=["If a team wants the strongest coder to take Logic and Platform, push back gently. Hats are for learning."])),

    slide("Working _rules_", CHECK([
        "Every change goes through a **branch and a pull request**. Nobody pushes straight to `main`",
        "**Someone else reviews** your PR, and runs it. Use `question:`, `nit:` and `blocking:`",
        "**Squash and merge**, with a clear title",
        "Keys live in **`.env`** locally and in the host's **Secrets** online. Never in the repo",
        "Keep an **AI log** in the README: prompts that worked, mistakes the AI made, what you changed",
        "If you are stuck for **15 minutes**, ask the team. Then ask the AI with the exact error text"], "w6-rules"),
        kicker="02 — The clock", mins=3,
        notes=NOTES(say=["Every one of these comes from a week of the course. It is the first time all six are used on one project at once.",
                         "The AI log is what turns AI use from a shortcut into evidence that you understood the work."])),

    slide("When it goes _wrong_", TABLE(["What happened", "Do this"], [
        ["A merge conflict", "Do not panic. Open the file, read both sides, decide together (Week 3)"],
        ["The deploy fails", "Read the last lines of the build log. Missing package? Wrong case? (Week 5)"],
        ["The AI gives broken code", "Paste the exact error back. Re-read the spec. Read the code before you run it (Week 4)"],
        ["A teammate disappears", "Cut a hat, cut the scope, ship the smaller thing"],
        ["You are running out of time", "Ship less. A smaller product that works beats a bigger one that does not"]]),
        kicker="02 — The clock", mins=2,
        notes=NOTES(say=["Each row points back to the week that covered it, so they know where to look.",
                         "Teammate disappearing is rare and real. Make sure they know the team's job is the same on a smaller scale."])),

    section("03", "Hand it _in_", "What you submit, and how to make the video and the retro quick.", mins=0,
            notes=NOTES(say=["This part is mostly checklists. The video and retro are where the learning from the sprint gets locked in."])),

    slide("The README, in _a dozen lines_", COLS(
        CODE("# Project name\nOne sentence: who it is for, what it does.\n\n**Live:** https://...\n\n## Who did what\n- Name: hat, and what they built\n\n## What AI did\n- Prompts that worked, mistakes we caught\n\n## What we cut\n- ...", label="README.md", xs=True),
        B(UL(["The **live URL** is on line three, where a judge looks", "Say who did what. Honestly. Everyone has a line", "**What we cut** shows judgement, which is a good thing"], cls="sm"),
          CALLOUT("A judge who opens your repo reads the README and nothing else.", title="Remember")), kind="split"),
        kicker="03 — Hand it in", mins=2,
        notes=NOTES(say=["The README is the second thing a judge opens after the demo. It should work with the video off.",
                         "This template will also be in the templates folder."])),

    slide("A 60-second demo _video_", COLS(
        STEPS(["**0-10 s** The problem, in one sentence, for one person", "**10-45 s** Use the product, live, on a phone. One flow", "**45-55 s** What you would build next", "**55-60 s** Say the URL"], cls="sm"),
        B(UL(["Record the **screen** with the phone's screen recorder or your laptop's", "No music, no effects, **voice only**", "Do **one take**, then maybe a second. Not ten", "It is also your **backup** if the live demo breaks"], cls="sm")), kind="split"),
        kicker="03 — Hand it in", mins=2,
        notes=NOTES(say=["The video has two jobs: it is the hand-in, and it is the backup that saves you when the Wi-Fi dies on demo day. Teams should practise making one now.",
                         "Voice only is the easiest to record and the easiest to listen to."],
                    watch=["Do not accept a video that is two minutes of explanation and ten seconds of product. The product has to be on the screen."])),

    slide("The five-question _retro_", CHECK([
        "**What shipped?** In one sentence, what a user can do now",
        "**What did we cut,** and was it the right thing to cut?",
        "**Where did we wait on each other?** For a review, a deploy, a decision",
        "**What is one rule we would change** before January 20?",
        "**What did each person learn?** One thing each, written down"], "w6-retro"),
        kicker="03 — Hand it in", lede="Blameless. Name problems, not people. This is the most valuable part of the sprint.", mins=2,
        notes=NOTES(say=["The retro answers are what I read first. They tell me where each team is weakest, and they shape Weeks 7 and 8.",
                         "Be honest about waiting. Most teams find that the review step is the bottleneck, which is a useful discovery."],
                    do=["Read every retro before Jan 7. Note which problems repeat across teams."])),

    task_slide("Week 6 _hand-in_", "Wed, Jan 6", [
        ("The team's **live URL**", "Opens on a phone, in a private window, no login."),
        ("The team repo with a README", "Live link, who did what, the AI log, what you cut."),
        ("A 60-second demo video", "A link, or a file in the group. Voice only is fine."),
        ("The retro, five answers", "One shared note, posted in the group."),
        ("Individually: at least one merged PR and one review you wrote", "Linked in the team's retro note.")], "w6-tasks", mins=2,
        evaluates="teamwork, shipping, honesty about what went wrong",
        notes=NOTES(say=["Five things from the team, one thing from each person. The individual part is so that every member has a trail on the repo.",
                         "If a team cannot ship a live URL, they hand in what they did get working, plus a retro that names the blocker. That is still a pass."],
                    do=["Check each repo on Jan 1 to 6 for commits and PRs, so a stuck team is found early, not on Jan 7."])),

    slide("Next: strategy and the _pitch_", B(
        UL(["**Thursday, Jan 7.** We read the retros, then work on what wins: strategy, scoring ideas, and the three-minute pitch.", "We **assign roles** for the real hackathon, using what you showed in the sprint and what you said you want.", "Bring your **retro note** and the **live URL**. We will open every project."]),
        CALLOUT("Bring a charged laptop. Every project goes on the big screen, and every project gets one honest comment.", title="Week 7")),
        kicker="Next", mins=1,
        notes=NOTES(say=["Close by saying: whatever happened, you now know your team's real weak spot. That is worth more than a perfect sprint."])),
)
