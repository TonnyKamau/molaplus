import type { Metadata } from "next";
import { pageMetadata } from "../../lib/seo";
import { DistributorDirectory } from "./DistributorDirectory";
import { distributors } from "./distributors";

export const metadata: Metadata = pageMetadata({
  title: "Find a MolaPlus Distributor Near You — 3,800+ Stockists",
  description:
    "Find MolaPlus feed supplements and fertilizers near you. Search 3,800+ distributors and agrovets by town, see the nearest stockists on a map and call them directly.",
  path: "/distributors",
  keywords: ["MolaPlus distributors", "agrovet near me", "where to buy MolaPlus", "feed supplement stockist"],
});

export default function Page() {
  return <DistributorDirectory distributors={distributors} />;
}
