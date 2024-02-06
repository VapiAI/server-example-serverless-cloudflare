import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { customLLMRoute } from "./api/custom-llm";
import { functionCallRoute } from "./api/functions";
import { inboundRoute } from "./api/inbound";
import { outboundRoute } from "./api/outbound";
import { webhookRoute } from "./api/webhook";

const app = new Hono();

app.use("*", prettyJSON());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.route("/api/inbound", inboundRoute);
app.route("/api/outbound", outboundRoute);
app.route("/api/webhook", webhookRoute);

app.route("/api/functions", functionCallRoute);
app.route("/api/custom-llm", customLLMRoute);

export default app;
