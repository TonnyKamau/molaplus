"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";

export function Login({ onAuthenticated }: { onAuthenticated: () => void | Promise<void> }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch("/api/studio/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(data.email || "").trim(), password: String(data.password || "") }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not sign in. Try again.");
      await onAuthenticated();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not sign in. Try again.");
      setBusy(false);
    }
  }

  const loading = busy;
  return <main className={`studio-login ${loading ? "is-loading" : ""}`}><div className="studio-login__story"><Link href="/blog" className="studio-brand">m<span>+</span><small>MOLAPLUS / STUDIO</small></Link><div><p className="studio-kicker">Good stories start here</p><h1>From your farm.<br /><em>To their next<br />great idea.</em></h1><p>A space to write, refine and share the knowledge that helps farms grow.</p></div><span>FIELD NOTES · MOLAPLUS</span></div><div className="studio-login__form"><Link href="/blog">← Back to the blog</Link><div><p className="studio-kicker">Your publishing desk</p><h2>Welcome to the studio.</h2><p>Sign in to manage your stories and bring your next idea to life.</p><form onSubmit={submit} aria-busy={loading}><label>Email address<input name="email" type="email" autoComplete="username" required placeholder="you@molaplus.org" disabled={loading} /></label><label>Password<span className="studio-password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required disabled={loading} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)} disabled={loading}>{showPassword ? "Hide" : "Show"}</button></span></label>{error && <p role="alert" className="studio-error">{error}</p>}<button className="studio-primary" disabled={loading}>{loading ? <><span className="studio-spinner" aria-hidden="true" />Opening your studio…</> : <>Sign in to the studio<span aria-hidden="true">↗</span></>}</button><p className="studio-hint" role="status" aria-live="polite">{loading ? "Loading your publishing workspace. This will only take a moment." : "Access is reserved for the MolaPlus publishing team."}</p></form></div></div></main>;
}
