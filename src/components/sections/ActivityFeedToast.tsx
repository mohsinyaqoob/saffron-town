"use client";

import { useEffect, useState } from "react";
import activityFeed from "@/data/activity-feed.json";

type ActivityFeedFile = {
  names: string[];
  cities: string[];
  actions: string[];
  packs: string[];
};

type ActivityItem = {
  id: string;
  name: string;
  city: string;
  action: string;
  pack: string;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pair shuffled names with shuffled cities by index so each name/city is used once per cycle (no repeated pair in the deck). */
function buildVisitDeck(data: ActivityFeedFile): ActivityItem[] {
  const names = shuffle(data.names);
  const cities = shuffle(data.cities);
  const n = Math.min(names.length, cities.length);
  const actions = data.actions;
  const packs = data.packs;

  const paired: ActivityItem[] = Array.from({ length: n }, (_, i) => ({
    id: `activity-${i}`,
    name: names[i],
    city: cities[i],
    action: actions[i % actions.length],
    pack: packs[(i * 7 + 3) % packs.length],
  }));

  return shuffle(paired);
}

/** Random delay in ms before showing the next feed item (inclusive). */
function nextFeedGapMs(): number {
  const min = 3000;
  const max = 10000;
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function ActivityFeedToast() {
  const [deck, setDeck] = useState<ActivityItem[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("activity-feed-hidden");
    if (saved === "1") setIsHidden(true);
  }, []);

  useEffect(() => {
    setDeck(buildVisitDeck(activityFeed as ActivityFeedFile));
  }, []);

  useEffect(() => {
    if (!deck.length) return;

    const timers: { outer: number | null; inner: number | null } = {
      outer: null,
      inner: null,
    };

    const clearAll = () => {
      if (timers.outer !== null) window.clearTimeout(timers.outer);
      if (timers.inner !== null) window.clearTimeout(timers.inner);
      timers.outer = timers.inner = null;
    };

    const scheduleNext = () => {
      const gap = nextFeedGapMs();
      timers.outer = window.setTimeout(() => {
        setVisible(false);
        timers.inner = window.setTimeout(() => {
          setIndex((prev) => (prev + 1) % deck.length);
          setVisible(true);
          scheduleNext();
        }, 220);
      }, gap);
    };

    scheduleNext();
    return clearAll;
  }, [deck]);

  if (!deck.length || isHidden) return null;

  const current = deck[index];
  const activityLine = `${current.name} from ${current.city} ${current.action} ${current.pack}.`;

  return (
    <aside
      className={`fixed bottom-3 left-1/2 z-[60] flex h-[5.5rem] w-[calc(100%-1.5rem)] max-w-lg flex-col overflow-hidden rounded-xl border border-secondary-border/25 bg-background/90 px-3 py-2 shadow-md backdrop-blur-sm transition-all duration-300 sm:bottom-4 sm:left-4 sm:h-[6.25rem] sm:w-[min(92vw,340px)] sm:max-w-none sm:rounded-2xl sm:border-secondary-border/40 sm:bg-background/95 sm:px-4 sm:py-2.5 sm:shadow-xl ${
        visible
          ? "-translate-x-1/2 translate-y-0 opacity-100 sm:translate-x-0"
          : "-translate-x-1/2 translate-y-2 opacity-0 sm:translate-x-0"
      }`}
      aria-live="polite"
    >
      <div className="flex shrink-0 items-start justify-between gap-2 sm:items-center sm:gap-3">
        <p className="text-[9px] font-bold uppercase tracking-wider text-primary sm:text-[10px] sm:tracking-widest">
          Live activity
        </p>
        <button
          type="button"
          onClick={() => {
            setIsHidden(true);
            window.localStorage.setItem("activity-feed-hidden", "1");
          }}
          className="sm:hidden -mr-0.5 -mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-muted/60 hover:text-text-primary"
          aria-label="Hide live activity feed"
        >
          <span className="text-lg leading-none" aria-hidden>
            ×
          </span>
        </button>
      </div>
      <div className="mt-1 min-h-0 flex-1 overflow-hidden">
        <p
          className="line-clamp-2 break-words text-[11px] leading-snug text-text-primary font-body sm:text-sm sm:leading-snug"
          title={activityLine}
        >
          <span className="font-semibold">{current.name}</span> from{" "}
          <span className="font-semibold">{current.city}</span> {current.action}{" "}
          <span className="font-semibold">{current.pack}</span>.
        </p>
      </div>
      <p className="shrink-0 truncate text-[9px] leading-tight text-text-muted font-body sm:text-[11px] sm:leading-tight">
        <span className="sm:hidden">
          Browsing signals only — not purchases.
        </span>
        <span className="hidden sm:inline">
          Showing browsing activity, not confirmed orders.
        </span>
      </p>
    </aside>
  );
}
