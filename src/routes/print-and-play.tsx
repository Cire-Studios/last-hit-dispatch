import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, FileText } from "lucide-react";
import { RULEBOOK_URL } from "@/lib/game-rules";
import { printAndPlayGroups } from "@/lib/print-and-play";
import pnpBg from "@/assets/pnp-bg.png.asset.json";
import { BestiaryFooter } from "@/components/bestiary/BestiaryPages";

const ASSET_ROOT = "/last-hit";

export const Route = createFileRoute("/print-and-play")({
  component: PrintAndPlayPage,
  head: () => ({
    meta: [
      { title: "Print & Play — Last Hit" },
      {
        name: "description",
        content:
          "Last Hit playtester materials: current rulebook and individual print-and-play PDFs by component and sheet.",
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
    <main className="relative isolate min-h-screen overflow-x-clip">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${pnpBg.url})` }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-background/75" />

      <section className="section relative z-10">
        <div className="mx-auto max-w-4xl px-5 py-16 lg:px-10 lg:py-24">
          <p className="eyebrow">Playtester materials · Unlisted</p>
          <h1 className="section-title">
            Last Hit Print &amp; Play
            <span>Print files by component.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Choose individual sheets or the combined Player Cards and Boons &amp; Gold PDFs. Open a
            PDF to preview or download it, or open a group to browse its files. Please don&apos;t
            reshare this page publicly.
          </p>

          <div className="mt-12 rounded-md border border-border bg-card/70 p-6">
            <h2 className="text-xl font-semibold">Current rulebook</h2>
            <p className="mt-2 mb-5 text-muted-foreground">
              Learn the latest setup, hunt, Market, and recovery rules.
            </p>
            <a
              className="button button-gold"
              href={RULEBOOK_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              <BookOpen size={18} /> Read the rulebook
            </a>
          </div>

          <nav aria-label="Print file groups" className="mt-10 flex flex-wrap gap-2">
            {printAndPlayGroups.map((group) => (
              <a
                key={group.id}
                href={`#print-${group.id}`}
                className="rounded-full border border-border bg-card/70 px-4 py-2 text-sm transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {group.name}
              </a>
            ))}
          </nav>

          <div className="mt-8 space-y-6">
            {printAndPlayGroups.map((group) => (
              <section
                key={group.id}
                id={`print-${group.id}`}
                aria-labelledby={`print-title-${group.id}`}
                className="scroll-mt-8 rounded-md border border-border bg-card/80 p-5 sm:p-6"
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 id={`print-title-${group.id}`} className="text-xl font-semibold">
                      {group.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {group.files.length} {group.files.length === 1 ? "PDF" : "PDFs"}
                    </p>
                  </div>
                  <a
                    href={group.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`Open ${group.name} group`}
                    className="inline-flex items-center gap-2 text-sm underline underline-offset-4"
                  >
                    Open group <ArrowUpRight size={16} aria-hidden />
                  </a>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {group.files.map((file) => (
                    <li key={file.url}>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="flex h-full items-center gap-3 rounded border border-border p-4 transition-colors hover:bg-background/60 focus-visible:outline-2 focus-visible:outline-offset-4"
                        aria-label={`Open ${group.name}: ${file.name} PDF`}
                      >
                        <FileText
                          size={20}
                          className="shrink-0 text-muted-foreground"
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{file.name}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">
                            PDF · {file.sizeMB} MB
                          </span>
                        </span>
                        <ArrowUpRight size={16} className="shrink-0" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <Link className="button button-small" to="/">
              Back to Last Hit
            </Link>
            <img src={`${ASSET_ROOT}/crest.webp`} alt="" width={28} height={28} />
          </div>
        </div>
      </section>
      <div className="relative z-10">
        <BestiaryFooter />
      </div>
    </main>
  );
}
