"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileUp, FolderOpen, PackageSearch } from "lucide-react";
import { PageFrame } from "@/components/dashboard/PageFrame";
import { useAuditRun } from "@/components/dashboard/useAuditRun";
import { demoAudits } from "@/lib/data/demoAudit";
import type { AuditSampleId } from "@/lib/types";
import { cn, formatCarbon, formatCurrency } from "@/lib/utils";

export function UploadExperience() {
  const { auditId, run, selectAudit } = useAuditRun();
  const [uploadedNames, setUploadedNames] = useState<string[]>([]);

  const selectedAudit = useMemo(() => demoAudits.find((audit) => audit.id === auditId) ?? demoAudits[0], [auditId]);

  const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const names = Array.from(event.target.files ?? []).map((file) => file.name);
    setUploadedNames(names);
  };

  return (
    <PageFrame
      eyebrow="Audit package"
      title="Select a sample or upload project files"
      description="The demo works with realistic seed data, and uploaded filenames are shown as part of the audit package preview."
    >
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-50 text-gold-700 ring-1 ring-gold-100">
              <PackageSearch className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">Demo samples</h2>
              <p className="text-sm text-graphite">Choose the story you want to present in the hackathon demo.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {demoAudits.map((audit) => {
              const selected = audit.id === auditId;
              return (
                <button
                  key={audit.id}
                  type="button"
                  onClick={() => selectAudit(audit.id as AuditSampleId)}
                  className={cn(
                    "flex min-h-64 flex-col rounded-lg border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-gold-300",
                    selected ? "border-gold-300 bg-gold-50/65" : "border-ink/10 bg-white hover:border-gold-100 hover:bg-porcelain"
                  )}
                >
                  <span className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{audit.name}</span>
                    {selected ? <CheckCircle2 className="h-5 w-5 text-mint" aria-hidden /> : null}
                  </span>
                  <span className="text-sm leading-6 text-graphite">{audit.tagline}</span>
                  <span className="mt-auto grid grid-cols-2 gap-2 pt-5 text-xs text-graphite">
                    <span className="rounded-md bg-white/80 p-2 ring-1 ring-ink/10">
                      Waste
                      <strong className="block text-sm text-ink">{formatCurrency(audit.metrics.estimatedTotalMonthlyWasteUsd)}</strong>
                    </span>
                    <span className="rounded-md bg-white/80 p-2 ring-1 ring-ink/10">
                      Carbon
                      <strong className="block text-sm text-ink">{formatCarbon(audit.metrics.monthlyCarbonWasteKgCO2e)}</strong>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-lg border border-dashed border-ink/20 bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-50 text-river ring-1 ring-sky-100">
                <FileUp className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-ink">Optional upload</h2>
                <p className="text-sm text-graphite">Add package, Docker, CI, billing, or API log files.</p>
              </div>
            </div>
            <label className="mt-5 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-ink/10 bg-porcelain px-4 py-6 text-center transition hover:bg-gold-50">
              <FolderOpen className="h-8 w-8 text-gold-700" aria-hidden />
              <span className="mt-3 text-sm font-semibold text-ink">Choose files</span>
              <span className="mt-1 text-xs text-graphite">No backend upload required for the demo.</span>
              <input className="sr-only" type="file" multiple onChange={onFilesSelected} />
            </label>
            <div className="mt-4 rounded-md bg-ink/[0.03] p-3">
              <p className="text-xs font-semibold text-graphite">Package preview</p>
              <ul className="mt-2 space-y-1 text-sm text-ink">
                {(uploadedNames.length ? uploadedNames : selectedAudit.files.map((file) => file.name)).slice(0, 7).map((name) => (
                  <li key={name} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-300" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-lg border border-ink/10 bg-ink p-5 text-white shadow-soft">
            <p className="text-sm font-semibold text-gold-100">Selected audit</p>
            <h2 className="mt-2 text-2xl font-semibold">{run.audit.name}</h2>
            <p className="mt-3 text-sm leading-6 text-white/76">{run.audit.description}</p>
            <Link
              href="/orchestration"
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gold-300 px-4 text-sm font-semibold text-ink transition hover:bg-gold-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Run autonomous audit
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        </aside>
      </div>
    </PageFrame>
  );
}
