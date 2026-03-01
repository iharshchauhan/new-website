export const metadata = {
  title: 'About | harshc_',
  description: 'About me.',
};

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">About Me</h1>
      <div className="prose prose-neutral sm:prose-lg text-muted-foreground">
        <p>
          Hey there! I'm Harsh, a Product and Growth enthusiast.
        </p>
        <p>
          I love building things that live on the internet, whether that be websites, applications, or anything in between. My goal is to always build products that provide pixel-perfect, performant experiences.
        </p>
        <p>
          When I'm not in front of a computer screen, I'm probably listening to music, reading, or exploring new places.
        </p>
      </div>
    </div>
  );
}
