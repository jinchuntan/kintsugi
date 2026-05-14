import type { AuditRun } from "@/lib/types";
import { carbonAccountantAgent } from "@/lib/agents/carbonAccountantAgent";
import { cloudWasteAgent } from "@/lib/agents/cloudWasteAgent";
import { crackFinderAgent } from "@/lib/agents/crackFinderAgent";
import { impactReportAgent } from "@/lib/agents/impactReportAgent";
import { repairPlannerAgent } from "@/lib/agents/repairPlannerAgent";
import { riskVerifierAgent } from "@/lib/agents/riskVerifierAgent";
import { x402PaymentAgent } from "@/lib/agents/x402PaymentAgent";
import { getAuditSample } from "@/lib/data/demoAudit";

export function runAuditWorkflow(auditId?: string): AuditRun {
  const audit = getAuditSample(auditId);
  const crackFinder = crackFinderAgent(audit);
  const cloudWaste = cloudWasteAgent(audit);
  const carbonAccountant = carbonAccountantAgent(audit);
  const repairPlanner = repairPlannerAgent(audit);
  const riskVerifier = riskVerifierAgent(audit, repairPlanner.repairPlan);
  const x402Payment = x402PaymentAgent(audit);
  const impactReport = impactReportAgent(audit, repairPlanner.repairPlan);

  return {
    audit,
    agents: [
      crackFinder,
      cloudWaste,
      carbonAccountant,
      repairPlanner.result,
      riskVerifier,
      x402Payment.result,
      impactReport.result
    ],
    repairPlan: repairPlanner.repairPlan,
    x402Simulation: x402Payment.simulation,
    report: impactReport.report
  };
}
