import { Hono } from "hono";
import { Bindings } from "../types/hono.types";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  // Extract phoneNumberId, assistantId, and customerNumber from the request body
  const { phoneNumberId, assistantId, customerNumber } = await c.req.json();

  try {
    /**!SECTION
     * Handle Outbound Call logic here.
     * This can initiate an outbound call to a customer's phonenumber using Vapi.
     */
    const response = await fetch(`${c.env.VAPI_BASE_URL}/call/phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${c.env.VAPI_API_KEY}`,
      },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        assistantId: assistantId,
        customer: {
          number: customerNumber,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return c.json(data, 200);
  } catch (error: any) {
    return c.json(
      {
        message: "Failed to place outbound call",
        error: error.message,
      },
      500
    );
  }
});

export { app as outboundRoute };
