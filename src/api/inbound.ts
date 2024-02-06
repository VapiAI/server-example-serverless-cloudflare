import { Hono } from "hono";
import { Bindings } from "../types/hono.types";
import { VapiPayload, VapiWebhookEnum } from "../types/vapi.types";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  try {
    const reqBody: any = await c.req.json();
    const payload: VapiPayload = reqBody.message;
    switch (payload.type) {
      case VapiWebhookEnum.ASSISTANT_REQUEST:
        // Handle Business logic here, similar to the Vercel function
        const assistant = payload.call
          ? {
              name: "Paula",
              model: {
                provider: "openai",
                model: "gpt-3.5-turbo",
                temperature: 0.7,
                systemPrompt:
                  "You're Paula, an AI assistant who can help user draft beautiful emails to their clients based on the user requirements. Then Call sendEmail function to actually send the email.",
                functions: [
                  {
                    name: "sendEmail",
                    description:
                      "Send email to the given email address and with the given content.",
                    parameters: {
                      type: "object",
                      properties: {
                        email: {
                          type: "string",
                          description:
                            "Email to which we want to send the content.",
                        },
                        content: {
                          type: "string",
                          description:
                            "Actual Content of the email to be sent.",
                        },
                      },
                      required: ["email"],
                    },
                  },
                ],
              },
              voice: {
                provider: "11labs",
                voiceId: "paula",
              },
              firstMessage: "Hi, I'm Paula, your personal email assistant.",
            }
          : null;
        if (assistant) return c.json({ assistant });
        break;
      default:
        throw new Error(`Unhandled message type`);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
  return c.text("Not found", 404);
});

export { app as inboundRoute };
