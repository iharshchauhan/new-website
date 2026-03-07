"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Headphones, Music4 } from "lucide-react";
import type { SpotifyHomeData } from "@/lib/spotify";

type ListeningsSectionProps = {
  data: SpotifyHomeData;
};

export function ListeningsSection({ data }: ListeningsSectionProps) {
  const [activeFilterId, setActiveFilterId] = useState(data.filters[0]?.id);
  const activeFilter =
    data.filters.find((filter) => filter.id === activeFilterId) ?? data.filters[0];

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Listenings</h2>
          <p className="text-sm text-muted-foreground">
            {data.personalizedDataAvailable
              ? "Current Spotify listening snapshots."
              : "Playlist is live now. Add a Spotify refresh token to unlock personalized top items."}
          </p>
        </div>
        <Link
          href={data.playlist.href}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center transition-colors"
        >
          Open Spotify <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5 rounded-[2rem] border border-border/70 bg-white/55 p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {data.filters.map((filter) => {
              const isActive = filter.id === activeFilter?.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilterId(filter.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-foreground text-background"
                      : "bg-background/70 text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {filter.label} | {filter.eyebrow}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              {activeFilter?.label === "Top artists" ? (
                <Headphones className="h-5 w-5" />
              ) : (
                <Music4 className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                {activeFilter?.eyebrow}
              </p>
              <h3 className="text-xl font-semibold">{activeFilter?.label}</h3>
            </div>
          </div>

          {activeFilter?.items.length ? (
            <div className="grid gap-3">
              {activeFilter.items.map((item, index) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/65 px-4 py-3 transition-transform hover:-translate-y-0.5 hover:border-border"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/12 text-sm font-semibold text-primary">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.title}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                  {item.meta ? (
                    <span className="hidden rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground md:inline-flex">
                      {item.meta}
                    </span>
                  ) : null}
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 bg-background/55 px-5 py-8 text-sm text-muted-foreground">
              Add `SPOTIFY_REFRESH_TOKEN` in `.env.local` to populate this filter with your personal Spotify history.
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-[2rem] border border-border/70 bg-white/55 p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-2xl bg-primary/10">
              {data.playlist.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.playlist.image}
                  alt={data.playlist.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Featured playlist
              </p>
              <h3 className="truncate text-lg font-semibold">{data.playlist.name}</h3>
              <p className="truncate text-sm text-muted-foreground">
                by {data.playlist.owner}
                {data.playlist.trackCount ? ` | ${data.playlist.trackCount} tracks` : ""}
              </p>
            </div>
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {data.playlist.description}
          </p>

          <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/60">
            <iframe
              title="Spotify playlist"
              src="https://open.spotify.com/embed/playlist/6rhg71awO0tB2GIunqOxAg?utm_source=generator"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
