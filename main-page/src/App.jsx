import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!name || !email) {
      alert("Please enter both name and email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/users", {
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

  if (user) {
    return (
      <div style={styles.container}>
        <h2>Welcome, {user.name} 👋</h2>
        <p>Email: {user.email}</p>
        <button
          onClick={() => setUser(null)}
          style={styles.logoutBtn}
        >
          Logout
        </button>
      </div>
    );
  }

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
  logoutBtn: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#e74c3c",
    color: "white",
    cursor: "pointer",
  },
};

export default App;
