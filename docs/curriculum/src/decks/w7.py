"""Week 7 -- Thu Jan 7: strategy, the pitch, and roles."""
from lib import *
from config import ORG

DECK = Deck("w7", 7, "2027-01-07", "Thu, Jan 7", "Strategy and the pitch")

DECK.add(
    cover("Strategy and the pitch", "Win the _room_",
          "How to choose what to build, how to say it in three minutes, and who does what on the day.", 7, "Thu, Jan 7", "2027-01-20",
          notes=NOTES(say=["Six weeks of tools. Today is about decisions: what you build, how you say it, who owns what.",
                           "Two weeks left. Next Thursday is Demo Day, and after that it is the real thing."],
                      do=["Before class: read every sprint retro. Write down which problems repeat across teams, and which team had the sharpest observation.",
                          "Have the team board open in a tab so you can use it at the roles part. Fill in what you observed from PRs and reviews beforehand.",
                          "Print or share the role-ranking slips (one per person)."],
                      watch=["A few teams may not have finished the sprint. Today is not a punishment. Use their retro, which will be the most honest one."]), mins=1),

    quiz_slide("It is minute 75 and your hero flow does not work yet. What do you cut first?",
               ["The phone layout", "Nothing. Just work faster", "The extra screens and the AI part, so the hero flow works", "The demo video"], 2,
               "Cut scope, not the thing the demo needs. Hard-code the answer, drop the extra screens, finish the one flow a judge will see.", mins=2, kicker="Last week",
               notes=NOTES(say=["This is the checkpoint table from the sprint. Ask who actually did a cut during the sprint, and what it was."])),

    quiz_slide("Why put a live skeleton on a URL in the first 30 minutes?",
               ["It earns extra points from judges", "Deployment problems show up early, while they are cheap to fix", "It makes the idea better", "It is only busywork"], 1,
               "Deployment is the thing that surprises teams late. Doing it first turns the surprise into a ten-minute fix.", mins=2, kicker="Last week",
               notes=NOTES(say=["Tie it back to what they found in their own sprint. Ask whose deploy broke, and when they found out."])),

    slide("What you can do by the _end_", B(
        COLS(UL(["**Choose** one idea with a score you can defend", "**Show** each judging criterion in your demo", "**Pitch** in three minutes, out loud, with a timer", "**Say** which role you want, and why"]),
             TABLE(["Min", "Today"], [["8", "Recap and plan"], ["10", "What the sprints taught us"], ["28", "Strategy: choosing and winning"], ["28", "The pitch, with a practice round"], ["12", "Roles"], ["4", "Tasks and what is next"]]), kind="split")),
        kicker="Today", mins=3,
        notes=NOTES(say=["The practice pitch is the longest single block, on purpose. Saying it out loud is the only way to find out it does not work."])),

    slide("What the sprints _taught_ us", B(
        COLS(STEPS(["Each team has **90 seconds**: what shipped, where you waited, one rule you would change", "I write the rules on the board", "We **vote** on three that every team keeps for January 20"], cls="sm"),
             CALLOUT("Mistakes made in the sprint are data. A team that found a real problem learned more than a team whose sprint went smoothly.", title="No shame here"), kind="split"),
        TIMER(90, "one team, 90 seconds")),
        kicker="01 — The sprint, reviewed", mins=10,
        notes=NOTES(say=["Do not let a team defend itself. We are collecting problems, not assigning grades.",
                         "Common ones to listen for: waiting for a review, a deploy that broke, a scope that was too big, one person doing everything. Write the pattern, not the team."],
                    do=["Run the timer for each team. When it hits zero, thank them and move on, even mid-sentence. This is also practice for the pitch.",
                        "Write the three voted rules on the board and photograph them. They go into each team's README as 'our rules'."],
                    watch=["If a team has nothing to say, ask: 'What did you wait for?' There is always something."])),

    section("02", "Choosing and _winning_", "How to pick the idea, and how to make it score.", mins=0,
            notes=NOTES(say=["Two jobs: pick an idea you can finish, and make sure the judges can see why it is good."])),

    slide("From many ideas to _one_", B(
        FLOW([("Many problems", "20 in ten minutes"), ("Three filters", "Cut to three"), ("Score", "Weighted, honestly"), ("One sentence", "Your idea")], ["cut", "compare", "commit"], highlight=3),
        UL(["Quantity first, **no judging** while you list problems.", "A problem is something **a real person** said or did, not a technology.", "Commit in the room. A decided team is a faster team."], cls="sm")),
        kicker="02 — Strategy", mins=3,
        notes=NOTES(say=["The common mistake is starting from a technology: 'we should use an AI model for something'. Start from a person who has a problem.",
                         "The funnel is for the first two hours of the hackathon too. Fifteen minutes in total, then you build."],
                    do=["Ask each team to say one problem they have actually seen at school or at home, in one sentence."])),

    slide("A problem a judge can _picture_", TABLE(["Too vague", "Specific enough to build"], [
        ["Students need help studying", "Ninth graders forget which homework is due tomorrow"],
        ["Make learning more fun", "A five-question quiz made from the notes a student pastes in"],
        ["Help people find things", "Which of three school clubs meets today, from a phone, in two taps"],
        ["Use AI to solve a problem", "Turn a parent's voice note about a meeting into a calendar entry"]]),
        kicker="02 — Strategy", lede="Name **one person**, **one situation**, and **one thing** they cannot do today. The rest follows from that.", mins=4,
        notes=NOTES(say=["A judge remembers a person, not a category. 'Students' is a category. 'A ninth grader on the bus at 8 a.m.' is a person.",
                         "Ask the room to turn one of the vague lines on their own idea into a specific one."],
                    do=["Everyone rewrites their idea as one specific sentence on paper. Read three aloud and ask the room: could you build it in six hours?"])),

    slide("Three filters before you _score_", CARDS([
        ("Can we build the hero flow in six hours?", "With the skills in this room.", "filter 1: the 24h build"),
        ("Can a judge see it in sixty seconds?", "On a phone, live, with a clear result.", "filter 2: the demo", True),
        ("Does a stranger care in ten seconds?", "A real pain, said in plain words.", "filter 3: the pain")], kind="c3", lg=True),
        kicker="02 — Strategy", mins=3,
        notes=NOTES(say=["These are the three highest-weighted criteria in the scorer on the next slide. If an idea fails one of them, scoring it will not rescue it.",
                         "Be firm: an idea that needs more than six hours for its hero flow is two ideas. Pick the smaller one."],
                    watch=["Teams fall in love with the idea they came in with. The filters are there so the decision does not depend on who argues loudest."])),

    slide("Compare, then _commit_ to one", WIDGET("scorer"),
        kicker="02 — Strategy", mins=8,
        notes=NOTES(say=["Pain, Demo and 24h build are weighted three times, because they decide whether you have something to show. AI fit, Unique and Theme count twice.",
                         "The 'Theme' column is the event's theme or rubric. Change what the column means on the day if the rules say something different.",
                         "The highest score starts the discussion. It does not make the decision. If two ideas are within a few points, pick the one you can demo."],
                    do=["Each team enters its top three ideas and scores them together, with no one scoring their own idea alone. Five minutes, then each team says its winner and the single score that surprised them."],
                    watch=["A team scoring everything 5 has not thought hard enough. Ask: which one would you cut first?"])),

    slide("Make every criterion _visible_", TABLE(["Judges ask", "Show them"], [
        ["Is it new?", "One sentence on what exists today and what is different"],
        ["Does it work?", "A live demo on a real URL, no slides standing in for the product"],
        ["Does anyone need it?", "The specific person from your problem sentence, and one real quote"],
        ["Is it well made?", "A clean phone screen with all four states: empty, loading, error, done"],
        ["Was it explained well?", "Three minutes, one flow, the same sentence at the start and the end"]]),
        kicker="02 — Strategy", mins=4,
        notes=NOTES(say=["These are the five criteria from Week 1. The point is that you have to put evidence of each one in front of the judge. They will not dig for it.",
                         "A real quote from someone in the target group is cheap and very persuasive. Ask a friend in the target group one question this week."],
                    watch=["Most teams will cover 'does it work' and forget 'does anyone need it'. Make them say the specific person aloud."])),

    slide("Traps that sink _good_ teams", TABLE(["The trap", "The fix"], [
        ["Too big", "Cut until the hero flow fits in 60 seconds of demo"],
        ["AI for its own sake", "Name the human problem first, then ask where a model genuinely helps"],
        ["A demo that needs live Wi-Fi or a live API", "A recorded video and an offline fallback, ready"],
        ["Four ideas in one", "One user, one flow. Everything else goes on a 'next' slide"],
        ["The pitch is written at the last minute", "Draft it before the hackathon. Practise it twice out loud"]]),
        kicker="02 — Strategy", mins=3,
        notes=NOTES(say=["Every row has a Week or a sprint behind it. Ask which trap they hit during the sprint.",
                         "The Wi-Fi row is a real risk. Event networks are crowded, and a demo that needs a live API can fail at the worst moment."])),

    slide("Your backup _plan_", B(CHECK([
        "A **60-second video** of the working product, on your phone",
        "**Screenshots** of each screen in the flow",
        "An **offline fallback**: sample data the app can use if the API fails",
        "Your own **mobile hotspot** or a second connection",
        "The demo works from **a second laptop** that is logged in and ready"], "w7-backup"),
        CALLOUT("With a backup, a dead Wi-Fi network costs you thirty seconds. Without one, it costs you the pitch.", title="Why bother")),
        kicker="02 — Strategy", mins=3,
        notes=NOTES(say=["A live demo can fail for reasons that have nothing to do with your product. A backup means the pitch carries on.",
                         "The video from the sprint is already half of this. Re-record it if the product has changed."])),

    section("03", "The _pitch_", "Three minutes. One flow. Said out loud.", mins=0,
            notes=NOTES(say=["The pitch is a product. It also needs a spec, a draft and tests."])),

    slide("Three minutes, to _scale_", GANTT([
        (0, 25, "The problem", "One person, one pain. A real situation", True),
        (25, 45, "The idea in one sentence", "What it is, for whom"),
        (45, 130, "Live demo", "One flow, on a phone. Say what you are doing", True),
        (130, 155, "How it works, and what is next", "One sentence on the tech. One on what you would build next"),
        (155, 175, "Why this team", "What you built and learned in this time"),
        (175, 180, "Close", "Say the URL. Repeat the one sentence")], 180, unit=" s"),
        kicker="03 — The pitch", mins=4,
        notes=NOTES(say=["Notice that the demo is almost half the pitch. The product is the proof.",
                         "The problem comes first and the sentence repeats at the end, so the room remembers one thing."],
                    watch=["Teams explain the tech for a full minute because it is the part they are proudest of. Judges mostly want to see it work."])),

    slide("A pitch you can _write down_", COLS(
        CODE("[Hook]\nOne real person, one real situation.\n\n[Idea]\nOur app helps ___ do ___ so that ___.\n\n[Demo]\nOpen on a phone. Do one flow. Say what\nyou are doing as you do it.\n\n[Next]\nOne sentence on how it works.\nOne on what we build next.\n\n[Close]\nThe one sentence again. The URL.", label="pitch-outline.txt", xs=True),
        B(UL(["Write the **first and last sentence word for word**. Know them cold", "Everything between is a few bullets, not a script", "About **400 words** at a calm pace fits three minutes"], cls="sm"),
          CALLOUT("If you cannot say your idea in one sentence, the judges will not be able to either.", title="The test")), kind="split"),
        kicker="03 — The pitch", mins=4,
        notes=NOTES(say=["400 words is a rough number for a calm speaking pace, not a rule. Time yourself and adjust.",
                         "The template will also be in the templates folder as a file they can copy."],
                    watch=["Do not let them read from slides. The slide is for the judge, the voice is for you."])),

    slide("Say it out _loud_", UL([
        "**Stand up.** Use your normal voice, a bit slower than feels natural",
        "**Time it.** Every run, with a timer, start to finish",
        "**Record** it on your phone once and listen. Everyone hates this. Everyone improves",
        "**Look at the room**, not the screen. The demo is a prop, you are the pitch",
        "Rehearse **the first and the last 20 seconds** the most"]),
        kicker="03 — The pitch", mins=3,
        notes=NOTES(say=["Nobody enjoys hearing their own recording. It is also one of the quickest ways to hear where a pitch loses people.",
                         "If they do nothing else this week, they should say the pitch aloud three times with a timer."])),

    slide("Practice round: your sprint product, in _90 seconds_", B(
        COLS(STEPS(["Pairs from **different teams**", "One person pitches the **sprint product**: problem, idea, demo", "The other writes three notes: **what I understood**, **where I got lost**, **what I will remember**", "Swap"], cls="sm"),
             CALLOUT("The timer stops you at zero. Judges will do the same on Demo Day.", title="Hard stop"), kind="split"),
        TIMER(90, "90-second practice pitch")),
        kicker="03 — The pitch", mins=14,
        notes=NOTES(say=["Pairs from different teams on purpose: a teammate already knows the product and will fill in the gaps your pitch leaves.",
                         "The three notes are the whole feedback. No advice, no opinions about the idea, only what they understood."],
                    do=["Run the timer on the projector once for each swap. Seven minutes per round, including the notes.",
                        "Walk the room. Listen for the sentence 'so basically' and the technology being explained before the problem."],
                    watch=["Shy students will say less. Do not force it. Ask them to pitch to one person, not the room."])),

    slide("Feedback that _helps_", B(TABLE(["Say this", "Not this"], [
        ["I understood that it helps ___ do ___", "It was good"],
        ["I got lost when you said ___", "You should add a feature"],
        ["I will remember ___", "I would have done it differently"]]),
        CALLOUT("You are reporting what happened in your head. Nobody can argue with that, so the pitcher can simply use it.", title="Why this works")),
        kicker="03 — The pitch", mins=2,
        notes=NOTES(say=["Feedback about what the audience understood is hard to argue with, because it is just a report of what happened in their head.",
                         "Advice about the idea is usually opinion and it is rarely useful on a one-minute pitch."])),

    section("04", "Who does _what_", "Roles for the hackathon. How we decide, and what each one does.", mins=0,
            notes=NOTES(say=["This is where I tell you how I decide, so you can see that it is not random."])),

    slide("What each role does on the _day_", TABLE(["Role", "Hours 0 to 4", "Hours 4 to 18", "Hours 18 to 24"], [
        ["Product Lead", "Scope sentence, board", "Cuts scope, decides", "Pitch, submission text"],
        ["Interface Builder", "Wireframe, skeleton page", "Hero flow, four states", "Polish, phone test"],
        ["AI Engineer", "Pick the API, test a call", "Prompt, data, fallback", "Freeze prompts"],
        ["Platform Captain", "Repo, board, first deploy", "Reviews, merges, secrets", "Release check"],
        ["Demo Producer", "Assets, script outline", "Screenshots, README, draft", "Video, rehearsals"]]),
        kicker="04 — Roles", lede="Roles decide who **owns** the decision, not who does the work. Everyone helps everyone.", mins=5,
        notes=NOTES(say=["This is the Week 1 plan again, now with names attached. Notice how much of every role is not code.",
                         "In a team of three, people hold two roles. In a team of five, each person holds one. The board will show the options."])),

    slide("How I _decide_", B(
        CARDS([("What you showed", "Your PRs, your reviews, the hat you wore in the sprint, how you handled a problem.", "signal 1: observed"),
               ("What you want", "Your ranking of the five roles, and one sentence on why your first choice.", "signal 2: you tell me", True),
               ("What the team needs", "Every role covered. No one stacking the strongest coder on three jobs.", "signal 3: balance")], kind="c3"),
        CALLOUT("I weigh what you want as much as what you showed. A person who is curious and trying hard learns fast. You can ask for one change after I publish the teams.", title="It is a judgment, and I will explain it")),
        kicker="04 — Roles", mins=4,
        notes=NOTES(say=["Say plainly that it is a judgment call by a person, not a test. The board helps you keep your own notes consistent.",
                         "Tell them the weighting: what they want counts as much as what I observed. That is a choice about how to run a team of beginners, and I am telling them so they can disagree."],
                    do=["Open the team board on the projector. Show how the signals combine without showing real names: use a demo team.",
                        "Hand out the ranking slips: five roles, rank 1 to 5, one sentence on why."],
                    watch=["Do not promise anyone their first choice. Promise that you will explain the decision."])),

    slide("Rank the five, in _two minutes_", B(
        STEPS(["Take a slip. Write your name", "Rank the five roles: **1 is the one you are most curious about**", "One sentence on why your first choice", "Hand it to me. I publish teams on **Friday, Jan 8**"], cls="sm"),
        CALLOUT("Rank by curiosity, not by what you think you are good at. You are allowed to want something new.", title="How to rank")),
        kicker="04 — Roles", mins=3,
        notes=NOTES(say=["Do not discuss rankings out loud. Rank on paper, individually, so that nobody is influenced by a friend."],
                    do=["Collect the slips. Enter them into the team board that evening, and publish teams on Jan 8."],
                    watch=["If everyone ranks the same role first, tell them that is normal and that the balance rule will apply."])),

    task_slide("Week 7 _tasks_", "Wed, Jan 13", [
        ("Your **idea in one sentence**, a user story and three screens", "Photo or Figma link. Mark the four states of the main screen."),
        ("Your **sprint product, fixed**", "Fix the biggest problem from your retro and redeploy. Test it on a phone, in a private window."),
        ("A **pitch draft**, at most 400 words", "Say it out loud twice, with a timer. Note how long it took."),
        ("A **backup demo video**, 60 seconds", "Re-record if the product changed since the sprint."),
        ("Your **role ranking**, if you did not hand it in", "Five roles, rank 1 to 5, one sentence on why.")], "w7-tasks", mins=3,
        evaluates="decision-making, pitch craft, follow-through",
        notes=NOTES(say=["These five are your preparation for Demo Day. Next Thursday you pitch the product you will build on the day, or a version of it.",
                         "The retro fix is the one that matters most. Fix the thing you said you would change."],
                    do=["Say the Demo Day date and the pitch length again: three minutes and a hard stop."])),

    slide("Next: _Demo Day_", B(
        UL(["**Thursday, Jan 14.** Each team pitches in three minutes, then two minutes of questions.", "We judge with the **same rubric** as Week 1. Scores and one comment per team.", "Bring a **laptop, a charger, and your backup video on your phone**."]),
        CALLOUT("It is a dress rehearsal for January 20. Treat it like the real thing and we will find the problems here.", title="Week 8")),
        kicker="Next", mins=1,
        notes=NOTES(say=["Teams will be published on Friday. The roster is the team you will go into the hackathon with, so read it and ask questions early."],
                    do=["If you can invite one or two guests to judge Demo Day, such as a teacher or mentor, ask them this week."])),
)
