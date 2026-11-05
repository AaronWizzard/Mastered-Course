// Framework content and the made-up demo employee.
// The framework and job description are Wizzard's real wording, approved to show publicly.
// The employee, their manager and everything about them are made up.

const LEVELS = ["Junior", "Mid-Level", "Senior", "Director"];

const BANDS = [
  { key: "low",  name: "Improving", from: 1, to: 3 },
  { key: "mid",  name: "Expected",  from: 4, to: 6 },
  { key: "high", name: "Advanced",  from: 7, to: 9 }
];

const SKILLS = [
  {
    id: "sk1", name: "Stakeholder engagement",
    def: "Builds trusted relationships with everyone the work touches, including clients, KOLs, colleagues and partners. Understands what they need and helps them achieve it.",
    d: [
      "Builds good working relationships across Wizzard. Listens carefully, asks questions to understand what is needed and keeps people informed.",
      "Is a trusted day-to-day contact for clients and colleagues. Understands their objectives and leads discussions in their own area of expertise.",
      "Is a trusted adviser to clients and senior stakeholders. Brings ideas and constructive challenge, and manages expectations with confidence.",
      "Holds the most senior relationships and shapes clients' thinking. Is the person clients and colleagues turn to first."
    ]
  },
  {
    id: "sk2", name: "Delivery and ownership",
    def: "Owns their work from brief to completion. Manages time, priorities and resources, flags risks early and solves problems with others.",
    d: [
      "Delivers allocated work on time and to brief. Manages their own workload, records time accurately and flags problems early.",
      "Plans and delivers several projects at once. Anticipates risks, proposes solutions and adapts to changing priorities.",
      "Leads delivery across accounts or teams. Sets plans and priorities for others and keeps work on track, on time and on budget.",
      "Sets how work is resourced and delivered across their area. Resolves the hardest problems and improves ways of working agency-wide."
    ]
  },
  {
    id: "sk3", name: "Quality and craft",
    def: "Produces work of a consistently high standard in their own discipline. What good looks like comes from the person's role and JD; the standard of care and accuracy is the same for everyone.",
    d: [
      "Produces accurate, careful work and checks it before sharing. Takes feedback on board and improves with each round.",
      "Produces high-quality work with little correction. Reviews others' work and gives clear, constructive feedback.",
      "Is recognised for the quality of their craft. Sets the standard for others, raises the quality of the team's output and mentors others in the craft.",
      "Defines what excellent looks like in their discipline at Wizzard. Is seen as an expert inside and outside the agency."
    ]
  },
  {
    id: "sk4", name: "Contribution to Wizzard's growth",
    def: "Strengthens existing relationships and spots opportunities to add value. Acts as an ambassador for Wizzard and its values, inside and outside the agency.",
    d: [
      "Represents Wizzard well and shares ideas that could add value to client work. Supports pitches and proposals when asked.",
      "Spots opportunities within their accounts and raises them. Contributes actively to proposals and pitches.",
      "Turns opportunities into new work. Plays a leading part in pitches and represents Wizzard at client and industry events.",
      "Drives growth for their area of the business. Builds Wizzard's reputation and leads its most important pitches."
    ]
  }
];

const BEH_SCALE = [
  { v: 1, name: "Developing", desc: "Not seen consistently yet" },
  { v: 2, name: "Consistent", desc: "What we expect from everyone" },
  { v: 3, name: "Role model", desc: "Others learn from how they do this" }
];

