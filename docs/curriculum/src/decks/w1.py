"""Week 1 -- Thu Nov 26: how hackathons are won + your toolkit."""
from lib import *
from config import ORG

DECK = Deck("w1", 1, "2026-11-26", "Thu, Nov 26", "How hackathons are won")

DECK.add(
    cover("Hackathon-ready by Jan 20", "How hackathons are _won_",
          "Eight Thursdays, one goal: walk into the room able to ship a working product as a team.", 1, "Thu, Nov 26", "2027-01-20",
          notes=NOTES(say=["Open with the outcome, not the agenda: by January 20 you can take an idea to a working, deployed product in 24 hours, with a team.",
                           "Tell them why you are teaching this: you have won a hackathon, and you know what actually mattered."],
                      do=["Stand, do not sit. Put the countdown on screen while people settle."],
                      watch=["Do not apologise for being a student teacher. Say what you will teach and move on."]), mins=1),

    slide("Eight Thursdays to _Jan 20_", TIMELINE([
        ("Nov 26", "Win condition", "How hackathons are won, setup", "now"),
        ("Dec 3", "Git", "Commits, branches, GitHub"),
        ("Dec 10", "Teamwork", "PRs, reviews, merge conflicts"),
        ("Dec 17", "AI tools", "Prompting, AI in the product, Python glue"),
        ("Dec 24", "Interfaces", "UI, deployment, secrets"),
        ("Dec 31", "Async sprint", "Public holiday: you ship alone, at home", "x"),
        ("Jan 7", "Strategy", "Idea, scope, pitch, roles"),
        ("Jan 14", "Demo day", "Mock judging, final checklist"),
        ("Jan 20", "Deadline", "Show up ready", "end")]),
        kicker="01 — The plan", lede="By then you should be able to turn an idea into a deployed product in 24 hours, with a team, using tools you already know.", mins=4,
        notes=NOTES(say=["Walk left to right, one sentence each. Spend longest on the amber one: Dec 31 is a public holiday, so that week is a take-home sprint, not a meeting.",
                         "Each week builds on the last. If you miss one, tell me and I will help you catch up. Do not just disappear."],
                    do=["Ask who has a hackathon already in their calendar. Note names."],
                    watch=["Do not promise this is easy. Say it is a lot, and that is why it starts today."])),

    slide("What this is _not_", B(
        CARDS([("Not this", "Memorising syntax. Learning every framework. Typing every line by hand.", "we skip"),
               ("This", "Using tools well: Git, AI assistants, deployment. Reading and directing code you did not write. Making product decisions fast.", "we teach", True)], kind="c2", lg=True),
        CALLOUT("AI can write a lot of the code now. The teams that win are the ones who know what to build, can check what the AI built, and can ship it before the clock runs out.")),
        kicker="01 — The plan", mins=3,
        notes=NOTES(say=["You will not become a Python expert by January. You will become someone a team wants on it, because you can use the tools and finish things.",
                         "That is a different skill from knowing a language, and honestly a rarer one."],
                    watch=["Someone will ask 'so do I not need to learn to code?' Answer: you need to read it, run it, and fix it. You will do all three. You will not memorise it."])),

    slide("How Thursdays _work_", B(
        COLS(TABLE(["Min", "What happens"], [["10", "Recap quiz on last week"], ["25", "Teaching, with live demos"], ["30", "You build it yourself"], ["15", "Show and review"], ["10", "Tasks for next week"]]),
             UL(["**Tasks are due the Wednesday before.** Late is fine. Silent is not.", "**AI is allowed.** Understanding is required: you must be able to explain every line you ship.", "**Nobody ships alone.** From Week 3 all work goes through a pull request."]),
             kind="split")),
        kicker="01 — The plan", mins=3,
        notes=NOTES(say=["The 30 minutes of building is the point. If I talk for 90 minutes you learn nothing. Stop me if I do.",
                         "The AI rule matters. In the demo room, a judge will ask you how something works. 'The AI wrote it' is a losing answer."],
                    watch=["Set the Wednesday deadline now so it is not a surprise. Tasks go in the group chat this week; from Week 3 they go in as pull requests."])),

    section("02", "What _wins_", "What judges score, what teams get wrong, and how 24 hours really goes.", notes=NOTES(say=["This is the most important section today. Slow down."])),

    slide("What judges actually _score_", B(
        CARDS([("Innovation", "Have I seen this before?", "criterion 1"), ("Execution", "Does it work, right now?", "criterion 2", True), ("Impact", "Who needs this, and how badly?", "criterion 3"),
               ("Design", "Can I use it without help?", "criterion 4"), ("Pitch", "Did I understand it in 3 minutes?", "criterion 5")], kind="c5"),
        CALLOUT("Names and weights differ by event, but most hackathons score some version of these five. Judges score the product, the pitch and the potential. They rarely read the code.", title="Read the rubric first")),
        kicker="02 — What wins", mins=5,
        notes=NOTES(say=["Every hackathon publishes its criteria. Reading them in the first ten minutes is the cheapest advantage you will ever get.",
                         "Notice what is not on the list: lines of code, how clever the algorithm is, how many technologies you used.",
                         "Execution is highlighted because it is the one most teams lose. A broken demo wipes out a good idea."],
                    do=["Ask the room: which of these five do you think your team is naturally strong at? Which is weakest? Write two names on the board."],
                    watch=["Do not claim these are the exact criteria of the January event. Say you will check the real rubric as soon as you have it."])),

    slide("Three ways teams _lose_", COLS(
        STEP(CARD("Scope too big", "A half-built big idea loses to a finished small one. Judges can only score what runs.", "mistake 1", lg=True)),
        STEP(CARD("Demo not ready", "The pitch is rehearsed once, then the demo crashes, the Wi-Fi dies, the key has expired. Nobody had a backup.", "mistake 2", lg=True)),
        STEP(CARD("No plan, no sleep", "A rested team that cut scope beats an exhausted team that did not. Hour-20 mistakes are expensive.", "mistake 3", lg=True)),
        kind="c3"),
        kicker="02 — What wins", mins=4,
        notes=NOTES(say=["These three come up in almost every post-mortem. Click to reveal one at a time and ask the room if they have seen it happen.",
                         "Everything we do over the next eight weeks is aimed at preventing one of these three."],
                    do=["Click once per card. After each, ask: has this ever happened to you in a school project?"],
                    watch=["Use a school group-project example. It lands harder than a hackathon story."])),

    quiz_slide("Your team has 24 hours. Which plan gives you the best chance?", [
        "Build five features, then write the pitch in the last hour",
        "Pick one core flow, deploy it in the first hours, then improve it",
        "Perfect the backend first and add the interface at the end",
        "Wait until you find the perfect idea before starting"], 1,
        "A deployed skeleton early means you always have something to show. Everything after that is improvement, not rescue.", mins=2, kicker="What wins",
        notes=NOTES(say=["Let people vote by show of hands before you click. Most will pick B. Ask the A voters what they were thinking."],
                    watch=["C feels responsible and is a trap: a perfect backend with no interface demos as nothing."])),

    slide("A 24-hour hackathon, _to scale_", GANTT([
        (0, 2, "Pick the problem, cut the scope", "One sentence, one user, one hero flow"),
        (2, 4, "Deploy a skeleton", "Repo, hello-world live on a real URL", True),
        (4, 14, "Build the hero flow", "The one thing the demo needs"),
        (14, 18, "Polish and fix", "Empty states, errors, mobile"),
        (18, 21, "Freeze and record", "No new features. Record a backup demo", True),
        (21, 23, "Rehearse the pitch", "Out loud, with a timer, twice"),
        (23, 24, "Submit, with a buffer", "Test every link in a private window")], 24),
        kicker="02 — What wins", mins=5,
        notes=NOTES(say=["The bars are to scale. Notice how little time is left for building, and how much is spent on things that are not code.",
                         "The amber rows are the two that teams skip: the early deploy, and the freeze with a recorded backup. They are the cheapest insurance in the whole event.",
                         "We will rebuild this plan for your real event in Week 7."],
                    watch=["If the real hackathon is 48 hours or a different format, say so: the proportions hold, the hours change."])),

    slide("Five roles, one _team_", B(
        CARDS([("Product Lead", "Owns scope, the story and the pitch.", "role 01"), ("Interface Builder", "Owns what the user sees and touches.", "role 02"),
               ("AI Engineer", "Owns the model, the data, the glue code.", "role 03"), ("Platform Captain", "Owns the repo, deploys and secrets.", "role 04"),
               ("Demo Producer", "Owns the video, slides and assets.", "role 05")], kind="c5"),
        CALLOUT("Roles decide who owns decisions, not who does the work. Everyone helps everyone. You will try all five before we assign anything, in Week 7.", title="No one is locked in today")),
        kicker="02 — What wins", mins=5,
        notes=NOTES(say=["Read each one aloud in a sentence. Then say: I do not know yet who is best at which. You do not either. That is what the next five weeks are for.",
                         "I will be watching how you do on the tasks and noting it. Not to rank you, to put you where you will help the team most."],
                    do=["Ask them to privately rank the five by 'most curious about'. It goes on the task list."],
                    watch=["Someone will assume 'AI Engineer' is the best role. It is not. A team with no one who can ship and pitch loses to one that can."])),

    slide("The toolbox, _mapped_ to the weeks", TABLE(["Stage", "Tools you will use", "When"], [
        ["Think", "AI chat assistants, a notes doc", "Weeks 4, 7"],
        ["Design", "Figma or paper, AI interface generators", "Week 5"],
        ["Build", "VS Code, AI coding assistants, Python", "Weeks 4, 5"],
        ["Version", "Git and GitHub", "Weeks 2, 3"],
        ["Ship", "Vercel, Streamlit, environment variables", "Week 5"],
        ["Pitch", "Slides, screen recording, a timer", "Weeks 7, 8"]]),
        kicker="02 — What wins", mins=4,
        notes=NOTES(say=["This is the map for the whole program. Every tool here shows up once and then keeps showing up.",
                         "Git is first because it is the one that protects you. Everything else you can recover from. A lost afternoon of code you cannot."],
                    watch=["Do not demo any of these now. Today is only setup."])),

    section("03", "Lab: _set up_ your machine", "Forty minutes, hands on. Ask for help early.", notes=NOTES(say=["From here on, you talk less and walk around more."])),

    slide("Check your _setup_", B(
        COLS(TERM(["$ git --version", "git version 2.x", "$ python --version", "Python 3.x", "# on Windows, if that fails:", "$ py --version", "$ node --version", "v20 or newer", "$ code --version", "1.x"], label="run these four"),
             B(UL(["All four print a version? You are done.", "Any error? **Install it now**, not after class.", "Pair up: the person next to you checks yours."], cls="sm"),
               CALLOUT("git-scm.com, python.org, nodejs.org (the LTS version), code.visualstudio.com", title="Where from")), kind="split")),
        kicker="03 — Lab", mins=10,
        notes=NOTES(say=["Everyone runs the four commands in a terminal. On Windows use PowerShell or the VS Code terminal.",
                         "If one fails, do not debug it for twenty minutes. Install it, close and reopen the terminal, try again."],
                    do=["Walk the room. Look at screens. The most common fault is installing and not reopening the terminal."],
                    watch=["Python on Windows is often `py`, not `python`. Node versions printing v18 or older: tell them to install the current LTS.",
                           "Anyone on a school-managed laptop who cannot install software: write their name down and sort it before Dec 3, do not hold the room."])),

    slide("Make your GitHub account _count_", STEPS([
        ("Pick a username you will not be embarrassed by in five years", "Employers and judges will see it. Real name or a clean handle."),
        ("Turn on two-factor authentication", "Settings, then Password and authentication. Use an authenticator app."),
        ("Keep your email private", "Settings, then Emails, then Keep my email addresses private. Commits still link to your profile."),
        ("Add a profile README (optional)", "Create a repo named exactly like your username. Its README shows on your profile.")]),
        kicker="03 — Lab", mins=6,
        notes=NOTES(say=["Do these four in order. Two-factor is not optional: a stolen GitHub account can leak every key your team has.",
                         "Private email matters because commits carry an email address forever, and these repos will be public."],
                    do=["Do it live on your own account on the projector while they follow. Show where each setting is."],
                    watch=["Someone will have an old account with an embarrassing username. Let them make a new one; it takes three minutes."])),

    slide("Your first repo, your first _commit_", COLS(
        STEPS(["On GitHub: **New repository**, name it `hello-yourname`, public, **add a README**", "Click the README, the pencil icon, write three lines about you", "**Commit changes** on the main branch, with a message", "Click **History** and find your commit"], cls="sm"),
        TERM(["# now do it from your computer", f"$ git clone https://github.com/YOURNAME/hello-yourname.git", "$ cd hello-yourname", "$ code .", "# edit README.md in VS Code, save", "$ git add README.md", "$ git commit -m \"Say who I am\"", "$ git push"], label="the same thing, from your machine", sm=True),
        kind="c2"), kicker="03 — Lab", mins=12,
        notes=NOTES(say=["First the website, so you see what a commit is. Then the terminal, so you see it is the same thing.",
                         "A commit is a saved snapshot with a message. The message should say why, not what."],
                    do=["Do the website half together, step by step. Let them do the terminal half alone, and walk the room."],
                    watch=["`git push` may open a browser to sign in, or ask for credentials. If it asks for a password, a password will not work: GitHub removed password login for Git. Use the browser sign-in.",
                           "Never let anyone paste a personal access token into the group chat. If it happens, tell them to delete it on GitHub immediately."])),

    slide("Your first _AI-assisted_ build", COLS(
        CODE("I'm a high school student learning web basics.\nCreate a single file, index.html, with the HTML and CSS inside it.\nIt is a personal page: my name, a one-line bio, three interests\nas a list, dark blue background, light green accents.\nNo frameworks. After the code, explain each part in one sentence.", label="a prompt with four parts: who, task, constraints, format"),
        B(STEPS(["Paste it into an AI assistant you are allowed to use", "Save the code as `index.html`, double-click to open it", "**Change one thing yourself**, reload, see it change", "Commit and push it to `hello-yourname`"], cls="sm"),
          CALLOUT("The page does not matter. The loop does: ask, run, read, change, commit.")), kind="split"),
        kicker="03 — Lab", mins=12,
        notes=NOTES(say=["This is the loop you will use for the next eight weeks. Ask, run it, read it, change one thing, commit.",
                         "The 'change one thing yourself' step is the whole lesson. It proves you can steer the code instead of only receiving it."],
                    do=["If someone has no AI tool they may use yet, they can pair with someone who does. Do not let that block them.",
                        "Show one example on the projector, then stop talking."],
                    watch=["Some will paste the whole answer including the explanation into the file. The file only wants the code block.",
                           "Never paste passwords, tokens or personal details into an assistant."])),

    slide("Access check: what can _you_ use?", B(
        CALLOUT("Many AI tools have a minimum age, some 18 and over. Rules differ by tool and change often. Read the current terms yourself, ask a parent or teacher if you are under 18, and never share one account between people.", kind="warn", title="Before you sign up for anything"),
        TABLE(["Tool type", "Where to look", "Write down"], [
            ["Chat assistant", "The tool's terms, age requirements", "Minimum age. Parent consent needed?"],
            ["Coding assistant", "Same, plus the plan's student rules", "Free for you? Age limit?"],
            ["AI API key", "Developer terms, not the chat app's", "Allowed at your age?"],
            ["GitHub student pack", "education.github.com", "Eligible with school proof?"]])),
        kicker="03 — Lab", mins=5,
        notes=NOTES(say=["This is boring and important. The rules differ between tools. Some chat apps allow teenagers with a parent's permission; some do not allow under 18 at all, and the developer key sites can be stricter than the chat apps.",
                         "I am not going to tell you which tools you may use. I am going to ask you to check, because it is your account and your responsibility."],
                    do=["Tell them you will ask the school which tools are approved, and report back in Week 2.",
                        "Everyone fills the table as a task, with the real minimum age they find."],
                    watch=["Do not tell anyone to use a parent's or older sibling's account to get around a limit. Do not let that become the group's workaround.",
                           "If a tool is out of reach for someone, they are not behind. The labs work with free tools and nothing here requires one specific product."])),

    slide("How we will find your _role_", B(
        UL(["Every week's tasks show something different: Git, interfaces, logic, AI, communication, follow-through.",
            "I score a few signals after each week. **You rank your own curiosity** too.",
            "In Week 7 we compare both and lock roles for the real event.",
            "Roles can change if the evidence does."]),
        CALLOUT("Skill and interest are different. The best role is where they overlap. Neither alone decides it.")),
        kicker="03 — Lab", mins=3,
        notes=NOTES(say=["Be straight about it: I am watching, and I will use what I see. But it is not a competition, and it is not permanent.",
                         "The team board tool we will use is in the repo. You will see how roles are scored when we get there."],
                    watch=["Do not announce anyone's scores. Individual feedback is private."])),

    task_slide("Week 1 _tasks_", "Wed, Dec 2", [
        ("Post a screenshot of your four version commands", "git, python, node, code. Fix any that fail."),
        ("A repo called `hello-yourname` with a README and an `index.html`", "Public, with at least two commits. Post the link in the group."),
        ("Fill the access table", "Minimum age and consent rules for the tools you want to use."),
        ("Find one hackathon project you admire, any year", "Three lines: what it does, why it stood out. Bring the link."),
        ("Rank the five roles by curiosity, with one sentence on your top pick", "Private message to me is fine.")], "w1-tasks", mins=4,
        evaluates="setup, Git basics, follow-through",
        notes=NOTES(say=["Read all five. The first two are what I will actually check. The access table and the role ranking I need for planning.",
                         "Due Wednesday night, so I can read them before we meet Thursday."],
                    do=["Post the task list in the group chat as text, so nobody has to photograph the slide."],
                    watch=["Anyone whose setup failed today: name them now and agree a time this week to fix it."])),

    slide("Next week: _Git_ from zero", B(
        UL(["Commits, branches and remotes, with a sandbox you can break.", "Cloning, pushing, pulling. What a `.gitignore` does and why it protects you.", "Bring a charged laptop and your working `hello-yourname` repo."]),
        CALLOUT("If a task is stuck, say so in the group before Thursday. A fifteen-minute fix now saves a wasted lab later.")),
        kicker="Next", mins=2,
        notes=NOTES(say=["Close with the one thing: finish the setup. Everything else builds on it.",
                         "Ask if anyone has a question about the plan before they leave."],
                    do=["Take a photo of the whiteboard if you used one. You will want it for the recap."])),
)
