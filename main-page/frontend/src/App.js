import React, { useState } from "react";
import "./App.css";
// https://workspace-gilt-kappa.vercel.app/
function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // your app links
  const apps = [
    { id: "bot", name: "Bot", icon: "🤖", link: "https://chatbot-livid-three-77.vercel.app/" },
    { id: "chat", name: "Chat", icon: "💬", link: "https://chat-app-ruddy-six-38.vercel.app/" },
    { id: "chess", name: "Chess", icon: "♟️", link: "https://workspace-sel3.vercel.app" },
    { id: "conversion", name: "Conversion", icon: "🔄", link: "https://currency-converter-hazel-two.vercel.app/" },
    { id: "cab", name: "Cab", icon: "🚗", link: "https://cab-nine.vercel.app/" },
    { id: "todo", name: "Todo", icon: "✅", link: "https://todo-gamma-five-32.vercel.app/" },
    { id: "news", name: "News", icon: "📰", link: "https://workplace-news.vercel.app/" },
    { id: "voting", name: "Voting", icon: "📺", link: "https://workspace-5275.vercel.app" },
    { id: "translate", name: "Translate", icon: "🌐", link: "https://workspace-4oqc.vercel.app" },
    { id: "codereviewer", name: "Code Reviewer", icon: "🧑🏻‍💻", link: "https://workspace-gilt-kappa.vercel.app/" },
  ];

  const handleLogin = async () => {
    if (!name || !email) {
      alert("Please enter both name and email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://workspace-2tbd.onrender.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ if logged in → show Workplace dashboard
  if (user) {
    return (
      <div className="app-container">
        <div className="header">
          <h2>Welcome, {user.name} 👋</h2>
          <button
            onClick={() => setUser(null)}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: "#e74c3c",
              color: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <div className="apps-grid">
          {apps.map((app) => (
            <div key={app.id} className="app-link" id={app.id}>
              <div className="icon">{app.icon}</div>
              <div className="app-name">
                <a href={app.link} target="_blank" rel="noopener noreferrer">
                  {app.name}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text">Workplace</div>
      </div>
    );
  }

  // ✅ if not logged in → show login form
  return (
    <div style={styles.container}>
      <h2>Login to Continue</h2>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.btn} disabled={loading}>
        {loading ? "Loading..." : "Enter"}
      </button>
    </div>
  );
}

// Simple inline login page styles
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
  },
  input: {
    padding: "10px",
    margin: "5px",
    width: "220px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  btn: {
    padding: "10px 20px",
    marginTop: "10px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#4CAF50",
    color: "white",
    cursor: "pointer",
  },
};

export default App;