const BEHAVIOURS = [
  { id: "bh1", name: "Curious and always learning", def: "Looks for new ways of doing things and keeps getting better.",
    looks: ["Asks questions rather than taking things at face value", "Seeks feedback and acts on it", "Tries something new and shares what they learn"] },
  { id: "bh2", name: "Collaborative", def: "Works well with others to get to the best result.",
    looks: ["Offers help without being asked", "Shares ideas and credit, and values different views", "Builds good relationships across teams"] },
  { id: "bh3", name: "Clear and honest", def: "Communicates openly, listens well and can be trusted.",
    looks: ["Explains things clearly in writing and in person", "Listens properly and checks understanding", "Speaks up respectfully and owns up to mistakes"] },
  { id: "bh4", name: "Positive and resilient", def: "Brings energy, and keeps going when things get difficult.",
    looks: ["Stays calm and constructive under pressure", "Treats setbacks as something to learn from", "Lifts the team's mood and momentum"] },
  { id: "bh5", name: "Brave with ideas", def: "Puts forward new ideas and isn't afraid to challenge.",
    looks: ["Suggests new ideas and better ways of working", "Challenges the brief or the status quo constructively", "Takes sensible risks and learns from the result"] },
  { id: "bh6", name: "Helps others grow", def: "Supports colleagues to learn and do their best work.",
    looks: ["Gives useful, kind and timely feedback", "Shares knowledge and helps when others are stuck", "Coaches or mentors others, whatever their level"] }
];

const ROLES = [
  { name: "Graduate Medical Writer", level: 0 },
  { name: "Associate Medical Writer", level: 0 },
  { name: "Medical Writer", level: 0 },
  { name: "Senior Medical Writer", level: 1 },
  { name: "Principal Medical Writer", level: 2 },
  { name: "Scientific Lead", level: 2 },
  { name: "Director of Scientific Services", level: 3 }
];

const GOAL_STATUS = ["Not started", "In progress", "Achieved", "Carried over"];

const WIZZARD_GOAL = {
  year: 2027,
  title: "Make something new",
  text: "Every month in 2027, do at least one thing that's new: a new skill, tool, idea or way of working. Share what you learned with the team.",
  why: "New is at the heart of how Wizzard grows. It's our answer to a simple question: what have you done that's new this month?",
  measure: "At least one new thing recorded in the 1:1 Tracker each month, and shared with the team at least once a quarter."
};

const JOB_DESCRIPTION = {
  role: "Medical Writer",
  reportsTo: "Senior Medical Writer",
  objectives: [
    "Our Medical Writers are responsible for developing on-brief, accurate copy for Wizzard projects covering brand and scientific communications, mainly across medical affairs and promotional assets. These can range across a wide variety of media including, digital, print, internal, congress and event materials"
  ],
  responsibilities: [
    "Developing and writing engaging, accurate and fully referenced copy for a wide variety of therapy areas and client accounts",
    "Developing and writing copy for a wide variety of media including print and digital materials, internal communications, congress and event materials, as well supporting ad-hoc with medical editing as required",
    "Carrying out research, finding both background information and key clinical papers, and keeping the team up to date where necessary on therapy areas and products",
    "Finding insights around the disease, patient pathways and experiences and HCP practice to inform the pitch process as well as project development",
    "Attending client meetings and (on occasion) pitch presentations where needed, representing Scientific Services as the expert on the therapy area, patient group and product",
    "Supporting, and sometimes leading, scientific and medical discussions, both internally and with clients",
    "Ensuring all work allocated is executed on time to the schedule provided, and recording all hours worked accurately on CMap",
    "Collaboratively working with the Client Services and Creative teams to produce high-quality communications",
    "Actively responding to fluctuating business workloads, which may involve assisting with other team members’ workload as directed",
    "Developing and maintaining excellent relationships with all other departments",
    "Being a brand guardian, both for our company brand as well as for our clients",
    "Managing personal workload and schedules"
  ],
  kse: [
    "Evidence of previous healthcare/medical communications agency experience",
    "BSc in a medical or scientific subject; MSc or PhD preferred but not essential",
    "Excellent attention to detail and ability to work simultaneously on more than one project",
    "Ability to write accurately and creatively in a fast-paced environment",
    "Ability to meet reasonable timelines",
    "Adaptability and flexibility to changing priorities",
    "Ability to work as part of a team or solo",
    "Excellent verbal and written communication",
    "Ability to establish and maintain effective working relationships with co-workers, managers and clients",
    "PC and/or Mac literacy and experienced in Microsoft Office and Adobe Acrobat"
  ]
};

