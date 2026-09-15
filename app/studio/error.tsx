"use client";

export default function StudioError({ reset }: { reset: () => void }) {
  return <main className="studio-content"><div className="studio-empty"><h1>The studio couldn’t load.</h1><p>Please try again. If this continues, ask the site owner to check the server and its storage.</p><button className="studio-primary" onClick={reset}>Try again</button></div></main>;
}
