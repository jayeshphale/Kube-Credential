import React from "react";

import IssuePage from "./pages/IssuePage";
import VerifyPage from "./pages/VerifyPage";

export default function App() {
  const [route, setRoute] = React.useState<string>("/issue");

  return (
    <div className="container">
      <header>
        <div>
          <h1>Kube Credential</h1>
          <div className="meta">Issue and verify simple JSON credentials</div>
        </div>

        <nav>
          <button className={route === "/issue" ? 'active' : ''} onClick={() => setRoute("/issue")}>Issue</button>
          <button className={route === "/verify" ? 'active' : ''} onClick={() => setRoute("/verify")}>Verify</button>
        </nav>
      </header>

      <div className="layout">
        <div className="card">{route === "/issue" ? <IssuePage /> : <VerifyPage />}</div>
        <aside className="card">
          <h3>Status</h3>
          <p className="meta">Local backend: issuance @ 5000, verification @ 6000 (vite proxy active)</p>
          <p className="meta">In Kubernetes, set VERIFICATION_URL to the verification service DNS.</p>
        </aside>
      </div>
    </div>
  );
}
