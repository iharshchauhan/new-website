import { Suspense } from 'react';
import { getAllPosts } from '@/lib/mdx';
import { LogbookTabs } from '@/components/logbook-tabs';

export const metadata = {
  title: 'Notes | harshc_',
  description: 'Thoughts, experiments, systems, playbooks, and notes.',
};

export default function LogbookPage() {
  const writingPosts = getAllPosts('writing');
  const projectPosts = getAllPosts('projects');
  
  const allPosts = [...writingPosts, ...projectPosts].sort((a, b) => 
    a.meta.date > b.meta.date ? -1 : 1
  );

  return (
    <div className="space-y-14 max-w-[72rem] mx-auto">
      <header className="space-y-6 text-center pt-10 pb-14">
        <h1 className="text-[4.8rem] sm:text-[6.2rem] md:text-[9.2rem] font-semibold leading-[0.95] tracking-[-0.03em] text-[#055f57]">
          Notes.
        </h1>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
          Some thoughts, reflections, and notes on design, product, and work in progress.
        </p>
      </header>
      
      <Suspense fallback={<div className="text-center py-24 text-muted-foreground">Loading logbook...</div>}>
        <LogbookTabs posts={allPosts} />
      </Suspense>
    </div>
  );
}
