import type { Metadata } from "next";
import "./studio.css";
import "../blog/blog.css";

export const metadata: Metadata = { title: "Publishing Studio | MolaPlus Africa", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default function StudioLayout({ children }: { children: React.ReactNode }) { return <div className="studio">{children}</div>; }
