import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import pnpBg from "@/assets/pnp-bg.png.asset.json";


const ASSET_ROOT = "/last-hit";

const files = [
  {
    id: "1mQTuauSXV5FlXbRRqDd2gpq1BoEUqSwd",
    title: "Bounty Board",
    detail: "8x16 tiled on US Letter · 4.6 MB",
    note: "Print single-sided, trim the margins, and tile together.",
  },
  {
    id: "1jFyF9Kz95eHrP7Lj-VwbGe0PpdU5ztRS",
    title: "Cards & Player Mats",
    detail: "Full print set · large file (~512 MB)",
    note: "High-resolution. Download over Wi‑Fi — it may take a while.",
  },
  {
    id: "1sQ7wgp2qtb6If9Dd0hsIv3yl4ZFJD2AW",
    title: "Tokens",
    detail: "Duplex, flip on long edge · 3.7 MB",
    note: "Print double-sided (long-edge binding) so backs line up.",
  },
];

const driveUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`;
const downloadUrl = (id: string) =>
  `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;

export const Route = createFileRoute("/print-and-play")({
  component: PrintAndPlayPage,
  head: () => ({
    meta: [
      { title: "Print & Play — Last Hit" },
      {
        name: "description",
        content:
          "Private print-and-play download page for Last Hit playtesters: bounty board, cards and mats, and tokens.",
      },
      { name: "robots", content: "noindex, nofollow, noarchive" },
      { property: "og:title", content: "Print & Play — Last Hit" },
      {
        property: "og:description",
        content: "Playtester print-and-play files for Last Hit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function PrintAndPlayPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${pnpBg.url})` }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-background/75"
      />

      <section className="section relative">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:px-10 lg:py-24">

          <p className="eyebrow">Playtester materials · Unlisted</p>
          <h1 className="section-title">
            Last Hit Print &amp; Play
            <span>Three files. One table-ready prototype.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Art and balance are still in progress — these files reflect the current build, not the
            final production version. Please don&apos;t reshare this page publicly.
          </p>

          <div className="mt-12 grid gap-5">
            {files.map((file) => (
              <article
                key={file.id}
                className="rounded-md border border-border bg-card/70 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="shrink-0 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">{file.title}</h2>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{file.detail}</p>
                  <p className="mt-1 text-sm text-muted-foreground/80">{file.note}</p>
                </div>
                <div className="mt-5 flex shrink-0 flex-wrap items-center gap-3 sm:mt-0">
                  <a
                    className="button button-gold"
                    href={downloadUrl(file.id)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <Download size={18} />
                    Download
                  </a>
                  <a
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    href={driveUrl(file.id)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Preview
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-md border border-border/60 bg-secondary/40 p-6">
            <h2 className="text-lg font-semibold text-foreground">Printing tips</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Print at 100% scale — no &quot;fit to page&quot; or shrink-to-margins.</li>
              <li>Cards and mats look best on heavier cardstock; sleeve the cards if you can.</li>
              <li>Tokens must be duplex, flipped on the long edge.</li>
            </ul>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <Link className="button button-small" to="/">
              Back to Last Hit
            </Link>
            <img src={`${ASSET_ROOT}/crest.webp`} alt="" width={28} height={28} />
          </div>
        </div>
      </section>
    </main>
  );
}
