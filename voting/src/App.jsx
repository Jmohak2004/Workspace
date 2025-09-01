import { useEffect, useMemo, useState } from "react";
import "./App.css";

export default function App() {
  // --- Auth ---
  const [userName, setUserName] = useState(() => localStorage.getItem("userName") || "");
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem("userName"));

  // --- Data ---
  const [polls, setPolls] = useState(() => {
    const saved = localStorage.getItem("polls");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: cryptoRandomId(),
            question: "What's your favorite programming language?",
            options: ["JavaScript", "Python", "C++"],
            votes: [0, 0, 0],
            creator: "System",
            createdAt: Date.now(),
          },
        ];
  });

  // Optional: restrict to one vote per user per poll (toggle to false to allow multi-vote)
  const ONE_VOTE_PER_USER = true;
  const [votesByUser, setVotesByUser] = useState(() => {
    const saved = localStorage.getItem("votesByUser");
    return saved ? JSON.parse(saved) : {}; // shape: { [userName]: { [pollId]: optionIndex } }
  });

  // --- UI state ---
  const [view, setView] = useState("list"); // 'login' | 'list' | 'vote' | 'create'
  const [selectedPollId, setSelectedPollId] = useState(null);
  const selectedPoll = useMemo(
    () => polls.find((p) => p.id === selectedPollId) || null,
    [polls, selectedPollId]
  );

  // --- Create form ---
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState("");
  const [msg, setMsg] = useState("");

  // --- Persistence ---
  useEffect(() => localStorage.setItem("polls", JSON.stringify(polls)), [polls]);
  useEffect(() => localStorage.setItem("votesByUser", JSON.stringify(votesByUser)), [votesByUser]);

  // Utilities
  function cryptoRandomId() {
    // Good enough for client ids
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  function parseOptions(raw) {
    // Accept comma-separated or newline-separated
    const parts = raw
      .split(/[\n,]/g)
      .map((s) => s.trim())
      .filter(Boolean);
    // De-duplicate while preserving order
    const seen = new Set();
    const unique = [];
    for (const p of parts) {
      if (!seen.has(p.toLowerCase())) {
        seen.add(p.toLowerCase());
        unique.push(p);
      }
    }
    return unique.slice(0, 10); // cap at 10 options for UX
  }

  // --- Handlers ---
  const handleLogin = () => {
    const name = userName.trim();
    if (!name) return setMsg("Please enter your name.");
    localStorage.setItem("userName", name);
    setLoggedIn(true);
    setMsg("");
    setView("list");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem("userName");
    setUserName("");
    setView("login");
  };

  const handleCreatePoll = () => {
    const q = newQuestion.trim();
    const opts = parseOptions(newOptions);

    if (!q) return setMsg("Poll question cannot be empty.");
    if (opts.length < 2) return setMsg("Add at least two valid options.");

    const newPoll = {
      id: cryptoRandomId(),
      question: q,
      options: opts,
      votes: Array(opts.length).fill(0),
      creator: userName || "Anonymous",
      createdAt: Date.now(),
    };

    setPolls((prev) => [newPoll, ...prev]);
    setNewQuestion("");
    setNewOptions("");
    setMsg("✅ Poll created!");
    // Go back to list so the user can see it immediately
    setView("list");
  };

  const handleVote = (pollId, optionIndex) => {
    // One-vote-per-user enforcement
    if (ONE_VOTE_PER_USER) {
      const userMap = votesByUser[userName] || {};
      if (userMap[pollId] !== undefined) {
        setMsg("You have already voted on this poll.");
        return;
      }
    }

    setPolls((prev) =>
      prev.map((p) =>
        p.id === pollId
          ? { ...p, votes: p.votes.map((v, i) => (i === optionIndex ? v + 1 : v)) }
          : p
      )
    );

    if (ONE_VOTE_PER_USER) {
      setVotesByUser((prev) => {
        const forUser = prev[userName] ? { ...prev[userName] } : {};
        forUser[pollId] = optionIndex;
        return { ...prev, [userName]: forUser };
      });
    }

    setMsg("Thanks for voting!");
    setView("list");
  };

  // --- Derived helpers ---
  const totalVotes = (poll) => poll.votes.reduce((a, b) => a + b, 0);
  const pct = (numer, denom) => (denom === 0 ? "0%" : `${Math.round((numer / denom) * 100)}%`);

  // --- Screens ---
  if (!loggedIn) {
    return (
      <div className="wrap">
        <Card>
          <h1>🗳️ Simple Voting App</h1>
          <p className="muted">Enter your name to continue</p>
          <input
            className="input"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button className="btn primary" onClick={handleLogin}>Enter</button>
          {msg && <p className="msg">{msg}</p>}
        </Card>
      </div>
    );
  }

  return (
    <div className="wrap">
      <Header
        userName={userName}
        onNav={(v) => setView(v)}
        view={view}
        onLogout={handleLogout}
      />

      {view === "list" && (
        <section className="section">
          <h2>Available Polls</h2>
          {polls.length === 0 && <p className="muted">No polls yet. Create one!</p>}
          <div className="grid">
            {polls.map((p) => {
              const tv = totalVotes(p);
              return (
                <Card key={p.id}>
                  <h3 className="question">{p.question}</h3>
                  <p className="meta">
                    By <b>{p.creator}</b> • {new Date(p.createdAt).toLocaleString()}
                  </p>
                  <div className="results">
                    {p.options.map((opt, i) => (
                      <div key={i} className="barRow">
                        <div className="barMeta">
                          <span>{opt}</span>
                          <span className="count">
                            {p.votes[i]} ({pct(p.votes[i], tv)})
                          </span>
                        </div>
                        <div className="barTrack">
                          <div
                            className="barFill"
                            style={{ width: pct(p.votes[i], tv) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn"
                    onClick={() => {
                      setSelectedPollId(p.id);
                      setView("vote");
                      setMsg("");
                    }}
                  >
                    Vote
                  </button>
                </Card>
              );
            })}
          </div>
          {msg && <p className="msg">{msg}</p>}
        </section>
      )}

      {view === "vote" && selectedPoll && (
        <section className="section">
          <Card>
            <button className="btn small" onClick={() => setView("list")}>← Back</button>
            <h2 className="question">{selectedPoll.question}</h2>
            <div className="options">
              {selectedPoll.options.map((opt, i) => (
                <button
                  key={i}
                  className="btn option"
                  onClick={() => handleVote(selectedPoll.id, i)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Card>
        </section>
      )}

      {view === "create" && (
        <section className="section">
          <Card>
            <button className="btn small" onClick={() => setView("list")}>← Back</button>
            <h2>Create a New Poll</h2>
            <label className="label">Question</label>
            <input
              className="input"
              type="text"
              placeholder="e.g., Which framework do you prefer?"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <label className="label">Options</label>
            <textarea
              className="textarea"
              placeholder={"Enter options separated by commas or new lines, e.g.\nReact\nVue\nAngular"}
              value={newOptions}
              onChange={(e) => setNewOptions(e.target.value)}
              rows={5}
            />
            <div className="row">
              <button className="btn primary" onClick={handleCreatePoll}>
                Create Poll
              </button>
              <button
                className="btn ghost"
                onClick={() => {
                  setNewQuestion("");
                  setNewOptions("");
                  setMsg("");
                }}
              >
                Reset
              </button>
            </div>
            {msg && <p className="msg">{msg}</p>}
          </Card>
        </section>
      )}
    </div>
  );
}

/* ---------- Tiny presentational helpers ---------- */

function Header({ userName, onNav, view, onLogout }) {
  return (
    <header className="header">
      <div className="brand">🗳️ Votify</div>
      <nav className="nav">
        <button
          className={`tab ${view === "list" ? "active" : ""}`}
          onClick={() => onNav("list")}
        >
          Polls
        </button>
        <button
          className={`tab ${view === "create" ? "active" : ""}`}
          onClick={() => onNav("create")}
        >
          Create Poll
        </button>
      </nav>
      <div className="user">
        <span className="muted">Hi,</span> <b>{userName}</b>
        <button className="btn small ghost" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

function Card({ children }) {
  return <div className="card">{children}</div>;
}
