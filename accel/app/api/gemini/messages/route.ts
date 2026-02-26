import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, tools, system } = await req.json();

    // Convert messages to Gemini format
    const geminiContents = messages.map((m: any) => {
      // Tool result messages
      if (Array.isArray(m.content)) {
        return {
          role: "user",
          parts: m.content.map((c: any) => ({
            functionResponse: {
              name: c.name ?? c.tool_use_id,
              response: { result: c.content },
            },
          })),
        };
      }
      // Assistant messages with tool calls
      if (m.role === "assistant" && Array.isArray(m.content)) {
        return {
          role: "model",
          parts: m.content.map((b: any) => {
            if (b.type === "tool_use") {
              return { functionCall: { name: b.name, args: b.input } };
            }
            return { text: b.text ?? "" };
          }),
        };
      }
      // Plain text messages
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      };
    });

    // Convert Anthropic-style tool schemas to Gemini function declarations
    const functionDeclarations =
      tools?.map((t: any) => ({
        name: t.name,
        description: t.description,
        parameters: t.input_schema,
      })) ?? [];

    const requestBody: any = {
      system_instruction: system ? { parts: [{ text: system }] } : undefined,
      contents: geminiContents,
      tools:
        functionDeclarations.length > 0
          ? [{ function_declarations: functionDeclarations }]
          : undefined,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.2,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini error:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: data.error?.message ?? "Gemini API error" },
        { status: response.status },
      );
    }

    // Normalise Gemini response → Anthropic-like shape so page.tsx needs minimal changes
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts ?? [];
    const finishReason = candidate?.finishReason;

    const content = parts.map((p: any) => {
      if (p.functionCall) {
        return {
          type: "tool_use",
          id: `call_${p.functionCall.name}_${Date.now()}`,
          name: p.functionCall.name,
          input: p.functionCall.args ?? {},
        };
      }
      return { type: "text", text: p.text ?? "" };
    });

    const hasToolUse = content.some((c: any) => c.type === "tool_use");

    return NextResponse.json({
      content,
      stop_reason: hasToolUse ? "tool_use" : "end_turn",
      finishReason,
    });
  } catch (err: any) {
    console.error("Gemini proxy error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
