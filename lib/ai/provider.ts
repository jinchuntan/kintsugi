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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
