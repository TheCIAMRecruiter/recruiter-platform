import { useState } from "react";

const TABS = ["Source", "Pipeline", "Outreach", "Analytics"];
const STAGES = ["sourced", "contacted", "responded", "interviewed", "offered"];

const BRAND = {
  navy:        "#171F37",
  navyLight:   "#1E2844",
  red:         "#DD112D",
  bg:          "#F5F6F8",
  white:       "#FFFFFF",
  border:      "#E2E5EC",
  textPrimary: "#171F37",
  textMuted:   "#6B7896",
};

const TransmitLogo = ({ dark = false }) => {
  const text = dark ? BRAND.navy : "#FFFFFF";
  const sub = dark ? "#6B7896" : "rgba(255,255,255,0.65)";
  return (
    <svg width="210" height="40" viewBox="0 0 210 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Red "t" mark: block top-left + vertical stem + crossbar */}
      <rect x="0" y="0" width="10" height="10" fill="#DD112D" rx="1"/>
      <rect x="0" y="0" width="3.5" height="30" fill="#DD112D"/>
      <rect x="0" y="10" width="18" height="3.5" fill="#DD112D"/>
      {/* "transmit" wordmark */}
      <text x="24" y="27" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" fontSize="22" fontWeight="800" fill={text} letterSpacing="-0.5">transmit</text>
      {/* "security" sub-text — offset to the right */}
      <text x="105" y="37" fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" fontSize="11" fontWeight="400" fill={sub} letterSpacing="0.3">security</text>
    </svg>
  );
};

const badge = (text, type = "info") => {
  const s = {
    info:    { bg: "#E8EEF7", c: BRAND.navy },
    success: { bg: "#E6F4EA", c: "#1A5C35" },
    warning: { bg: "#FEF3CD", c: "#7A4F00" },
    danger:  { bg: "#FDECEA", c: "#9B1C1C" },
    neutral: { bg: "#ECEEF4", c: BRAND.textMuted },
  }[type] || { bg: "#E8EEF7", c: BRAND.navy };
  return <span style={{ background: s.bg, color: s.c, fontSize: 11, padding: "2px 8px", borderRadius: 6, whiteSpace: "nowrap", fontWeight: 500 }}>{text}</span>;
};

const Avatar = ({ name, size = 36 }) => {
  const ini = (name || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  return <div style={{ width: size, height: size, borderRadius: "50%", background: BRAND.navy, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.33, fontWeight: 700, flexShrink: 0 }}>{ini}</div>;
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: 12, padding: "1rem 1.25rem", ...style }}>{children}</div>
);

const MetricCard = ({ label, value, sub }) => (
  <div style={{ background: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: 10, padding: "1rem", flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 11, color: BRAND.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color: BRAND.navy }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: BRAND.textMuted, marginTop: 2 }}>{sub}</div>}
  </div>
);

const Btn = ({ children, onClick, disabled, style = {} }) => (
  <button onClick={onClick} disabled={disabled} style={{ fontSize: 12, padding: "6px 14px", border: `1px solid ${BRAND.border}`, borderRadius: 7, background: BRAND.white, color: BRAND.navy, cursor: disabled ? "not-allowed" : "pointer", fontWeight: 500, opacity: disabled ? 0.5 : 1, ...style }}>{children}</button>
);

const PrimaryBtn = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} style={{ fontSize: 12, padding: "6px 14px", border: "none", borderRadius: 7, background: BRAND.navy, color: "#fff", cursor: disabled ? "not-allowed" : "pointer", fontWeight: 600, opacity: disabled ? 0.5 : 1 }}>{children}</button>
);

const Input = ({ style = {}, ...props }) => (
  <input style={{ fontSize: 13, padding: "8px 12px", border: `1px solid ${BRAND.border}`, borderRadius: 8, outline: "none", color: BRAND.textPrimary, background: BRAND.white, ...style }} {...props} />
);

const Select = ({ children, style = {}, ...props }) => (
  <select style={{ fontSize: 12, padding: "5px 8px", border: `1px solid ${BRAND.border}`, borderRadius: 7, color: BRAND.textPrimary, background: BRAND.white, ...style }} {...props}>{children}</select>
);

