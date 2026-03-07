'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, BookOpen, Briefcase, LayoutTemplate, Sparkles, Star } from 'lucide-react';
import { Post } from '@/lib/mdx';
import { cn } from '@/lib/utils';

const LEGACY_TAB_MAP: Record<string, string> = {
  Logbook: 'Thoughts',
  Articles: 'Thoughts',
  'Fun Projects': 'Experiments',
  'Proof of work': 'Systems',
  'Proof of Work': 'Systems',
  Frameworks: 'Playbooks',
  Reviews: 'Notes',
};

const TABS = [
  { id: 'Thoughts', label: 'Thoughts', icon: BookOpen },
  { id: 'Experiments', label: 'Experiments', icon: Sparkles },
  { id: 'Systems', label: 'Systems', icon: Briefcase },
  { id: 'Playbooks', label: 'Playbooks', icon: LayoutTemplate },
  { id: 'Notes', label: 'Notes', icon: Star },
];

const NOTE_BADGE_STYLES = [
  'bg-[#0f7770] text-[#d7fff8]',
  'bg-[#8f6200] text-[#fff1cb]',
  'bg-[#8e2748] text-[#ffd9e6]',
  'bg-[#205f93] text-[#dff0ff]',
  'bg-[#49489f] text-[#e3e4ff]',
];

function pickNoteBadge(slug: string) {
  const hash = Array.from(slug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return NOTE_BADGE_STYLES[hash % NOTE_BADGE_STYLES.length];
}

function getInitials(title: string) {
  const words = title.trim().split(/\s+/).slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase() ?? '').join('');
}

export function LogbookTabs({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTabFromUrl = searchParams.get('tab');
  const tabFromUrl = rawTabFromUrl
    ? (LEGACY_TAB_MAP[rawTabFromUrl] || rawTabFromUrl)
    : null;
  const validTabIds = useMemo(() => new Set(TABS.map((tab) => tab.id)), []);
  const [activeTabState, setActiveTabState] = useState('Notes');
  const activeTab =
    tabFromUrl && validTabIds.has(tabFromUrl) ? tabFromUrl : activeTabState;

  const handleTabChange = (tabId: string) => {
    setActiveTabState(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredPosts = posts.filter((post) => post.meta.category === activeTab);
  const notesMode = activeTab === 'Notes';

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                isActive
                  ? 'bg-white/75 text-foreground'
                  : 'text-foreground/70 hover:bg-white/55 hover:text-foreground',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto max-w-4xl flex flex-col gap-4">
        {filteredPosts.map((post) => {
          const isProject = post.meta.category === 'Experiments';

          return (
            <Link
              key={post.slug}
              href={`/${post.type}/${post.slug}?tab=${encodeURIComponent(activeTab)}`}
              className="group block"
            >
              <article
                className={cn(
                  'rounded-2xl border px-6 py-6 sm:px-8 sm:py-8 transition-all duration-300',
                  notesMode
                    ? 'bg-[#f5f4eb]/90 border-white/45 hover:bg-[#f8f7ef] hover:shadow-[0_14px_30px_rgba(31,68,61,0.1)]'
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-lg',
                )}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-[2rem] sm:leading-tight font-semibold text-[#055f57] group-hover:text-primary transition-colors">
                      {post.meta.title}
                    </h3>
                    <p className="text-base sm:text-[1.12rem] leading-relaxed text-foreground/75 max-w-2xl">
                      {post.meta.description}
                    </p>
                  </div>

                  {!isProject && notesMode && (
                    <div
                      className={cn(
                        'hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-lg font-bold tracking-wide',
                        pickNoteBadge(post.slug),
                      )}
                    >
                      {getInitials(post.meta.title)}
                    </div>
                  )}

                  {!isProject && !notesMode && (
                    <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary shrink-0">
                      Read <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {isProject && (
                  <div className="pt-4 text-blue-500 flex items-center gap-1 text-sm font-medium">
                    Explore app <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </article>
            </Link>
          );
        })}

        {filteredPosts.length === 0 && (
          <div className="text-center py-24 text-muted-foreground bg-card rounded-[2rem] border border-border">
            No posts found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
