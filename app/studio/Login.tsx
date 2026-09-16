"use client";
import { useState, useTransition, type SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export function Login() {
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false); const [showPassword, setShowPassword] = useState(false); const [isPending, startTransition] = useTransition(); const router = useRouter();
  const loading = busy || isPending;
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const { error } = await createClient().auth.signInWithPassword({ email: String(data.email || "").trim(), password: String(data.password || "") });
      if (error) throw new Error(error.code === "invalid_credentials" ? "Email or password is incorrect." : error.message);
      startTransition(() => router.refresh());
      setBusy(false);
    }
    catch (error) { setError(error instanceof Error ? error.message : "Could not sign in. Try again."); setBusy(false); }
  }
  return <main className={`studio-login ${loading ? "is-loading" : ""}`}><div className="studio-login__story"><Link href="/blog" className="studio-brand">m<span>+</span><small>MOLAPLUS / STUDIO</small></Link><div><p className="studio-kicker">Good stories start here</p><h1>From your farm.<br /><em>To their next<br />great idea.</em></h1><p>A space to write, refine and share the knowledge that helps farms grow.</p></div><span>FIELD NOTES · MOLAPLUS AFRICA</span></div><div className="studio-login__form"><Link href="/blog">← Back to the blog</Link><div><p className="studio-kicker">Your publishing desk</p><h2>Welcome to the studio.</h2><p>Sign in to manage your stories and bring your next idea to life.</p><form onSubmit={submit} aria-busy={loading}><label>Email address<input name="email" type="email" autoComplete="username" required placeholder="you@molaplusafrica.com" disabled={loading} /></label><label>Password<span className="studio-password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required disabled={loading} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)} disabled={loading}>{showPassword ? "Hide" : "Show"}</button></span></label>{error && <p role="alert" className="studio-error">{error}</p>}<button className="studio-primary" disabled={loading}>{loading ? <><span className="studio-spinner" aria-hidden="true" />Opening your studio…</> : <>Sign in to the studio<span aria-hidden="true">↗</span></>}</button><p className="studio-hint" role="status" aria-live="polite">{loading ? "Loading your publishing workspace. This will only take a moment." : "Access is reserved for the MolaPlus publishing team."}</p></form></div></div></main>;
}
