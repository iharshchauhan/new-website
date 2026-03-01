import { getAllPosts } from '@/lib/mdx';
import { LogbookTabs } from '@/components/logbook-tabs';

export const metadata = {
  title: 'Logbook | harshc_',
  description: 'Writing, projects, and frameworks.',
};

export default function LogbookPage() {
  const writingPosts = getAllPosts('writing');
  const projectPosts = getAllPosts('projects');
  
  const allPosts = [...writingPosts, ...projectPosts].sort((a, b) => 
    a.meta.date > b.meta.date ? -1 : 1
  );

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <header className="space-y-4 text-center pb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">Articles</h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          A collection of my writings, projects, frameworks, and reviews.
        </p>
      </header>
      
      <LogbookTabs posts={allPosts} />
    </div>
  );
}
