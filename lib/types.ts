export type Severity = "Low" | "Medium" | "High" | "Critical";
export type Effort = "Low" | "Medium" | "High";
export type RiskLevel = "Low" | "Medium" | "High";
export type AgentStatus = "waiting" | "running" | "completed";

export type AuditSampleId =
  | "bloated-saas-backend"
  | "wasteful-ai-pipeline"
  | "overprovisioned-microservice";

export interface AuditMetrics {
  dockerImageSizeMb: number;
  dockerImageTargetMb: number;
  ciRuntimeMinutes: number;
  ciRuntimeTargetMinutes: number;
  monthlyCloudWasteUsd: number;
  estimatedTotalMonthlyWasteUsd: number;
  aiDuplicateCallRate: number;
  idleComputeHoursPerDay: number;
  monthlyCarbonWasteKgCO2e: number;
  annualSavingsUsd: number;
  engineeringHoursSavedMonthly: number;
  kintsugiScoreBefore: number;
  kintsugiScoreAfter: number;
}

export interface AuditPackageFile {
  name: string;
  type: "package" | "docker" | "ci" | "billing" | "api-log" | "notes" | "tree";
  signal: string;
}

export interface Finding {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  estimatedMonthlyCostWaste: number;
  estimatedCarbonKgCO2e: number;
  repairRecommendation: string;
  implementationDifficulty: Effort;
  riskLevel: RiskLevel;
  expectedImpact: string;
  confidence: number;
  sourceSignals: string[];
  before: string;
  after: string;
}

export interface AuditSample {
  id: AuditSampleId;
  name: string;
  tagline: string;
  description: string;
  organizationProfile: string;
  architectureNotes: string[];
  files: AuditPackageFile[];
  metrics: AuditMetrics;
  findings: Finding[];
}

export interface AgentResult {
  agentName: string;
  status: "completed";
  confidence: number;
  summary: string;
  explanation: string;
  output: Record<string, unknown>;
  findings?: Finding[];
}

export interface RepairItem {
  finding: Finding;
  priorityScore: number;
  lane: "Quick win" | "Medium-term" | "Needs human approval";
  suggestedOwner: string;
  verificationStep: string;
}

export interface RepairPlan {
  formula: string;
  quickWins: RepairItem[];
  mediumTerm: RepairItem[];
  humanApproval: RepairItem[];
  allItems: RepairItem[];
  pullRequestSummary: string;
}

export interface X402Step {
  id: string;
  label: string;
  actor: "Agent" | "Paid API" | "Budget policy" | "Ledger";
  httpStatus?: number;
  method?: "GET" | "POST";
  endpoint?: string;
  header?: string;
  detail: string;
  status: "completed" | "approved" | "logged";
}

export interface X402Simulation {
  serviceName: string;
  priceUsd: number;
  budgetUsd: number;
  approved: boolean;
  mockPaymentHeader: string;
  premiumResult: string;
  receiptId: string;
  steps: X402Step[];
}

export interface ImpactReport {
  executiveSummary: string;
  monthlySavingsUsd: number;
  annualSavingsUsd: number;
  monthlyCarbonReductionKgCO2e: number;
  engineeringHoursSavedMonthly: number;
  riskLevel: RiskLevel;
  scoreBefore: number;
  scoreAfter: number;
  markdown: string;
}

export interface AuditRun {
  audit: AuditSample;
  agents: AgentResult[];
  repairPlan: RepairPlan;
  x402Simulation: X402Simulation;
  report: ImpactReport;
}
