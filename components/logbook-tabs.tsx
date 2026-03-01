'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Briefcase, LayoutTemplate, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Post } from '@/lib/mdx';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'Logbook', label: 'Logbook', icon: BookOpen },
  { id: 'Fun Projects', label: 'Fun Projects', icon: Sparkles },
  { id: 'Proof of work', label: 'Proof of Work', icon: Briefcase },
  { id: 'Frameworks', label: 'Frameworks', icon: LayoutTemplate },
  { id: 'Reviews', label: 'Reviews', icon: Star },
];

export function LogbookTabs({ posts }: { posts: Post[] }) {
  const [activeTab, setActiveTab] = useState('Logbook');

  const filteredPosts = posts.filter(post => post.meta.category === activeTab);

  return (
    <div className="space-y-10">
      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-start gap-6 md:gap-10 border-b border-border">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 pb-4 border-b-2 transition-colors px-1 shrink-0 -mb-[1px]",
                isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="flex flex-col gap-6">
        {filteredPosts.map(post => {
          const isProject = post.meta.category === 'Fun Projects';
          
          return (
            <Link 
              key={post.slug} 
              href={`/${post.type}/${post.slug}`}
              className="group block"
            >
              <article className="bg-card rounded-[2rem] p-6 sm:p-8 border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                
                {/* Left Side */}
                <div className="space-y-4 flex-1">
                  {isProject && (
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-2">
                      <Sparkles className="w-6 h-6" />
                    </div>
                  )}
                  
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.meta.title}
                  </h3>
                  
                  {isProject ? (
                    <p className="text-muted-foreground text-base">
                      {post.meta.description}
                    </p>
                  ) : (
                    <div className="flex items-center flex-wrap gap-3 text-sm text-muted-foreground">
                      <time dateTime={post.meta.date}>
                        {new Date(post.meta.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </time>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-2">
                        {post.meta.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isProject && (
                    <div className="text-blue-500 flex items-center gap-1 text-sm font-medium pt-2">
                      Explore app <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Right Side */}
                {!isProject && (
                  <div className="text-blue-500 flex items-center gap-1 text-sm font-medium shrink-0 sm:pt-0 pt-2">
                    Read <ArrowRight className="w-4 h-4" />
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
