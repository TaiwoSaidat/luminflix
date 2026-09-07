"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MediaItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import PreviewCard, { PreviewRect } from "./PreviewCard";
import TitleModal from "./TitleModal";

interface VideoCardProps {
  movie: MediaItem;
  /** 0–100 watch progress. Renders the continue-watching bar when set. */
  progress?: number;
}

/** Netflix-ish dwell before the preview opens, so scrubbing a row is quiet. */
const OPEN_DELAY = 500;
/** Grace period covering the gap between the card and the popup. */
const CLOSE_DELAY = 150;
/** How much wider the preview is than the card it replaces. */
const PREVIEW_SCALE = 1.4;
/** Keeps the popup off the viewport edges. */
const VIEWPORT_MARGIN = 12;

const VideoCard: React.FC<VideoCardProps> = ({ movie, progress }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [rect, setRect] = useState<PreviewRect | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const watchHref = `/watch/${movie.mediaType}/${movie.id}`;
  // A poster is 2:3, so it can't fill a 16:9 frame without cropping away the
  // top and bottom of the art. It's contained rather than covered when it
  // stands in for a missing backdrop.
  const artwork = movie.backdrop ?? movie.poster;
  const isPosterFallback = !movie.backdrop && Boolean(movie.poster);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };

  /**
   * The popup is fixed-positioned (see PreviewCard), so its coordinates are
   * measured from the card at open time: centred on the card, grown around it,
   * then clamped so it never hangs off the left or right edge of the viewport.
   */
  const measure = useCallback((): PreviewRect | null => {
    const el = cardRef.current;
    if (!el) return null;

    const bounds = el.getBoundingClientRect();
    const maxWidth = window.innerWidth - VIEWPORT_MARGIN * 2;
    const width = Math.min(bounds.width * PREVIEW_SCALE, maxWidth);
    const growth = (width - bounds.width) / 2;

    const left = Math.min(
      Math.max(bounds.left - growth, VIEWPORT_MARGIN),
      window.innerWidth - width - VIEWPORT_MARGIN
    );
    // The media area is 16:9 like the card, so growing it upward by half the
    // extra height keeps the artwork visually anchored where the card was.
    const top = Math.max(bounds.top - (growth * 9) / 16, VIEWPORT_MARGIN);

    return { top, left, width };
  }, []);

  const open = useCallback(() => {
    clearTimers();
    openTimer.current = setTimeout(() => setRect(measure()), OPEN_DELAY);
  }, [measure]);

  const close = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setRect(null), CLOSE_DELAY);
  }, []);

  const keepOpen = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  useEffect(() => clearTimers, []);

  // Fixed coordinates go stale the moment anything moves, and the row itself
  // scrolls horizontally — so any scroll or resize dismisses the preview
  // rather than leaving it stranded beside its card.
  useEffect(() => {
    if (!rect) return;

    const dismiss = () => {
      clearTimers();
      setRect(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };

    window.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [rect]);

  return (
    <div
      ref={cardRef}
      className="relative cursor-pointer min-w-62 md:min-w-78"
      onMouseEnter={open}
      onMouseLeave={close}
      // Keyboard users get the same preview: it opens when focus lands
      // anywhere in the card and closes when focus leaves it entirely.
      onFocus={open}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
      }}
    >
      <Link href={watchHref} className="block">
        <div className="relative aspect-video overflow-hidden rounded-sm bg-zinc-900">
          {artwork ? (
            <Image
              src={artwork}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 250px, 312px"
              className={isPosterFallback ? "object-contain" : "object-cover"}
            />
          ) : (
            <div className="w-full h-full flexCenter p-4">
              <span className="small-14 text-zinc-400 text-center line-clamp-3">
                {movie.title}
              </span>
            </div>
          )}

          {/* Scrim under the title treatment — backdrops are busy and a logo
              dropped straight onto one is often unreadable. */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/85 via-black/35 to-transparent" />

          {movie.logo ? (
            <div className="absolute bottom-3 left-3 right-3 h-10">
              <Image
                src={movie.logo}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 250px, 312px"
                className="object-contain object-left-bottom drop-shadow-md"
              />
            </div>
          ) : (
            <h3 className="absolute bottom-3 left-3 right-3 small-14 font-semibold line-clamp-2 drop-shadow-md">
              {movie.title}
            </h3>
          )}
        </div>

        {typeof progress === "number" && (
          <div
            className="mt-2 h-[3px] w-full bg-zinc-600"
            role="progressbar"
            aria-label={`${movie.title} watch progress`}
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-luminflix-red"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        )}
      </Link>

      {/* No SSR guard is needed around document: `rect` is only ever set from
          a pointer or focus handler, which cannot run during a server render. */}
      {rect &&
        createPortal(
          <PreviewCard
            movie={movie}
            rect={rect}
            onOpenDetails={() => {
              clearTimers();
              setRect(null);
              setDetailsOpen(true);
            }}
            onMouseEnter={keepOpen}
            onMouseLeave={close}
          />,
          document.body
        )}

      {detailsOpen && (
        <TitleModal movie={movie} onClose={() => setDetailsOpen(false)} />
      )}
    </div>
  );
};

export default VideoCard;
