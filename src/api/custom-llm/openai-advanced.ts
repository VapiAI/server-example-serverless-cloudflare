import OpenAI from "openai";
import { envConfig } from "../../config/env.config";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

const app = new Hono();

const openai = new OpenAI({ apiKey: envConfig.openai.apiKey });

app.post("chat/completions", async (c) => {
  try {
    const {
      model,
      messages,
      max_tokens,
      temperature,
      stream,
      call,
      ...restParams
    } = await c.req.json();

    const lastMessage = messages?.[messages.length - 1];
    const prompt = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: `
        Create a prompt which can act as a prompt template where I put the original prompt and it can modify it according to my intentions so that the final modified prompt is more detailed. You can expand certain terms or keywords.
        ----------
        PROMPT: ${lastMessage.content}.
        MODIFIED PROMPT: `,
      max_tokens: 500,
      temperature: 0.7,
    });

    const modifiedMessage = [
      ...messages.slice(0, messages.length - 1),
      { ...lastMessage, content: prompt.choices[0].text },
    ];

    if (stream) {
      const completionStream = await openai.chat.completions.create({
        model: model || "gpt-3.5-turbo",
        ...restParams,
        messages: modifiedMessage,
        max_tokens: max_tokens || 150,
        temperature: temperature || 0.7,
        stream: true,
      } as OpenAI.Chat.ChatCompletionCreateParamsStreaming);

      // c.res.setHeader("Content-Type", "text/event-stream");
      // c.res.setHeader("Cache-Control", "no-cache");
      // c.res.setHeader("Connection", "keep-alive");

      return streamSSE(c, async (stream) => {
        for await (const data of completionStream) {
          await stream.writeSSE({
            data: JSON.stringify(data),
            event: data.object,
            id: data.id,
          });
        }
      });
    } else {
      const completion = await openai.chat.completions.create({
        model: model || "gpt-3.5-turbo",
        ...restParams,
        messages: modifiedMessage,
        max_tokens: max_tokens || 150,
        temperature: temperature || 0.7,
        stream: false,
      });
      return c.json(completion, 200);
    }
  } catch (e) {
    console.log(e);
    return c.json({ error: e }, 500);
  }
});

export { app as openAIAdvancedRoute };