// ---- The made-up demo employee ----
const DEMO_PLAN = {
  profile: {
    name: "Penny Wright",
    firstName: "Penny",
    role: "Medical Writer",
    level: 0,
    manager: "Dee Adline",
    managerTitle: "Senior Medical Writer",
    startDate: "2024-03-04",
    year: 2027
  },
  skills: {
    sk1: { self: 5, mgr: 5, selfNote: "I've become the go-to writer for day-to-day questions on the respiratory account.", mgrNote: "Clients trust you. Next step: lead a content discussion from start to finish." },
    sk2: { self: 6, mgr: 5, selfNote: "Hit every deadline this quarter, even with two launches overlapping.", mgrNote: "Reliable and organised. Flag pressure a little earlier so we can rebalance work." },
    sk3: { self: 4, mgr: 6, selfNote: "I still get a fair number of reference queries back from review.", mgrNote: "You're harder on yourself than you need to be. Your copy needs very little correction now." },
    sk4: { self: 3, mgr: 3, selfNote: "Haven't been involved in a pitch yet.", mgrNote: "Let's get you onto the next proposal team. Your therapy area insights would really help." }
  },
  behaviours: {
    bh1: { self: 2, mgr: 3, selfNote: "", mgrNote: "Your lunch-and-learn on new AI tools was brilliant." },
    bh2: { self: 2, mgr: 2, selfNote: "", mgrNote: "" },
    bh3: { self: 2, mgr: 2, selfNote: "", mgrNote: "" },
    bh4: { self: 2, mgr: 2, selfNote: "", mgrNote: "" },
    bh5: { self: 1, mgr: 2, selfNote: "I'd like to speak up more in creative reviews.", mgrNote: "You do, more than you think. Keep going." },
    bh6: { self: 2, mgr: 2, selfNote: "", mgrNote: "" }
  },
  wizzardGoal: {
    progress: "January: learned to build a reference pack with the new citation tool and showed the team.",
    status: "In progress",
    mgrNote: "Great start. Your tool demo saved the team hours."
  },
  goals: [
    {
      title: "Lead the medical content for a congress symposium",
      link: "sk1",
      specific: "Own the scientific content for one symposium, from storyboard to final slides.",
      measurable: "Content approved first time through medical review, and positive client feedback.",
      achievable: "Dee to review drafts weekly; time protected in the resource plan.",
      relevant: "Builds client confidence and is a key step towards Senior Medical Writer.",
      deadline: "2027-06-30",
      status: "In progress",
      progress: "Storyboard signed off by the client in February.",
      mgrNote: "Strong start. Bring me the first full draft before the internal review."
    },
    {
      title: "Join a new business pitch team",
      link: "sk4",
      specific: "Contribute therapy area research and insights to at least one pitch.",
      measurable: "Insight section delivered on time and used in the final pitch deck.",
      achievable: "Next suitable pitch to be agreed with the Scientific Lead.",
      relevant: "Grows confidence with business development, rated Improving today.",
      deadline: "2027-09-30",
      status: "Not started",
      progress: "",
      mgrNote: "I'll put your name forward for the next respiratory pitch."
    },
    {
      title: "Run a reference-checking masterclass",
      link: "bh6",
      specific: "Share my reference-pack checklist with the newer writers in a 30-minute session.",
      measurable: "Session delivered, and the checklist added to the team's shared drive.",
      achievable: "Uses a checklist I already have; needs one team meeting slot.",
      relevant: "Helps others grow and strengthens quality across the team.",
      deadline: "2027-04-30",
      status: "Achieved",
      progress: "Ran it in March. Eight people came and the checklist is now on the drive.",
      mgrNote: "Lovely work, and great feedback from the graduates."
    }
  ],
  privateNotes: "Talk to the Scientific Lead about Penny joining the next pitch. Ready to start thinking about a Senior Medical Writer path in 12–18 months."
};
