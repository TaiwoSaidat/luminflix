import React from "react";

interface ErrorStateProps {
  title: string;
  detail: string;
  /**
   * Next's error hash. Safe to show — it is an opaque id, not the message — and
   * it is the only thing that lets a report be matched to a server log entry.
   */
  digest?: string;
  /** The actions: "Try again", "Go home". Composed by the caller. */
  children?: React.ReactNode;
}

/**
 * The centred message block shared by every failure screen — `error.tsx` at
 * each level, `not-found.tsx`, and `global-error.tsx`.
 *
 * Deliberately just the block, not a page: `error.tsx` files are Client
 * Components by definition, so they cannot render `Header` (an async Server
 * Component), while `not-found.tsx` can and does. Owning the page shell here
 * would force one of those two to be wrong.
 *
 * It never takes the error object itself, only a title, a written explanation
 * and the digest. `error.message` can carry provider URLs and internals, so
 * there is no prop that could accidentally render it.
 */
const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  detail,
  digest,
  children,
}) => (
  <div className="max-w-xl space-y-5 text-center">
    <h1 className="large-30 md:large-40">{title}</h1>

    <p className="regular-16 leading-relaxed text-zinc-400">{detail}</p>

    {children && (
      <div className="flexCenter flex-wrap gap-3 pt-2">{children}</div>
    )}

    {digest && (
      <p className="small-12 text-zinc-600">
        Reference: <span className="font-mono">{digest}</span>
      </p>
    )}
  </div>
);

export default ErrorState;
