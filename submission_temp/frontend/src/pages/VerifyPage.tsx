import React from "react";

export default function VerifyPage() {
  const [id, setId] = React.useState("");
  const [out, setOut] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOut(null);
    try {
      const res = await fetch("/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const text = await res.text();
      let data: any = text;
      try {
        data = JSON.parse(text);
      } catch {
        // leave as text
      }

      if (!res.ok) {
        setOut(`HTTP ${res.status} ${res.statusText}\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`);
      } else {
        setOut(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      setOut(`Network error: ${err?.message || err}\nCheck that verification service is running on port 6000 and CORS is allowed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Verify Credential</h2>
      <form onSubmit={submit} className="form">
        <div className="field">
          <label>ID</label>
          <input placeholder="e.g. user-123" value={id} onChange={(e) => setId(e.target.value)} />
        </div>

        <button type="submit" disabled={loading}>Verify Credential</button>
      </form>

      {out && <pre className="output">{out}</pre>}
    </div>
  );
}
