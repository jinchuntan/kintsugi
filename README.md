# KintsugiOps AI

**Repair software waste before it becomes cloud waste.**

KintsugiOps AI is an autonomous green software repair agent for the AI Agent Olympics Hackathon at Milan AI Week 2026. It helps software teams find the "cracks" in their systems: bloated containers, over-provisioned cloud resources, redundant CI jobs, duplicate AI API calls, unused dependencies, idle workloads, and other waste that turns into avoidable cost and carbon emissions.

## Problem

Modern engineering teams often respond to slow systems by adding more cloud resources. That hides waste instead of repairing it. The result is higher cloud bills, longer CI cycles, unnecessary carbon impact, and engineering time lost to systems that quietly became inefficient.

Most optimization tools report problems. KintsugiOps AI is designed to feel like an autonomous repair team that diagnoses, prioritizes, verifies, and simulates execution.

## Solution

KintsugiOps AI provides a structured enterprise dashboard where a user selects or uploads a software audit package. The app runs a multi-agent workflow and produces:

- Waste findings with severity, cost, carbon, effort, risk, and confidence
- Estimated monthly and annual savings
- Estimated kgCO2e reduction
- Before/after impact estimates
- A prioritized repair plan using `impact x confidence / effort / risk`
- A simulated X402 payment flow for paid specialist audit services
- An exportable markdown impact report

## Why Kintsugi

Kintsugi is the Japanese practice of repairing broken pottery with gold, making the repair visible and valuable instead of hiding it. KintsugiOps AI applies that metaphor to software:

- **Cracks** are software waste findings
- **Gold repairs** are recommended optimizations
- **Restored vessel** is the improved software system
- **Repair ledger** is the verified before/after impact
- **Kintsugi Score** is the health score after repair

The design uses a clean enterprise light theme with subtle gold accents rather than decorative cultural styling.

## Multi-Agent System

The demo workflow is implemented as typed agents under `lib/agents`:

- `Crack Finder Agent`: scans package, Docker, CI, API log, and repo tree signals
- `Cloud Waste Agent`: identifies over-provisioning, idle compute, and observability waste
- `Carbon Accountant Agent`: estimates monthly kgCO2e impact
- `Repair Planner Agent`: ranks repairs and creates execution lanes
- `Risk Verifier Agent`: adds approval gates, canaries, and verification checks
- `X402 Payment Agent`: simulates autonomous paid API access
- `Impact Report Agent`: creates an executive-ready repair ledger

Each agent accepts structured input and returns structured JSON so it can be replaced with real LLM-backed or tool-backed logic later.

## X402 Payment Simulation

The X402 flow is implemented in `lib/x402/simulation.ts` and displayed in the X402 page:

1. Agent requests a paid Carbon Intensity API
2. API returns `HTTP 402 Payment Required`
3. Agent reads the price
4. Agent checks the autonomous budget
5. Agent signs a mock payment
6. Agent retries with an `X-PAYMENT` header
7. API returns a premium audit result
8. Receipt is logged in the repair ledger

The current version is simulated for hackathon reliability, but the code is isolated so a real X402 provider can replace the mock signer and paid API call.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Recharts
- Lucide icons
- Next.js API routes
- Local seed data and mock AI mode

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run typecheck
npm run build
```

Or run the full local verification command:

```bash
npm run verify
```

## Deploy on Vercel

This repository is Vercel-ready. The included `vercel.json` uses the Next.js framework preset, `npm install`, and `npm run build`.

Recommended Vercel settings:

- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: `.next`
- Node.js: `20.x` or newer

The app defaults to mock AI mode, so deployment does not require API keys.

## Environment Variables

The app works without API keys in deterministic mock mode.

```bash
KINTSUGIOPS_AI_PROVIDER=mock
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
KINTSUGIOPS_OPENAI_MODEL=gpt-4.1-mini
KINTSUGIOPS_ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

Supported provider modes:

- `mock`: default, fully demo-safe
- `openai`: calls an OpenAI-compatible chat endpoint through `lib/ai/provider.ts`
- `anthropic`: calls Anthropic Messages API through the same abstraction

## Demo Script

1. Start on the landing page and introduce the one-liner.
2. Open **Audit** and select **Bloated SaaS backend**.
3. Run the autonomous audit and show the visible agent workflow.
4. Open **Findings** and highlight Docker image size, CI runtime, idle compute, duplicate AI API calls, cost waste, and carbon waste.
5. Open **Repair Plan** and explain quick wins, medium-term fixes, approval-gated repairs, and the priority formula.
6. Open **X402** and show the `HTTP 402` payment moment, budget check, `X-PAYMENT` header, and receipt.
7. Open **Report**, export the markdown, and close on business plus sustainability impact.

## Hackathon Judging Alignment

- **Autonomous AI agents**: visible typed agent workflow and handoffs
- **Multi-agent collaboration**: seven specialist agents produce a combined result
- **Enterprise usefulness**: engineering, DevOps, ESG, and CTO-facing metrics
- **Sustainability impact**: cost and carbon estimates on every major finding
- **Business value**: monthly and annual savings, repair prioritization, PR summary
- **X402-style payment**: simulated agentic paid API flow with receipt logging
- **Memorable metaphor**: kintsugi turns software cracks into measurable repairs
- **Demo readiness**: mock data, local run, no API key required

## Roadmap

- Connect to GitHub repositories and pull request generation
- Add live cloud billing imports from AWS, Azure, and GCP
- Replace mock X402 signer with a real payment provider
- Add real carbon intensity datasets by region and time window
- Add policy controls for autonomous repair approval levels
- Generate actual code diffs for Dockerfile, CI, and dependency repairs
- Persist audit runs and repair ledgers in a database
- Add team dashboards for savings over time
