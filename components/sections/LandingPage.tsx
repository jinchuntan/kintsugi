import Link from "next/link";
import { ArrowRight, Building2, Leaf, ShieldCheck, Sparkles } from "lucide-react";

const proofPoints = [
  {
    icon: Sparkles,
    title: "Autonomous repair workflow",
    copy: "Visible agents diagnose cracks, plan gold repairs, verify risk, and prepare a report."
  },
  {
    icon: Leaf,
    title: "Cost and carbon together",
    copy: "Every finding carries monthly spend, kgCO2e, confidence, effort, and before/after impact."
  },
  {
    icon: ShieldCheck,
    title: "Enterprise approval gates",
    copy: "High-risk repairs are separated from quick wins so teams can act without losing control."
  },
  {
    icon: Building2,
    title: "Demo-ready agentic payments",
    copy: "The X402 flow shows how agents can purchase paid specialist audits under budget policy."
  }
];

export function LandingPage() {
  return (
    <>
      <section
        className="relative min-h-[76svh] bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-kintsugiops.png')" }}
      >
        <div className="absolute inset-0 bg-ink/52" aria-hidden />
        <div className="relative mx-auto flex min-h-[76svh] max-w-7xl items-center px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-5 inline-flex rounded-md border border-white/24 bg-white/12 px-3 py-1 text-sm font-semibold backdrop-blur">
              AI Agent Olympics Hackathon MVP
            </p>
            <h1 className="break-anywhere text-4xl font-semibold sm:text-6xl lg:text-7xl">KintsugiOps AI</h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-white/88">
              Repair software waste before it becomes cloud waste.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/82">
              Inspired by kintsugi, the product finds cracks in software workflows and turns them into measurable cost,
              performance, and carbon repairs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/upload"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-gold-300 px-5 text-sm font-semibold text-ink shadow-soft transition hover:bg-gold-100 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Start Software Waste Audit
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/orchestration"
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/32 bg-white/12 px-5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Watch Agent Workflow
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-porcelain py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {proofPoints.map((point) => {
            const Icon = point.icon;
            return (
              <article key={point.title} className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-50 text-gold-700 ring-1 ring-gold-100">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-base font-semibold text-ink">{point.title}</h2>
                <p className="mt-2 text-sm leading-6 text-graphite">{point.copy}</p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