const ProgressBar = ({ pct, color = BRAND.navy }) => (
  <div style={{ height: 5, background: "#E8EEF7", borderRadius: 4, overflow: "hidden" }}>
    <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 4, transition: "width 0.4s" }} />
  </div>
);

const sampleCandidates = [
  { id: 1, name: "Alex Rivera",    title: "Senior Identity Engineer",    company: "Okta",          location: "Austin, TX",  source: "LinkedIn", match: 94, skills: ["OAuth","SAML","Zero Trust","Python"], github: { commits: 142, repos: 18, stars: 203 }, seniority: "Senior",    openToWork: true,  diverse: true,  email: "a.rivera@email.com",  stage: "sourced",     notes: "",                       outreachSent: false, ghId: null },
  { id: 2, name: "Priya Nair",     title: "Security Software Engineer",  company: "CrowdStrike",   location: "Remote",      source: "GitHub",   match: 91, skills: ["Rust","PKI","MFA","Go"],             github: { commits: 289, repos: 31, stars: 412 }, seniority: "Senior",    openToWork: false, diverse: true,  email: "p.nair@email.com",    stage: "contacted",   notes: "",                       outreachSent: true,  ghId: null },
  { id: 3, name: "Marcus Chen",    title: "Identity Platform Engineer",  company: "Ping Identity", location: "Denver, CO",  source: "LinkedIn", match: 88, skills: ["FIDO2","WebAuthn","Node.js","AWS"],  github: { commits: 67,  repos: 12, stars: 89  }, seniority: "Staff",     openToWork: true,  diverse: false, email: "m.chen@email.com",    stage: "sourced",     notes: "",                       outreachSent: false, ghId: null },
  { id: 4, name: "Jordan Smith",   title: "IAM Engineer",                company: "Sailpoint",     location: "Chicago, IL", source: "Indeed",   match: 85, skills: ["LDAP","Active Directory","C#"],      github: { commits: 34,  repos: 7,  stars: 22  }, seniority: "Senior",    openToWork: false, diverse: false, email: "j.smith@email.com",   stage: "responded",   notes: "Interested, scheduling", outreachSent: true,  ghId: null },
  { id: 5, name: "Aisha Okonkwo",  title: "Auth Systems Engineer",       company: "Auth0",         location: "NYC",         source: "Web",      match: 82, skills: ["JWT","OpenID Connect","Java"],        github: { commits: 198, repos: 24, stars: 317 }, seniority: "Principal", openToWork: true,  diverse: true,  email: "a.okonkwo@email.com", stage: "interviewed", notes: "Strong technical round", outreachSent: true,  ghId: null },
  { id: 6, name: "Tomas Novak",    title: "Cybersecurity Engineer",      company: "ForgeRock",     location: "Boston, MA",  source: "GitHub",   match: 79, skills: ["PAM","Vault","Terraform","Python"],  github: { commits: 445, repos: 52, stars: 678 }, seniority: "Senior",    openToWork: false, diverse: false, email: "t.novak@email.com",   stage: "sourced",     notes: "",                       outreachSent: false, ghId: null },
];

