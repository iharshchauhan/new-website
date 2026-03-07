import { getAllPosts } from '@/lib/mdx';
import { LogbookTabs } from '@/components/logbook-tabs';

export const metadata = {
  title: 'Logbook | harshc_',
  description: 'A running log of ideas, experiments, systems, and notes from my product + AI journey.',
};

export default async function LogbookPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string; page?: string }>;
}) {
  const writingPosts = getAllPosts('writing');
  const projectPosts = getAllPosts('projects');
  const resolvedSearchParams = await searchParams;
  const allPosts = [...writingPosts, ...projectPosts].sort((a, b) => 
    a.meta.date > b.meta.date ? -1 : 1
  );

  return (
    <div className="space-y-14 max-w-[72rem] mx-auto">
      <header className="space-y-6 text-center pt-10 pb-14">
        <h1 className="text-[4.8rem] sm:text-[6.2rem] md:text-[9.2rem] font-semibold leading-[0.95] tracking-[-0.03em] text-primary">
          Logbook.
        </h1>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
          A living archive of how I think and build: product strategy, AI systems, experiments, frameworks, and working notes from real projects.
        </p>
      </header>
      
      <LogbookTabs
        posts={allPosts}
        rawTab={resolvedSearchParams?.tab}
        rawPage={resolvedSearchParams?.page}
      />
    </div>
  );
}
