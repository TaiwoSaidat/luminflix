"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Check, Play, ThumbsUp, VolumeX, X } from "lucide-react";

import { MediaItem } from "@/types";
import { getTitleDetails } from "@/lib/actions/media";
import { SkeletonText } from "../shared/Skeleton";
import TitleBadges from "../shared/TitleBadges";
import IconButton from "../ui/IconButton";
import PreviewPlayer from "./PreviewPlayer";
import EpisodesSection from "../titleModalComponents/EpisodesSection";
import MoreLikeThis from "../titleModalComponents/MoreLikeThis";

interface TitleModalProps {
  /** The row card's item — rendered immediately, then enriched by the action. */
  movie: MediaItem;
  onClose: () => void;
}

/** A right-column entry (cast, genres) that renders nothing when empty. */
const MetaList: React.FC<{ label: string; values?: string[] }> = ({
  label,
  values,
}) => {
  if (!values || values.length === 0) return null;

  return (
    <p className="small-14 leading-relaxed">
      <span className="capitalize text-[#9C949B]">{label}: </span>
      {values.join(", ")}
    </p>
  );
};

/**
 * The title detail modal, opened by the chevron on the hover preview.
 *
 * Row cards carry list data only, so `runtime`, `certification`, `cast` and the
 * recommendation grid are fetched on open through the `getTitleDetails` Server
 * Action. Everything the card already has (artwork, title, overview, year,
 * genres) renders immediately and the fetched fields fill in behind skeletons,
 * so the modal never opens onto a blank panel.
 *
 * Rendered through a portal into <body>: rows clip their overflow, and the
 * modal must sit above the header and every row regardless of where the card
 * that opened it lives.
 */
const TitleModal: React.FC<TitleModalProps> = ({ movie, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [detail, setDetail] = useState<MediaItem>(movie);
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [pending, setPending] = useState(true);

  const headingId = `title-modal-${movie.mediaType}-${movie.id}`;
  const watchHref = `/watch/${movie.mediaType}/${movie.id}`;

  useEffect(() => {
    let active = true;

    getTitleDetails(movie.mediaType, movie.id)
      .then((result) => {
        if (!active) return;
        // A null result means the session went away — the card data already on
        // screen stays, rather than throwing the user out of the modal.
        if (result) {
          setDetail(result.detail);
          setRecommendations(result.recommendations);
        }
      })
      .catch(() => {
        // Non-fatal: the modal still shows everything the card knew.
      })
      .finally(() => {
        if (active) setPending(false);
      });

    return () => {
      active = false;
    };
  }, [movie.mediaType, movie.id]);

  // Escape closes, focus starts on the close button, and the page behind the
  // modal is locked so a scroll gesture moves the modal, not the row underneath.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-100 overflow-y-auto overscroll-contain bg-black/80 px-4 py-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-lg bg-zinc-900 text-white shadow-2xl shadow-black/70"
      >
        <IconButton
          ref={closeRef}
          icon={X}
          variant="overlay"
          onClick={onClose}
          label={`Close details for ${detail.title}`}
          className="absolute right-4 top-4 z-10"
        />

        <h2 id={headingId} className="sr-only">
          {detail.title}
        </h2>

        <PreviewPlayer
          movie={detail}
          priority
          sizes="(max-width: 1024px) 100vw, 896px"
          logoClassName="h-16 w-1/2 md:h-24"
        >
          <div className="flexBetween gap-4">
            <div className="flex items-center gap-3">
              <Link
                href={watchHref}
                className="flex items-center gap-2 rounded bg-white px-6 py-2 regular-16 font-semibold text-black transition hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                Play
              </Link>

              {/* My List and ratings have no backing store yet — shown as
                  disabled rather than as live controls that do nothing. */}
              <IconButton
                icon={Check}
                size="lg"
                disabled
                title="My List is not available yet"
                label={`Add ${detail.title} to My List`}
              />
              <IconButton
                icon={ThumbsUp}
                size="lg"
                disabled
                title="Ratings are not available yet"
                label={`Rate ${detail.title}`}
              />
            </div>

            {/* Audio has nothing to mute until the trailer player lands. */}
            <IconButton
              icon={VolumeX}
              size="lg"
              disabled
              title="Audio arrives with the player"
              label="Toggle preview audio"
            />
          </div>
        </PreviewPlayer>

        <div className="space-y-10 px-6 py-6 md:px-12 md:py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
              <TitleBadges
                media={detail}
                size="md"
                pendingCertification={pending}
              />

              <p className="small-16 leading-relaxed">
                {detail.overview || "No synopsis available."}
              </p>
            </div>

            <div className="space-y-3">
              {pending && !detail.cast ? (
                <SkeletonText lines={2} />
              ) : (
                <MetaList label="cast" values={detail.cast} />
              )}
              <MetaList label="genres" values={detail.genres} />
            </div>
          </div>

          {detail.mediaType === "tv" && <EpisodesSection title={detail.title} />}

          <MoreLikeThis items={recommendations} pending={pending} />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TitleModal;
