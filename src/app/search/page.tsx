import type { Metadata } from "next";
import ComingSoon from "@/components/shared/ComingSoon";

export const metadata: Metadata = {
  title: "Search — LuminFlix",
};

export default function SearchPage() {
  return (
    <ComingSoon
      title="Search"
      detail="Results will render server-side from the ?q search param."
    />
  );
}
