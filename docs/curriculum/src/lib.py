"""Authoring helpers for the class decks.

Content files call these to describe slides; build.py turns the result into one
self-contained HTML file per deck. Inline markup available in any text field:

    **bold**    `code`    ==accent==    [[Ctrl]] (keycap)    _italic_ (titles only)
"""
import html
import re

# Glyphs the bundled font subsets do not carry. Falling back to a system font
# for one arrow in a line of Geist looks like a mistake, so the build refuses them.
FORBIDDEN = {"→": "->", "←": "<-", "✓": "check", "✔": "check", "✅": "emoji",
             "❌": "emoji", "✨": "emoji", "\U0001F680": "emoji"}


def esc(s):
    return html.escape(str(s), quote=False)


def fmt(s):
    s = esc(s)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"==([^=]+)==", r'<span class="acc">\1</span>', s)
    s = re.sub(r"\[\[([^\]]+)\]\]", r"<kbd>\1</kbd>", s)
    return s


def ftitle(s):
    s = esc(s)
    return re.sub(r"_([^_]+)_", r"<em>\1</em>", s)


class Raw(str):
    """Marks a string as already-built HTML."""


def raw(s):
    return Raw(s)


# ------------------------------------------------------------- components
def P(text, muted=False, cls=""):
    return Raw(f'<p class="t{" m" if muted else ""} {cls}">{fmt(text)}</p>')


def UL(items, cls=""):
    out = []
    for it in items:
        if isinstance(it, (tuple, list)):
            out.append(f"<li>{fmt(it[0])}<small>{fmt(it[1])}</small></li>")
        else:
            out.append(f"<li>{fmt(it)}</li>")
    return Raw(f'<ul class="list {cls}">{"".join(out)}</ul>')


def STEPS(items, cls=""):
    out = []
    for it in items:
        if isinstance(it, (tuple, list)):
            out.append(f"<li><div>{fmt(it[0])}<small>{fmt(it[1])}</small></div></li>")
        else:
            out.append(f"<li><div>{fmt(it)}</div></li>")
    return Raw(f'<ol class="steps {cls}">{"".join(out)}</ol>')


def COLS(*cols, kind="c2", top=False):
    body = "".join(f'<div class="col">{c}</div>' for c in cols)
    return Raw(f'<div class="cols {kind}{" top" if top else ""}">{body}</div>')


def CARD(title, text="", tag=None, hl=False, sm=False):
    cls = "card" + (" hl" if hl else "") + (" sm" if sm else "")
    t = f'<div class="ct">{esc(tag)}</div>' if tag else ""
    p = f"<p>{fmt(text)}</p>" if text else ""
    return Raw(f'<div class="{cls}">{t}<h3>{fmt(title)}</h3>{p}</div>')


def CARDS(items, kind="c3", sm=False):
    """items: (title, text[, tag[, hl]])."""
    cards = []
    for it in items:
        title, text = it[0], it[1]
        tag = it[2] if len(it) > 2 else None
        hl = it[3] if len(it) > 3 else False
        cards.append(CARD(title, text, tag, hl, sm))
    return Raw(f'<div class="cols cards {kind}">{"".join(cards)}</div>')


def _term_lines(lines):
    out, copy = [], []
    for ln in lines:
        if ln.startswith("$ "):
            out.append(f'<span class="p">$ </span>{esc(ln[2:])}')
            copy.append(ln[2:])
        elif ln.startswith("# "):
            out.append(f'<span class="c">{esc(ln)}</span>')
        elif ln == "":
            out.append("")
        else:
            out.append(f'<span class="o">{esc(ln)}</span>')
    return "\n".join(out), "\n".join(copy)


def TERM(lines, label="terminal", sm=False):
    body, copy = _term_lines(lines)
    btn = f'<button class="copy" data-copy="{html.escape(copy, quote=True)}">copy</button>' if copy else ""
    return Raw(f'<div class="term{" sm" if sm else ""}"><div class="th"><span>{esc(label)}</span>{btn}</div><pre>{body}</pre></div>')


def CODE(text, label="code", sm=False):
    lines = text.strip("\n").split("\n")
    body = "\n".join(esc(l) for l in lines)
    btn = f'<button class="copy" data-copy="{html.escape(text.strip(chr(10)), quote=True)}">copy</button>'
    return Raw(f'<div class="term{" sm" if sm else ""}"><div class="th"><span>{esc(label)}</span>{btn}</div><pre>{body}</pre></div>')


def CALLOUT(text, kind="", title=None):
    t = f'<span class="ct">{esc(title)}</span>' if title else ""
    return Raw(f'<div class="callout {kind}">{t}{fmt(text)}</div>')


def TABLE(headers, rows):
    th = "".join(f"<th>{esc(h)}</th>" for h in headers)
    trs = "".join("<tr>" + "".join(f"<td>{fmt(c)}</td>" for c in r) + "</tr>" for r in rows)
    return Raw(f'<table class="tbl"><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>')


def BIG(num, label):
    return Raw(f'<div><div class="big">{esc(num)}</div><div class="bigl">{esc(label)}</div></div>')


