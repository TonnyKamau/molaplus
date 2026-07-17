import type { Metadata } from "next";
import { DistributorDirectory } from "./DistributorDirectory";
import { distributors } from "./distributors";

export const metadata: Metadata = {
  title: "Distributors | MolaPlus Africa",
  description:
    "Search the MolaPlus Africa distributor directory and call authorized distributors directly.",
};

export default function Page() {
  return <DistributorDirectory distributors={distributors} />;
}
