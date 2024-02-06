import { Hono } from "hono";
import { basicHandler } from "./basic";
import { ragHandler } from "./rag";

const app = new Hono();

app.route("basic", basicHandler);
app.route("rag", ragHandler);

export { app as functionCallRoute };
