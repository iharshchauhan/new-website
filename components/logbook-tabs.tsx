'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, BookOpen, Briefcase, LayoutTemplate, Sparkles, Star, Layers } from 'lucide-react';
import { Post } from '@/lib/mdx';
import { cn } from '@/lib/utils';
import { PostTags } from '@/components/post-tags';

const LEGACY_TAB_MAP: Record<string, string> = {
  All: 'All',
  Logbook: 'Thoughts',
  Articles: 'Thoughts',
  'Fun Projects': 'Experiments',
  'Proof of work': 'Systems',
  'Proof of Work': 'Systems',
  Frameworks: 'Playbooks',
  Reviews: 'Notes',
};

const TABS = [
  { id: 'All', label: 'All', icon: Layers },
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
const NOTE_BADGE_ICONS = ['🗒️', '🤖', '🔥', '🧠', '⚙️'];

function pickNoteBadge(slug: string) {
  const hash = Array.from(slug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return NOTE_BADGE_STYLES[hash % NOTE_BADGE_STYLES.length];
}
function pickNoteIcon(slug: string) {
  const hash = Array.from(slug).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return NOTE_BADGE_ICONS[hash % NOTE_BADGE_ICONS.length];
}

export function LogbookTabs({ posts }: { posts: Post[] }) {
  const POSTS_PER_PAGE = 7;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawTabFromUrl = searchParams.get('tab');
  const rawPageFromUrl = Number(searchParams.get('page') || '1');
  const tabFromUrl = rawTabFromUrl
    ? (LEGACY_TAB_MAP[rawTabFromUrl] || rawTabFromUrl)
    : null;
  const validTabIds = useMemo(() => new Set(TABS.map((tab) => tab.id)), []);
  const [activeTabState, setActiveTabState] = useState('All');
  const activeTab =
    tabFromUrl && validTabIds.has(tabFromUrl) ? tabFromUrl : activeTabState;

  const handleTabChange = (tabId: string) => {
    setActiveTabState(tabId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    params.set('page', '1');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredPosts = (
    activeTab === 'All'
      ? posts
      : posts.filter((post) => post.meta.category === activeTab)
  ).sort((a, b) => (a.meta.date > b.meta.date ? -1 : 1));
  const notesMode = activeTab === 'Notes';
  const totalPages =
    activeTab === 'All' ? Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE)) : 1;
  const currentPage =
    activeTab === 'All'
      ? Math.min(totalPages, Math.max(1, Number.isFinite(rawPageFromUrl) ? rawPageFromUrl : 1))
      : 1;
  const paginatedPosts =
    activeTab === 'All'
      ? filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
      : filteredPosts;

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'All');
    params.set('page', String(nextPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-center gap-2 pb-1">
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

      <div className="mx-auto max-w-5xl flex flex-col gap-4">
        {paginatedPosts.map((post) => {
          const isProject = post.meta.category === 'Experiments';

          return (
            <Link
              key={post.slug}
              href={`/${post.type}/${post.slug}?tab=${encodeURIComponent(activeTab)}`}
              className="group block"
            >
              <article
                className={cn(
                  'rounded-2xl border px-6 py-6 sm:px-9 sm:py-8 transition-all duration-300',
                  notesMode
                    ? 'bg-[#f5f4eb]/92 border-white/50 hover:bg-[#f8f7ef] hover:shadow-[0_14px_30px_rgba(31,68,61,0.1)]'
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-lg',
                )}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-[2.05rem] sm:leading-tight font-semibold text-primary group-hover:text-primary/85 transition-colors">
                      {post.meta.title}
                    </h3>
                    <time dateTime={post.meta.date} className="block text-sm font-medium text-muted-foreground">
                      {new Date(post.meta.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                    <PostTags tags={post.meta.tags} compact />
                    <p className="text-base sm:text-[1.12rem] leading-relaxed text-foreground/75 max-w-2xl">
                      {post.meta.description}
                    </p>
                  </div>

                  {!isProject && notesMode && (
                    <div
                      className={cn(
                        'hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-3xl',
                        pickNoteBadge(post.slug),
                      )}
                    >
                      <span aria-hidden>{pickNoteIcon(post.slug)}</span>
                    </div>
                  )}

                  {!isProject && !notesMode && (
                    <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary shrink-0">
                      Read <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {isProject && (
                  <div className="pt-4 text-primary flex items-center gap-1 text-sm font-medium">
                    Explore app <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </article>
            </Link>
          );
        })}

        {paginatedPosts.length === 0 && (
          <div className="text-center py-24 text-muted-foreground bg-card rounded-[2rem] border border-border">
            No posts found in this category.
          </div>
        )}
      </div>

      {activeTab === 'All' && totalPages > 1 && (
        <div className="mx-auto max-w-5xl flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-border/60 bg-white/55 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/85 transition-colors"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => handlePageChange(page)}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                currentPage === page
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border/60 bg-white/55 text-foreground hover:bg-white/85',
              )}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-border/60 bg-white/55 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/85 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
