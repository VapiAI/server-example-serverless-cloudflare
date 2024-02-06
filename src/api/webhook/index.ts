import { Hono } from "hono";
import { VapiPayload, VapiWebhookEnum } from "../../types/vapi.types";
import { Bindings } from "../../types/hono.types";
import { assistantRequestHandler } from "./assistantRequest";
import { endOfCallReportHandler } from "./endOfCallReport";
import { functionCallHandler } from "./functionCall";
import { HangEventHandler } from "./hang";
import { speechUpdateHandler } from "./speechUpdateHandler";
import { statusUpdateHandler } from "./statusUpdate";
import { transcriptHandler } from "./transcript";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  const conversationUuid = c.req.query("conversation_uuid");

  if (conversationUuid) {
    // Fetch some data from the database and use it in the handlers.
    console.log("conversationUuid", conversationUuid);
  }

  try {
    const reqBody: any = await c.req.json();
    const payload: VapiPayload = reqBody.message;
    switch (payload.type) {
      case VapiWebhookEnum.FUNCTION_CALL:
        console.log("func call");
        return c.json(await functionCallHandler(payload), 201);
      case VapiWebhookEnum.STATUS_UPDATE:
        return c.json(await statusUpdateHandler(payload), 201);
      case VapiWebhookEnum.ASSISTANT_REQUEST:
        return c.json(await assistantRequestHandler(payload), 201);
      case VapiWebhookEnum.END_OF_CALL_REPORT:
        await endOfCallReportHandler(payload);
        return c.json({}, 201);
      case VapiWebhookEnum.SPEECH_UPDATE:
        return c.json(await speechUpdateHandler(payload), 201);
      case VapiWebhookEnum.TRANSCRIPT:
        return c.json(await transcriptHandler(payload), 201);
      case VapiWebhookEnum.HANG:
        return c.json(await HangEventHandler(payload), 201);
      default:
        throw new Error("Unhandled message type");
    }
  } catch (error: any) {
    return c.text(error.message, 500);
  }
});

export { app as webhookRoute };
