import { notFound } from "next/navigation";
import ComingSoon from "@/components/shared/ComingSoon";

/**
 * Placeholder for the player route. The path shape is final — `VideoCard` and
 * `Hero` already link here as /watch/{mediaType}/{id} — but the native <video>
 * player, custom controls and `generateMetadata` are still to come.
 */
export default async function WatchPage({
  params,
}: {
  params: Promise<{ mediaType: string; id: string }>;
}) {
  const { mediaType, id } = await params;

  // Only /watch/movie/* and /watch/tv/* are real; anything else is a bad URL.
  if (mediaType !== "movie" && mediaType !== "tv") {
    notFound();
  }

  return (
    <ComingSoon
      title="Player"
      detail={`The player for ${mediaType} ${id} isn't built yet. It will be a native <video> element with hand-built controls.`}
    />
  );
}