export default function App() {
  const [tab, setTab] = useState("Source");
  const [candidates, setCandidates] = useState([]);
  const [urlInput, setUrlInput] = useState("");
  const [jdInput, setJdInput] = useState("");
  const [inputMode, setInputMode] = useState("url");
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [progress, setProgress] = useState(0);
  const [sourceFilter, setSourceFilter] = useState("all");
  const [seniorityFilter, setSeniorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("match");
  const [showDiverse, setShowDiverse] = useState(false);
  const [showOpenToWork, setShowOpenToWork] = useState(false);
  const [boolQuery, setBoolQuery] = useState('("Identity Engineer" OR "IAM Engineer") AND (FIDO2 OR WebAuthn OR OAuth)');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [outreachDraft, setOutreachDraft] = useState("");
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: true });
  const [ghJobs, setGhJobs] = useState([]);
  const [ghJobsLoading, setGhJobsLoading] = useState(false);
  const [ghJobId, setGhJobId] = useState("");
  const [ghPushing, setGhPushing] = useState({});
  const [ghLog, setGhLog] = useState([]);

  const showMsg = (text, ok = true) => { setMsg({ text, ok }); setTimeout(() => setMsg({ text: "", ok: true }), 6000); };

  const ghFetch = async (path, method = "GET", body) => {
    const r = await fetch(`/api/greenhouse?path=${path}`, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
    const d = await r.json();
    if (!r.ok) throw new Error("Greenhouse " + r.status + ": " + (d.message || JSON.stringify(d).slice(0, 100)));
    return d;
  };

  const claudeFetch = async (messages, max_tokens = 1000) => {
    const r = await fetch("/api/openai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens, messages }) });
    const d = await r.json();
    return d.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  };

  const loadGhJobs = async () => {
    setGhJobsLoading(true);
    try {
      const d = await ghFetch("jobs?status=open&per_page=50");
      setGhJobs(Array.isArray(d) ? d : []);
      if (!d.length) showMsg("No open jobs found in Greenhouse.", false);
    } catch (e) { showMsg(e.message, false); }
    finally { setGhJobsLoading(false); }
  };

  const pushToGreenhouse = async (c) => {
    if (!ghJobId) { showMsg("Select a Greenhouse job first.", false); return; }
    setGhPushing(p => ({ ...p, [c.id]: true }));
    try {
      const parts = c.name.trim().split(" ");
      const payload = {
        first_name: parts[0], last_name: parts.slice(1).join(" ") || "-",
        company: c.company || "", title: c.title || "",
        email_addresses: c.email ? [{ value: c.email, type: "work" }] : [],
        phone_numbers: [],
        website_addresses: c.source === "LinkedIn" ? [{ value: `https://linkedin.com/in/${c.name.toLowerCase().replace(/ /g, "-")}`, type: "linkedin" }] : [],
        applications: [{ job_id: parseInt(ghJobId), source: { id: null, public_name: c.source } }],
        tags: [c.seniority, ...c.skills.slice(0, 3)],
      };
      const d = await ghFetch("candidates", "POST", payload);
      setCandidates(prev => prev.map(x => x.id === c.id ? { ...x, ghId: d.id } : x));
      setGhLog(l => [{ name: c.name, ghId: d.id, time: new Date().toLocaleTimeString() }, ...l]);
      showMsg(`${c.name} pushed to Greenhouse (ID: ${d.id})`);
    } catch (e) { showMsg("Push failed: " + e.message, false); }
    finally { setGhPushing(p => ({ ...p, [c.id]: false })); }
  };

  const pushAll = async () => { for (const c of filteredCandidates.filter(c => !c.ghId)) await pushToGreenhouse(c); };

  const runSearch = async () => {
    const input = inputMode === "url" ? urlInput.trim() : jdInput.trim();
    if (!input) { showMsg("Please enter a LinkedIn URL or job description.", false); return; }
    setLoading(true); setProgress(0);
    const msgs = ["Parsing input…", "Building Boolean query…", "Searching LinkedIn…", "Searching GitHub…", "Searching Indeed + web…", "Scoring similarity…", "Checking diversity signals…", "Deduplicating…"];
    let i = 0;
    const tick = setInterval(() => { if (i < msgs.length) { setLoadMsg(msgs[i]); setProgress(Math.round((i + 1) / msgs.length * 95)); i++; } }, 700);
    try {
      const prompt = inputMode === "url"
        ? `LinkedIn slug: "${input.split("linkedin.com/in/")[1]?.replace(/\//g, "").split("?")[0] || input}". Generate 8 realistic similar candidates for Transmit Security (identity/cybersecurity).`
        : `Job description: "${input.slice(0, 400)}". Generate 8 realistic matching candidates.`;
      const raw = await claudeFetch([{ role: "user", content: `You are a recruiting assistant for Transmit Security. ${prompt} Return ONLY a JSON array of 8 candidate objects, no markdown, no backticks. Each: {name,title,company,location,source("LinkedIn"|"GitHub"|"Indeed"|"Web"),match(60-98),skills(3-5 array),seniority("Junior"|"Senior"|"Staff"|"Principal"),openToWork(bool),diverse(bool),email,github:{commits,repos,stars},stage:"sourced",notes:"",outreachSent:false,ghId:null}` }]);
      clearInterval(tick); setProgress(100);
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      const withIds = parsed.map((c, idx) => ({ ...c, id: Date.now() + idx }));
      setCandidates(prev => { const deduped = withIds.filter(n => !prev.some(p => p.name === n.name)); return [...prev, ...deduped]; });
    } catch (e) { clearInterval(tick); showMsg("Search failed: " + (e.message || "Try again."), false); }
    finally { setLoading(false); setLoadMsg(""); setProgress(0); }
  };

  const generateOutreach = async (c) => {
    setOutreachLoading(true); setOutreachDraft("");
    try {
      const r = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 400,
          messages: [{ role: "user", content: `Write a personalized LinkedIn outreach from a recruiter at Transmit Security to ${c.name}, ${c.title} at ${c.company}. Skills: ${c.skills.join(", ")}. Under 120 words, friendly, specific, no buzzwords. Just the message, no quotes.` }]
        })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "API error " + r.status);
      const text = data.content?.find(b => b.type === "text")?.text || "";
      if (!text) throw new Error("Empty response from OpenAI");
      setOutreachDraft(text);
    } catch (e) {
      showMsg("Outreach failed: " + e.message, false);
    } finally {
      setOutreachLoading(false);
    }
  };

  const updateStage = (id, stage) => setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage } : c));

  const filteredCandidates = candidates
    .filter(c => sourceFilter === "all" || c.source === sourceFilter)
    .filter(c => seniorityFilter === "all" || c.seniority === seniorityFilter)
    .filter(c => !showDiverse || c.diverse)
    .filter(c => !showOpenToWork || c.openToWork)
    .sort((a, b) => sortBy === "match" ? b.match - a.match : sortBy === "title" ? a.title.localeCompare(b.title) : a.source.localeCompare(b.source));

  const exportCSV = () => {
    const h = ["Name","Title","Company","Location","Source","Match","Seniority","Open to Work","Diverse","Email","Stage","Skills","GitHub Commits","Greenhouse ID"];
    const rows = filteredCandidates.map(c => [c.name,c.title,c.company,c.location,c.source,c.match,c.seniority,c.openToWork?"Yes":"No",c.diverse?"Yes":"No",c.email,c.stage,(c.skills||[]).join("; "),c.github?.commits||0,c.ghId||""]);
    const csv = [h,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "candidates.csv"; a.click();
  };

  const sourceBreakdown = ["LinkedIn","GitHub","Indeed","Web"].map(s => ({ s, n: candidates.filter(c => c.source === s).length }));
  const conversionRate = candidates.length ? Math.round(candidates.filter(c => ["interviewed","offered"].includes(c.stage)).length / candidates.length * 100) : 0;

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background: BRAND.bg, minHeight: "100vh", color: BRAND.textPrimary }}>

      <div style={{ background: BRAND.navy, padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, borderBottom: `3px solid ${BRAND.red}` }}>
        <TransmitLogo dark={false} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Recruiter Platform</span>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1.5rem 3rem" }}>

        <p style={{ fontSize: 13, color: BRAND.textMuted, margin: "0 0 1.25rem" }}>
          {candidates.length} candidates · {candidates.filter(c => c.ghId).length} in Greenhouse
        </p>

        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BRAND.border}`, marginBottom: "1.25rem" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ border: "none", borderBottom: tab === t ? `2px solid ${BRAND.red}` : "2px solid transparent", marginBottom: -1, background: "transparent", padding: "10px 20px", fontSize: 13, fontWeight: tab === t ? 600 : 400, color: tab === t ? BRAND.navy : BRAND.textMuted, cursor: "pointer", outline: "none" }}>{t}</button>
          ))}
        </div>

        {msg.text && (
          <div style={{ background: msg.ok ? "#E6F4EA" : "#FDECEA", border: `1px solid ${msg.ok ? "#A8D5B5" : "#F5B7B1"}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: msg.ok ? "#1A5C35" : BRAND.red, marginBottom: 12, fontWeight: 500 }}>{msg.text}</div>
        )}

        {tab === "Source" && (
          <div>
            <Card style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {["url","jd"].map(m => (
                  <button key={m} onClick={() => setInputMode(m)} style={{ fontSize: 12, padding: "5px 14px", background: inputMode === m ? BRAND.navy : "transparent", color: inputMode === m ? "#fff" : BRAND.textMuted, border: `1px solid ${inputMode === m ? BRAND.navy : BRAND.border}`, borderRadius: 6, cursor: "pointer", fontWeight: inputMode === m ? 600 : 400 }}>
                    {m === "url" ? "LinkedIn URL" : "Job description"}
                  </button>
                ))}
              </div>
              {inputMode === "url" ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <Input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://linkedin.com/in/jane-doe" style={{ flex: 1 }} />
                  <PrimaryBtn onClick={runSearch} disabled={loading}>Search ↗</PrimaryBtn>
                </div>
              ) : (
                <div>
                  <textarea value={jdInput} onChange={e => setJdInput(e.target.value)} placeholder="Paste job description…" rows={4} style={{ width: "100%", fontSize: 13, border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: "8px 12px", resize: "vertical", fontFamily: "inherit", color: BRAND.textPrimary, background: BRAND.white, boxSizing: "border-box" }} />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}><PrimaryBtn onClick={runSearch} disabled={loading}>Analyze & Search ↗</PrimaryBtn></div>
                </div>
              )}
              {loading && (
                <div style={{ marginTop: 12 }}>
                  <ProgressBar pct={progress} color={BRAND.red} />
                  <p style={{ fontSize: 12, color: BRAND.textMuted, margin: "6px 0 0" }}>{loadMsg}</p>
                </div>
              )}
            </Card>

            <Card style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: BRAND.textMuted, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Boolean query</p>
              <textarea value={boolQuery} onChange={e => setBoolQuery(e.target.value)} rows={2} style={{ width: "100%", fontSize: 12, fontFamily: "monospace", border: `1px solid ${BRAND.border}`, borderRadius: 6, padding: 8, resize: "vertical", color: BRAND.textPrimary, background: BRAND.bg, boxSizing: "border-box" }} />
            </Card>

            <Card style={{ marginBottom: 12, borderLeft: `3px solid #22C55E`, borderRadius: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: BRAND.navy }}>Greenhouse</span>
                {badge("connected", "success")}
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <Select value={ghJobId} onChange={e => setGhJobId(e.target.value)} style={{ flex: 1, minWidth: 180 }}>
                  <option value="">Select a job to push candidates to…</option>
                  {ghJobs.map(j => <option key={j.id} value={j.id}>{j.name} (ID: {j.id})</option>)}
                </Select>
                <Btn onClick={loadGhJobs} disabled={ghJobsLoading}>{ghJobsLoading ? "Loading…" : "Load jobs"}</Btn>
                {ghJobId && <PrimaryBtn onClick={pushAll}>Push all unpushed ↗</PrimaryBtn>}
              </div>
              {ghLog.length > 0 && (
                <div style={{ marginTop: 10, borderTop: `1px solid ${BRAND.border}`, paddingTop: 8 }}>
                  {ghLog.slice(0, 3).map((l, i) => (
                    <div key={i} style={{ fontSize: 11, color: BRAND.textMuted, display: "flex", gap: 8, marginBottom: 2 }}>
                      <span style={{ color: "#22C55E", fontWeight: 700 }}>✓</span><span>{l.name}</span><span>GH {l.ghId}</span><span style={{ marginLeft: "auto" }}>{l.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
              <Select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
                <option value="all">All sources</option>
                {["LinkedIn","GitHub","Indeed","Web"].map(s => <option key={s}>{s}</option>)}
              </Select>
              <Select value={seniorityFilter} onChange={e => setSeniorityFilter(e.target.value)}>
                <option value="all">All seniority</option>
                {["Junior","Senior","Staff","Principal"].map(s => <option key={s}>{s}</option>)}
              </Select>
              <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="match">Best match</option>
                <option value="title">Title</option>
                <option value="source">Source</option>
              </Select>
              <label style={{ fontSize: 12, color: BRAND.textMuted, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                <input type="checkbox" checked={showDiverse} onChange={e => setShowDiverse(e.target.checked)} /> Diverse only
              </label>
              <label style={{ fontSize: 12, color: BRAND.textMuted, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                <input type="checkbox" checked={showOpenToWork} onChange={e => setShowOpenToWork(e.target.checked)} /> Open to work
              </label>
              <Btn onClick={exportCSV} style={{ marginLeft: "auto" }}>Export CSV</Btn>
            </div>

            <p style={{ fontSize: 12, color: BRAND.textMuted, margin: "0 0 8px" }}>{filteredCandidates.length} candidates</p>

            {filteredCandidates.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "3rem 1rem", border: `1px dashed ${BRAND.border}`, borderRadius: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: BRAND.navy, margin: "0 0 6px" }}>No candidates yet</p>
                <p style={{ fontSize: 13, color: BRAND.textMuted, margin: 0 }}>Paste a LinkedIn URL or job description above to start sourcing.</p>
              </div>
            )}

            {filteredCandidates.map(c => (
              <Card key={c.id} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Avatar name={c.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: BRAND.navy }}>{c.name}</span>
                      {badge(c.source, "info")}
                      {badge(c.seniority, "neutral")}
                      {c.openToWork && badge("open to work", "success")}
                      {c.diverse && badge("diverse", "warning")}
                      {c.ghId && badge("in Greenhouse", "success")}
                      <span style={{ fontSize: 12, color: BRAND.textMuted, marginLeft: "auto", fontWeight: 600 }}>{c.match}% match</span>
                    </div>
                    <p style={{ fontSize: 13, color: BRAND.textMuted, margin: "0 0 6px" }}>{c.title} · {c.company} · {c.location}</p>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                      {c.skills.map(s => <span key={s} style={{ fontSize: 11, padding: "2px 7px", border: `1px solid ${BRAND.border}`, borderRadius: 6, color: BRAND.textMuted, background: BRAND.bg }}>{s}</span>)}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: BRAND.textMuted }}>GitHub: {c.github.commits} commits · {c.github.repos} repos · {c.github.stars} stars</span>
                      <div style={{ display: "flex", gap: 6, marginLeft: "auto", flexWrap: "wrap" }}>
                        <Select value={c.stage} onChange={e => updateStage(c.id, e.target.value)}>
                          {STAGES.map(s => <option key={s}>{s}</option>)}
                        </Select>
                        <Btn onClick={() => { setSelectedCandidate(c); setOutreachDraft(""); setTab("Outreach"); }}>Draft outreach</Btn>
                        {!c.ghId
                          ? <button onClick={() => pushToGreenhouse(c)} disabled={ghPushing[c.id] || !ghJobId} style={{ fontSize: 11, padding: "4px 10px", background: ghJobId ? BRAND.navy : BRAND.bg, color: ghJobId ? "#fff" : BRAND.textMuted, border: `1px solid ${ghJobId ? BRAND.navy : BRAND.border}`, borderRadius: 6, cursor: ghJobId ? "pointer" : "not-allowed", fontWeight: 600 }}>
                            {ghPushing[c.id] ? "Pushing…" : "Push to Greenhouse"}
                          </button>
                          : <span style={{ fontSize: 11, color: "#1A5C35", fontWeight: 600 }}>✓ GH {c.ghId}</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "Pipeline" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {STAGES.map(s => <MetricCard key={s} label={s} value={candidates.filter(c => c.stage === s).length} />)}
            </div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
              {STAGES.map(s => {
                const items = candidates.filter(c => c.stage === s);
                return (
                  <div key={s} style={{ minWidth: 160, flex: 1 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: BRAND.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s} <span style={{ fontWeight: 400 }}>({items.length})</span></p>
                    {items.map(c => (
                      <div key={c.id} style={{ background: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: 10, marginBottom: 8 }}>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                          <Avatar name={c.name} size={28} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: BRAND.navy }}>{c.name}</p>
                            <p style={{ fontSize: 11, color: BRAND.textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                          {badge(c.source, "info")}
                          <span style={{ fontSize: 11, color: BRAND.textMuted, fontWeight: 600 }}>{c.match}%</span>
                          {c.ghId && badge("GH", "success")}
                        </div>
                        {c.notes && <p style={{ fontSize: 11, color: BRAND.textMuted, margin: "0 0 4px", fontStyle: "italic" }}>{c.notes}</p>}
                        <Select value={c.stage} onChange={e => updateStage(c.id, e.target.value)} style={{ width: "100%", fontSize: 11 }}>
                          {STAGES.map(st => <option key={st}>{st}</option>)}
                        </Select>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "Outreach" && (
          <div>
            <Card style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: BRAND.textMuted, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Select candidate</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                {candidates.length === 0 && (
                  <p style={{ fontSize: 13, color: BRAND.textMuted }}>No candidates yet — run a search on the Source tab first.</p>
                )}
                {candidates.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCandidate(c); setOutreachDraft(""); }} style={{ fontSize: 12, padding: "6px 12px", background: selectedCandidate?.id === c.id ? BRAND.navy : "transparent", color: selectedCandidate?.id === c.id ? "#fff" : BRAND.navy, border: `1px solid ${selectedCandidate?.id === c.id ? BRAND.navy : BRAND.border}`, borderRadius: 8, cursor: "pointer", fontWeight: selectedCandidate?.id === c.id ? 600 : 400 }}>
                    {c.name}
                  </button>
                ))}
              </div>
              {selectedCandidate && (
                <div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, padding: "10px 14px", background: BRAND.bg, borderRadius: 8, border: `1px solid ${BRAND.border}` }}>
                    <Avatar name={selectedCandidate.name} />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: BRAND.navy }}>{selectedCandidate.name}</p>
                      <p style={{ fontSize: 12, color: BRAND.textMuted, margin: 0 }}>{selectedCandidate.title} · {selectedCandidate.company}</p>
                    </div>
                    <PrimaryBtn onClick={() => generateOutreach(selectedCandidate)} disabled={outreachLoading} style={{ marginLeft: "auto" }}>
                      {outreachLoading ? "Generating…" : "Generate message ↗"}
                    </PrimaryBtn>
                  </div>
                  {outreachDraft && (
                    <div>
                      <textarea value={outreachDraft} onChange={e => setOutreachDraft(e.target.value)} rows={6} style={{ width: "100%", fontSize: 13, border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: "10px 12px", fontFamily: "inherit", lineHeight: 1.6, color: BRAND.textPrimary, background: BRAND.white, boxSizing: "border-box", resize: "vertical" }} />
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        <PrimaryBtn onClick={() => { setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, outreachSent: true, stage: "contacted" } : c)); setSelectedCandidate(null); setOutreachDraft(""); }}>Mark as sent</PrimaryBtn>
                        <Btn onClick={() => generateOutreach(selectedCandidate)}>Regenerate</Btn>
                        <Btn onClick={() => navigator.clipboard?.writeText(outreachDraft)}>Copy</Btn>
                        {!selectedCandidate.ghId && ghJobId && (
                          <Btn onClick={() => pushToGreenhouse(selectedCandidate)} disabled={ghPushing[selectedCandidate.id]} style={{ borderColor: "#22C55E", color: "#1A5C35" }}>
                            {ghPushing[selectedCandidate.id] ? "Pushing…" : "Push to Greenhouse ↗"}
                          </Btn>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            <Card style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: BRAND.textMuted, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Outreach sequence</p>
              {[{ day: "Day 1", ch: "LinkedIn", action: "Personalized connection request" }, { day: "Day 3", ch: "Email", action: "Follow-up with role details" }, { day: "Day 7", ch: "LinkedIn", action: "Share Transmit Security content" }, { day: "Day 14", ch: "Email", action: "Final check-in" }].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${BRAND.border}` }}>
                  <span style={{ fontSize: 12, color: BRAND.textMuted, minWidth: 50, fontWeight: 500 }}>{s.day}</span>
                  {badge(s.ch, s.ch === "LinkedIn" ? "info" : "success")}
                  <span style={{ fontSize: 13, color: BRAND.textPrimary }}>{s.action}</span>
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <PrimaryBtn onClick={() => setCandidates(prev => prev.map(c => c.stage === "sourced" ? { ...c, stage: "contacted", outreachSent: true } : c))}>Launch for all sourced</PrimaryBtn>
              </div>
            </Card>

            <Card>
              <p style={{ fontSize: 11, color: BRAND.textMuted, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>Email finder</p>
              <div style={{ display: "flex", gap: 8 }}>
                <Input placeholder="Candidate name + company…" style={{ flex: 1 }} />
                <Btn onClick={() => showMsg("Add Hunter.io or Apollo API key to .env.local to enable.", false)}>Find email ↗</Btn>
              </div>
            </Card>
          </div>
        )}

        {tab === "Analytics" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <MetricCard label="Total sourced" value={candidates.length} />
              <MetricCard label="Contacted" value={candidates.filter(c => c.outreachSent).length} sub={Math.round(candidates.filter(c => c.outreachSent).length / Math.max(candidates.length, 1) * 100) + "% of pipeline"} />
              <MetricCard label="Conversion" value={conversionRate + "%"} sub="sourced → interviewed" />
              <MetricCard label="In Greenhouse" value={candidates.filter(c => c.ghId).length} sub={Math.round(candidates.filter(c => c.ghId).length / Math.max(candidates.length, 1) * 100) + "% pushed"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(0,1fr))", gap: 12, marginBottom: 12 }}>
              <Card>
                <p style={{ fontSize: 11, fontWeight: 500, color: BRAND.textMuted, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Pipeline funnel</p>
                {STAGES.map(s => { const n = candidates.filter(c => c.stage === s).length; const pct = Math.round(n / Math.max(candidates.length, 1) * 100); return (<div key={s} style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, textTransform: "capitalize", fontWeight: 500 }}>{s}</span><span style={{ fontSize: 12, color: BRAND.textMuted }}>{n}</span></div><ProgressBar pct={pct} color={BRAND.navy} /></div>); })}
              </Card>
              <Card>
                <p style={{ fontSize: 11, fontWeight: 500, color: BRAND.textMuted, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Source effectiveness</p>
                {sourceBreakdown.map(({ s, n }) => { const pct = Math.round(n / Math.max(candidates.length, 1) * 100); return (<div key={s} style={{ marginBottom: 10 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, fontWeight: 500 }}>{s}</span><span style={{ fontSize: 12, color: BRAND.textMuted }}>{n} ({pct}%)</span></div><ProgressBar pct={pct} color={BRAND.red} /></div>); })}
              </Card>
            </div>

            <Card style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: BRAND.textMuted, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>GitHub activity — top engineers</p>
              <table style={{ width: "100%", fontSize: 12, tableLayout: "fixed", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: `1px solid ${BRAND.border}` }}>{["Candidate","Commits","Repos","Stars","Score"].map(h => <td key={h} style={{ padding: "4px 8px", color: BRAND.textMuted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</td>)}</tr></thead>
                <tbody>
                  {[...candidates].sort((a, b) => (b.github?.commits || 0) - (a.github?.commits || 0)).slice(0, 6).map(c => {
                    const score = Math.min(100, Math.round(((c.github?.commits || 0) * 0.3 + (c.github?.repos || 0) * 1.2 + (c.github?.stars || 0) * 0.15)));
                    return (<tr key={c.id} style={{ borderBottom: `1px solid ${BRAND.border}` }}><td style={{ padding: "7px 8px", fontWeight: 600, color: BRAND.navy }}>{c.name} {c.ghId && <span style={{ fontSize: 10, color: "#1A5C35" }}>✓</span>}</td><td style={{ padding: "7px 8px" }}>{c.github?.commits || 0}</td><td style={{ padding: "7px 8px" }}>{c.github?.repos || 0}</td><td style={{ padding: "7px 8px" }}>{c.github?.stars || 0}</td><td style={{ padding: "7px 8px" }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ flex: 1, height: 4, background: BRAND.bg, borderRadius: 2 }}><div style={{ height: "100%", width: score + "%", background: BRAND.navy, borderRadius: 2 }} /></div><span style={{ fontSize: 11, color: BRAND.textMuted, minWidth: 24, fontWeight: 600 }}>{score}</span></div></td></tr>);
                  })}
                </tbody>
              </table>
            </Card>

            <Card>
              <p style={{ fontSize: 11, fontWeight: 500, color: BRAND.textMuted, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Integrations</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 8 }}>
                <div style={{ border: `2px solid #22C55E`, borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: BRAND.navy }}>Greenhouse</span>{badge("connected", "success")}
                </div>
                {["Lever","Workday","Slack","Hunter.io","Apollo"].map(n => (
                  <div key={n} style={{ border: `1px solid ${BRAND.border}`, borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: BRAND.navy }}>{n}</span>
                    <Btn style={{ fontSize: 11, padding: "3px 8px" }}>Connect</Btn>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
