"""Week 3 -- Thu Dec 10: teamwork on GitHub (pull requests, reviews, merges, conflicts)."""
from lib import *
from config import ORG

DECK = Deck("w3", 3, "2026-12-10", "Thu, Dec 10", "Shipping together")

DECK.add(
    cover("Teamwork on GitHub", "Shipping _together_",
          "Pull requests, reviews and merge conflicts: how five people change one codebase without breaking it.", 3, "Thu, Dec 10", "2027-01-20",
          notes=NOTES(say=["Last week you learned Git alone. Today you learn the part that actually decides whether a team ships: how several people change the same project.",
                           "We will create a merge conflict on purpose, so the first one you ever fix is not at 3am on hackathon night."],
                      do=["Before class: create the `conflict-lab` repo with a `team-motto.md` file, and make sure each team has its own repo with a README (see the facilitator guide).",
                          "Check that every student could push to `git-gym`. Anyone who could not needs fixing first."]), mins=1),

    quiz_slide("You ran `git commit`. Where does your snapshot live now?", ["On GitHub, for everyone to see", "On your computer only", "On your teammates' computers", "Nowhere yet, it is still staged"], 1,
               "A commit saves a snapshot in your local repository. It reaches GitHub only when you run `git push`.", mins=2, kicker="Last week",
               notes=NOTES(say=["This is the single most common Git misunderstanding. If many get it wrong, redraw the four-box diagram from last week."])),

    quiz_slide("Your push is rejected with 'non-fast-forward'. What now?", ["Run `git push --force`", "Delete the repo and clone it again", "Run `git pull`, then push again", "Ask your teammate to stop pushing"], 2,
               "Someone pushed first. Pull their commits into yours, then push. Forcing would overwrite their work.", mins=2, kicker="Last week",
               notes=NOTES(say=["Ask: why is --force dangerous? Because it makes GitHub match your computer, and throws away whatever your teammate pushed."],
                           watch=["Do not let anyone leave thinking --force is a normal fix. We are going to teach the right way today."])),

    slide("What you can do by the _end_", B(
        COLS(UL(["**Open** a pull request that a teammate can actually review", "**Review** someone else's, and say useful things", "**Resolve** a merge conflict calmly", "**Run** a small team sprint with issues and a board"]),
             TABLE(["Min", "Today"], [["8", "Recap"], ["28", "The team loop: PRs, reviews, merging"], ["12", "Merge conflicts, the idea"], ["17", "Lab: conflict on purpose"], ["27", "Lab: a mini sprint"]]), kind="split")),
        kicker="Today", mins=3,
        notes=NOTES(say=["Two labs today, and they are the real lesson. The slides before them are short on purpose."])),

    section("01", "The team _loop_", "How a change travels from one person's idea to the shared main branch.", notes=NOTES(say=["This is the workflow your team will use on hackathon day. Learn it once."])),

    slide("How a change reaches _main_", B(
        FLOW([("Issue", "The task, written down"), ("Branch", "Your work, away from main"), ("Pull request", "Ask to merge it"), ("Review", "A teammate reads and runs it"), ("Merge", "It joins main")],
             ["start", "push", "open", "approve"], highlight=2, tight=True),
        CALLOUT("Nobody pushes straight to main. Every change goes through a pull request, even when it is one line. That is what keeps main always working.", title="The one rule")),
        kicker="01 — The team loop", mins=4,
        notes=NOTES(say=["Five steps. You have done two already: issues and branches. Today is steps three to five.",
                         "A pull request is a conversation about a change: here is my branch, please look at it, then merge it if it is good."],
                    do=["Point at the flow while you talk, and leave it on screen."],
                    watch=["Students will say 'it is faster to push to main'. It is, until the day it breaks the demo. Hold the line."])),

    slide("Anatomy of a good _pull request_", COLS(
        CODE("## What changed\n- Added a send button to the chat page\n\n## Why\nFixes #7\n\n## How to test\n1. Run the branch (or the preview link)\n2. Type a message, press Send\n3. It appears in the list\n\n## Screenshots\n(drag an image here)", label="the template every PR starts from", sm=True),
        UL(["**Small.** One idea per PR. If you cannot explain it in a sentence, split it.", "**Linked.** `Fixes #7` closes the issue when it merges.", "**Testable.** Say how someone checks it works.", "**Visual.** A screenshot for anything the user sees."], cls="sm"),
        kind="split"),
        kicker="01 — The team loop", mins=5,
        notes=NOTES(say=["A PR is for your reviewer, not for you. They have not been inside your head for two hours. Tell them what changed, why, and how to check.",
                         "Small is the single biggest factor in whether a PR gets reviewed well. A 20-line PR gets read. A 600-line PR gets approved without anyone reading it."],
                    do=["Open a real PR on the projector in the team repo and show where the template appears. Put the template file in `.github/pull_request_template.md` beforehand."],
                    watch=["Students will open PRs titled 'update' with no description. Send those back, kindly, until it becomes a habit."])),

    slide("Reviewing a teammate's _work_", B(
        COLS(STEPS(["Read the description. What is this meant to do?", "Open **Files changed**. Read every line.", "**Run it** on your machine, or from a preview link if you have one", "Comment on specific lines. Then **Approve** or **Request changes**"], cls="sm"),
             B(TABLE(["Prefix", "Means"], [["question:", "I do not understand this part"], ["nit:", "Tiny, optional, your call"], ["blocking:", "Must change before merging"]]),
               CALLOUT("Review the code, not the person. Say what you would do, not what they did wrong.")), kind="split")),
        kicker="01 — The team loop", mins=5,
        notes=NOTES(say=["The prefixes matter more than they look. Without them every comment feels like a demand, and every reviewer is a bully.",
                         "Approving something you did not run is not reviewing. If you did not run it, say so in the comment."],
                    do=["Model one review live: open a PR, add a nit, a question and a blocking comment, then approve."],
                    watch=["Shy students will approve everything without reading. Shy reviewers are the biggest risk to main. Tell them they are allowed to ask questions."])),

    slide("Three ways to merge, one rule for _main_", B(
        TABLE(["Method", "What main's history looks like", "Use it"], [
            ["Merge commit", "Every branch commit kept, plus one merge commit", "Fine, can be noisy"],
            ["Squash and merge", "One tidy commit per pull request", "**Our default**"],
            ["Rebase and merge", "Rewrites commits onto main", "Skip it for now"]]),
        CALLOUT("In Settings, add a rule for main: require a pull request before merging, and block force pushes. Now even you cannot break main by accident.", title="Protect main")),
        kicker="01 — The team loop", mins=5,
        notes=NOTES(say=["Squash and merge keeps main readable: one commit per feature, with the PR title as the message. For a team of beginners it is the least surprising.",
                         "We skip rebase. It rewrites history, and rewriting shared history is how teams lose work."],
                    do=["Show the three options on the green merge button on a real PR."],
                    watch=["Branch rules for private repositories can need a paid plan. Our repos are public so the rules are free. Check Settings, then Rules or Branches, to see what your plan allows."])),

    section("02", "Merge _conflicts_", "What they are, why they are normal, and how to fix one.", notes=NOTES(say=["Say this clearly: a conflict is not an error. It is Git asking you a question."])),

    slide("A conflict is a _question_", B(
        COLS(UL(["Two people changed **the same lines**.", "Git cannot guess whose version is right, so it stops and asks.", "It marks the file with `<<<<<<<`, `=======` and `>>>>>>>`.", "You pick, remove the markers, and commit."]),
             CALLOUT("Conflicts are boring when you know what they are, and terrifying when you do not. By the end of today you will know.", title="Why this matters"), kind="split")),
        kicker="02 — Merge conflicts", mins=3,
        notes=NOTES(say=["The markers: the top half, between the first two lines, is your version. The bottom half is the other person's. Your job is to produce the one version that is correct.",
                         "Sometimes that is yours, sometimes theirs, sometimes both combined. It is a decision, not a click."],
                    watch=["Do not use the word 'error'. Use 'question'. It changes how they feel about it."])),

    slide("Resolve one", WIDGET("conflict"),
        kicker="02 — Merge conflicts", lede="This is what VS Code shows. Try each button and read what it says.", mins=5,
        notes=NOTES(say=["Click all three. 'Accept both' is the dangerous one: it keeps both lines, and here that means the file sets the name twice.",
                         "After resolving: save, run the app to check it still works, then `git add` and `git commit`. People forget to test, and ship a file that no longer runs."],
                    do=["Ask the room which button is right here. There is no right answer without knowing which name the team wants. That is the point."])),

    slide("Avoiding most _conflicts_", UL([
        "**Small pull requests**, merged quickly. A branch that lives for a day conflicts less than one that lives for a week.",
        "**Pull from main often**, into your branch, so you resolve small differences early.",
        "**Split the work by file.** Interface people in the interface files, API people in theirs.",
        "**Say it out loud**: 'I am editing the header'. Ten seconds in chat saves ten minutes.",
        "**Do not reformat whole files.** Auto-formatting touches every line and conflicts with everyone."]),
        kicker="02 — Merge conflicts", mins=3,
        notes=NOTES(say=["You will still get conflicts. That is fine. The goal is to make them small.",
                         "Generated files such as lockfiles are the exception: do not hand-merge them. Delete them, regenerate them, commit the result. We will meet one in the AI weeks."])),

    section("03", "Lab: conflict on _purpose_", "Teams of three. You will create a conflict and then fix it.", notes=NOTES(say=["Seventeen minutes. Teams of three, one laptop each. Do not split the steps between you, everyone does everything."])),

    slide("Make a conflict, then fix it", COLS(
        STEPS(["Each person: `git switch -c motto-yourname`", "Each edits **line 1** of `team-motto.md`, differently, and pushes", "Person A opens a PR and merges it", "Person B opens a PR: GitHub says **This branch has conflicts**", "Person B: pull main into the branch, then resolve in VS Code", "Commit, push. The PR can now merge. Then Person C"], cls="sm"),
        TERM(["$ git switch motto-yourname", "$ git pull origin main", "Auto-merging team-motto.md", "CONFLICT (content): Merge conflict in team-motto.md", "Automatic merge failed; fix conflicts and then commit the result.", "# open team-motto.md, keep the right lines, remove the markers", "$ git add team-motto.md", "$ git commit -m \"Resolve merge conflict in team motto\"", "$ git push"], label="what Person B does", sm=True),
        kind="c2"), kicker="03 — Lab", mins=17,
        notes=NOTES(say=["The repo is `conflict-lab`. Everyone edits the same line of the same file, which is the cause of every conflict.",
                         "When the second PR shows 'This branch has conflicts', that is the lesson. Celebrate it. Then fix it."],
                    do=["Walk the teams. The usual traps: leaving the `<<<<<<<` markers in the file, resolving and forgetting `git add`, and resolving on main instead of the branch.",
                        "Ask each Person B to read the result aloud before pushing. Make them check the markers are gone."],
                    watch=["`git pull origin main` merges main into the current branch. It is the one command here they have not used. Say what it does before they run it.",
                           "If a team gets truly stuck, `git merge --abort` returns the branch to how it was. Say it once and keep it in your pocket."])),

    slide("The board and the daily _standup_", B(
        COLS(STEPS(["In the team repo, create a **Project** (board view)", "Columns: **Todo, In progress, In review, Done**", "Move your card when you start, and when you open the PR", "Standup: what did I finish, what am I doing, what is blocking me"], cls="sm"),
             CALLOUT("On hackathon day, run a five-minute standup every three hours. It catches the person who has been stuck for two of them.", title="Why a standup"), kind="split")),
        kicker="03 — Lab", mins=5,
        notes=NOTES(say=["The board is just issues arranged in columns. Its only job is to show, at a glance, who is doing what and what is waiting for a review.",
                         "Reviews are the usual bottleneck. If the 'In review' column is full, the team's job is to review, not to start new things."],
                    do=["Create the board together on the projector, then let teams build their own."])),

    slide("Mini sprint: three issues, three _PRs_", COLS(
        STEPS(["Each team agrees a tiny pretend product: a team page", "Write **three issues**, one per person, each about 15 minutes of work", "Everyone: branch, change, push, open a PR using the template", "**Review someone else's.** Nobody merges their own", "Squash and merge all three. Move the cards to Done"], cls="sm"),
        B(CALLOUT("Rules for the sprint: main only changes through a PR. Every PR gets one review. If two PRs touch the same file, talk first.", title="The rules"),
          CALLOUT("You will finish with a board, three merged PRs and a git history you can read.", title="What you leave with")), kind="split"),
        kicker="03 — Lab", mins=22,
        notes=NOTES(say=["This is a rehearsal of the real thing. Same rules as hackathon day. If it feels slow, that is correct. It gets fast with practice.",
                         "Watch for the team where one person does everything. That is a signal, write it down, and ask them to hand a task over."],
                    do=["Float between teams. The things to check: are PRs small, do they have descriptions, is someone actually reviewing?",
                        "Take note of who reads code carefully, who communicates, who finishes. You need it for the role board in Week 7."],
                    watch=["Teams will want to build a real feature. Keep it tiny. The topic is the workflow, not the page."])),

    task_slide("Week 3 _tasks_", "Wed, Dec 16", [
        ("Team repo: a README, a project board, and at least five merged PRs", "From at least three different people, each reviewed by someone else."),
        ("The conflict you resolved: link the PR", "Add a comment saying what the conflict was and what you kept."),
        ("Submit your reflection as a pull request", f"Add `week3/yourname.md` to `{ORG}/classwork`. Three lines: a conflict, something a reviewer taught you, something still confusing."),
        ("Review one PR from a person on another team", "Leave at least one `question:` and one `nit:`."),
        ("Ask your school contact which AI tools are approved", "I will bring the answers in Week 4, so send me your list.")], "w3-tasks", mins=4,
        evaluates="teamwork, communication, Git fluency",
        notes=NOTES(say=["From today, tasks come in as pull requests. The reflection is your first one into `classwork`, and it is small on purpose.",
                         "The cross-team review is practice at reviewing someone you do not already know, which is what a judge's Q&A feels like."],
                    do=["Post the link to `classwork` and the exact folder name expected."],
                    watch=["Some will submit to the wrong repo or branch. Check Friday morning and message anyone who is missing."])),

    slide("Next week: _AI tools_", B(
        UL(["How to work with an AI assistant without handing it the steering wheel.", "Writing prompts that get you something usable the first time.", "Putting AI inside a product, and a first taste of Python.", "Bring a laptop with Python working. Last week's check still applies."]),
        CALLOUT("The pull request habit pays off next week: AI will write you a lot of code, and a PR is where you check it before it reaches main.")),
        kicker="Next", mins=2,
        notes=NOTES(say=["Next week is the one most people are looking forward to. It lands better because you now have a safe way to use it."],
                    do=["Tell them which AI tools the school approved, if you have the answer."])),
)
