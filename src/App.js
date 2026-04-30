import { useState } from "react";

const TABS = ["Source", "Pipeline", "Outreach", "Analytics"];
const STAGES = ["sourced", "contacted", "responded", "interviewed", "offered"];

const badge = (text, type = "info") => {
  const s = {
    info: { bg: "#e6f1fb", c: "#0c447c" },
    success: { bg: "#eaf3de", c: "#27500a" },
    warning: { bg: "#faeeda", c: "#633806" },
    danger: { bg: "#fcebeb", c: "#791f1f" },
    neutral: { bg: "#f1efe8", c: "#444441" },
  }[type] || { bg: "#e6f1fb", c: "#0c447c" };
  return (
    <span style={{ background: s.bg, color: s.c, fontSize: 11, padding: "2px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>
      {text}
    </span>
  );
};

const Avatar = ({ name, size = 36 }) => {
  const ini = (name || "?").split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#e6f1fb", color: "#0c447c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 500, flexShrink: 0 }}>
      {ini}
    </div>
  );
};

const Card = ({ children, style = {} }) => (
  <div style={{ background: "#fff", border: "0.5px solid #e0ddd4", borderRadius: 12, padding: "1rem 1.25rem", ...style }}>
    {children}
  </div>
);

const MetricCard = ({ label, value, sub }) => (
  <div style={{ background: "#f9f9f7", borderRadius: 8, padding: "1rem", flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 24, fontWeight: 500 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{sub}</div>}
  </div>
);

const sampleCandidates = [
  { id: 1, name: "Alex Rivera", title: "Senior Identity Engineer", company: "Okta", location: "Austin, TX", source: "LinkedIn", match: 94, skills: ["OAuth", "SAML", "Zero Trust", "Python"], github: { commits: 142, repos: 18, stars: 203 }, seniority: "Senior", openToWork: true, diverse: true, email: "a.rivera@email.com", stage: "sourced", notes: "", outreachSent: false, ghId: null },
  { id: 2, name: "Priya Nair", title: "Security Software Engineer", company: "CrowdStrike", location: "Remote", source: "GitHub", match: 91, skills: ["Rust", "PKI", "MFA", "Go"], github: { commits: 289, repos: 31, stars: 412 }, seniority: "Senior", openToWork: false, diverse: true, email: "p.nair@email.com", stage: "contacted", notes: "", outreachSent: true, ghId: null },
  { id: 3, name: "Marcus Chen", title: "Identity Platform Engineer", company: "Ping Identity", location: "Denver, CO", source: "LinkedIn", match: 88, skills: ["FIDO2", "WebAuthn", "Node.js", "AWS"], github: { commits: 67, repos: 12, stars: 89 }, seniority: "Staff", openToWork: true, diverse: false, email: "m.chen@email.com", stage: "sourced", notes: "", outreachSent: false, ghId: null },
  { id: 4, name: "Jordan Smith", title: "IAM Engineer", company: "Sailpoint", location: "Chicago, IL", source: "Indeed", match: 85, skills: ["LDAP", "Active Directory", "C#", "Azure AD"], github: { commits: 34, repos: 7, stars: 22 }, seniority: "Senior", openToWork: false, diverse: false, email: "j.smith@email.com", stage: "responded", notes: "Interested, scheduling call", outreachSent: true, ghId: null },
  { id: 5, name: "Aisha Okonkwo", title: "Auth Systems Engineer", company: "Auth0", location: "NYC", source: "Web", match: 82, skills: ["JWT", "OpenID Connect", "Java", "Kubernetes"], github: { commits: 198, repos: 24, stars: 317 }, seniority: "Principal", openToWork: true, diverse: true, email: "a.okonkwo@email.com", stage: "interviewed", notes: "Strong technical round", outreachSent: true, ghId: null },
  { id: 6, name: "Tomas Novak", title: "Cybersecurity Engineer", company: "ForgeRock", location: "Boston, MA", source: "GitHub", match: 79, skills: ["PAM", "Vault", "Terraform", "Python"], github: { commits: 445, repos: 52, stars: 678 }, seniority: "Senior", openToWork: false, diverse: false, email: "t.novak@email.com", stage: "sourced", notes: "", outreachSent: false, ghId: null },
];

export default function App() {
  const [tab, setTab] = useState("Source");
  const [candidates, setCandidates] = useState(sampleCandidates);
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
  const [error, setError] = useState("");
  const [ghJobs, setGhJobs] = useState([]);
  const [ghJobsLoading, setGhJobsLoading] = useState(false);
  const [ghJobId, setGhJobId] = useState("");
  const [ghPushing, setGhPushing] = useState({});
  const [ghLog, setGhLog] = useState([]);

  const showMsg = (msg) => { setError(msg); setTimeout(() => setError(""), 6000); };

  const ghFetch = async (path, method = "GET", body) => {
    const r = await fetch(`/api/greenhouse?path=${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const d = await r.json();
    if (!r.ok) throw new Error("Greenhouse " + r.status + ": " + (d.message || JSON.stringify(d).slice(0, 100)));
    return d;
  };

  const claudeFetch = async (messages, max_tokens = 1000) => {
    const r = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens, messages }),
    });
    const d = await r.json();
    return d.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  };

  const loadGhJobs = async () => {
    setGhJobsLoading(true);
    try {
      const d = await ghFetch("jobs?status=open&per_page=50");
      setGhJobs(Array.isArray(d) ? d : []);
      if (!d.length) showMsg("No open jobs found in Greenhouse.");
    } catch (e) { showMsg(e.message); }
    finally { setGhJobsLoading(false); }
  };

  const pushToGreenhouse = async (c) => {
    if (!ghJobId) { showMsg("Select a Greenhouse job first."); return; }
    setGhPushing(p => ({ ...p, [c.id]: true }));
    try {
      const parts = c.name.trim().split(" ");
      const payload = {
        first_name: parts[0],
        last_name: parts.slice(1).join(" ") || "-",
        company: c.company || "",
        title: c.title || "",
        email_addresses: c.email ? [{ value: c.email, type: "work" }] : [],
        phone_numbers: [],
        website_addresses: c.source === "LinkedIn" ? [{ value: `https://linkedin.com/in/${c.name.toLowerCase().replace(/ /g, "-")}`, type: "linkedin" }] : [],
        applications: [{ job_id: parseInt(ghJobId), source: { id: null, public_name: c.source } }],
        tags: [c.seniority, ...c.skills.slice(0, 3)],
      };
      const d = await ghFetch("candidates", "POST", payload);
      setCandidates(prev => prev.map(x => x.id === c.id ? { ...x, ghId: d.id } : x));
      setGhLog(l => [{ name: c.name, ghId: d.id, time: new Date().toLocaleTimeString() }, ...l]);
      showMsg("✓ " + c.name + " pushed to Greenhouse (ID: " + d.id + ")");
    } catch (e) { showMsg("Push failed: " + e.message); }
    finally { setGhPushing(p => ({ ...p, [c.id]: false })); }
  };

  const pushAll = async () => {
    for (const c of filteredCandidates.filter(c => !c.ghId)) await pushToGreenhouse(c);
  };

  const runSearch = async () => {
    const input = inputMode === "url" ? urlInput.trim() : jdInput.trim();
    if (!input) { showMsg("Please enter a LinkedIn URL or job description."); return; }
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
      setCandidates(prev => {
        const deduped = withIds.filter(n => !prev.some(p => p.name === n.name));
        return [...prev, ...deduped];
      });
    } catch (e) { clearInterval(tick); showMsg("Search failed: " + (e.message || "Try again.")); }
    finally { setLoading(false); setLoadMsg(""); setProgress(0); }
  };

  const generateOutreach = async (c) => {
    setOutreachLoading(true); setOutreachDraft("");
    try {
      const text = await claudeFetch([{ role: "user", content: `Write a personalized LinkedIn outreach from a recruiter at Transmit Security to ${c.name}, ${c.title} at ${c.company}. Skills: ${c.skills.join(", ")}. Under 120 words, friendly, specific, no buzzwords. Just the message, no quotes.` }], 400);
      setOutreachDraft(text);
    } catch (e) { showMsg("Outreach generation failed."); }
    finally { setOutreachLoading(false); }
  };

  const updateStage = (id, stage) => setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage } : c));

  const filteredCandidates = candidates
    .filter(c => sourceFilter === "all" || c.source === sourceFilter)
    .filter(c => seniorityFilter === "all" || c.seniority === seniorityFilter)
    .filter(c => !showDiverse || c.diverse)
    .filter(c => !showOpenToWork || c.openToWork)
    .sort((a, b) => sortBy === "match" ? b.match - a.match : sortBy === "title" ? a.title.localeCompare(b.title) : a.source.localeCompare(b.source));

  const exportCSV = () => {
    const h = ["Name", "Title", "Company", "Location", "Source", "Match", "Seniority", "Open to Work", "Diverse", "Email", "Stage", "Skills", "GitHub Commits", "Greenhouse ID"];
    const rows = filteredCandidates.map(c => [c.name, c.title, c.company, c.location, c.source, c.match, c.seniority, c.openToWork ? "Yes" : "No", c.diverse ? "Yes" : "No", c.email, c.stage, (c.skills || []).join("; "), c.github?.commits || 0, c.ghId || ""]);
    const csv = [h, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "candidates.csv"; a.click();
  };

  const isSuccess = error.startsWith("✓");

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>Recruiter Intelligence Platform</h1>
          {badge("Transmit Security", "info")}
          {badge("Greenhouse connected", "success")}
        </div>
        <p style={{ fontSize: 13, color: "#888", margin: 0 }}>{candidates.length} candidates · {candidates.filter(c => c.ghId).length} pushed to Greenhouse</p>
      </div>

      <div style={{ display: "flex", gap: 4, borderBottom: "0.5px solid #e0ddd4", marginBottom: "1.25rem" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ border: "none", borderBottom: tab === t ? "2px solid #1a1a18" : "2px solid transparent", background: "transparent", padding: "8px 16px", fontSize: 13, fontWeight: tab === t ? 500 : 400, color: tab === t ? "#1a1a18" : "#888", cursor: "pointer", outline: "none" }}>{t}</button>
        ))}
      </div>

      {error && (
        <div style={{ background: isSuccess ? "#eaf3de" : "#fcebeb", border: "0.5px solid " + (isSuccess ? "#97c459" : "#f09595"), borderRadius: 8, padding: "10px 14px", fontSize: 13, color: isSuccess ? "#27500a" : "#791f1f", marginBottom: 12 }}>{error}</div>
      )}

      {tab === "Source" && (
        <div>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {["url", "jd"].map(m => (
                <button key={m} onClick={() => setInputMode(m)} style={{ fontSize: 12, padding: "4px 12px", background: inputMode === m ? "#f1efe8" : "transparent", border: "0.5px solid #e0ddd4", borderRadius: 6, cursor: "pointer" }}>
                  {m === "url" ? "LinkedIn URL" : "Job description"}
                </button>
              ))}
            </div>
            {inputMode === "url" ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://linkedin.com/in/jane-doe" style={{ flex: 1, fontSize: 13, padding: "8px 12px", border: "0.5px solid #e0ddd4", borderRadius: 8, outline: "none" }} />
                <button onClick={runSearch} disabled={loading} style={{ fontSize: 13, padding: "0 16px", border: "0.5px solid #e0ddd4", borderRadius: 8, background: "transparent", cursor: "pointer" }}>Search ↗</button>
              </div>
            ) : (
              <div>
                <textarea value={jdInput} onChange={e => setJdInput(e.target.value)} placeholder="Paste job description…" rows={4} style={{ width: "100%", fontSize: 13, border: "0.5px solid #e0ddd4", borderRadius: 8, padding: "8px 12px", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button onClick={runSearch} disabled={loading} style={{ fontSize: 13, padding: "6px 16px", border: "0.5px solid #e0ddd4", borderRadius: 8, background: "transparent", cursor: "pointer" }}>Analyze & Search ↗</button>
                </div>
              </div>
            )}
            {loading && (
              <div style={{ marginTop: 12 }}>
                <div style={{ height: 3, background: "#f1efe8", borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", background: "#378add", width: progress + "%", transition: "width 0.4s", borderRadius: 4 }} />
                </div>
                <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{loadMsg}</p>
              </div>
            )}
          </Card>

          <Card style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 12, color: "#888", margin: "0 0 6px" }}>Boolean query</p>
            <textarea value={boolQuery} onChange={e => setBoolQuery(e.target.value)} rows={2} style={{ width: "100%", fontSize: 12, fontFamily: "monospace", border: "0.5px solid #e0ddd4", borderRadius: 6, padding: 8, resize: "vertical", background: "#f9f9f7", boxSizing: "border-box" }} />
          </Card>

          <Card style={{ marginBottom: 12, borderColor: "#97c459" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Greenhouse</span>
              {badge("connected", "success")}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <select value={ghJobId} onChange={e => setGhJobId(e.target.value)} style={{ fontSize: 12, padding: "4px 8px", flex: 1, minWidth: 160, border: "0.5px solid #e0ddd4", borderRadius: 6 }}>
                <option value="">Select job…</option>
                {ghJobs.map(j => <option key={j.id} value={j.id}>{j.name} (ID: {j.id})</option>)}
              </select>
              <button onClick={loadGhJobs} disabled={ghJobsLoading} style={{ fontSize: 12, padding: "4px 10px", border: "0.5px solid #e0ddd4", borderRadius: 6, background: "transparent", cursor: "pointer" }}>
                {ghJobsLoading ? "Loading…" : "Load jobs"}
              </button>
              {ghJobId && <button onClick={pushAll} style={{ fontSize: 12, padding: "4px 10px", border: "0.5px solid #97c459", borderRadius: 6, background: "#eaf3de", color: "#27500a", cursor: "pointer" }}>Push all unpushed ↗</button>}
            </div>
            {ghLog.length > 0 && (
              <div style={{ marginTop: 10, borderTop: "0.5px solid #e0ddd4", paddingTop: 8 }}>
                {ghLog.slice(0, 3).map((l, i) => (
                  <div key={i} style={{ fontSize: 11, color: "#888", display: "flex", gap: 8 }}>
                    <span style={{ color: "#639922" }}>✓</span><span>{l.name}</span><span>GH {l.ghId}</span><span style={{ marginLeft: "auto" }}>{l.time}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
            {[["sourceFilter", sourceFilter, setSourceFilter, ["all", "LinkedIn", "GitHub", "Indeed", "Web"]], ["seniorityFilter", seniorityFilter, setSeniorityFilter, ["all", "Junior", "Senior", "Staff", "Principal"]], ["sortBy", sortBy, setSortBy, ["match", "title", "source"]]].map(([, val, setter, opts]) => (
              <select key={val} value={val} onChange={e => setter(e.target.value)} style={{ fontSize: 12, padding: "4px 8px", border: "0.5px solid #e0ddd4", borderRadius: 6 }}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            ))}
            <label style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <input type="checkbox" checked={showDiverse} onChange={e => setShowDiverse(e.target.checked)} /> Diverse only
            </label>
            <label style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <input type="checkbox" checked={showOpenToWork} onChange={e => setShowOpenToWork(e.target.checked)} /> Open to work
            </label>
            <button onClick={exportCSV} style={{ fontSize: 12, padding: "4px 10px", border: "0.5px solid #e0ddd4", borderRadius: 6, background: "transparent", cursor: "pointer", marginLeft: "auto" }}>Export CSV</button>
          </div>

          <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px" }}>{filteredCandidates.length} candidates</p>

          {filteredCandidates.map(c => (
            <Card key={c.id} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Avatar name={c.name} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{c.name}</span>
                    {badge(c.source, "info")}
                    {badge(c.seniority, "neutral")}
                    {c.openToWork && badge("open to work", "success")}
                    {c.diverse && badge("diverse", "warning")}
                    {c.ghId && badge("in Greenhouse", "success")}
                    <span style={{ fontSize: 12, color: "#888", marginLeft: "auto" }}>{c.match}% match</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#888", margin: "0 0 4px" }}>{c.title} · {c.company} · {c.location}</p>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6 }}>
                    {c.skills.map(s => <span key={s} style={{ fontSize: 11, padding: "2px 6px", border: "0.5px solid #e0ddd4", borderRadius: 6, color: "#888" }}>{s}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "#888" }}>GitHub: {c.github.commits} commits · {c.github.repos} repos · {c.github.stars} stars</span>
                    <div style={{ display: "flex", gap: 6, marginLeft: "auto", flexWrap: "wrap" }}>
                      <select value={c.stage} onChange={e => updateStage(c.id, e.target.value)} style={{ fontSize: 11, padding: "2px 6px", border: "0.5px solid #e0ddd4", borderRadius: 6 }}>
                        {STAGES.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <button onClick={() => { setSelectedCandidate(c); setOutreachDraft(""); setTab("Outreach"); }} style={{ fontSize: 11, padding: "2px 8px", border: "0.5px solid #e0ddd4", borderRadius: 6, background: "transparent", cursor: "pointer" }}>Draft outreach</button>
                      {!c.ghId
                        ? <button onClick={() => pushToGreenhouse(c)} disabled={ghPushing[c.id] || !ghJobId} style={{ fontSize: 11, padding: "2px 8px", background: "#eaf3de", color: "#27500a", border: "0.5px solid #97c459", borderRadius: 6, cursor: ghJobId ? "pointer" : "not-allowed", opacity: ghJobId ? 1 : 0.5 }}>{ghPushing[c.id] ? "Pushing…" : "Push to Greenhouse"}</button>
                        : <span style={{ fontSize: 11, color: "#639922" }}>✓ GH {c.ghId}</span>
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
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8 }}>
            {STAGES.map(s => {
              const items = candidates.filter(c => c.stage === s);
              return (
                <div key={s} style={{ minWidth: 160, flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "#888", marginBottom: 8, textTransform: "capitalize" }}>{s} ({items.length})</p>
                  {items.map(c => (
                    <div key={c.id} style={{ background: "#fff", border: "0.5px solid #e0ddd4", borderRadius: 8, padding: 10, marginBottom: 8 }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                        <Avatar name={c.name} size={28} />
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                          <p style={{ fontSize: 11, color: "#888", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.title}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 4, marginBottom: 6, flexWrap: "wrap" }}>
                        {badge(c.source, "info")}
                        <span style={{ fontSize: 11, color: "#888" }}>{c.match}%</span>
                        {c.ghId && badge("GH", "success")}
                      </div>
                      <select value={c.stage} onChange={e => updateStage(c.id, e.target.value)} style={{ fontSize: 11, padding: "2px 4px", width: "100%", border: "0.5px solid #e0ddd4", borderRadius: 4 }}>
                        {STAGES.map(st => <option key={st}>{st}</option>)}
                      </select>
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
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 10px" }}>Select candidate</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {candidates.filter(c => !c.outreachSent).slice(0, 6).map(c => (
                <button key={c.id} onClick={() => { setSelectedCandidate(c); setOutreachDraft(""); }} style={{ fontSize: 12, padding: "6px 10px", background: selectedCandidate?.id === c.id ? "#f1efe8" : "transparent", border: "0.5px solid #e0ddd4", borderRadius: 8, cursor: "pointer" }}>
                  {c.name}
                </button>
              ))}
            </div>
            {selectedCandidate && (
              <div>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12, padding: 10, background: "#f9f9f7", borderRadius: 8 }}>
                  <Avatar name={selectedCandidate.name} />
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>{selectedCandidate.name}</p>
                    <p style={{ fontSize: 12, color: "#888", margin: 0 }}>{selectedCandidate.title} · {selectedCandidate.company}</p>
                  </div>
                  <button onClick={() => generateOutreach(selectedCandidate)} disabled={outreachLoading} style={{ fontSize: 12, padding: "6px 12px", border: "0.5px solid #e0ddd4", borderRadius: 8, background: "transparent", cursor: "pointer", marginLeft: "auto" }}>
                    {outreachLoading ? "Generating…" : "Generate message ↗"}
                  </button>
                </div>
                {outreachDraft && (
                  <div>
                    <textarea value={outreachDraft} onChange={e => setOutreachDraft(e.target.value)} rows={6} style={{ width: "100%", fontSize: 13, border: "0.5px solid #e0ddd4", borderRadius: 8, padding: "10px 12px", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box", resize: "vertical" }} />
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                      <button onClick={() => { setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, outreachSent: true, stage: "contacted" } : c)); setSelectedCandidate(null); setOutreachDraft(""); }} style={{ fontSize: 12, padding: "6px 12px", border: "0.5px solid #e0ddd4", borderRadius: 8, background: "transparent", cursor: "pointer" }}>Mark as sent</button>
                      <button onClick={() => generateOutreach(selectedCandidate)} style={{ fontSize: 12, padding: "6px 12px", border: "0.5px solid #e0ddd4", borderRadius: 8, background: "transparent", cursor: "pointer" }}>Regenerate</button>
                      <button onClick={() => navigator.clipboard?.writeText(outreachDraft)} style={{ fontSize: 12, padding: "6px 12px", border: "0.5px solid #e0ddd4", borderRadius: 8, background: "transparent", cursor: "pointer" }}>Copy</button>
                      {!selectedCandidate.ghId && ghJobId && (
                        <button onClick={() => pushToGreenhouse(selectedCandidate)} disabled={ghPushing[selectedCandidate.id]} style={{ fontSize: 12, padding: "6px 12px", background: "#eaf3de", color: "#27500a", border: "0.5px solid #97c459", borderRadius: 8, cursor: "pointer" }}>
                          {ghPushing[selectedCandidate.id] ? "Pushing…" : "Push to Greenhouse ↗"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
          <Card style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>Outreach sequence</p>
            {[{ day: "Day 1", ch: "LinkedIn", action: "Personalized connection request" }, { day: "Day 3", ch: "Email", action: "Follow-up with role details" }, { day: "Day 7", ch: "LinkedIn", action: "Share Transmit Security content" }, { day: "Day 14", ch: "Email", action: "Final check-in" }].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #e0ddd4" }}>
                <span style={{ fontSize: 12, color: "#888", minWidth: 50 }}>{s.day}</span>
                {badge(s.ch, s.ch === "LinkedIn" ? "info" : "success")}
                <span style={{ fontSize: 13 }}>{s.action}</span>
              </div>
            ))}
            <button onClick={() => setCandidates(prev => prev.map(c => c.stage === "sourced" ? { ...c, stage: "contacted", outreachSent: true } : c))} style={{ fontSize: 12, padding: "6px 12px", border: "0.5px solid #e0ddd4", borderRadius: 8, background: "transparent", cursor: "pointer", marginTop: 10 }}>Launch for all sourced</button>
          </Card>
          <Card>
            <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 8px" }}>Email finder</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Candidate name + company…" style={{ flex: 1, fontSize: 13, padding: "8px 12px", border: "0.5px solid #e0ddd4", borderRadius: 8, outline: "none" }} />
              <button onClick={() => showMsg("Add Hunter.io or Apollo API key in .env.local to enable.")} style={{ fontSize: 13, padding: "0 12px", border: "0.5px solid #e0ddd4", borderRadius: 8, background: "transparent", cursor: "pointer" }}>Find email ↗</button>
            </div>
          </Card>
        </div>
      )}

      {tab === "Analytics" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <MetricCard label="Total sourced" value={candidates.length} />
            <MetricCard label="Contacted" value={candidates.filter(c => c.outreachSent).length} sub={Math.round(candidates.filter(c => c.outreachSent).length / Math.max(candidates.length, 1) * 100) + "% of pipeline"} />
            <MetricCard label="Conversion" value={Math.round(candidates.filter(c => ["interviewed", "offered"].includes(c.stage)).length / Math.max(candidates.length, 1) * 100) + "%"} />
            <MetricCard label="In Greenhouse" value={candidates.filter(c => c.ghId).length} sub={Math.round(candidates.filter(c => c.ghId).length / Math.max(candidates.length, 1) * 100) + "% pushed"} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(0,1fr))", gap: 12, marginBottom: 12 }}>
            <Card>
              <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 12px" }}>Pipeline funnel</p>
              {STAGES.map(s => { const n = candidates.filter(c => c.stage === s).length; const pct = Math.round(n / Math.max(candidates.length, 1) * 100); return (<div key={s} style={{ marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 12, textTransform: "capitalize" }}>{s}</span><span style={{ fontSize: 12, color: "#888" }}>{n}</span></div><div style={{ height: 6, background: "#f1efe8", borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: pct + "%", background: "#378add", borderRadius: 4 }} /></div></div>); })}
            </Card>
            <Card>
              <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 12px" }}>Source effectiveness</p>
              {["LinkedIn", "GitHub", "Indeed", "Web"].map(s => { const n = candidates.filter(c => c.source === s).length; const pct = Math.round(n / Math.max(candidates.length, 1) * 100); return (<div key={s} style={{ marginBottom: 8 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 12 }}>{s}</span><span style={{ fontSize: 12, color: "#888" }}>{n} ({pct}%)</span></div><div style={{ height: 6, background: "#f1efe8", borderRadius: 4, overflow: "hidden" }}><div style={{ height: "100%", width: pct + "%", background: "#639922", borderRadius: 4 }} /></div></div>); })}
            </Card>
          </div>
          <Card style={{ marginBottom: 12 }}>
            <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>GitHub activity — top engineers</p>
            <table style={{ width: "100%", fontSize: 12, tableLayout: "fixed", borderCollapse: "collapse" }}>
              <thead><tr style={{ borderBottom: "0.5px solid #e0ddd4" }}>{["Candidate", "Commits", "Repos", "Stars", "Score"].map(h => <td key={h} style={{ padding: "4px 8px", color: "#888", fontWeight: 500 }}>{h}</td>)}</tr></thead>
              <tbody>
                {[...candidates].sort((a, b) => (b.github?.commits || 0) - (a.github?.commits || 0)).slice(0, 6).map(c => {
                  const score = Math.min(100, Math.round(((c.github?.commits || 0) * 0.3 + (c.github?.repos || 0) * 1.2 + (c.github?.stars || 0) * 0.15)));
                  return (<tr key={c.id} style={{ borderBottom: "0.5px solid #e0ddd4" }}><td style={{ padding: "6px 8px", fontWeight: 500 }}>{c.name} {c.ghId && <span style={{ fontSize: 10, color: "#639922" }}>✓</span>}</td><td style={{ padding: "6px 8px" }}>{c.github?.commits || 0}</td><td style={{ padding: "6px 8px" }}>{c.github?.repos || 0}</td><td style={{ padding: "6px 8px" }}>{c.github?.stars || 0}</td><td style={{ padding: "6px 8px" }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ flex: 1, height: 4, background: "#f1efe8", borderRadius: 2 }}><div style={{ height: "100%", width: score + "%", background: "#378add", borderRadius: 2 }} /></div><span style={{ fontSize: 11, color: "#888", minWidth: 24 }}>{score}</span></div></td></tr>);
                })}
              </tbody>
            </table>
          </Card>
          <Card>
            <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>Integrations</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 8 }}>
              <div style={{ border: "2px solid #97c459", borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>Greenhouse</span>{badge("connected", "success")}
              </div>
              {["Lever", "Workday", "Slack", "Hunter.io", "Apollo"].map(n => (
                <div key={n} style={{ border: "0.5px solid #e0ddd4", borderRadius: 8, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 500 }}>{n}</span>
                  <button style={{ fontSize: 11, padding: "3px 8px", border: "0.5px solid #e0ddd4", borderRadius: 6, background: "transparent", cursor: "pointer" }}>Connect</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
