import { Hono } from "hono";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { prettyJSON } from "hono/pretty-json";
import { inboundRoute } from "./api/inbound";
import { outboundRoute } from "./api/outbound";
import { webhookRoute } from "./api/webhook";
import { customLLMOpenAIAdvancedRoute } from "./api/custom-llm/openai-advanced";
import { customLLMOpenAISSEHandler } from "./api/custom-llm/openai-sse";
import { customLLMBasicHandler } from "./api/custom-llm/basic";

const app = new Hono();

app.use("*", prettyJSON());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.route("/api/inbound", inboundRoute);
app.route("/api/outbound", outboundRoute);
app.route("/api/webhook", webhookRoute);
app.route("/api/custom-llm/basic", customLLMBasicHandler);
app.route("/api/custom-llm/openai-advanced", customLLMOpenAIAdvancedRoute);
app.route("/api/custom-llm/openai-sse", customLLMOpenAISSEHandler);

export default app;
