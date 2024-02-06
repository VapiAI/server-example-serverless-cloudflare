import { Hono } from "hono";
import { getRandomName } from "../../functions/getRandomName";
import { Bindings } from "../../types/hono.types";
import { VapiPayload, VapiWebhookEnum } from "../../types/vapi.types";

const basicHandler = new Hono<{ Bindings: Bindings }>();

basicHandler.post("/", async (c) => {
  try {
    const reqBody: any = await c.req.json();
    const payload: VapiPayload = reqBody.message;

    if (payload.type === VapiWebhookEnum.FUNCTION_CALL) {
      const { functionCall } = payload;

      if (!functionCall) {
        return c.json({ error: "Invalid Request." }, 400);
      }

      const { name, parameters } = functionCall;
      console.log("functionCall", functionCall);
      if (name === "getRandomName") {
        const result = await getRandomName(parameters);
        return c.json(result, 201);
      } else {
        console.log(`Function ${name} not found`);
        return c.json({ error: `Function ${name} not found` }, 404);
      }
    }

    return c.json({}, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export { basicHandler };
