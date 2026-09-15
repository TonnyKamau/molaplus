"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Login({ configured }: { configured: boolean }) {
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try { const data = Object.fromEntries(new FormData(event.currentTarget)); const response = await fetch("/api/studio/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); router.refresh(); }
    catch (error) { setError(error instanceof Error ? error.message : "Could not sign in. Try again."); } finally { setBusy(false); }
  }
  return <main className="studio-login"><div className="studio-login__story"><Link href="/blog" className="studio-brand">m<span>+</span><small>MOLAPLUS / STUDIO</small></Link><div><p className="studio-kicker">Good stories start here</p><h1>From your farm.<br /><em>To their next<br />great idea.</em></h1><p>A space to write, refine and share the knowledge that helps farms grow.</p></div><span>FIELD NOTES · MOLAPLUS AFRICA</span></div><div className="studio-login__form"><Link href="/blog">← Back to the blog</Link><div><p className="studio-kicker">Your publishing desk</p><h2>Welcome to the studio.</h2><p>Sign in to manage your stories and bring your next idea to life.</p>{configured ? <form onSubmit={submit}><label>Email address<input name="email" type="email" autoComplete="username" required placeholder="you@molaplusafrica.com" /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p role="alert" className="studio-error">{error}</p>}<button className="studio-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in to the studio"}<span aria-hidden="true">↗</span></button><p className="studio-hint">Access is reserved for the MolaPlus publishing team.</p></form> : <div className="studio-notice"><h3>Studio setup is needed</h3><p>The site owner needs to run <code>node scripts/setup-studio.mjs</code> on the server to create the editor credentials, then restart the website.</p></div>}</div></div></main>;
}
