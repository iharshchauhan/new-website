import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | harshc_',
  description: 'About Harsh Chauhan',
};

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
        About Me
      </h1>

      <div className="prose prose-neutral sm:prose-lg text-muted-foreground dark:prose-invert">

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

        <p>
          <em>
            I dream of making a lot of money with computers and then maybe never touching one again.
            Just kidding. Or maybe not. I enjoy cold days, hot coffee, and music on repeat. When I am not
            building or thinking about products, you will find me watching films, spending time in nature,
            or overanalyzing human behaviour.
          </em>
        </p>

        <h2>Where I have contributed</h2>

        <ul>
          <li><a href="https://www.quillaudits.com/smart-contract-audit" target="_blank">QuillAudits</a> — part of <a href="https://quillhash.com/" target="_blank">Quillhash Group</a></li>
          <li><a href="https://ximivogueretail.com/" target="_blank">Ximi Vogue</a></li>
          <li><a href="https://airtel.in" target="_blank">Airtel</a></li>
          <li><a href="https://in.harmankardon.com/" target="_blank">Harman & Kardon</a></li>
          <li><a href="https://www.edelman.com/" target="_blank">Edelman</a></li>
          <li><a href="https://www.midea.com/in" target="_blank">Midea</a></li>
          <li><a href="https://instoried.com/" target="_blank">Instoried</a></li>
          <li><a href="https://indiefolio.com/" target="_blank">Indiefolio</a></li>
          <li><a href="https://tegro.com/" target="_blank">Tegro</a></li>
          <li><a href="https://jovian.com/" target="_blank">Jovian</a></li>
          <li><a href="https://bezit.co/" target="_blank">Bezit</a></li>
          <li><a href="https://piersight.space/" target="_blank">PierSight</a></li>
          <li><a href="https://atlas.so/" target="_blank">Atlas</a></li>
          <li><a href="https://scrut.io/" target="_blank">Scrut Automation</a></li>
        </ul>

        <h2>Let’s Connect and Create</h2>

        <p>
          If you are building something ambitious and want to move faster, let us connect.
          I enjoy working on ideas that turn the ordinary into something meaningful and impactful.
        </p>

        <p>
          I am available 24/7. Do not be shy.
        </p>

        <p>
          Email: <a href="mailto:hey@iharsh.xyz">hey@iharsh.xyz</a>
        </p>

      </div>
    </section>
  );
}
