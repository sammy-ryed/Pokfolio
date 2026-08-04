"use client";

import { useState } from "react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export default function Home() {
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/github/${username}`);
      const data = await res.json();
      setStats(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Statmon</h1>
      <p>Enter a GitHub username to generate a stat card.</p>

      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="github username"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Generate"}
        </button>
      </form>

      {stats && (
        <pre style={{ marginTop: "1.5rem" }}>
          {JSON.stringify(stats, null, 2)}
        </pre>
      )}
    </main>
  );
}
