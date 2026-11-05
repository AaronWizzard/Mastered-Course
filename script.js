// Wizzard Personal Development Plan demo.
// Everything shown comes from data.js. Changes are saved in this browser only (localStorage).
(function () {
  "use strict";

  const STORE_KEY = "wizzard-pdp-demo-v2";
  const VIEW_KEY = "wizzard-pdp-demo-view";
  const SECTIONS = ["overview", "goals", "competencies", "checkins", "work", "review", "role"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const openMonths = {};

  // ---------- Saving and loading ----------
  const clone = (o) => JSON.parse(JSON.stringify(o));
  function load() {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved) return Object.assign(clone(DEMO_PLAN), JSON.parse(saved));
    } catch (e) { /* storage unavailable: fall back to the demo data */ }
    return clone(DEMO_PLAN);
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(plan)); } catch (e) { /* ignore */ }
  }
  let plan = load();
  let view = "employee";
  try { if (localStorage.getItem(VIEW_KEY) === "manager") view = "manager"; } catch (e) { /* ignore */ }

  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), plan);
  function set(path, value) {
    const keys = path.split(".");
    const last = keys.pop();
    keys.reduce((o, k) => o[k], plan)[last] = value;
    save();
  }

  // ---------- Small helpers ----------
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const bandOf = (n) => BANDS.find((b) => n >= b.from && n <= b.to);
  const allComps = () => SKILLS.concat(BEHAVIOURS);
  const compName = (id) => (allComps().find((c) => c.id === id) || {}).name || "";
  const isEmp = () => view === "employee";
  const isMgr = () => view === "manager";
  const p = () => plan.profile;
  const levelName = (i) => (LEVELS[i] === "Mid-Level" ? "Mid-Level" : LEVELS[i] + " level");
  let uid = 0;

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }

  // A text field: editable for the person who owns it, read-only for everyone else.
  function field(label, path, editable, opts) {
    opts = opts || {};
    const val = get(path) || "";
    if (editable) {
      const id = "f" + (++uid);
      return `<label class="f" for="${id}">${esc(label)}</label>` +
        `<textarea id="${id}" data-path="${path}" placeholder="${esc(opts.placeholder || "")}">${esc(val)}</textarea>`;
    }
    return `<p class="f" style="margin:14px 0 6px;font-weight:600;font-size:13px">${esc(label)}</p>` +
      `<div class="ro${val ? "" : " empty"}">${val ? esc(val) : esc(opts.empty || "Nothing added yet")}</div>`;
  }

  function statusSelect(path, editable, label) {
    const val = get(path);
    if (!editable) return `<span class="status s-${val.toLowerCase().replace(/ /g, "-")}">${esc(val)}</span>`;
    const id = "f" + (++uid);
    return `<label class="f" for="${id}">${esc(label || "Status")}</label>` +
      `<select id="${id}" data-path="${path}">${GOAL_STATUS.map((s) => `<option${s === val ? " selected" : ""}>${s}</option>`).join("")}</select>`;
  }

  // ---------- Header ----------
  function renderHeader() {
    const pr = p();
    document.getElementById("who-kicker").textContent = `Development plan ${pr.year}`;
    document.getElementById("who-name").textContent = pr.name;
    document.getElementById("who-meta").innerHTML =
      `<span><strong>${esc(pr.role)}</strong> · Scientific Services</span>` +
      `<span class="pill">${levelName(pr.level)}</span>` +
      `<span>Line manager: <strong>${esc(pr.manager)}</strong></span>` +
      `<span>With Wizzard since <strong>${formatDate(pr.startDate)}</strong></span>`;

    document.querySelectorAll(".viewswitch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.view === view)));

    document.getElementById("viewnote").innerHTML = isEmp()
      ? `<span aria-hidden="true">👋</span><div>You're seeing <strong>${esc(pr.firstName)}'s view</strong>. ${esc(pr.firstName)} fills in their own ratings, reflections and goal progress. ${esc(pr.manager)}'s ratings and comments are shown so you can talk them through together. Try switching to <strong>Manager view</strong> at the top.</div>`
      : `<span aria-hidden="true">🧭</span><div>You're seeing <strong>${esc(pr.manager)}'s view</strong> as line manager. You add your own ratings and comments next to ${esc(pr.firstName)}'s, and you have private notes that ${esc(pr.firstName)} never sees.</div>`;
  }

  // ---------- Overview ----------
  function renderOverview() {
    const pr = p();
    const achieved = plan.goals.filter((g) => g.status === "Achieved").length;
    const skillsOn = SKILLS.filter((s) => (plan.skills[s.id].mgr || 0) >= 4).length;
    const behOn = BEHAVIOURS.filter((b) => (plan.behaviours[b.id].mgr || 0) >= 2).length;

    const chartRows = SKILLS.map((s) => {
      const r = plan.skills[s.id];
      const pos = (n) => `left:${((n - 0.5) / 9) * 100}%`;
      const label = `${s.name}: self-rating ${r.self || "not set"}${r.self ? " (" + bandOf(r.self).name + ")" : ""}, manager rating ${r.mgr || "not set"}${r.mgr ? " (" + bandOf(r.mgr).name + ")" : ""}`;
      return `<div class="chart-row">
        <span class="chart-name">${esc(s.name)}</span>
        <div class="track" role="img" aria-label="${esc(label)}">${"<i></i>".repeat(9)}
          ${r.self ? `<span class="dot self" style="${pos(r.self)}"></span>` : ""}
          ${r.mgr ? `<span class="dot mgr" style="${pos(r.mgr)}"></span>` : ""}
        </div>
      </div>`;
    }).join("");

    const behRows = BEHAVIOURS.map((b) => {
      const v = plan.behaviours[b.id].mgr;
      const s = BEH_SCALE.find((x) => x.v === v);
      return `<li><span>${esc(b.name)}</span><span class="chip ${s ? "v" + s.v : "none"}">${s ? s.name : "Not rated"}</span></li>`;
    }).join("");

    const heading = isEmp()
      ? `Hello, ${esc(pr.firstName)}. Here's how your year is <span class="hl">shaping up</span>`
      : `${esc(pr.firstName)}'s year <span class="hl">at a glance</span>`;

    document.getElementById("s-overview").innerHTML = `
      <h2 id="h-overview">${heading}</h2>
      <hr class="rule">
      <p class="lede">${isEmp()
        ? "This is your space to reflect on what's going well, what you'd like to grow, and how you're getting on with your goals. There are no wrong answers. It's the start of a conversation with your manager."
        : `A quick read before your next 1:1. Ratings shown here are the ones you've agreed or shared with ${esc(pr.firstName)}.`}</p>

      <div class="stats">
        <div class="stat card navy"><b>${achieved} of ${plan.goals.length}</b><span>goals achieved so far, plus the Wizzard goal: ${esc(plan.wizzardGoal.status.toLowerCase())}</span></div>
        <div class="stat card navy"><b>${skillsOn} of ${SKILLS.length}</b><span>skills rated Expected or above by ${isEmp() ? "your manager" : "you"}</span></div>
        <div class="stat card feature"><b>${behOn} of ${BEHAVIOURS.length}</b><span>behaviours seen consistently or role-modelled</span></div>
      </div>

      <div class="grid2">
        <div class="card">
          <h3>Skills: ${isEmp() ? "your view and your manager's" : `${esc(pr.firstName)}'s view and yours`}</h3>
          <p class="muted small" style="margin:4px 0 14px">Rated 1–9. ${esc(pr.role)}s are measured against the ${LEVELS[pr.level]} descriptors.</p>
          <div class="scale-head"><span></span><div class="bandlabels">${BANDS.map((b) => `<span class="b-${b.key}">${b.name} ${b.from}–${b.to}</span>`).join("")}</div></div>
          ${chartRows}
          <div class="legend">
            <span><span class="dot self"></span>${isEmp() ? "Your rating" : esc(pr.firstName) + "'s rating"}</span>
            <span><span class="dot mgr"></span>${isEmp() ? "Manager's rating" : "Your rating"}</span>
          </div>
        </div>
        <div class="card navy">
          <h3>Behaviours</h3>
          <p class="small" style="margin:4px 0 12px;color:var(--on-navy-muted)">How ${isEmp() ? "you work" : esc(pr.firstName) + " works"}, as seen by ${isEmp() ? "your manager" : "you"}.</p>
          <ul class="behlist">${behRows}</ul>
        </div>
      </div>

      ${isMgr() ? `<div class="card private" style="margin-top:16px">
        <span class="lock"><span aria-hidden="true">🔒</span> Private to you</span>
        <h3 style="margin-top:6px">Your private notes</h3>
        <p class="muted small" style="margin:4px 0 0">Working notes for yourself. ${esc(pr.firstName)} never sees these, even after you share your ratings.</p>
        ${field("Notes", "privateNotes", true)}
      </div>` : ""}
    `;
  }

  // ---------- Goals ----------
  function renderGoals() {
    const pr = p();
    const wg = WIZZARD_GOAL;
    const goals = plan.goals.map((g, i) => `
      <article class="goal">
        <div class="goal-top">
          <span class="goal-n" aria-hidden="true">${i + 1}</span>
          <div class="goal-title">
            <h3>${esc(g.title)}</h3>
            <p>Linked to <strong>${esc(compName(g.link))}</strong> · Due ${formatDate(g.deadline)}</p>
          </div>
          ${statusSelect(`goals.${i}.status`, false)}
        </div>
        <ul class="smart" aria-label="SMART breakdown">
          <li><b>S</b><em>Specific</em>${esc(g.specific)}</li>
          <li><b>M</b><em>Measurable</em>${esc(g.measurable)}</li>
          <li><b>A</b><em>Achievable</em>${esc(g.achievable)}</li>
          <li><b>R</b><em>Relevant</em>${esc(g.relevant)}</li>
          <li><b>T</b><em>Time-bound</em>${formatDate(g.deadline)}</li>
        </ul>
        <div class="rate">
          <div class="${isEmp() ? "" : "locked"}">
            <div class="who-label"><span class="dot self"></span>${isEmp() ? "You" : esc(pr.firstName)} <small>${isEmp() ? "· you fill this in" : "· filled in by " + esc(pr.firstName)}</small></div>
            ${isEmp() ? statusSelect(`goals.${i}.status`, true) : ""}
            ${field("Progress and examples", `goals.${i}.progress`, isEmp(), { placeholder: "What have you done towards this goal?" })}
          </div>
          <div class="${isMgr() ? "" : "locked"}">
            <div class="who-label"><span class="dot mgr"></span>${isMgr() ? "You" : esc(pr.manager)} <small>${isMgr() ? "· you fill this in" : "· filled in by your manager"}</small></div>
            ${field("Manager comment", `goals.${i}.mgrNote`, isMgr(), { placeholder: "Encouragement, feedback or next steps" })}
          </div>
        </div>
      </article>`).join("");

    document.getElementById("s-goals").innerHTML = `
      <h2 id="h-goals">Goals for <span class="hl">${p().year}</span></h2>
      <hr class="rule">
      <p class="lede">One goal we all share, plus personal SMART goals agreed with ${isEmp() ? "your manager" : esc(pr.firstName)}. Each personal goal links to a skill or behaviour, so progress shows up where it counts.</p>

      <div class="wgoal feature">
        <p class="comp-kicker">The Wizzard goal ${wg.year} · same for everyone</p>
        <h3>${esc(wg.title)}</h3>
        <p class="wgoal-text">${esc(wg.text)}</p>
        <div class="facts">
          <div><h4>Why it matters</h4><p>${esc(wg.why)}</p></div>
          <div><h4>How we'll know</h4><p>${esc(wg.measure)}</p></div>
        </div>
        <div class="wgoal-mine">
          <div>${field(isEmp() ? "What I've done that's new" : `What ${pr.firstName} has done that's new`, "wizzardGoal.progress", isEmp())}</div>
          <div>${isEmp() ? statusSelect("wizzardGoal.status", true) : `<p class="f" style="margin:14px 0 6px;font-weight:600;font-size:13px">Status</p><div class="ro">${esc(plan.wizzardGoal.status)}</div>`}</div>
        </div>
        ${field("Manager comment", "wizzardGoal.mgrNote", isMgr())}
      </div>

      <h3 style="font-size:24px;margin-bottom:14px">Personal goals</h3>
      ${goals}
    `;
  }

  // ---------- Skills & Behaviours ----------
  function ratingStrip(path, editable, label) {
    const val = get(path);
    const bands = BANDS.map((b) => {
      let btns = "";
      for (let n = b.from; n <= b.to; n++) {
        btns += `<button type="button" data-rate="${path}" data-val="${n}" aria-pressed="${val === n}" aria-label="${n}, ${b.name}"${editable ? "" : " disabled"}>${n}</button>`;
      }
      return `<div class="band ${b.key}">${btns}</div>`;
    }).join("");
    return `<div class="strip" role="group" aria-label="${esc(label)}">${bands}</div>
      <div class="bandnames">${BANDS.map((b) => `<span>${b.name}</span>`).join("")}</div>`;
  }

  function behStrip(path, editable, label) {
    const val = get(path);
    return `<div class="bstrip" role="group" aria-label="${esc(label)}">${BEH_SCALE.map((s) =>
      `<button type="button" data-rate="${path}" data-val="${s.v}" aria-pressed="${val === s.v}"${editable ? "" : " disabled"}><b>${s.name}</b><span>${s.desc}</span></button>`).join("")}</div>`;
  }

  function ratingPanels(kind, c) {
    const pr = p();
    const base = `${kind}.${c.id}`;
    const strip = kind === "skills" ? ratingStrip : behStrip;
    return `<div class="rate">
      <div class="${isEmp() ? "" : "locked"}">
        <div class="who-label"><span class="dot self"></span>${isEmp() ? "Your self-rating" : esc(pr.firstName) + "'s self-rating"}</div>
        ${strip(base + ".self", isEmp(), (isEmp() ? "Your" : pr.firstName + "'s") + " rating for " + c.name)}
        ${field(isEmp() ? "Your reflection" : "Their reflection", base + ".selfNote", isEmp(), { placeholder: "An example that shows where you are" })}
      </div>
      <div class="${isMgr() ? "" : "locked"}">
        <div class="who-label"><span class="dot mgr"></span>${isMgr() ? "Your rating" : "Manager's rating"}</div>
        ${strip(base + ".mgr", isMgr(), (isMgr() ? "Your" : "Manager's") + " rating for " + c.name)}
        ${field("Manager comment", base + ".mgrNote", isMgr(), { placeholder: "What you've seen, and the next step" })}
      </div>
    </div>`;
  }

  function renderCompetencies() {
    const pr = p();
    const lv = pr.level;
    const next = Math.min(lv + 1, LEVELS.length - 1);
    const skills = SKILLS.map((s, i) => `
      <article class="comp">
        <div class="comp-head">
          <p class="comp-kicker">Skill ${i + 1} of ${SKILLS.length}</p>
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.def)}</p>
        </div>
        <div class="desc">
          <div><h4>What good looks like at ${levelName(lv)}</h4>${esc(s.d[lv])}</div>
          ${next !== lv ? `<div class="next"><h4>Next step: ${levelName(next)}</h4>${esc(s.d[next])}</div>` : ""}
        </div>
        ${ratingPanels("skills", s)}
      </article>`).join("");

    const behs = BEHAVIOURS.map((b, i) => `
      <article class="comp">
        <div class="comp-head">
          <p class="comp-kicker">Behaviour ${i + 1} of ${BEHAVIOURS.length}</p>
          <h3>${esc(b.name)}</h3>
          <p>${esc(b.def)}</p>
        </div>
        <ul class="looks" aria-label="What it looks like">${b.looks.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
        ${ratingPanels("behaviours", b)}
      </article>`).join("");

    document.getElementById("s-competencies").innerHTML = `
      <h2 id="h-competencies">Skills &amp; <span class="hl">behaviours</span></h2>
      <hr class="rule">
      <p class="lede">The same framework for everyone at Wizzard. <strong>Skills</strong> are what you do, rated 1–9 against the descriptors for your level. <strong>Behaviours</strong> are how you do it, and they're the same at every level.</p>
      <div class="card" style="margin-bottom:8px">
        <h4>How the 1–9 scale works</h4>
        <div class="bandlabels" style="margin-top:8px">${BANDS.map((b) => `<span class="b-${b.key}">${b.from}–${b.to} · ${b.name}</span>`).join("")}</div>
      </div>
      <h3 class="subhead" style="font-size:26px">Skills</h3>
      <p class="muted" style="margin:0 0 16px">${esc(pr.role)} · measured at ${levelName(lv)}</p>
      ${skills}
      <h3 class="subhead" style="font-size:26px">Behaviours</h3>
      <p class="muted" style="margin:0 0 16px">Rated Developing, Consistent or Role model</p>
      ${behs}
    `;
  }

  // ---------- Small form pieces ----------
  function inputField(label, path, editable, type, opts) {
    opts = opts || {};
    const val = get(path) || "";
    if (!editable) {
      const shown = type === "date" ? formatDate(val) : val;
      return `${label ? `<p class="f ro-label">${esc(label)}</p>` : ""}<div class="ro${shown ? "" : " empty"}">${shown ? esc(shown) : esc(opts.empty || "–")}</div>`;
    }
    const id = "f" + (++uid);
    const aria = label ? "" : ` aria-label="${esc(opts.aria || "")}"`;
    if (opts.options) {
      return `${label ? `<label class="f" for="${id}">${esc(label)}</label>` : ""}<select id="${id}" data-path="${path}"${aria}>` +
        `<option value="">Choose…</option>${opts.options.map((o) => `<option${o === val ? " selected" : ""}>${esc(o)}</option>`).join("")}</select>`;
    }
    if (type === "textarea") {
      return `${label ? `<label class="f" for="${id}">${esc(label)}</label>` : ""}<textarea id="${id}" data-path="${path}" rows="2"${aria} placeholder="${esc(opts.placeholder || "")}">${esc(val)}</textarea>`;
    }
    return `${label ? `<label class="f" for="${id}">${esc(label)}</label>` : ""}<input type="${type}" id="${id}" data-path="${path}" value="${esc(val)}"${aria} placeholder="${esc(opts.placeholder || "")}">`;
  }

  function ownerLabel(isMine, ownerName) {
    return isMine ? `<small>· you fill this in</small>` : `<small>· filled in by ${esc(ownerName)}</small>`;
  }

  // ---------- 1:1 Tracker ----------
  function renderCheckins() {
    const pr = p();
    plan.checkins = plan.checkins || {};
    const recorded = MONTHS.filter((m) => plan.checkins[m] && (plan.checkins[m].summary || plan.checkins[m].actions));
    const latest = recorded[recorded.length - 1];
    const months = MONTHS.map((m) => {
      if (!plan.checkins[m]) plan.checkins[m] = { summary: "", actions: "" };
      const has = recorded.includes(m);
      const open = openMonths[m] !== undefined ? openMonths[m] : m === latest;
      return `<details class="month" data-month="${m}"${open ? " open" : ""}>
        <summary><span>${m} ${pr.year}</span><span class="filled">${has ? "✓ Recorded" : "Not yet"}</span></summary>
        <div class="month-body">
          <div>${inputField("Summary of discussion", `checkins.${m}.summary`, true, "textarea", { placeholder: "What did you talk about?" })}</div>
          <div>${inputField("Actions and agreements", `checkins.${m}.actions`, true, "textarea", { placeholder: "Who will do what, and by when?" })}</div>
        </div>
      </details>`;
    }).join("");

    document.getElementById("s-checkins").innerHTML = `
      <h2 id="h-checkins">1:1 <span class="hl">Tracker</span></h2>
      <hr class="rule">
      <p class="lede">${isEmp()
        ? `Your monthly 1:1s with ${esc(pr.manager)}, all in one place. Jot down what you talked about and what you agreed, so nothing gets lost between catch-ups.`
        : `Your monthly 1:1s with ${esc(pr.firstName)}, all in one place. You can both add to these, so it's a shared record of what you talked about and agreed.`}</p>
      <div class="card stats-inline"><b>${recorded.length} of 12</b> 1:1s recorded this year. ${recorded.length ? `Latest: ${latest}.` : ""}</div>
      <div class="months">${months}</div>
    `;
  }

  // ---------- Deliverables & Learning ----------
  function rowsTable(listKey, cols, addLabel, emptyText) {
    const rows = plan[listKey] || [];
    const edit = isEmp();
    const head = cols.map((c) => `<th scope="col" style="width:${c.w || "auto"}">${esc(c.label)}</th>`).join("") + (edit ? `<th scope="col" class="x"><span class="sr">Remove</span></th>` : "");
    const body = rows.length ? rows.map((r, i) => `<tr>${cols.map((c) =>
        `<td data-label="${esc(c.label)}">${inputField("", `${listKey}.${i}.${c.key}`, edit, c.type || "textarea", { options: c.options, aria: `${c.label}, row ${i + 1}` })}</td>`).join("")}
        ${edit ? `<td class="x"><button type="button" data-action="del-row" data-list="${listKey}" data-i="${i}" aria-label="Remove row ${i + 1}">×</button></td>` : ""}</tr>`).join("")
      : `<tr><td colspan="${cols.length + (edit ? 1 : 0)}" class="muted small">${esc(emptyText)}</td></tr>`;
    return `<div class="tbl-wrap"><table class="rows"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
      ${edit ? `<button class="btn" type="button" data-action="add-row" data-list="${listKey}">+ ${esc(addLabel)}</button>` : ""}`;
  }

  function renderWork() {
    const pr = p();
    document.getElementById("s-work").innerHTML = `
      <h2 id="h-work">Deliverables &amp; <span class="hl">learning</span></h2>
      <hr class="rule">
      <p class="lede">${isEmp()
        ? "The work you're proud of and the things you've learned. Add them as they happen, and your evidence will be ready and waiting when review time comes round."
        : `The work ${esc(pr.firstName)} is proud of and what they've learned. ${esc(pr.firstName)} keeps this up to date, and it's great evidence for your ratings.`}</p>
      <div class="card">
        <div class="card-head"><h3>Deliverables and achievements</h3><div class="who-label">${ownerLabel(isEmp(), pr.firstName)}</div></div>
        ${rowsTable("deliverables", [
          { key: "project", label: "Project or achievement", w: "34%" },
          { key: "client", label: "Client", w: "20%", type: "text" },
          { key: "feedback", label: "Contribution and feedback" }
        ], "Add a project", "Nothing here yet. Add your first project whenever you're ready.")}
      </div>
      <div class="card">
        <div class="card-head"><h3>Training and initiatives</h3><div class="who-label">${ownerLabel(isEmp(), pr.firstName)}</div></div>
        ${rowsTable("training", [
          { key: "name", label: "Training or initiative", w: "30%" },
          { key: "type", label: "Internal or external", w: "16%", options: ["Internal", "External"] },
          { key: "date", label: "Date", w: "17%", type: "date" },
          { key: "outcomes", label: "Outcomes" }
        ], "Add training", "Nothing here yet. Add training as you go.")}
      </div>
      <p class="muted small">All clients shown here are made up.</p>
    `;
  }

  // ---------- Year in Review ----------
  function signBox(who, role, key, mine) {
    const signed = plan.review[key];
    let inner;
    if (signed) {
      inner = `<p class="signed">✓ Agreed on ${formatDate(signed)}</p>` +
        (mine ? `<button type="button" class="linkbtn" data-action="unsign" data-key="${key}">Undo</button>` : "");
    } else if (mine) {
      inner = `<button type="button" class="btn primary" data-action="sign" data-key="${key}">I agree with this review</button>`;
    } else {
      inner = `<p class="muted" style="margin:0">Waiting for ${esc(who)}</p>`;
    }
    return `<div class="signbox${signed ? " done" : ""}"><h4>${esc(who)} <span style="font-weight:500;opacity:.8">(${role})</span></h4>${inner}</div>`;
  }

  function renderReview() {
    const pr = p();
    const r = plan.review;
    const both = r.empSigned && r.mgrSigned;
    document.getElementById("s-review").innerHTML = `
      <h2 id="h-review">Year in <span class="hl">review</span></h2>
      <hr class="rule">
      <p class="lede">${isEmp()
        ? `A look back at your year. ${esc(pr.manager)} writes a summary, you add your own reflections, and when you've both had your say you sign it off together.`
        : `Pull together the highlights of ${esc(pr.firstName)}'s year. ${esc(pr.firstName)} adds their own reflections, and when you've both had your say you sign it off together.`}</p>

      <div class="card review-date">
        ${inputField("Review meeting date", "review.date", isMgr(), "date", { empty: "Not booked yet" })}
        ${isEmp() ? "" : `<p class="muted small" style="margin:8px 0 0">The date shows on the plan for both of you.</p>`}
      </div>

      <div class="card">
        <div class="card-head"><h3>Line manager's summary</h3><div class="who-label"><span class="dot mgr"></span>${ownerLabel(isMgr(), pr.manager)}</div></div>
        ${field("Summary of the year", "review.mgrSummary", isMgr(), { placeholder: "The highlights of their year, and what's next" })}
        ${field("360 feedback summary", "review.feedback360", isMgr(), { placeholder: "Themes from colleagues' feedback" })}
      </div>

      <h3 class="subhead" style="font-size:24px">${isEmp() ? "Your reflections" : esc(pr.firstName) + "'s reflections"}</h3>
      <p class="muted" style="margin:0 0 16px">${isEmp() ? "Add these after reading your manager's summary." : `${esc(pr.firstName)} fills these in.`}</p>
      <div class="refl">
        <div class="card">${field("Key accomplishments", "review.accomplishments", isEmp())}</div>
        <div class="card">${field("Learnings", "review.learnings", isEmp())}</div>
        <div class="card">${field("Highlights", "review.highlights", isEmp())}</div>
        <div class="card">${field("Lowlights", "review.lowlights", isEmp())}</div>
      </div>
      <div class="card" style="margin-top:16px">${field(isEmp() ? "Your summary" : "Employee summary", "review.summary", isEmp(), { placeholder: "Your year in a few sentences", empty: "Not written yet" })}</div>

      <div class="card ${both ? "feature" : "navy"}" style="margin-top:16px">
        <h3>Sign-off</h3>
        <p style="margin:6px 0 14px;font-size:14px">${both ? "Signed off by you both. Here's to next year!" : "Once you've both had your say, each of you confirms you agree."}</p>
        <div class="sign">
          ${signBox(pr.firstName, "employee", "empSigned", isEmp())}
          ${signBox(pr.manager, "line manager", "mgrSigned", isMgr())}
        </div>
        <p class="small" style="margin:14px 0 0;opacity:.85">No statement in this review constitutes a guarantee of promotion, compensation, continued employment or any other contractual agreement.</p>
      </div>
    `;
  }

  // ---------- Job description ----------
  function renderRole() {
    const jd = JOB_DESCRIPTION;
    const pr = p();
    document.getElementById("s-role").innerHTML = `
      <h2 id="h-role">The <span class="hl">${esc(jd.role)}</span> role</h2>
      <hr class="rule">
      <p class="lede">Reports to the ${esc(jd.reportsTo)}. Use this to find evidence for your ratings and ideas for goals.</p>
      <div class="jd">
        <div class="card navy">
          <h3>Purpose</h3>
          ${jd.objectives.map((o) => `<p style="margin:10px 0 0;font-size:14px">${esc(o)}</p>`).join("")}
          <h3 style="margin-top:22px">Career path</h3>
          <ul class="ladder">${ROLES.map((r) => `<li class="${r.name === pr.role ? "me" : ""}"><span>${esc(r.name)}</span><span class="muted">${LEVELS[r.level]}</span></li>`).slice().reverse().join("")}</ul>
        </div>
        <div class="card">
          <h3>Responsibilities</h3>
          <ul>${jd.responsibilities.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
        </div>
        <div class="card">
          <h3>Knowledge, skills and experience</h3>
          <ul>${jd.kse.map((k) => `<li>${esc(k)}</li>`).join("")}</ul>
        </div>
      </div>
    `;
  }

  // ---------- Tabs ----------
  function currentSection() {
    const h = location.hash.replace("#", "");
    return SECTIONS.includes(h) ? h : "overview";
  }
  function showSection() {
    const cur = currentSection();
    SECTIONS.forEach((s) => { document.getElementById("s-" + s).hidden = s !== cur; });
    document.querySelectorAll(".tabs a").forEach((a) => {
      if (a.getAttribute("href") === "#" + cur) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function renderAll() {
    uid = 0;
    renderHeader();
    renderOverview();
    renderGoals();
    renderCompetencies();
    renderCheckins();
    renderWork();
    renderReview();
    renderRole();
    showSection();
  }

  // ---------- Events ----------
  document.querySelector(".viewswitch").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-view]");
    if (!b || b.dataset.view === view) return;
    view = b.dataset.view;
    try { localStorage.setItem(VIEW_KEY, view); } catch (err) { /* ignore */ }
    renderAll();
  });

  document.getElementById("main").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-rate]");
    if (!b || b.disabled) return;
    const path = b.dataset.rate;
    set(path, Number(b.dataset.val));
    // Re-render, then put keyboard focus back on the same button.
    const sel = `button[data-rate="${path}"][data-val="${b.dataset.val}"]`;
    renderAll();
    const again = document.querySelector(sel);
    if (again) again.focus();
  });

  document.getElementById("main").addEventListener("input", (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.path && (el.tagName === "TEXTAREA" || el.tagName === "INPUT")) set(el.dataset.path, el.value);
  });
  document.getElementById("main").addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset && el.dataset.path && el.tagName === "SELECT") {
      set(el.dataset.path, el.value);
      const id = el.id;
      renderAll();
      const again = document.getElementById(id);
      if (again) again.focus();
    }
  });

  // Buttons for adding and removing rows, and for signing off.
  document.getElementById("main").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-action]");
    if (!b) return;
    const a = b.dataset.action;
    if (a === "add-row") {
      const list = b.dataset.list;
      plan[list] = plan[list] || [];
      plan[list].push(list === "training" ? { name: "", type: "", date: "", outcomes: "" } : { project: "", client: "", feedback: "" });
      save();
      renderAll();
      const rows = document.querySelectorAll(`[data-path^="${list}.${plan[list].length - 1}."]`);
      if (rows[0]) rows[0].focus();
    } else if (a === "del-row") {
      if (!confirm("Remove this row?")) return;
      plan[b.dataset.list].splice(Number(b.dataset.i), 1);
      save();
      renderAll();
    } else if (a === "sign" || a === "unsign") {
      plan.review[b.dataset.key] = a === "sign" ? new Date().toISOString().slice(0, 10) : "";
      save();
      renderAll();
      const again = document.querySelector(`button[data-key="${b.dataset.key}"]`);
      if (again) again.focus();
    }
  });

  // Remember which 1:1 months are open.
  document.addEventListener("toggle", (e) => {
    const d = e.target;
    if (d && d.dataset && d.dataset.month) openMonths[d.dataset.month] = d.open;
  }, true);

  document.getElementById("reset").addEventListener("click", () => {
    if (!confirm("Reset the demo? Any changes you've made in this browser will be cleared.")) return;
    plan = clone(DEMO_PLAN);
    try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignore */ }
    renderAll();
  });

  window.addEventListener("hashchange", () => { showSection(); window.scrollTo(0, 0); });

  renderAll();
})();
