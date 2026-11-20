"""Week 4 -- Thu Dec 17: AI tools, and Python as glue."""
from lib import *
from config import ORG

DECK = Deck("w4", 4, "2026-12-17", "Thu, Dec 17", "AI as a teammate")

DECK.add(
    cover("AI tools and a first taste of Python", "AI as a _teammate_",
          "How to build with AI assistants without handing them the steering wheel, and how to put AI inside a product.", 4, "Thu, Dec 17", "2027-01-20",
          notes=NOTES(say=["This is the week most people came for. It works because you now have a safe place to put AI-written code: a pull request.",
                           "Two halves today: working with AI tools, then Python, just enough to connect a product to a model."],
                      do=["Before class: run `weather.py` from `docs/curriculum/code/week4` once on the school network. If the network blocks it, plan to use the offline version.",
                          "Bring the answer from the school about which AI tools are approved, or say honestly that you are still waiting."],
                      watch=["Do not let this turn into a tool demo. The skill is the workflow. The tool will change by February."]), mins=1),

    quiz_slide("What does 'Squash and merge' do?", ["Deletes the branch's history", "Turns the whole pull request into one commit on main", "Merges without a review", "Rebases your commits onto main"], 1,
               "One tidy commit per pull request. Main stays readable, and the PR title becomes the commit message.", mins=2, kicker="Last week",
               notes=NOTES(say=["If people hesitate, ask which merge option they used in the sprint."])),

    quiz_slide("Two people edited the same line. Git stops and shows `<<<<<<<` markers. What is that?", ["A bug in Git", "A question Git needs you to answer", "Proof someone broke the rules", "Something `--force` fixes"], 1,
               "Git cannot know whose version is right. You decide, remove the markers, test, and commit.", mins=2, kicker="Last week",
               notes=NOTES(say=["The word we want is 'question', not 'error'."])),

    slide("What you can do by the _end_", B(
        COLS(UL(["**Run** the ask, run, read, change, commit loop with an AI assistant", "**Write** a spec and a prompt that gets usable code", "**Check** AI-written code before it reaches main", "**Call** an API from Python and show the result on a web page"]),
             TABLE(["Min", "Today"], [["8", "Recap"], ["27", "Working with AI tools"], ["14", "AI inside a product"], ["33", "Python, an API call, a web page"], ["6", "Tasks"]]), kind="split")),
        kicker="Today", mins=3,
        notes=NOTES(say=["The last block is a lab. By the end of class you will have a web page that shows live data, and you will have written fewer than twenty lines yourself."])),

    section("01", "Working with _AI_", "A workflow, a way of writing prompts, and the checks that keep you out of trouble.", notes=NOTES(say=["The workflow matters more than the tool. Say that early."])),

    slide("The AI _toolbox_", B(
        CARDS([("Think", "Research, brainstorming, explaining code. ChatGPT, Gemini, Claude.", "category 1"), ("Build", "Edits your files for you. Copilot, Cursor, Claude Code.", "category 2", True),
               ("Interface", "Describe a screen, get a working one. v0, Lovable, Bolt.", "category 3"), ("Make", "Images, voice and video for the demo and the pitch.", "category 4"),
               ("Connect", "A model called from your own code, through an API.", "category 5"), ("Automate", "Link apps without code. n8n, Zapier, Make.", "category 6")], kind="c3", sm=True),
        CALLOUT("Names change fast. Learn the category and the workflow, and check each tool's age rules.", kind="warn", title="Examples, not a shopping list")),
        kicker="01 — Working with AI", mins=4,
        notes=NOTES(say=["Six categories. For the hackathon you will mostly use Think, Build and Interface, and maybe Connect.",
                         "The names are examples from late 2026. If one is gone by January, the category is still there and the workflow is the same.",
                         "Remember the access check: some of these are 18 and over, some need a parent's permission. Only use what you are allowed to use."],
                    watch=["Some will already have a favourite and defend it. Fine. The point is the loop, which works with any of them."])),

    slide("The build _loop_", B(
        FLOW([("Spec", "What done looks like"), ("Generate", "Ask the AI"), ("Run", "Does it actually work?"), ("Read", "Do you understand it?"), ("Commit", "In a branch, then a PR")],
             ["prompt", "paste", "check", "branch"], highlight=3, tight=True),
        CALLOUT("Skipping Run or Read is how broken code, or someone else's secret, reaches main. The loop is fast because you do all five every time.", title="Do not skip the middle")),
        kicker="01 — Working with AI", mins=4,
        notes=NOTES(say=["This is the same loop from Week 1, with one step added: write down what done looks like before you ask.",
                         "Read is highlighted. It is the step people skip, and it is the one that makes you a developer instead of a passenger."],
                    do=["Walk through one example live: ask for a function, run it, read it aloud, change one thing, commit."])),

    slide("Prompts that _work_", COLS(
        B(TERM(["# weak", "make a login page"], label="what most people type", sm=True),
          CALLOUT("Five parts: **context**, **task**, **constraints**, **format**, **check**. You do not need all five every time, but you need a task and a format.")),
        CODE("I'm building a single-page web app in plain HTML, CSS\nand JavaScript, no libraries.\n\nAdd a login form: email, password, a Sign in button.\nValidate in the browser. Show a friendly error message.\n\nKeep it under 80 lines.\nAfter the code, list any assumptions you made.", label="strong", sm=True),
        kind="c2"),
        kicker="01 — Working with AI", mins=5,
        notes=NOTES(say=["The weak prompt gets you a generic page in a framework you did not choose. The strong one tells it what stack, what to build, how big, and asks it to expose its guesses.",
                         "'List any assumptions' is the cheapest trick in the whole lesson. The AI will tell you what it guessed, and the guesses are where the bugs are."],
                    do=["Have everyone rewrite 'make a login page' as a strong prompt in two minutes, and read one aloud."],
                    watch=["Do not let the prompt become a long essay. Short and specific beats long and vague."])),

    slide("Write the spec _first_", COLS(
        CODE("Feature: send button on the chat page\n\nDone when:\n1. Typing a message and pressing Send adds it to the list\n2. An empty message does nothing\n3. The input clears after sending\n4. It works on a phone-sized screen", label="five lines, before you prompt", sm=True),
        B(UL(["The spec is your **test**. When the AI says it is done, you check the four lines.", "It also stops you asking for the wrong thing."], cls="sm"),
          CALLOUT("Paste the spec into the prompt. Ask the AI to make each line true.")), kind="split"),
        kicker="01 — Working with AI", mins=4,
        notes=NOTES(say=["Most beginners prompt, get something, and then discover what they actually wanted. Writing four lines first is faster overall.",
                         "These four lines will become the PR description's 'How to test' section. You are writing the PR before the code."],
                    do=["Ask the room for a feature, write the spec on the board together, then turn it into a prompt."])),

    slide("Never trust, always _check_", B(
        COLS(STEPS(["Does it **run**?", "Do I **understand** each part?", "What happens with **empty or wrong** input?", "Did it add a **package or key** I did not ask for?", "Does it match the **spec**?"], cls="sm"),
             B(TABLE(["AI often", "So you"], [["Invents functions or packages", "Check the official docs"], ["Uses outdated syntax", "Run it, read the error"], ["Sounds sure and is wrong", "Test with a real case"], ["Builds far too much", "Ask for the smallest version"]])), kind="split")),
        kicker="01 — Working with AI", mins=5,
        notes=NOTES(say=["These five questions are the review you do on your own code before you open the PR. A reviewer will ask the same five.",
                         "The invented-package problem is real: an AI will import a library that does not exist, or one that exists and does something different. Search for the package before you install it."],
                    do=["Show one real failure. Ask an assistant for something slightly obscure and see if it invents a function. Even a small failure teaches more than a rule."],
                    watch=["The AI is not lying. It predicts plausible code. Plausible is not the same as correct."])),

    slide("Rules for AI on our _team_", UL([
        "**Understand every line you commit.** In the demo room someone will ask how it works. 'The AI wrote it' loses.",
        "**AI-written code goes through a pull request**, like everyone's.",
        "**Secrets never go into a prompt.** Not keys, not passwords, not other people's personal details.",
        "**Say so in the PR** when AI wrote most of it, so the reviewer reads it harder.",
        "**Check the event's own rules** on AI use. Some hackathons limit it. Read them."]),
        kicker="01 — Working with AI", mins=3,
        notes=NOTES(say=["These are not restrictions to slow you down. They are what lets a team use AI heavily without the project turning into code nobody understands.",
                         "The last one matters. Some events allow AI, some limit it, some require you to say how you used it. Find out in the first week."])),

    section("02", "AI _inside_ your product", "How a product calls a model, three patterns that demo well, and the risks judges notice.", notes=NOTES(say=["Different from using AI to build. Now the AI is part of what you are building."])),

    slide("How a product uses a _model_", B(
        FLOW([("User", "Types or uploads something"), ("Your app", "Builds the prompt, adds data"), ("Model API", "Returns text or JSON"), ("Your app", "Checks it, formats it"), ("User", "Sees the answer")],
             ["input", "request", "response", "show"], highlight=1, tight=True),
        TABLE(["Term", "Plainly"], [["Prompt", "The text you send the model"], ["System prompt", "Standing instructions: role, tone, limits"], ["Structured output", "Ask for JSON so your code can use the answer"], ["Evaluation", "Test it on ten real examples, not one lucky one"]])),
        kicker="02 — AI inside your product", mins=5,
        notes=NOTES(say=["Your app is the middle. The model is a service it calls. The value you add is what goes in (data, instructions) and what you do with what comes out.",
                         "Structured output is the practical trick: ask for JSON, then your code can show it as a card, a chart, a button, instead of a paragraph."],
                    watch=["Calling a model API usually needs a key, and key sites can have age rules stricter than the chat apps. We practise today with an API that needs no key."])),

    slide("Three patterns that win _demos_", CARDS([
        ("Answer from your data", "The user asks, you look up the relevant text, you give it to the model, it answers from that. Often called RAG.", "pattern 1", True),
        ("Turn mess into structure", "Messy text, a photo or a voice note becomes clean fields: a form, a table, a schedule.", "pattern 2"),
        ("Draft, then edit", "The model writes a first version, the user fixes it. Honest about being a draft.", "pattern 3")], kind="c3", lg=False),
        kicker="02 — AI inside your product", lede="AI is a feature, not the product. Name the human problem first, then ask where a model genuinely helps.", mins=5,
        notes=NOTES(say=["These three work because they are easy to demo in a minute and easy to explain. The best hackathon AI features are often the second one.",
                         "The question to ask a team: if I removed the AI, would the product still exist? If yes, the AI is a feature. If no, ask whether that is good or a gimmick."],
                    watch=["Do not push 'agents' on beginners. They are hard to make reliable in 24 hours and hard to demo safely."])),

    slide("What judges notice about _AI_", TABLE(["Risk", "What a good team does"], [
        ["Wrong answers shown as facts", "Show sources, or say it may be wrong"],
        ["Real personal data in the demo", "Use made-up data, and say so"],
        ["Bias in what it recommends", "Test a few different cases before you pitch"],
        ["Only one example works", "Try ten. Keep the table of results"],
        ["Depends on one fragile key or API", "Have a saved result ready if it fails"]]),
        kicker="02 — AI inside your product", mins=3,
        notes=NOTES(say=["Judges at AI hackathons ask about these. A team that raises them first looks careful. A team that gets asked and has no answer looks like it did not think.",
                         "The last one is the practical one: keep a recorded or saved answer so a dead API does not kill your demo."])),

    section("03", "Python as _glue_", "Not to master it. To read it, run it, change it, and connect things.", notes=NOTES(say=["Twenty minutes of Python to read. Then the lab."])),

    slide("Python in _twenty minutes_", COLS(
        CODE("cities = [\"Baku\", \"Ganja\", \"Sumqayıt\"]   # a list\n\ndef greet(name):                    # a function\n    return \"Hello, \" + name\n\nfor city in cities:                 # a loop\n    print(greet(city))", label="hello.py", sm=True),
        B(TERM(["$ python hello.py", "Hello, Baku", "Hello, Ganja", "Hello, Sumqayıt"], label="run it", sm=True),
          UL(["Indentation is the structure. Four spaces matter.", "An error's **last line** says what, the line number says where.", "`pip install name` adds a package. Do it inside a project, not at random."], cls="sm")), kind="split"),
        kicker="03 — Python as glue", mins=6,
        notes=NOTES(say=["This is everything you need to read the code an AI gives you: a list, a function, a loop, and how to run a file.",
                         "When Python errors it prints a traceback. Read from the bottom. The last line is the error, the line above it is where."],
                    do=["Have everyone type the file by hand, run it, then change a city. Typing it once is worth ten reads."],
                    watch=["On Windows the command may be `py hello.py`. Tell them it is the same program."])),

    slide("Call an API from _Python_", COLS(
        CODE("import requests\n\nurl = \"https://api.open-meteo.com/v1/forecast\"\nparams = {\"latitude\": 40.41, \"longitude\": 49.87,\n          \"current\": \"temperature_2m\"}\ndata = requests.get(url, params=params, timeout=10).json()\nprint(\"Baku right now:\", data[\"current\"][\"temperature_2m\"], \"C\")", label="weather.py", sm=True),
        B(STEPS(["`pip install requests` (Windows: `py -m pip install requests`)", "Save as `weather.py`, run `python weather.py`", "Change the coordinates. Different city?", "Ask your AI to explain every line. Check it against the docs"], cls="sm"),
          CALLOUT("Network blocks it? Use `weather_offline.py` with `sample.json`, run from the folder that holds both.", kind="warn", title="Fallback")), kind="split"),
        kicker="03 — Python as glue", mins=18,
        notes=NOTES(say=["An API is a web address that answers with data instead of a page. This one is free and needs no key, which is why we use it today.",
                         "`.json()` turns the answer into a Python dictionary. `data[\"current\"][\"temperature_2m\"]` is reaching two levels in to get one number."],
                    do=["Walk the room. This is where `pip` fails on half the machines: say 'reopen the terminal' before anything else.",
                        "If the school network blocks the host, the offline files are in the repo, under `docs/curriculum/code/week4`. Put them on the board or in the group chat."],
                    watch=["The top error: running the file from the wrong folder, so Python cannot find `sample.json`. Teach `cd` if you have to.",
                           "Do not hand out the finished file. They have the slide. The AI-explains-every-line step is the learning."])),

    slide("The same data, as a _web page_", COLS(
        CODE("import requests\nimport streamlit as st\n\nCITIES = {\"Baku\": (40.41, 49.87), \"Ganja\": (40.68, 46.36)}\n\nst.title(\"Weather\")\ncity = st.selectbox(\"City\", list(CITIES))\nlat, lon = CITIES[city]\nurl = \"https://api.open-meteo.com/v1/forecast\"\nparams = {\"latitude\": lat, \"longitude\": lon,\n          \"current\": \"temperature_2m\"}\ndata = requests.get(url, params=params, timeout=10).json()\nst.metric(\"Temperature\", f'{data[\"current\"][\"temperature_2m\"]} C')", label="app.py", sm=True, xs=True),
        B(TERM(["$ pip install streamlit", "$ streamlit run app.py"], label="then open the link it prints", sm=True),
          CALLOUT("Streamlit turns a Python file into a web page, with widgets. It is the fastest way to put an AI or data idea in front of a judge.", title="Why this matters")), kind="split"),
        kicker="03 — Python as glue", mins=10,
        notes=NOTES(say=["This is the first time they see their own code as a website. Give them a moment.",
                         "Streamlit reruns the whole file every time you touch a widget. That is why it is so simple: no page logic to write."],
                    do=["Everyone runs it, changes the city list, adds a third city."],
                    watch=["`pip install streamlit` is large and slow on poor Wi-Fi. Start it early. If someone cannot install it, pair them up, do not stall the room."])),

    slide("Where does the _key_ go?", COLS(
        B(CODE("# .env   (in .gitignore, never committed)\nMODEL_API_KEY=paste-your-key-here", label=".env", sm=True),
          CODE("import os\nfrom dotenv import load_dotenv\n\nload_dotenv()\nkey = os.environ[\"MODEL_API_KEY\"]", label="python", sm=True)),
        B(UL(["Keys live in `.env`, and `.env` is in `.gitignore` **before** the first commit", "`pip install python-dotenv` reads it", "Online, the same value goes in the host's environment settings. We do that in Week 5"], cls="sm"),
          CALLOUT("Today's API needs no key. The moment you use one that does, this is how it goes in.", title="Next time")), kind="split"),
        kicker="03 — Python as glue", mins=3,
        notes=NOTES(say=["Week 2's secrets slide, applied. It looks small. It is the difference between a safe project and a leaked key."],
                    watch=["Someone will paste a real key into the slide's example. Do not let it happen. Tell them to make one up."])),

    task_slide("Week 4 _tasks_", "Wed, Dec 23", [
        ("`weather.py` working, with a different city or API", f"Submit as a PR to `{ORG}/classwork`, in `week4/yourname/`."),
        ("The Streamlit page running on your computer", "Screenshot in your PR description."),
        ("An AI log: three things the AI got wrong or you had to fix", "One line each. What was wrong, how you noticed."),
        ("A five-line spec for a feature you could build for the hackathon", "Use the 'Done when' format. It does not have to be your final idea."),
        ("Review one classmate's PR", "Run their code. Leave one `question:` and one `nit:`.")], "w4-tasks", mins=4,
        evaluates="AI skill, logic, follow-through",
        notes=NOTES(say=["The AI log is the most important task. It proves you read the code. If your log says 'nothing went wrong', I will not believe you.",
                         "The spec for a hackathon feature is a rehearsal for Week 7. Do not overthink it."],
                    do=["Post the folder name exactly: `week4/yourname/`. Wrong folders waste your Friday."])),

    slide("Next week: _interfaces_ and deploying", B(
        UL(["What users see first: layout, flow, and why demos are won on the interface.", "Putting a project online with Vercel, and getting a preview link on every PR.", "Keys and environment variables, done properly.", "Bring `app.py` or any small project. We will deploy it."]),
        CALLOUT("We meet on Dec 24 unless the school says otherwise. Dec 31 is a public holiday, so that week is the take-home sprint.")),
        kicker="Next", mins=2,
        notes=NOTES(say=["Next week is the one that makes the project real: it stops living on your laptop."],
                    do=["Check whether the school is open on Dec 24 and tell them today. Remind them Dec 31 is the take-home sprint."])),
)
