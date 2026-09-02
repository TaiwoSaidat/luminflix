"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Check, Play, ThumbsUp, VolumeX, X } from "lucide-react";

import { MediaItem } from "@/types";
import { formatDuration } from "@/lib/utils";
import { getTitleDetails } from "@/lib/actions/media";
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

const MetaListSkeleton = () => (
  <div className="space-y-2" aria-hidden="true">
    <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-800" />
    <div className="h-3 w-full animate-pulse rounded bg-zinc-800/70" />
  </div>
);

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
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={`Close details for ${detail.title}`}
          className="absolute right-4 top-4 z-10 flexCenter h-9 w-9 rounded-full bg-black/70 transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

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
              <button
                type="button"
                disabled
                title="My List is not available yet"
                aria-label={`Add ${detail.title} to My List`}
                className="flexCenter h-10 w-10 rounded-full border-2 border-white/40 text-white/50 disabled:cursor-not-allowed"
              >
                <Check className="h-5 w-5" />
              </button>
              <button
                type="button"
                disabled
                title="Ratings are not available yet"
                aria-label={`Rate ${detail.title}`}
                className="flexCenter h-10 w-10 rounded-full border-2 border-white/40 text-white/50 disabled:cursor-not-allowed"
              >
                <ThumbsUp className="h-5 w-5" />
              </button>
            </div>

            {/* Audio has nothing to mute until the trailer player lands. */}
            <button
              type="button"
              disabled
              title="Audio arrives with the player"
              aria-label="Toggle preview audio"
              className="flexCenter h-10 w-10 rounded-full border-2 border-white/40 text-white/50 disabled:cursor-not-allowed"
            >
              <VolumeX className="h-5 w-5" />
            </button>
          </div>
        </PreviewPlayer>

        <div className="space-y-10 px-6 py-6 md:px-12 md:py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-4 md:col-span-2">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 small-14">
                {detail.year && <span>{detail.year}</span>}
                {detail.runtime && <span>{formatDuration(detail.runtime)}</span>}
                <span className="border border-white/40 px-1.5 py-0.5">HD</span>
                <span className="font-semibold text-green-500">
                  {detail.matchScore}% Match
                </span>
                {detail.certification ? (
                  <span className="border border-white/40 px-1.5 py-0.5">
                    {detail.certification}
                  </span>
                ) : (
                  pending && (
                    <span
                      aria-hidden="true"
                      className="h-5 w-10 animate-pulse rounded bg-zinc-800"
                    />
                  )
                )}
              </div>

              <p className="small-16 leading-relaxed">
                {detail.overview || "No synopsis available."}
              </p>
            </div>

            <div className="space-y-3">
              {pending && !detail.cast ? (
                <MetaListSkeleton />
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
