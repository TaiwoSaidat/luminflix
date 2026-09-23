import React from "react";

import type { MediaItem } from "@/types";
import ScrollRow from "../shared/ScrollRow";
import TopTenCard from "./TopTenCard";

/** The ranking only means anything as a top ten — extra items aren't drawn. */
const RANK_LIMIT = 10;

/**
 * A ranked strip of titles, numbered 1–10.
 *
 * Shares `ScrollRow` with `ContentRow`, so the chevrons, the scroll state and
 * the resize handling behave identically to every other row on the site.
 */
const TopTenRow: React.FC<{ title: string; items: MediaItem[] }> = ({
  title,
  items,
}) => (
  <ScrollRow title={title}>
    {items.slice(0, RANK_LIMIT).map((item, index) => (
      <TopTenCard
        // Mixed film/series lists can repeat an id across the two catalogs.
        key={`${item.mediaType}-${item.id}`}
        item={item}
        rank={index + 1}
      />
    ))}
  </ScrollRow>
);

export default TopTenRow;
