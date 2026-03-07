import { Github, Instagram, Music, Twitter } from "lucide-react";

const socialLinks = [
  { href: "https://github.com/iharshchauhan", label: "GitHub", icon: Github },
  { href: "https://twitter.com/harshc_/", label: "Twitter", icon: Twitter },
  { href: "https://instagram.com/iharshchauhan/", label: "Instagram", icon: Instagram },
  {
    href: "https://open.spotify.com/playlist/6rhg71awO0tB2GIunqOxAg?si=b1cb737056354412",
    label: "Spotify",
    icon: Music,
  },
];

export function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-8 px-6 py-12 text-sm text-muted-foreground md:px-12">
      <div className="w-full overflow-hidden text-center text-[10px] tracking-[0.5em] text-primary/70 opacity-80">
        {Array.from({ length: 60 }).map((_, i) => (
          <span key={i}>{"\u2022"}</span>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-center text-muted-foreground">
        <div className="mr-2 flex items-center space-x-4">
          {socialLinks.map(({ href, label, icon: Icon }, index) => (
            <div key={label} className="flex items-center space-x-4">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
                aria-label={label}
                title={label}
              >
                <Icon className="h-4 w-4" />
              </a>
              {index < socialLinks.length - 1 ? <span className="opacity-50">|</span> : null}
            </div>
          ))}
        </div>

        <span className="hidden opacity-50 sm:inline">|</span>
        <span className="w-full sm:w-auto">2025 &copy; Harsh Chauhan</span>
        <span className="hidden opacity-50 sm:inline">|</span>
        <a
          href="mailto:hey@iharsh.xyz"
          className="border-b-2 border-primary/70 pb-0.5 transition-colors hover:text-foreground"
        >
          Contact
        </a>
        <span className="hidden opacity-50 sm:inline">|</span>
        <a
          href="https://www.websitecarbon.com/website/iharsh-xyz/"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-auto"
        >
          This page visit emitted{" "}
          <span className="border-b-2 border-primary/70 pb-0.5">0.04g of CO2</span> :)
        </a>
      </div>
    </footer>
  );
}