def TAGS(items, accent=True):
    return Raw("".join(f'<span class="tag{" a" if accent else ""}">{esc(i)}</span> ' for i in items))


def STEP(inner):
    """Wrap a component so it appears on the next click."""
    return Raw(f'<div class="step">{inner}</div>')


def CHECK(items, key, sm=False):
    lis = []
    for it in items:
        if isinstance(it, (tuple, list)):
            lis.append(f'<li><label><input type="checkbox"><span>{fmt(it[0])}<small>{fmt(it[1])}</small></span></label></li>')
        else:
            lis.append(f'<li><label><input type="checkbox"><span>{fmt(it)}</span></label></li>')
    return Raw(f'<ul class="check{" sm" if sm else ""}" data-key="{key}">{"".join(lis)}</ul>')


def WIDGET(name):
    return Raw(f'<div data-widget="{name}"></div>')


def QUIZ(question, options, correct, why):
    opts = "".join(f'<button class="opt"><i>{chr(65 + k)}</i><span>{fmt(o)}</span></button>' for k, o in enumerate(options))
    return Raw(f'<div class="quiz" data-correct="{correct}"><div class="q">{fmt(question)}</div>{opts}<div class="why">{fmt(why)}</div></div>')


def NOTES(say=(), do=(), watch=()):
    def block(title, items):
        if not items:
            return ""
        return f"<h4>{title}</h4><ul>" + "".join(f"<li>{fmt(i)}</li>" for i in items) + "</ul>"
    return block("Say", say) + block("Do", do) + block("Watch for", watch)


# ------------------------------------------------------------------ slides
class Slide:
    def __init__(self, html_, title, section, mins, notes, kind):
        self.html, self.title, self.section, self.mins, self.notes, self.kind = html_, title, section, mins, notes, kind

    def render(self):
        notes = f'<aside class="notes">{self.notes}</aside>' if self.notes else ""
        return (f'<section class="slide {self.kind}" data-title="{html.escape(self.title, quote=True)}" '
                f'data-section="{html.escape(self.section, quote=True)}" data-mins="{self.mins}" data-kind="{self.kind}">'
                f'{self.html}{notes}</section>')


def slide(title, body, kicker="", lede="", mins=3, notes="", section="", kind="std"):
    k = f'<div class="kicker">{esc(kicker)}</div>' if kicker else ""
    l = f'<p class="lede">{fmt(lede)}</p>' if lede else ""
    inner = f'<div class="inner">{k}<h2 class="title">{ftitle(title)}</h2>{l}<div class="body">{body}</div></div>'
    return Slide(inner, re.sub(r"_", "", title), section or kicker, mins, notes, kind)


def cover(kicker, title, sub, week, date_label, deadline, mark="logo-mark.png", notes="", mins=1):
    inner = (f'<div class="glow"></div><img class="mark" src="{mark}" alt=""><div class="inner">'
             f'<div class="kicker">{esc(kicker)}</div><h1>{ftitle(title)}</h1><p class="sub">{fmt(sub)}</p>'
             f'<div class="meta"><span class="tag a">Week {week:02d}</span><span class="tag">{esc(date_label)}</span>'
             f'<div class="count"><div class="n" data-countdown="{deadline}">0</div><div class="l">days to Jan 20</div></div></div></div>')
    return Slide(inner, re.sub(r"_", "", title), "Cover", mins, notes, "cover")


def section(num, title, sub="", mins=0, notes=""):
    inner = f'<div class="inner"><div class="num">{esc(num)}</div><h2>{ftitle(title)}</h2>{"<p>" + fmt(sub) + "</p>" if sub else ""}</div>'
    return Slide(inner, re.sub(r"_", "", title), f"Part {num}", mins, notes, "sect")


def quiz_slide(question, options, correct, why, mins=2, notes="", kicker="Recap"):
    body = QUIZ(question, options, correct, why)
    inner = f'<div class="inner"><div class="kicker">{esc(kicker)} — quick check</div><div class="body" style="margin-top:34px">{body}</div></div>'
    return Slide(inner, "Quick check: " + re.sub(r"[`*=\[\]]", "", question)[:60], kicker, mins, notes, "std")


def task_slide(title, due, items, key, lede="", mins=4, notes="", evaluates=""):
    head = (f'<div class="task-head"><span class="due">Due {esc(due)}</span>'
            f'{"<span class=eval>Shows: " + esc(evaluates) + "</span>" if evaluates else ""}</div>')
    body = f'{head}{CHECK(items, key)}'
    return slide(title, body, kicker="Your tasks", lede=lede, mins=mins, notes=notes, section="Tasks")


class Deck:
    def __init__(self, id_, week, date, date_label, title, deadline="2027-01-20"):
        self.id, self.week, self.date, self.date_label, self.title, self.deadline = id_, week, date, date_label, title, deadline
        self.slides = []

    def add(self, *slides):
        self.slides.extend(slides)
        return self


def B(*parts):
    """Concatenate components into one body."""
    return Raw("".join(str(p) for p in parts))
