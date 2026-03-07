import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | harshc_',
  description: 'About Harsh Chauhan',
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const companies = [
  {
    name: 'QuillAudits',
    href: 'https://www.quillaudits.com/smart-contract-audit',
    logoSrc: '/company-logos/quillaudits.jpg',
  },
  {
    name: 'Ximi Vogue',
    href: 'https://ximivogueretail.com/',
    logoSrc: '/company-logos/ximi-vogue.jpg',
  },
  {
    name: 'Airtel',
    href: 'https://airtel.in',
    logoSrc: '/company-logos/airtel.png',
  },
  {
    name: 'Harman & Kardon',
    href: 'https://in.harmankardon.com/',
    logoSrc: '/company-logos/harman-kardon.webp',
  },
  { name: 'Edelman', href: 'https://www.edelman.com/', logoSrc: '/company-logos/edelman.jpg' },
  {
    name: 'Midea',
    href: 'https://www.midea.com/in',
    logoSrc: '/company-logos/midea.png',
  },
  {
    name: 'Instoried',
    href: 'https://yourstory.com/herstory/2022/04/funding-instoried-200-million-gem-content-startup-ipo',
    logoSrc: '/company-logos/instoried.avif',
  },
  { name: 'Indiefolio', href: 'https://indiefolio.com/', logoSrc: '/company-logos/indiefolio.jpg' },
  { name: 'Tegro', href: 'https://tegro.com/', logoSrc: '/company-logos/tegro.jpg' },
  { name: 'Jovian', href: 'https://jovian.com/', logoSrc: '/company-logos/jovian.jpg' },
  {
    name: 'Bezit',
    href: 'https://bezit.co/',
    logoSrc: '/company-logos/bezit.png',
  },
  {
    name: 'PierSight',
    href: 'https://piersight.space/',
    logoSrc: '/company-logos/piersight.jpg',
  },
  {
    name: 'Atlas',
    href: 'https://atlas.so/',
    logoSrc: '/company-logos/atlas.png',
  },
  {
    name: 'Scrut Automation',
    href: 'https://scrut.io/',
    logoSrc: '/company-logos/scrut.webp',
  },
] as const;

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-[4.2rem] font-semibold leading-[0.95] tracking-[-0.03em] text-primary sm:text-[5.2rem] md:text-[6.4rem]">
        About Me
      </h1>

      <div className="prose prose-neutral text-muted-foreground dark:prose-invert sm:prose-lg">
        <p>
          Hi, I am Harsh, your friendly neighbourhood Product Generalist with 6+ years of juggling
          <strong> SaaS, GRC, AI, Space Tech, and Web3</strong> (if it is futuristic, I am into it).
          I eat data for breakfast, and no, my favourite app is not Instagram or Twitter, it is ChatGPT.
        </p>

        <p>
          <em>
            I am basically Jon Snow. I know nothing, except how to get things done. Even if I have no clue
            what is going on, give me a minute, and I will figure it out.
          </em>
        </p>

        <p>
          I specialize in scaling innovative products faster than you can say disrupt the market.
          My journey has been a wild ride through multi-channel product development, product strategy,
          and just enough chaos to keep things interesting.
        </p>

        <p>
          I am constantly blown away by the insane talent out there and the incredible things people build.
          If our paths have crossed, there is a strong chance I have already visited your website and
          admired your work. My reading list keeps expanding like a black hole, and I am always ready to add more.
        </p>

        <p className="text-sm italic">
          <em>
            I dream of making a lot of money with computers and then maybe never touching one again.
            Just kidding. Or maybe not. I enjoy cold days, hot coffee, and music on repeat. When I am not
            building or thinking about products, you will find me watching films, spending time in nature,
            or overanalyzing human behaviour.
          </em>
        </p>

        <h2>Where I have contributed</h2>

        <div className="not-prose">
          <div className="grid gap-5 sm:grid-cols-2">
            {companies.map((company) => {
              const badge = company.name
                .split(/[\s&]+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase() ?? '')
                .join('');

              return (
                <a
                  key={company.name}
                  href={company.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-border/60 bg-background/60 p-4 no-underline transition-colors hover:border-foreground/20 hover:bg-muted/40"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted text-sm font-semibold tracking-[-0.02em] text-foreground">
                    {company.logoSrc ? (
                      <img
                        src={`${basePath}${company.logoSrc}`}
                        alt={`${company.name} logo`}
                        className="h-10 w-10 rounded-lg object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span aria-hidden="true">{badge}</span>
                    )}
                  </div>

                  <div className="min-w-0 pt-1">
                    <div className="text-[1.45rem] font-semibold leading-none tracking-[-0.03em] text-foreground">
                      {company.name}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        <h2>Let&apos;s Connect and Create</h2>

        <p>
          If you are building something ambitious and want to move faster, let us connect.
          I enjoy working on ideas that turn the ordinary into something meaningful and impactful.
        </p>

        <p>I am available 24/7. Do not be shy.</p>

        <p>
          Email: <a href="mailto:hey@iharsh.xyz">hey@iharsh.xyz</a>
        </p>
      </div>
    </section>
  );
}
