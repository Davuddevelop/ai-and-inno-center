// Every string a visitor reads lives here. Edit this file with the real
// details (school name, program names, leadership, founding date) — nothing
// below should be treated as final copy.

export const site = {
  orgName: "AI & Innovation Center",
  schoolName: "Baku European Lyceum",
  location: "Baku, Azerbaijan",
  eyebrow: "FIRST OF ITS KIND — BAKU",

  nav: [
    { label: "Manifesto", href: "#manifesto" },
    { label: "Programs", href: "#programs" },
    { label: "Gazette", href: "#gazette" },
  ],

  hero: {
    headline: "The first AI center built by high schoolers, for high schoolers.",
    sub: "We're a student-run center inside Baku European Lyceum, teaching, building, and shipping real AI projects — before anyone told us we were old enough to.",
    primaryCta: { label: "Apply to Join", href: "/apply" },
    secondaryCta: { label: "Read the Manifesto", href: "#manifesto" },
  },

  manifesto: {
    kicker: "01 — WHY WE EXIST",
    statement:
      "Azerbaijani high schools teach students about AI. We wanted a place where students build it.",
    body: "We started this center because the gap between \"learning about AI\" and \"shipping something with it\" was too wide, and nobody was closing it for people our age. So we built the room ourselves — meetings, mentors, hardware, deadlines — and put it under our own school's roof.",
  },

  programs: {
    kicker: "02 — WHAT WE ACTUALLY DO",
    title: "Four things, done properly.",
    items: [
      {
        number: "01",
        title: "Workshops",
        description:
          "Weekly sessions on the tools and math that actually matter — from prompting fundamentals to the first real neural network you'll train yourself.",
      },
      {
        number: "02",
        title: "Build Sprints",
        description:
          "Small teams, a real deadline, a real problem. Members ship a working project every cycle, not a slide deck.",
      },
      {
        number: "03",
        title: "Competitions",
        description:
          "We enter our members into national and international AI competitions and hackathons, and prepare them to actually place.",
      },
      {
        number: "04",
        title: "Mentorship",
        description:
          "Senior members and outside practitioners review your work, your code, and your next step — not just your attendance.",
      },
    ],
  },

  gazette: {
    kicker: "03 — THE GAZETTE",
    title: "Recent wins from the floor.",
    viewAllHref: "/gazette",
    // Placeholder posts — replace with real entries once the Gazette composer ships.
    posts: [
      {
        tag: "Competition",
        title: "First placement at a national robotics & AI challenge",
        excerpt: "A three-person team from our build sprint track placed in their first outside competition.",
        date: "TBD",
      },
      {
        tag: "Build Sprint",
        title: "Member-built attendance tracker now used internally",
        excerpt: "What started as a sprint project is now the tool the center runs on.",
        date: "TBD",
      },
      {
        tag: "Workshop",
        title: "First neural network, trained from scratch, in one sitting",
        excerpt: "Twelve members went from theory to a working classifier in a single workshop.",
        date: "TBD",
      },
    ],
  },

  leadership: {
    kicker: "04 — LEADERSHIP",
    title: "Run by the people doing the work.",
    people: [
      {
        role: "President & Co-Founder",
        name: "Davud Ali",
        image: "/founders/davud-ali.jpg",
      },
      {
        role: "Vice President & Co-Founder",
        name: "Sevinj İsrafilova",
        image: "/founders/sevinj-israfilova.png",
      },
      { role: "Vice President & Co-Founder", name: "Tofiq Taghisadeh" },
    ] as { role: string; name: string; image?: string }[],
  },

  join: {
    title: "If you'd rather build than just learn about it —",
    cta: { label: "Apply to Join", href: "/apply" },
  },

  footer: {
    tagline: "Ai, Innovation, Education.",
    email: "TODO@example.com",
    socials: [
      // { label: "Instagram", href: "https://instagram.com/..." },
    ],
  },
};
