import type { Metadata } from "next";
import ComingSoon from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Browse — LuminFlix",
};

export default function BrowsePage() {
  return (
    <ComingSoon
      title="Browse"
      detail="Genre and type filtering lands here, driven by ?type and ?genre search params."
    />
  );
}
