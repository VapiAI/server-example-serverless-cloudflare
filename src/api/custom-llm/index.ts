import { Hono } from "hono";
import { basicHandler } from "./basic";
import { openAISSEHandler } from "./openai-sse";
import { openAIAdvancedRoute } from "./openai-advanced";

const app = new Hono();

app.route("basic", basicHandler);
app.route("openai-sse", openAISSEHandler);
app.route("openai-advanced", openAIAdvancedRoute);

export { app as customLLMRoute };
