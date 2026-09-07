"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus } from "lucide-react";
import { MediaItem } from "@/types";
import { formatDuration } from "@/lib/utils";
import { Skeleton, SkeletonText } from "../shared/Skeleton";
import TitleBadges from "../shared/TitleBadges";
import IconButton from "../ui/IconButton";

/** Matches the grid so the pending state occupies the same space as the result. */
const SKELETON_CARDS = [1, 2, 3, 4, 5, 6];

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-md bg-zinc-800">
    <Skeleton tone="onSurface" radius="none" className="aspect-video w-full" />
    <div className="space-y-2 p-4">
      <Skeleton tone="onSurface" className="h-3 w-1/2" />
      <SkeletonText tone="onSurface" lines={2} />
    </div>
  </div>
);

interface MoreLikeThisProps {
  items: MediaItem[];
  /** True while the recommendations request is in flight. */
  pending: boolean;
}

/**
 * "More Like This" — recommendations from `getRecommendations()`.
 *
 * These come from a list endpoint, so `runtime` and `certification` are absent
 * on most entries; each is guarded rather than rendered blank.
 */
const MoreLikeThis: React.FC<MoreLikeThisProps> = ({ items, pending }) => {
  if (!pending && items.length === 0) return null;

  return (
    <section aria-labelledby="more-like-this-heading" className="space-y-4">
      <h3 id="more-like-this-heading" className="large-24">
        More Like This
      </h3>

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-busy={pending}
      >
        {pending
          ? SKELETON_CARDS.map((card) => <CardSkeleton key={card} />)
          : items.map((item) => {
              const artwork = item.backdrop ?? item.poster;

              return (
                <Link
                  key={`${item.mediaType}-${item.id}`}
                  href={`/watch/${item.mediaType}/${item.id}`}
                  className="group overflow-hidden rounded-md bg-zinc-800 transition hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <div className="relative aspect-video w-full bg-zinc-900">
                    {artwork ? (
                      <Image
                        src={artwork}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
                        className={
                          item.backdrop ? "object-cover" : "object-contain"
                        }
                      />
                    ) : (
                      <div className="h-full w-full flexCenter p-4">
                        <span className="small-14 text-center text-zinc-400 line-clamp-3">
                          {item.title}
                        </span>
                      </div>
                    )}

                    <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 small-12">
                      {item.runtime ? formatDuration(item.runtime) : item.year}
                    </span>

                    <span className="absolute inset-0 flexCenter opacity-0 transition-opacity group-hover:opacity-100">
                      <IconButton
                        icon={Play}
                        iconClassName="fill-current"
                        variant="overlay"
                        size="xl"
                        decorative
                        label=""
                        className="border-2 border-white bg-black/50"
                      />
                    </span>
                  </div>

                  <div className="space-y-2 p-4">
                    <div className="flexBetween gap-2">
                      <TitleBadges media={item} />

                      {/* My List has no backing store yet, and this sits inside
                          a link — a real button here would be invalid markup. */}
                      <IconButton
                        icon={Plus}
                        size="sm"
                        decorative
                        label=""
                        title="My List is not available yet"
                      />
                    </div>

                    <p className="small-14 text-zinc-400 line-clamp-4">
                      {item.overview || "No synopsis available."}
                    </p>
                  </div>
                </Link>
              );
            })}
      </div>
    </section>
  );
};

export default MoreLikeThis;
