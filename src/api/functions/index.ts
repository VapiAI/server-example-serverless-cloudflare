import { Hono } from "hono";
import { Bindings } from "../../types/hono.types";
import { basicHandler } from "./basic";
import { ragHandler } from "./rag";

const app = new Hono<{ Bindings: Bindings }>();

app.route("basic", basicHandler);
app.route("rag", ragHandler);

export { app as functionCallRoute };
