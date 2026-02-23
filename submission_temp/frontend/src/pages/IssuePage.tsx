import React from "react";

export default function IssuePage() {
  const [form, setForm] = React.useState({ id: "", name: "", course: "" });
  const [out, setOut] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOut(null);
    try {
      const res = await fetch("/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      setOut(`Network error: ${err?.message || err}\nCheck that backend services are running and VERIFICATION_URL is set correctly.\nPossible causes: backend down, CORS, mixed HTTP/HTTPS.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Issue Credential</h2>
      <form onSubmit={submit} className="form">
        <div className="field">
          <label>ID</label>
          <input placeholder="e.g. user-123" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
        </div>

        <div className="field">
          <label>Name</label>
          <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="field">
          <label>Course</label>
          <input placeholder="Course name" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
        </div>

        <button type="submit" disabled={loading}>Issue Credential</button>
      </form>

      {out && <pre className="output">{out}</pre>}
    </div>
  );
}
