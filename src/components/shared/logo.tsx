import React from "react";

const Logo = () => {
  return (
    // The wordmark is announced as a whole regardless of which variant is
    // painted, so a small-screen reader never hears a bare "L".
    <div
      role="img"
      aria-label="LUMINFLIX"
      className="text-3xl md:text-2xl font-bold bg-linear-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
    >
      <span aria-hidden="true" className="md:hidden">
        L
      </span>
      <span aria-hidden="true" className="hidden md:inline">
        LUMINFLIX
      </span>
    </div>
  );
};

export default Logo;
