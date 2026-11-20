"""Week 5 -- Thu Dec 24: interfaces and deployment."""
from lib import *
from config import ORG

DECK = Deck("w5", 5, "2026-12-24", "Thu, Dec 24", "Make it real")

DECK.add(
    cover("Interfaces and deployment", "Make it _real_",
          "What a judge sees first, and how to put your project on a real URL that works on a phone.", 5, "Thu, Dec 24", "2027-01-20",
          notes=NOTES(say=["Until today your work lives on your laptop. Today it gets a web address you can send to anyone.",
                           "Two halves: how to make the interface worth looking at, and how to get it online without it breaking."],
                      do=["Before class: confirm the school is open today. Then test the deploy steps yourself, on the same network, from a fresh GitHub account if you can.",
                          "Deployment pre-flight (see the facilitator guide): check that your chosen platforms accept your GitHub org, and test a team repo with two committers. Do not discover this live."],
                      watch=["Low attendance is likely on Dec 24. Do not skip the content, but make sure the take-home sprint brief reaches everyone who is absent."]), mins=1),

    quiz_slide("Which step of the build loop do people skip most?", ["Spec", "Generate", "Run", "Read"], 3,
               "Reading the code. It is the step that makes you a developer instead of a passenger, and the one a reviewer will check for.", mins=2, kicker="Last week",
               notes=NOTES(say=["Ask who has an AI log entry about something they only found by reading. Take one example."])),

    quiz_slide("Where does an API key belong?", ["In the code, so it always works", "In the group chat, so everyone has it", "In `.env`, which is listed in `.gitignore`", "In the README"], 2,
               "Locally in `.env`, never committed. Online, in the host's secret or environment settings. Today you will do the online half.", mins=2, kicker="Last week",
               notes=NOTES(say=["Say the second half: today we move the key from a local file to the host's settings."])),

    slide("What you can do by the _end_", B(
        COLS(UL(["**Scope** an interface to one flow and three screens", "**Judge** an interface in ten seconds, and fix the obvious problems", "**Deploy** a page and a Python app to real URLs", "**Keep secrets** safe online"]),
             TABLE(["Min", "Today"], [["8", "Recap and plan"], ["31", "Interfaces: flow, wireframe, basics, stack"], ["44", "Deploying: two labs, secrets, failures"], ["7", "Tasks and what is next"]]), kind="split")),
        kicker="Today", mins=3,
        notes=NOTES(say=["The last block is the practical one. You should leave with two live URLs that you can open on your phone."])),

    section("01", "The _interface_", "A judge spends most of the demo looking at your screen. Make it count.", notes=NOTES(say=["A strong idea behind a confusing screen scores like a weak idea."])),

    slide("Judges meet the interface _first_", B(
        CARDS([("What is this?", "Within five seconds.", "question 1"), ("What do I do?", "One obvious action.", "question 2"), ("Does it work?", "A result, not a spinner.", "question 3", True)], kind="c3", lg=True),
        CALLOUT("If a first-time user cannot answer all three in ten seconds, a judge will not either. They have a room of other projects to see.", title="The ten-second test")),
        kicker="01 — The interface", mins=3,
        notes=NOTES(say=["Judges see ten or twenty projects in a day. The interface is where they decide in ten seconds whether to lean in.",
                         "These three questions are the test you apply to your own screen."],
                    do=["Put a screenshot of a real, plain page on the projector and give the room ten seconds. Ask them the three questions."])),

    slide("One flow, three _screens_", B(
        FLOW([("Start", "What is this, and the one button"), ("Do the thing", "The input, then the work"), ("See the result", "The answer, clear and shareable")], ["tap", "wait"], highlight=2),
        UL(["Write the **user story**: 'A student wants to ___ so that ___.'", "Design the one path through it. Everything else is out of scope.", "Plan the four states of each screen: **empty, loading, error, done**."]),
        CALLOUT("'A student wants to find a free study room right now, so that they stop texting five friends.' One sentence, one flow, three screens.", title="An example worth copying")),
        kicker="01 — The interface", mins=5,
        notes=NOTES(say=["The hero flow is the thing your demo shows. Everything on the screen should serve it.",
                         "The four states are where hackathon interfaces fall apart. A screen that is great when full and blank when empty looks broken in a demo."],
                    do=["Ask each team to say their hero flow in one sentence. If it has the word 'and' twice, cut it."],
                    watch=["Teams will add a login screen and a settings page. Neither is on the hero flow. Cut them."])),

    slide("A wireframe in fifteen _minutes_", COLS(
        STEPS(["Paper or Figma. **No colour, no fonts.** Boxes and words only", "Biggest thing on the screen = most important thing", "One **primary** button per screen", "Show a teammate for 10 seconds. Ask them what they would tap"]),
        CALLOUT("Fix the layout before you fix the colours. A wireframe is cheap to change. A built page is not.", title="Why so rough")),
        kicker="01 — The interface", mins=5,
        notes=NOTES(say=["Do this on paper if you like. The tool does not matter. What matters is that you decide the layout before you ask an AI to build it, so you are steering.",
                         "Showing it to someone for ten seconds is the cheapest usability test there is."],
                    do=["Everyone sketches the three screens of their own idea, on paper, in five minutes. Swap and ask the neighbour what they would tap."])),

    slide("Design basics that carry a _demo_", B(TABLE(["Rule", "In practice"], [
        ["Readable", "Body text at least 16px. Strong contrast (a 4.5:1 ratio is the standard for normal text)"],
        ["Tappable", "Buttons about 44px tall so a thumb can hit them"],
        ["Consistent", "One spacing scale. Two fonts at most. One accent colour"],
        ["Real", "Real words and real data in the demo, not 'Lorem ipsum'"],
        ["Responsive", "It must work on a phone. Test it on one"]]),
        CALLOUT("Open your page on your phone. If you have to zoom, or scroll sideways, fix that before anything else.", title="The two-second phone check")),
        kicker="01 — The interface", mins=5,
        notes=NOTES(say=["None of these needs talent. They are rules you can check. A plain page that follows them beats a fancy one that breaks them.",
                         "The contrast number is a real accessibility standard: 4.5 to 1 for normal text. A free contrast checker in the browser will tell you."],
                    watch=["Judges are often reading your screen from a projector or a laptop across a table. Small grey text disappears."])),

    slide("AI-made interfaces and how not to look _generic_", COLS(
        CARD("The tells", "Purple-to-blue gradients. Glowing blobs. Emoji as icons. A centred hero and three identical cards. 'Unlock your potential'. Placeholder photos.", "what judges have seen a hundred times", sm=False),
        CARD("The fixes", "One accent colour you chose. Real content in your own words. Your own logo and screenshots. Plain layout with strong spacing. One idea per screen.", "what stands out", hl=True),
        kind="c2"),
        kicker="01 — The interface", lede="AI interface generators are fast and they all drift to the same look. Use them for the structure, then make it yours.", mins=5,
        notes=NOTES(say=["This is exactly what our own center decided about its website and slides. We picked one accent colour, wrote real copy, and put the grain on top.",
                         "An AI tool gets you a working screen in a minute. Spend your time on the part it cannot do: specific words, a real brand, restraint."],
                    do=["Show two screenshots, one generic generated page and one plain restrained one. Ask which they would trust."],
                    watch=["Do not turn this into a taste argument. The test is simple: could this page be for any product at all? If yes, it is generic."])),

    slide("A stack for each kind of _project_", B(
        TABLE(["Your project is", "Build with", "Deploy to"], [
            ["A page or small web tool", "HTML, CSS, JavaScript (AI helps)", "GitHub Pages"],
            ["A Python or AI demo", "Streamlit or Gradio", "Streamlit Community Cloud"],
            ["A web app with accounts and data", "Next.js and Supabase", "A host that supports it (check free-plan limits)"]]),
        CALLOUT("Pick the simplest row that fits your demo and your team's skills. Every extra piece costs hours you do not have at hour 14.", title="The rule")),
        kicker="01 — The interface", mins=8,
        notes=NOTES(say=["The first two rows you can finish in a hackathon. The third is what real products use, and it has more things that can go wrong.",
                         "For a team of beginners, a Streamlit demo that works beats a Next.js app that nearly does. Be honest about the row you are in."],
                    watch=["Do not promise that any one host's free plan works for a team. Free plans change and some limit team use. Check the current terms, and test with your real team repo before relying on it.",
                           "Our own site uses the third row, which is why we know how many things it has."])),

    section("02", "_Deploying_", "What it means, and two labs that end in a real URL.", notes=NOTES(say=["From here it is hands-on for about thirty minutes."])),

    slide("What deploying _means_", B(
        FLOW([("Your computer", "Where you built it"), ("GitHub", "Where the code lives"), ("The host", "Builds and runs it"), ("A live URL", "Anyone can open")], ["push", "connect", "build"], highlight=3),
        UL(["**Local** is your laptop. **Production** is the live one, built from `main`.", "Every time `main` changes, the host rebuilds and the URL updates.", "A deploy that fails leaves the old version running. Read the build log."]),
        CALLOUT("If `main` always works, the live site always works. That is the whole reason for the pull request rule.", title="Week 3, paid off")),
        kicker="02 — Deploying", mins=4,
        notes=NOTES(say=["Deploying is just a computer somewhere else running your code and giving it an address. The host watches your repo and rebuilds when it changes.",
                         "That is why the pull request rule matters: if main always works, the live site always works."],
                    do=["Draw the four boxes on the board and connect them. Say 'push' out loud on the first arrow."])),

    slide("Lab A: a page on _GitHub Pages_", COLS(
        STEPS(["Open your `hello-yourname` repo from Week 1", "**Settings**, then **Pages**", "Source: **Deploy from a branch**. Branch: **main**, folder: **/ (root)**. Save", "Wait about a minute. Open the link it shows", "Open it **on your phone**. Edit `index.html`, push, refresh"], cls="sm"),
        B(TERM(["# the address looks like this", "https://yourname.github.io/hello-yourname/"], label="your live URL", sm=True),
          CALLOUT("The repo must be public for this to work on a free account. Check there is an `index.html` at the top level.", kind="warn", title="If it 404s")), kind="split"),
        kicker="02 — Deploying", mins=10,
        notes=NOTES(say=["Five minutes of clicking and you have a real website. That is it. It is the same idea as every bigger host, minus the features.",
                         "The edit and refresh step is the point: change a word, push, and watch the live site change."],
                    do=["Do it on your own account on the projector first. Then let them go.",
                        "Walk around checking that Pages is enabled on the right repo and the branch is set to main."],
                    watch=["A page that says 404 right after enabling usually just needs another minute. If it persists, `index.html` is missing from the top folder or the repo is private."])),

    slide("Lab B: a Python app on _Streamlit_", COLS(
        STEPS(["Put `app.py` and a `requirements.txt` in a **public** repo of yours", "Go to **share.streamlit.io** and sign in with GitHub", "**Create app**: pick the repo, branch and file path `app.py`", "Deploy. The first build takes a few minutes", "Open the URL on your phone"], cls="sm"),
        B(CODE("streamlit\nrequests", label="requirements.txt, one package per line", sm=True),
          CALLOUT("If the build fails, the log names the missing package. Add it to `requirements.txt`, push, and it rebuilds.", title="The usual fix")), kind="split"),
        kicker="02 — Deploying", mins=15,
        notes=NOTES(say=["Same idea, for Python. The host reads `requirements.txt` to know what to install. A missing line is the number one reason a deploy fails.",
                         "This is the live version of last week's weather app. Everyone gets a `.streamlit.app` address."],
                    do=["Use a personal repo for this lab, not the org repo. Org repos may need the org owner to approve Streamlit's access, and that is a Week 6 question.",
                        "If the API is blocked for the host or school, switch the app to read `sample.json` so it still works."],
                    watch=["Build errors scare beginners. Read the log aloud with them: the last lines say what is missing.",
                           "Free plans have limits on how many apps and how long they sleep. Check the current Streamlit terms. Do not promise numbers from this slide."])),

    slide("Secrets, _online_", COLS(
        B(CODE("# paste into the app's Secrets box, never commit it\nMODEL_API_KEY = \"paste-your-key-here\"", label="Streamlit: app settings, Secrets", sm=True),
          CODE("import streamlit as st\n\nkey = st.secrets[\"MODEL_API_KEY\"]", label="reading it in the app", sm=True)),
        B(UL(["Locally: `.env`. Online: the host's **Secrets** or **Environment Variables** page", "The key never appears in your code or your repo", "In Next.js, anything named `NEXT_PUBLIC_...` is sent to the browser. **Never** put a secret in one"], cls="sm"),
          CALLOUT("If a secret is visible in the browser's developer tools, it is already public.", kind="bad", title="Test it")), kind="split"),
        kicker="02 — Deploying", mins=5,
        notes=NOTES(say=["Same rule as Week 2, now online. The host keeps the key in its own settings and gives it to your app when it runs.",
                         "The NEXT_PUBLIC point is the classic mistake: the name tells the framework to put the value in the page. A secret there is a public secret."],
                    watch=["Do not let anyone paste a real key into the demo. Make one up."])),

    slide("When the URL is _wrong_", TABLE(["What you see", "Look here"], [
        ["Build failed", "The build log. Last lines say which package or file is missing"],
        ["Works locally, breaks online", "A file name with different capitals. Online systems are case-sensitive"],
        ["Page loads, then errors", "A missing secret or environment variable"],
        ["Old version still showing", "Did the push reach `main`? Did the build finish?"],
        ["Very slow the first time", "Free apps sleep. Open it once before you demo"]]),
        kicker="02 — Deploying", mins=4,
        notes=NOTES(say=["These five show up again and again, so check them first. The case-sensitivity one catches people who build on Windows or Mac, where file names are usually not case-sensitive.",
                         "The last one is a demo killer: a sleeping app takes a long time to wake. Open it a few minutes before you present."])),

    slide("Preview links on every _PR_", B(
        UL(["Some hosts build a **temporary live copy of each pull request**, so a reviewer can click instead of running it.", "That turns review from 'read the code' into 'use the thing'.", "Check whether your host does this on a free plan and for a team repo, **before** you rely on it."]),
        CALLOUT("No preview links? A reviewer runs the branch on their laptop. Slower, but the rule is the same: someone uses it before it merges.")),
        kicker="02 — Deploying", mins=3,
        notes=NOTES(say=["Preview links are one of the best features of modern hosting, and one of the ones free plans restrict for teams. Find out what your host does.",
                         "Whatever you have, keep the rule: nothing merges until someone has used it."],
                    watch=["Do not demo a feature you have not tested with a team repo and two people committing. That is exactly where free plans surprise you."])),

    slide("Test like a _judge_", B(CHECK([
        "Open the live URL in a **private window**, signed out",
        "Open it on a **phone, on mobile data**, not school Wi-Fi",
        "Ask a teammate who has never seen it to use it for 30 seconds",
        "Reload it. Click the main button twice. Try an empty input",
        "Come back tomorrow and open it again. Free apps can go to sleep when nobody visits"], "w5-judge"),
        CALLOUT("The Platform Captain runs this before every demo. Everyone can run it, and everyone should.", title="Not just one role's job")),
        kicker="02 — Deploying", mins=3,
        notes=NOTES(say=["This is the checklist the Platform Captain runs before every demo. Everyone can run it.",
                         "Mobile data matters. School Wi-Fi hides problems that a judge's network will show."],
                    do=["Everyone runs it on their own Pages URL, right now, in three minutes."])),

    task_slide("Week 5 _tasks_", "Wed, Dec 30", [
        ("Your `hello-yourname` page live on GitHub Pages", "Post the URL. It must open on a phone."),
        ("Your Streamlit app live", "Post the `.streamlit.app` URL and add it to the repo's README."),
        ("A wireframe of three screens for an idea you might build", "Photo or Figma link. Mark the four states of the main screen."),
        ("Critique two apps in ten seconds each", "Screenshot each. Three notes: what is it, what do I do, what would you change."),
        ("Platform Captain candidates: test your team's deploy path", "Can your team repo deploy with two different people committing? Write down exactly what broke.")], "w5-tasks", mins=4,
        evaluates="interface sense, deploying, follow-through",
        notes=NOTES(say=["The last task matters most for the real event. We are going to find out in the take-home sprint whether your team can deploy together. I want you to find the problems now, not on January 20.",
                         "Volunteers for Platform Captain candidate: it is a role you try, not a role you are given."],
                    do=["Say it clearly: tell me which of you wants to try the Platform Captain job for the deploy test."])),

    slide("Next: the take-home _sprint_", B(
        UL(["Dec 31 is a public holiday, so there is no meeting. The sprint is yours to do at home.", "Your team builds and deploys one tiny product in a single three-hour session. The brief is in the next deck.", "Due Wednesday Jan 6: a live URL, a repo with a README, a 60-second demo video, and a short retro."]),
        CALLOUT("Everything you learned in five weeks gets used once, in order. It is a rehearsal for January 20.")),
        kicker="Next", mins=3,
        notes=NOTES(say=["Walk them through the sprint deck on the screen if you have time. The brief and the rules are in it.",
                         "Tell them the sprint is not graded for how good the product is. It is graded for whether the team shipped, together, in time."],
                    do=["Send the sprint deck link to the group today, so absent members have it."])),
)
