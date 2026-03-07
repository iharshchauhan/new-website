import { cn } from '@/lib/utils';

export function PostTags({
  tags,
  className,
  compact = false,
}: {
  tags: string[];
  className?: string;
  compact?: boolean;
}) {
  if (!tags.length) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            'inline-flex items-center rounded-full border border-primary/15 bg-primary/8 text-primary',
            compact ? 'px-2.5 py-1 text-[0.72rem] font-medium' : 'px-3 py-1.5 text-xs font-semibold',
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
