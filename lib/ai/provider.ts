export type AiProviderMode = "mock" | "openai" | "anthropic";

export interface StructuredGenerationRequest {
  system: string;
  prompt: string;
  temperature?: number;
}

export interface StructuredGenerationResponse {
  mode: AiProviderMode;
  content: string;
  mocked: boolean;
}

export function getAiProviderMode(): AiProviderMode {
  const mode = (process.env.KINTSUGIOPS_AI_PROVIDER ?? process.env.AI_PROVIDER ?? "mock").toLowerCase();
  if (mode === "openai" || mode === "anthropic") {
    return mode;
  }
  return "mock";
}

export async function generateStructuredNarrative(
  request: StructuredGenerationRequest
): Promise<StructuredGenerationResponse> {
  const mode = getAiProviderMode();
  const apiKey =
    mode === "anthropic"
      ? process.env.ANTHROPIC_API_KEY
      : process.env.OPENAI_API_KEY ?? process.env.KINTSUGIOPS_OPENAI_API_KEY;

  if (mode === "mock" || !apiKey) {
    return {
      mode: "mock",
      mocked: true,
      content:
        "Mock AI mode: deterministic agent outputs are generated from the audit package so the demo remains fully runnable without API keys."
    };
  }

  if (mode === "openai") {
    const baseUrl = process.env.KINTSUGIOPS_OPENAI_BASE_URL ?? "https://api.openai.com/v1";
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.KINTSUGIOPS_OPENAI_MODEL ?? "gpt-4.1-mini",
        temperature: request.temperature ?? 0.2,
        messages: [
          { role: "system", content: request.system },
          { role: "user", content: request.prompt }
        ]
      })
    });
    const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return {
      mode,
      mocked: false,
      content: json.choices?.[0]?.message?.content ?? ""
    };
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.KINTSUGIOPS_ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest",
      max_tokens: 900,
      temperature: request.temperature ?? 0.2,
      system: request.system,
      messages: [{ role: "user", content: request.prompt }]
    })
  });
  const json = (await response.json()) as { content?: Array<{ text?: string }> };
  return {
    mode,
    mocked: false,
    content: json.content?.[0]?.text ?? ""
  };
}

export interface VisionRequest {
  imageBase64: string;
  mimeType: string;
  prompt: string;
  system?: string;
}

export interface VisionResponse {
  mode: AiProviderMode;
  mocked: boolean;
  content: string;
}

const MOCK_VISION_RESPONSE = JSON.stringify({
  summary: "The uploaded image shows a cloud billing dashboard with several over-provisioned resources and idle compute instances. Detected 3 waste signals: unused reserved instances ($420/mo), oversized database tier ($310/mo), and idle load balancers ($85/mo).",
  findings: [
    {
      title: "Unused reserved instances",
      category: "Cloud compute",
      severity: "High",
      detail: "Reserved instances with <5% average utilization detected in the billing screenshot.",
      estimatedMonthlyCostUsd: 420,
      repairSuggestion: "Convert to on-demand or release reservations for idle capacity."
    },
    {
      title: "Oversized database tier",
      category: "Database",
      severity: "Medium",
      detail: "Database instance appears provisioned at 4x the required capacity based on visible metrics.",
      estimatedMonthlyCostUsd: 310,
      repairSuggestion: "Downsize to the next tier or enable auto-scaling."
    },
    {
      title: "Idle load balancers",
      category: "Networking",
      severity: "Low",
      detail: "Multiple load balancers with zero active connections visible in the dashboard.",
      estimatedMonthlyCostUsd: 85,
      repairSuggestion: "Remove unused load balancers or consolidate traffic routing."
    }
  ]
});

export async function generateVisionAnalysis(request: VisionRequest): Promise<VisionResponse> {
  const mode = getAiProviderMode();
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.KINTSUGIOPS_OPENAI_API_KEY;

  if (mode !== "openai" || !apiKey) {
    return { mode: "mock", mocked: true, content: MOCK_VISION_RESPONSE };
  }

  const baseUrl = process.env.KINTSUGIOPS_OPENAI_BASE_URL ?? "https://api.openai.com/v1";
  const visionModel = process.env.KINTSUGIOPS_VISION_MODEL ?? "meta-llama/llama-4-scout-17b-16e-instruct";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: visionModel,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: request.system ?? "You are a software waste analyst. Analyze images of cloud dashboards, architecture diagrams, billing reports, or infrastructure screenshots. You MUST respond with ONLY a valid JSON object (no markdown, no explanation) in this exact format: {\"summary\": \"string\", \"findings\": [{\"title\": \"string\", \"category\": \"string\", \"severity\": \"Low|Medium|High|Critical\", \"detail\": \"string\", \"estimatedMonthlyCostUsd\": number, \"repairSuggestion\": \"string\"}]}. If the image is not infrastructure-related, still return the JSON format with your best analysis of any inefficiencies visible." },
        {
          role: "user",
          content: [
            { type: "text", text: request.prompt + " Respond with ONLY valid JSON, no markdown fences." },
            { type: "image_url", image_url: { url: `data:${request.mimeType};base64,${request.imageBase64}` } }
          ]
        }
      ]
    })
  });

  const json = (await response.json()) as { choices?: Array<{ message?: { content?: string } }>; error?: { message?: string } };

  if (json.error) {
    return { mode: "mock", mocked: true, content: MOCK_VISION_RESPONSE };
  }

  return {
    mode,
    mocked: false,
    content: json.choices?.[0]?.message?.content ?? MOCK_VISION_RESPONSE
  };
}
