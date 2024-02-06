import { Hono } from "hono";
import { Bindings } from "../../types/hono.types";
import { basicHandler } from "./basic";
import { openAIAdvancedRoute } from "./openai-advanced";
import { openAISSEHandler } from "./openai-sse";

const app = new Hono<{ Bindings: Bindings }>();

app.route("basic", basicHandler);
app.route("openai-sse", openAISSEHandler);
app.route("openai-advanced", openAIAdvancedRoute);

export { app as customLLMRoute };
