"""Design test deck: one slide per component. Not part of the program."""
from lib import *
from config import ORG

DECK = Deck("sample", 0, "2026-11-26", "Nov 26", "Design test")
n = lambda s: NOTES(say=[s])

DECK.add(
    cover("Design test", "Every component, _once_", "If this looks like a template, the engine is wrong, not the content.", 0, "Nov 26", "2027-01-20", notes=n("cover")),
    section("01", "A section _divider_", "Used between the parts of a session.", notes=n("section")),
    slide("What judges actually _score_", B(
        COLS(
            UL(["**Innovation**: is the idea new to this audience?", "**Execution**: does it work, live, right now?", "**Impact**: who is better off if this exists?", "**Pitch**: can they explain it in three minutes?"]),
            B(CALLOUT("Judges score the product, the pitch and the potential. They rarely read the code.", title="The honest part"), BIG("3", "minutes to win a room")),
            kind="split")),
        kicker="01 — Hackathons", lede="Four criteria show up almost everywhere. Learn them once.", notes=n("list + callout + big")),
    slide("Reveal one at a _time_", B(STEP(CARD("First", "Appears on the first click.", "step 1")), STEP(CARD("Second", "Appears on the second click.", "step 2"))), kicker="01 — Hackathons", notes=n("steps")),
    slide("Five roles, one team", CARDS([
        ("Product Lead", "Owns scope, the story and the pitch.", "role 01"),
        ("Interface Builder", "Owns what the user sees and touches.", "role 02"),
        ("AI Engineer", "Owns the model, the data, the glue.", "role 03", True),
        ("Platform Captain", "Owns the repo, deploys and secrets.", "role 04"),
        ("Demo Producer", "Owns video, slides, assets.", "role 05")], kind="c5"),
        kicker="01 — Hackathons", notes=n("cards c5")),
    slide("Your first _commit_", COLS(
        TERM(["# configure once", "$ git config --global user.name \"Your Name\"", "$ git config --global user.email \"you@example.com\"", "", "# every time", "$ git add .", "$ git commit -m \"Add team page\"", "[main 3f2a9c1] Add team page", " 1 file changed, 12 insertions(+)", "$ git push"]),
        STEPS(["Edit a file", "**Stage** it with `git add`", "**Commit** with a message that says why", "**Push** so teammates can see it"]),
        kind="split"), kicker="02 — Git", notes=n("terminal + steps")),
    slide("Branches are _labels_", WIDGET("git"), kicker="02 — Git", notes=n("git sandbox")),
    slide("When two people edit one line", WIDGET("conflict"), kicker="03 — Teamwork", notes=n("conflict widget")),
    slide("Compare, then _commit_ to one", WIDGET("scorer"), kicker="04 — Strategy", notes=n("scorer")),
    quiz_slide("Which is more likely to win a hackathon?", ["A huge idea, half working, with a great deck", "A small idea, fully working, demoed live", "A perfect codebase nobody can see running", "The idea that uses the most AI models"], 1,
               "Judges can only score what they can see working. A narrow thing that works end to end beats an ambitious thing that almost does.", notes=n("quiz")),
    slide("Roles and the tools they touch", TABLE(["Role", "Main tools", "Ships by"], [
        ["Product Lead", "Docs, Figma, slides", "Hour 2: one-sentence scope"],
        ["Interface Builder", "Figma, VS Code, v0", "Hour 8: hero flow clickable"],
        ["AI Engineer", "Python, APIs, notebooks", "Hour 8: model answers"],
        ["Platform Captain", "GitHub, Vercel", "Hour 2: deployed skeleton"]]),
        kicker="05 — Roles", notes=n("table")),
    slide("What to do _tonight_", B(CALLOUT("Do these in order. Do not skip the first one.", kind="warn", title="Before Thursday"), P("Everything you need is in the links below the checklist.", muted=True)),
          kicker="Next", notes=n("callout warn")),
    task_slide("Week 0 tasks", "Wed, Dec 2", ["Install **Git** and run `git --version`", "Create a GitHub account with **two-factor authentication** on", ("Make a repo called `hello-yourname`", "Add a README with three lines about you"), "Post the repo link in the group"], "t-demo", evaluates="Git fluency, follow-through", notes=n("task slide")),
    slide("The pitch _clock_", TIMER(180, "3-minute pitch"), kicker="Demo day", notes=n("timer")),
)
