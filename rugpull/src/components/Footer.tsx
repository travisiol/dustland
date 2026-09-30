import { Mark } from "@/components/Mark";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const socials = [
    siteConfig.x ? { label: "X", href: siteConfig.x } : null,
    siteConfig.telegram ? { label: "Telegram", href: siteConfig.telegram } : null,
  ].filter((s): s is { label: string; href: string } => s !== null);

  return (
    <footer className="px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex items-center gap-3">
          <Mark size={28} />
          <div>
            <span className="type-title block leading-none text-bone">{siteConfig.name}</span>
            <span className="type-label mt-1 block text-bone-muted">{siteConfig.tagline}</span>
          </div>
        </div>

        {socials.length > 0 && (
          <ul className="flex items-center gap-5">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-label text-bone-soft transition-colors duration-150 hover:text-tape"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 border-t border-rule pt-6">
        <p className="type-data max-w-[80ch] text-bone-muted">
          Not financial advice. A financial warning. This token has one announced
          feature and it is bad for holders. Everything on this page is true at the
          time it is displayed, including the part where nothing is happening.
        </p>
      </div>
      <div className="hazard mt-6 h-2 w-full" aria-hidden />
    </footer>
  );
}
