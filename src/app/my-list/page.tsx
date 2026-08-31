import type { Metadata } from "next";
import ComingSoon from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "My List — LuminFlix",
};

export default function MyListPage() {
  return (
    <ComingSoon
      title="My List"
      detail="Saved titles appear here once there is somewhere to store them. Sign-in works — persistence is the remaining blocker, and this data is per-user, so it will never be cached."
    />
  );
}
