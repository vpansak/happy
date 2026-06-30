import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  name: z.string().trim().min(1).max(100),
  mobile: z
    .string()
    .trim()
    .min(5)
    .max(25)
    .regex(/^[+\d][\d\s\-()]{4,24}$/, "Invalid phone number"),
  email: z.string().trim().email().max(255),
  userAgent: z.string().max(500).optional(),
});

export const submitGiftRedemption = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("gift_redemptions")
      .insert({
        name: data.name,
        mobile: data.mobile,
        email: data.email,
        user_agent: data.userAgent ?? null,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("gift_redemption_insert_failed", error);
      throw new Error("Could not save your details. Please try again.");
    }

    // SMS placeholder — wire Twilio/MSG91 here when ready.
    // Email notification to aloksingh84959@gmail.com will activate
    // automatically once the project email domain is configured.

    return { ok: true, id: row.id };
  });
