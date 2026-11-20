"""Week 8 -- Thu Jan 14: Demo Day, a dress rehearsal for Jan 20."""
from lib import *
from config import ORG

DECK = Deck("w8", 8, "2027-01-14", "Thu, Jan 14", "Demo Day")

DECK.add(
    cover("Demo Day", "The dress _rehearsal_",
          "Pitch, get scored, find the problems, and still have six days to fix them.", 8, "Thu, Jan 14", "2027-01-20",
          notes=NOTES(say=["This is the real format, with the real clock, on a day when it is safe to fail. Every problem we find today is a problem we do not have on January 20."],
                      do=["Before class: confirm the order of pitches (draw it from a hat or use the roster). Set up the projector, speakers if any, and the screen mirror. Test the room's Wi-Fi from a phone.",
                          "Print scorecards, one per judge. If you have guests, brief them on the five criteria and the one-comment rule.",
                          "Have the team rosters from the board ready: this is the first time everyone sees the team they will go in with."],
                      watch=["Someone will be nervous. Say at the start that nervous is normal, and that the rule today is to be kind and honest."]), mins=1),

    slide("How Demo Day _works_", B(
        FLOW([("Tech check", "5 minutes, all teams"), ("Pitch", "3 minutes, hard stop"), ("Questions", "2 minutes"), ("Scores in", "Quietly, on paper"), ("Debrief", "What we saw")], ["go", "stop", "score", "share"], highlight=1, tight=True),
        UL(["Every team goes through the same steps, in the same order.", "The **timer stops you at zero**, even mid-sentence. That is the rule on the real day too.", "Teams who are not pitching are **judges**. You do not score your own team."], cls="sm")),
        kicker="Today", mins=3,
        notes=NOTES(say=["Walk through the five steps once. Then say the rule about the timer: when it hits zero, we thank the team and move on. It is a kindness to the next team.",
                         "Every non-presenting person scores. That is how everyone learns what a good pitch looks like."],
                    do=["Say the order of teams out loud and write it on the board."])),

    slide("The _scorecard_", B(
        TABLE(["Criterion", "Ask yourself", "Score 1 to 5"], [
            ["Innovation", "Have I seen this before?", "__"], ["Execution", "Did it work, live, right now?", "__"],
            ["Impact", "Who needs this, and how badly?", "__"], ["Design", "Could I use it without help?", "__"], ["Pitch", "Did I understand it in 3 minutes?", "__"]]),
        CALLOUT("Under the scores, write **one thing that worked** and **one thing to change**. Be specific: 'the phone demo was clear' beats 'nice'.", title="One comment, two parts")),
        kicker="Today", mins=3,
        notes=NOTES(say=["These are the same five criteria as Week 1. Real events name and weight them differently, so on January 20 you will read the official rubric first.",
                         "Scores are for learning, not for ranking the class. We will not announce a winner today."],
                    do=["Hand out a printed scorecard per judge. Collect them after each team and give them to the team at the debrief."],
                    watch=["Do not let judges compare scores out loud while a team is still pitching."])),

    slide("Tech check, all _teams_", B(
        CHECK(["Your **live URL** opens in a private window", "Your **backup video** is on your phone and plays with sound off", "Your laptop is **charged**, with the charger", "You can **mirror your screen** to the projector, and you have tried it", "One tab is open on the **start of your demo**, nothing else"], "w8-tech"),
        CALLOUT("A team that finds out its adapter does not fit one minute before its pitch has already lost its first minute. Find out now.", title="Do it before the first pitch")),
        kicker="Today", mins=6,
        notes=NOTES(say=["Five minutes. Every team connects to the projector once, so no one finds out during their slot.",
                         "If a team cannot mirror, the backup is a phone video held up, or the video file on the teacher's laptop."],
                    do=["Walk around. Watch for private-window tests that fail, because that is the thing to fix this week."],
                    watch=["A team whose URL does not open is not failing. They just found their first fix for the week."])),

    slide("The _clock_", B(
        TIMER(180, "pitch · 3 minutes", small=True),
        TIMER(120, "questions · 2 minutes", small=True)),
        kicker="Pitch rounds", mins=32,
        notes=NOTES(say=["Say: 'Start when you are ready. When the timer reaches zero, we stop.' Then press start when the team begins to speak.",
                         "When the pitch ends, press reset on the pitch timer and start the question timer."],
                    do=["For each team: reset both timers, press start on the pitch timer when they begin. Judges fill in their scorecards during the questions.",
                        "Keep time strictly. If a team finishes early, great, start questions.",
                        "Take one note per team for yourself: the strongest moment, and one thing that confused you."],
                    watch=["Nervous teams will rush. If one does, say gently after: 'You have the time, slow down'. Do not interrupt them mid-pitch."])),

    slide("What we _saw_", B(
        COLS(STEPS(["Read **one strongest moment** per team, aloud", "Each team reads its **scorecard comments** silently", "Each team writes its **top three fixes** on a card", "I collect the cards and **write the common ones on the board**"], cls="sm"),
             CALLOUT("The same problems repeat across teams. The common ones are the ones to fix first, because they will hurt every pitch on January 20.", title="Look for patterns"), kind="split")),
        kicker="Debrief", mins=12,
        notes=NOTES(say=["Say the strongest moment before anything critical. Teams listen to the critical part better after they have heard the good part.",
                         "The three fixes are for next six days. Fewer fixes done well beats ten half-done."],
                    do=["Collect the cards. After class, type up the common problems and post them in the group.",
                        "Common ones to look for: pitch too long, problem stated too vaguely, demo started late, URL did not open, a team member silent."],
                    watch=["If one team is clearly stronger, do not make them the model. Name specific things they did that others can copy."])),

    section("02", "The week _ahead_", "Six days. What to do each one, and how to be ready.", mins=0,
            notes=NOTES(say=["Short section. Four slides: the plan, the agreements, the rules, the checklist."])),

    slide("Jan 14 to _Jan 20_", TIMELINE([
        ("Jan 14", "Demo Day", "Pitch, get scored", "now"),
        ("Jan 15-16", "Fix", "The three things the judges found"),
        ("Jan 17", "Rehearse", "Pitch twice out loud, timed. Record it"),
        ("Jan 18", "Dry run", "Build a tiny new flow in 90 minutes, as a team"),
        ("Jan 19", "Pre-flight", "Checklist, rules read, early night"),
        ("Jan 20", "The day", "Show up ready", "end")]),
        kicker="02 — The week ahead", lede="Nothing new gets learned this week. It is all rehearsing what you already know.", mins=4,
        notes=NOTES(say=["The dry run on Jan 18 is optional but worth it: a 90-minute build with the roster you will have on the day, from a blank repo, using the sprint rules.",
                         "Nothing new gets learned this week. It is all rehearsing what you already know."],
                    watch=["Teams will want to add features. Remind them of the freeze rule: fix, rehearse, rest. No new ideas after Jan 17."])),

    slide("Five things to agree on _now_", B(
        TABLE(["Decide this", "So that"], [
            ["**Who decides** when you disagree", "A five-minute debate does not become a one-hour fight"],
            ["**When you stop building** and start the demo prep", "Freeze time is not negotiated at hour 20"],
            ["**What you do when stuck** for fifteen minutes", "Nobody sits silent with a broken thing"],
            ["**Who submits**, and who double-checks it", "The final link is tested in a private window by two people"],
            ["**When you eat, drink and sleep**", "Tired teams make small mistakes in the last hour"]]),
        CALLOUT("Write the five answers in the README. Settle them this week, when nobody is under pressure.", title="Do it on paper")),
        kicker="02 — The week ahead", mins=4,
        notes=NOTES(say=["These are the five things that blow up teams at 3 a.m. on a hackathon night. They are almost all about people, not code.",
                         "A decision rule is a gift to the Product Lead. It lets them decide without feeling like they are being bossy."],
                    watch=["Teams often put 'we will vote'. With three or five people that is fine, but have a tie-breaker. Ask what it is."])),

    slide("Read the _official rules_ the day they arrive", B(
        CHECK(["**Team size** and whether roles or mentors are allowed", "**Theme** or track, if there is one", "**What you must submit**: repo, video, slides, a live link", "**Deadline**, with the hour and the time zone", "**What AI tools and data** are allowed", "**How you are judged**, and the weights"], "w8-rules"),
        CALLOUT("I do not have the official rules yet. When we get them, we read them together, before anyone writes a line of code.", title="An honest gap")),
        kicker="02 — The week ahead", mins=3,
        notes=NOTES(say=["Everything in this course assumed a generic hackathon. The real event will have specific rules. Reading them is the cheapest advantage you will ever get.",
                         "If a rule conflicts with something we taught, the event's rule wins."],
                    do=["Find the official rules before this session if they are out. If not, ask the organizers for them now: team size, theme, submission format, and whether Jan 20 is the event day or the submission deadline.",
                        "Update this slide with anything you already know."],
                    watch=["Rules about AI tools and age vary. Check them with the organizers, not from memory."])),

    slide("Pre-flight, the _night before_", B(
        CHECK(["Every teammate can **log in** to GitHub, the host and the AI tools they need", "`main` is **deployed**, and the URL opens in a **private window**", "Keys are in the host's **Secrets**, not in the repo", "**Backup video** on two phones. Screenshots in a folder", "**Laptops, chargers, a hotspot**, headphones", "Everyone has the **team's phone numbers**", "Food, water, a plan for sleep"], "w8-preflight", sm=True),
        CALLOUT("The Platform Captain runs the list. Everyone tests their own part.", title="Who")),
        kicker="02 — The week ahead", mins=4,
        notes=NOTES(say=["The last two items are not a joke. A team that is hungry and has no phone numbers will not ship on time, however good the code is.",
                         "Say the Platform Captain runs it, but each person tests their own part. A checklist only the captain looks at is a single point of failure."])),

    slide("What you can do _now_", TABLE(["Week", "You can"], [
        ["1", "Read a hackathon rubric and know what a judge looks for"],
        ["2", "Save and share work with Git and GitHub, and keep secrets out of it"],
        ["3", "Ship through a pull request, review a teammate, resolve a conflict"],
        ["4", "Use AI as a teammate, check what it gives you, and call a model from Python"],
        ["5", "Design a screen for one flow, and put it on a real URL"],
        ["6", "Run a three-hour sprint with a team and hand in on time"],
        ["7", "Choose an idea with a score, and pitch it in three minutes"]]),
        kicker="Look back", lede="You started as beginners. This is what you added.", mins=4,
        notes=NOTES(say=["Read this slowly. It is easy to forget how much has been covered. Eight weeks ago most of these were unfamiliar words.",
                         "Do not say 'you are ready to win'. Say 'you are ready to compete and learn from it'. The outcome on the day is not up to us."],
                    watch=["Do not overpromise. A good result is possible. Learning to work as a team is guaranteed."])),

    task_slide("Last _tasks_", "Tue, Jan 19", [
        ("Fix your team's **top three** problems from today", "Redeploy. Test in a private window, on a phone."),
        ("Say the pitch out loud **twice**, with a timer", "Record one run. Listen to it once."),
        ("Write the **five agreements** in the team README", "Who decides, freeze time, stuck rule, who submits, food and sleep."),
        ("Run the **pre-flight list** with the Platform Captain", "Post a screenshot of the ticked boxes."),
        ("Read the **official rules** when they arrive", "Post any questions for the organizers in the group.")], "w8-tasks", mins=3,
        evaluates="readiness, follow-through",
        notes=NOTES(say=["After today there is no new content. These are preparation. If a team only has time for one thing, it is the pitch, out loud, twice."],
                    do=["Be available in the group chat during the week. Answer questions quickly. A fast answer to a small question saves an hour on the day."])),

    slide("Fix, rehearse, _rest_", B(
        UL(["**Fix** the three things the judges found. Nothing new.", "**Rehearse** the pitch, out loud, with a timer.", "**Rest.** Sleep is part of the plan."]),
        CALLOUT("Ask me anything this week, in the group chat. I would rather answer ten small questions now than lose an hour on January 20.", title="I am here")),
        kicker="Jan 20", mins=2,
        notes=NOTES(say=["End on the three words. Tell them you are proud of what they built, and mean it. Then let them go early."],
                    do=["Photograph the board with the common problems, and post it in the group.",
                        "Publish the final team rosters and role assignments if you have not already."])),
)
