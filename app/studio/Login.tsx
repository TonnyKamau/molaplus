"use client";
import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { toast } from "../../lib/toast";

export function Login({ onAuthenticated }: { onAuthenticated: () => Promise<boolean> }) {
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const response = await fetch("/api/studio/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: String(data.email || "").trim(), password: String(data.password || "") }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not sign in. Try again.");
      const ok = await onAuthenticated();
      if (!ok) {
        toast.error("Signed in, but the session didn't stick. Check that cookies aren't blocked and try again.");
        setBusy(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in. Try again.");
      setBusy(false);
    }
  };

  const loading = busy;
  return <main className={`studio-login ${loading ? "is-loading" : ""}`}><div className="studio-login__story"><Link href="/blog" className="studio-brand">m<span>+</span><small>MOLAPLUS / STUDIO</small></Link><div><p className="studio-kicker">Good stories start here</p><h1>From your farm.<br /><em>To their next<br />great idea.</em></h1><p>A space to write, refine and share the knowledge that helps farms grow.</p></div><span>FIELD NOTES · MOLAPLUS</span></div><div className="studio-login__form"><Link href="/blog">← Back to the blog</Link><div><p className="studio-kicker">Your publishing desk</p><h2>Welcome to the studio.</h2><p>Sign in to manage your stories and bring your next idea to life.</p><form onSubmit={submit} aria-busy={loading}><label>Email address<input name="email" type="email" autoComplete="username" required placeholder="you@molaplus.org" disabled={loading} /></label><label>Password<span className="studio-password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required disabled={loading} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)} disabled={loading}>{showPassword ? "Hide" : "Show"}</button></span></label><button className="studio-primary" disabled={loading}>{loading ? <><span className="studio-spinner" aria-hidden="true" />Opening your studio…</> : <>Sign in to the studio<span aria-hidden="true">↗</span></>}</button><p className="studio-hint" role="status" aria-live="polite">{loading ? "Loading your publishing workspace. This will only take a moment." : "Access is reserved for the MolaPlus publishing team."}</p></form></div></div></main>;
}
