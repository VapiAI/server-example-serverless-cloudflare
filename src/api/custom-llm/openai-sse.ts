import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import OpenAI from "openai";
import { envConfig } from "../../config/env.config";

const openai = new OpenAI({ apiKey: envConfig.openai.apiKey });

const customLLMOpenAISSEHandler = new Hono();

customLLMOpenAISSEHandler.post("chat/completions", async (c) => {
  const { model, messages, max_tokens, temperature, stream, ...restParams } =
    await c.req.json();

  console.log("handler exist");
  try {
    if (stream) {
      const completionStream = await openai.chat.completions.create({
        model: model || "gpt-3.5-turbo",
        ...restParams,
        messages,
        max_tokens: max_tokens || 150,
        temperature: temperature || 0.7,
        stream: true,
      } as OpenAI.Chat.ChatCompletionCreateParamsStreaming);

      return streamSSE(c, async (stream) => {
        for await (const data of completionStream) {
          await stream.writeSSE({
            data: JSON.stringify(data),
          });
        }
      });
    } else {
      const completion = await openai.chat.completions.create({
        model: model || "gpt-3.5-turbo",
        ...restParams,
        messages,
        max_tokens: max_tokens || 150,
        temperature: temperature || 0.7,
        stream: false,
      });
      return c.json(completion, 200);
    }
  } catch (e: any) {
    return c.json({ error: e.message }, 500);
  }
});

export { customLLMOpenAISSEHandler };
