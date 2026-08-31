import type { Metadata } from "next";
import ComingSoon from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "My List — LuminFlix",
};

export default function MyListPage() {
  return (
    <ComingSoon
      title="My List"
      detail="Saved titles appear here once profiles and auth exist — this data is per-user, so it will never be cached."
    />
  );
}
