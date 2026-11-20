"""Week 2 -- Thu Dec 3: Git and GitHub from zero."""
from lib import *
from config import ORG

DECK = Deck("w2", 2, "2026-12-03", "Thu, Dec 3", "Git and GitHub from zero")

DECK.add(
    cover("Version control", "Git, _from zero_",
          "A time machine for your code, and the reason a team of five does not overwrite each other.", 2, "Thu, Dec 3", "2027-01-20",
          notes=NOTES(say=["Last week was setup. Today is the tool that protects everything else you build.",
                           "By the end you will have pushed a branch to a shared repo that everyone in this room can see."],
                      do=["Before they arrive: make sure the `git-gym` repo exists and every student has been invited as a collaborator (see the facilitator guide)."],
                      watch=["Check how many people did not finish the Week 1 setup. Fix those first, before the quiz."]), mins=1),

    quiz_slide("Which of these do hackathon judges usually read the least?", ["The demo", "The pitch", "The code", "The problem you solve"], 2,
               "Judges score the product, the pitch and the potential. A clean codebase helps you, but it is rarely what they score.", mins=2, kicker="Last week",
               notes=NOTES(say=["Vote by hand first, then click. Ask someone who got it right to say why."],
                           watch=["If many get this wrong, spend one minute on it. The whole program rests on 'ship something that works'."])),

    quiz_slide("Which role owns the repo, the deploys and the secrets?", ["Product Lead", "Interface Builder", "AI Engineer", "Platform Captain"], 3,
               "The Platform Captain keeps the repo healthy and the deploys working. Everyone still uses Git. Someone has to own it.", mins=2, kicker="Last week",
               notes=NOTES(say=["Today you all learn the Platform Captain's tools. Not because everyone is the captain, but because everyone's work flows through it."])),

    slide("What you can do by the _end_", B(
        COLS(UL(["**Explain** what a commit and a branch really are", "**Clone**, branch, commit, push and pull without looking", "**Read** a history and say who changed what", "**Keep secrets** out of your repo"]),
             TABLE(["Min", "Today"], [["8", "Recap and the idea"], ["25", "The commands, the sandbox"], ["25", "Lab: push to git-gym"], ["15", "Secrets, mistakes, GitHub tour"], ["12", "Review and tasks"]]), kind="split")),
        kicker="Today", mins=3,
        notes=NOTES(say=["Four skills. If you can do those four by next Thursday, week three is easy.",
                         "Everything I teach in this room I will also put in the cheat sheet you get at the end."])),

    section("01", "The _idea_", "What Git is, what GitHub is, and where your changes actually live.", notes=NOTES(say=["Spend your energy here. If the mental model is right, the commands are easy."])),

    slide("Why version control _exists_", B(
        COLS(B(CODE("essay.docx\nessay_final.docx\nessay_final_v2.docx\nessay_FINAL_really.docx\nessay_FINAL_really_Aysel_edits.docx", label="every group project, ever"),
               P("Now give five people one folder. Whose version wins?", muted=True)),
             CARDS([("Git", "A tool on your computer. Saves snapshots of your project and remembers the history. Works offline.", "the tool"), ("GitHub", "A website that hosts Git projects. Where your team meets: issues, reviews, deploys.", "the place", True)], kind="top", sm=False), kind="c2"),
        ),
        kicker="01 — The idea", mins=4,
        notes=NOTES(say=["Git saves a snapshot every time you tell it to, with a message. You can go back to any snapshot, and it can combine work from many people.",
                         "Git is not GitHub. Git is the program on your laptop. GitHub is one website that hosts Git projects. GitLab and others exist, same idea."],
                    do=["Ask who has lost work to an overwrite or a crashed file. Almost everyone has."],
                    watch=["Students mix up the two for months. Say it three times today: Git is the tool, GitHub is the place."])),

    slide("Where your changes _live_", B(
        FLOW([("Working folder", "The files you are editing right now"), ("Staging area", "Changes you picked for the next snapshot"), ("Local repository", "Snapshots (commits) on your computer"), ("GitHub", "The shared copy your team sees")],
             ["git add", "git commit", "git push"], highlight=2),
        CALLOUT("Going the other way, **git pull** brings your teammates' commits from GitHub into your computer. You push what you did. You pull what they did.", title="And back again")),
        kicker="01 — The idea", mins=5,
        notes=NOTES(say=["This diagram is the whole of Git for beginners. Four places, three arrows.",
                         "You edit files in the working folder. `git add` picks which changes go in the next snapshot. `git commit` saves the snapshot on your computer. `git push` sends it to GitHub.",
                         "Nothing is shared until you push. That is why 'it works on my machine' is a thing."],
                    do=["Draw it on the whiteboard as well and leave it up all lesson. Point at it every time you run a command."],
                    watch=["The most common confusion: thinking `git commit` uploads to GitHub. It does not. Say that out loud."])),

    section("02", "The _commands_", "Six that cover almost everything. Then a sandbox to break.", notes=NOTES(say=["Short section. They already know the idea. These are just the names."])),

    slide("Six commands, ninety percent of the _work_", TABLE(["Command", "What it does"], [
        ["git clone URL", "Copy a repo from GitHub to your computer, history included"],
        ["git status", "What changed? What is staged? Run it constantly"],
        ["git add FILE", "Stage a change for the next commit"],
        ["git commit -m \"...\"", "Save a snapshot, with a message that says why"],
        ["git push", "Send your commits to GitHub"],
        ["git pull", "Fetch your teammates' commits and merge them in"]]),
        kicker="02 — The commands", mins=6,
        notes=NOTES(say=["Read them down once, then say: git status is the one you run when you are confused. It tells you exactly what state you are in.",
                         "You do not need to memorise these today. You will have typed each of them ten times by the end of the lab."],
                    watch=["Do not teach `git add .` yet as a habit. It is fine, but people stage things they did not mean to. Prefer naming files while learning."])),

    slide("Commit messages that _help_", COLS(
        TERM(["$ git commit -m \"update\"", "$ git commit -m \"fix\"", "$ git commit -m \"asdf\"", "$ git commit -m \"final final\"", "$ git commit -m \"changes\""], label="unhelpful", sm=False),
        TERM(["$ git commit -m \"Add login form validation\"", "$ git commit -m \"Fix crash when the list is empty\"", "$ git commit -m \"Move API key to .env\"", "$ git commit -m \"Make buttons bigger on mobile\""], label="helpful"),
        kind="c2"),
        kicker="02 — The commands", lede="Six months from now you will search this history for the one change that broke the demo. Write for that person.", mins=3,
        notes=NOTES(say=["The rule: start with a verb, say what changed, keep it under about 60 characters. 'Add', 'Fix', 'Move', 'Remove', 'Make'.",
                         "In a hackathon at 3am, a clear message is the difference between finding the bug in two minutes and in forty."],
                    do=["Ask the room to say what is wrong with 'final final'."])),

    slide("Play with _history_", WIDGET("git"),
        kicker="02 — The commands", lede="Commit. Branch. Commit. Switch back. Merge. Watch what moves.", mins=8,
        notes=NOTES(say=["Give them five minutes alone with the sandbox. The questions to ask at the end: what moved when you committed? What did 'new branch' copy? What happened when you merged?",
                         "Answers: committing moves the branch label forward. A new branch copies nothing, it is just another label on the same commit. A merge either just slides a label (fast-forward) or makes a commit with two parents."],
                    do=["Let them click. Walk the room and ask a few people to explain what they see, in their own words."],
                    watch=["Someone will make a merge commit and ask why there is no fast-forward. It is because both branches had new commits. That is the lesson, point at it."])),

    slide("A branch is a _label_", B(
        COLS(UL(["Making a branch copies **nothing**. It is a new name pointing at a commit.", "Commits move the label of the branch you are on.", "`main` should always work. Do your changes on a branch.", "Name branches for what they do: `feature/login`, `fix/empty-list`."]),
             B(TERM(["$ git switch -c feature/login", "Switched to a new branch 'feature/login'", "$ git switch main", "Switched to branch 'main'"], label="make one, go back", sm=True),
               CALLOUT("If you are not sure what branch you are on, run `git status`. The first line says.")), kind="split")),
        kicker="02 — The commands", mins=4,
        notes=NOTES(say=["It is not a copy of the project. That is why branches are cheap, and why you should make one for every change.",
                         "The rule for hackathons: main always runs. Nobody commits half-finished work straight onto main."],
                    watch=["Older tutorials use `git checkout -b`. It still works. We use `git switch -c` because the name says what it does."])),

    section("03", "Lab: _git-gym_", "A shared repo where everyone makes a branch and pushes it.", notes=NOTES(say=["Twenty-five minutes. You do it, I walk the room. Do not wait for me, go step by step."])),

    slide("Clone, branch, commit, _push_", COLS(
        TERM([f"$ git clone https://github.com/{ORG}/git-gym.git", "$ cd git-gym", "$ git switch -c add-yourname", "# create students/yourname.md, three lines about you", "$ git status", "$ git add students/yourname.md", "$ git commit -m \"Add yourname to the roster\"", "$ git push -u origin add-yourname"], label="git-gym, step by step"),
        B(STEPS(["Accept the invitation to the repo (check your email)", "Do every step in order, run `git status` after each", "When it pushes, open the link Git prints and look at your branch on GitHub"], cls="sm"),
          CALLOUT("`-u origin add-yourname` tells Git where this branch lives on GitHub. You only need it the first time.")), kind="split"),
        kicker="03 — Lab", mins=15,
        notes=NOTES(say=["Everyone creates their own file with their own name. That way nobody edits the same lines, and nobody gets a conflict. Next week we will create conflicts on purpose.",
                         "Run `git status` after every step. It is your only safety net while you are learning."],
                    do=["Walk the room. Look for these: someone cloning into a folder inside another repo, someone on the wrong branch, someone whose push is rejected.",
                        "If push asks for credentials, it should open a browser to sign in. A password will not work."],
                    watch=["If the invitation has not arrived, check the spam folder, then add them again from the repo's Settings, Collaborators.",
                           "Anyone who pushes to main by accident: do not panic them. It is the lab repo, it is safe. Show them how to see it."])),

    slide("Pull what others _did_", COLS(
        TERM(["$ git switch main", "$ git pull", "$ git fetch", "$ git branch -a", "$ git log --oneline --graph --decorate"], label="see everyone's work", sm=True),
        TERM(["* 8c1d2fe (origin/add-aysel) Add aysel to the roster", "| * 5a7e91b (HEAD -> add-yourname) Add yourname to the roster", "|/", "* 3a4b5c6 (origin/main, main) Add roster folder"], label="what it looks like", sm=True),
        kind="c2"),
        kicker="03 — Lab", lede="Each line is a commit. The branches split off the same starting point, and you can see all of them.", mins=6,
        notes=NOTES(say=["`git fetch` downloads what is on GitHub without changing your files. `git pull` fetches and also merges it into your branch.",
                         "`git log --oneline --graph --decorate` is the single most useful command for understanding a repo. Make everyone run it now and read it aloud."],
                    do=["Ask someone to find a teammate's branch in their own graph."],
                    watch=["The output will look different for everyone. That is the point. Do not worry if it does not match the slide."])),

    slide("Never commit your _secrets_", COLS(
        B(CODE(".env\n.env.local\nnode_modules/\n__pycache__/\n.venv/\n.DS_Store", label=".gitignore, lives in the project root"),
          P("Anything listed in `.gitignore` is never committed.", muted=True)),
        B(CALLOUT("If a key reaches a public repo, treat it as stolen. Revoke it at the provider first, then clean up. Deleting the file in a new commit does not remove it from history.", kind="bad", title="If it happens"),
          UL(["Keys, passwords and tokens go in `.env`", "`.env` goes in `.gitignore` **before** the first commit", "Never paste a key into chat or a screenshot"], cls="sm")), kind="c2"),
        kicker="03 — Lab", mins=7,
        notes=NOTES(say=["Automated scanners watch public GitHub for keys. A leaked key is used quickly. The fix is to revoke it, not to hide it.",
                         "On a hackathon team this is the Platform Captain's job to check, but everyone commits, so everyone needs to know."],
                    do=["Have them create a `.gitignore` in `hello-yourname` now, add a fake `.env` file, and run `git status` to see that `.env` does not appear."],
                    watch=["The `.gitignore` only stops files that are not yet tracked. If a file was already committed, ignoring it later does not remove it. Mention it, do not dwell on it."])),

    slide("When it goes _wrong_", TABLE(["What you see", "What it means, and the fix"], [
        ["nothing to commit", "You have no changes, or you forgot to save the file"],
        ["rejected (non-fast-forward)", "Someone pushed first. Run `git pull`, then push again"],
        ["Changes not staged", "You edited but did not `git add`. Run `git status`"],
        ["I committed to the wrong branch", "Ask for help before you push. It is fixable"],
        ["I want to undo my edits to a file", "`git restore FILE` throws the edits away. There is no undo for that"]]),
        kicker="03 — Lab", mins=5,
        notes=NOTES(say=["Most Git problems are one of these five. If you are stuck and cannot read the message, copy it exactly and ask. Do not guess commands from the internet.",
                         "Commands that rewrite history or delete work are on the list for later. Until then, if a Stack Overflow answer says `--force`, stop and ask."],
                    watch=["`git restore` discarding edits is permanent. Say that loudly."])),

    slide("A tour of _GitHub_", CARDS([
        ("Code", "Files, folders, the README, the latest commit.", "tab 1"), ("Commits and branches", "Every snapshot, every label. The history in a browser.", "tab 2"),
        ("Issues", "Your team's to-do list and bug list.", "tab 3", True), ("Pull requests", "How changes get reviewed. Next week.", "tab 4"),
        ("Actions", "Automatic checks and deploys. Later.", "tab 5"), ("Settings", "Collaborators, branch rules, secrets.", "tab 6")], kind="c3"),
        kicker="03 — Lab", mins=4,
        notes=NOTES(say=["Open `git-gym` on the projector and click through each tab. Do not explain everything, just show where things live.",
                         "Open Insights, then Network, to show everyone's branches as a graph. Students love finding their own."],
                    do=["Click into one student's commit and show the diff: red lines removed, green lines added."])),

    slide("Issues are your _to-do list_", B(
        COLS(STEPS(["**New issue**, with a clear title: what, not how", "Describe the problem or the goal in two lines", "Assign it to someone. Add a label like `bug` or `feature`", "Reference it from a commit, or close it with `Fixes #12`"], cls="sm"),
             TERM(["$ git commit -m \"Add roster page, refs #3\"", "# when the work is done, in the pull request:", "Fixes #3"], label="link work to an issue", sm=True), kind="split")),
        kicker="03 — Lab", lede="On a hackathon team, the issue list is the plan. If it is not an issue, it is not being done.", mins=4,
        notes=NOTES(say=["From Week 3 we plan every sprint as a list of issues. Today just practice making one.",
                         "Good issues are small enough to finish in an hour or two. 'Build the app' is not an issue. 'Add a send button that calls the API' is."],
                    do=["Everyone opens one issue in `git-gym`: 'Suggest a Git exercise'. It is one of the tasks."])),

    task_slide("Week 2 _tasks_", "Wed, Dec 9", [
        ("Push your `add-yourname` branch to `git-gym`", "It must show on GitHub with your commit. Post the link."),
        ("Add a `.gitignore` to `hello-yourname`", "Include `.env`. Show `git status` without `.env` in it."),
        ("Open one issue in `git-gym`", "Title: a Git exercise you would like to try."),
        ("Do levels 1 to 3 of Learn Git Branching", "learngitbranching.js.org, Main, Introduction Sequence. Screenshot the third level done."),
        ("Run `git log --oneline --graph` on your repo and paste the output", "Add a one-line note: what does each line mean?")], "w2-tasks", mins=4,
        evaluates="Git fluency, follow-through",
        notes=NOTES(say=["Learn Git Branching is a free interactive game in the browser. It is the best way to see branches and merges, and it is exactly what we need before next week.",
                         "Skip the rebase level for now."],
                    do=["Post these in the group as text."],
                    watch=["Anyone who could not get into git-gym needs to be sorted today, not next week."])),

    slide("Next week: working _together_", B(
        UL(["Pull requests: how your changes get into main.", "Reviewing a teammate's work, and being reviewed.", "Merge conflicts, which we will create on purpose and fix.", "Bring your `git-gym` branch. We will use it."]),
        CALLOUT("From next week, every task you submit goes in as a pull request. Today's lab was the practice for it.")),
        kicker="Next", mins=2,
        notes=NOTES(say=["Conflicts sound scary and are very ordinary. Once you have resolved one on purpose, you stop being afraid of them."],
                    do=["Tell the school contact the list of AI tools students wanted to use, so you can get an answer by Dec 10."])),
)
