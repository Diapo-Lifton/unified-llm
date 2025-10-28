/**
 * server.js
 * Express backend with:
 * - lowdb for simple storage (ensures default data)
 * - Stripe Checkout endpoints (create session)
 * - Webhook endpoint (verify signature)
 * - Simple chat proxy endpoint (calls OpenAI if OPENAI_API_KEY present)
 *
 * NOTE: Do not store secrets in .env committed to Git. Use Render env vars or .env.local locally.
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Stripe from "stripe";
import { Low, JSONFile } from "lowdb";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// --- Env / config ---
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const JWT_SECRET = process.env.JWT_SECRET || "change_me";

// --- Init Stripe if key present ---
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" }) : null;

// --- Setup lowdb with default data so "missing default data" won't happen ---
const dbFile = path.join(process.cwd(), "db.json");
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({
    users: [],
    subscriptions: [],
    payments: [],
    messages: [],
    settings: { language: "en" }
  }, null, 2));
}
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

// Read DB
await db.read();
db.data = db.data || { users: [], subscriptions: [], payments: [], messages: [], settings: { language: "en" } };
await db.write();

const app = express();

// Use JSON parser for non-webhook endpoints
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (your public folder)
app.use(express.static(path.join(process.cwd(), "public")));

// --- Routes ---

// Health check
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: NODE_ENV });
});

// Simple settings read/write
app.get("/api/settings", async (req, res) => {
  await db.read();
  res.json(db.data.settings || {});
});
app.post("/api/settings", async (req, res) => {
  db.data.settings = { ...(db.data.settings || {}), ...(req.body || {}) };
  await db.write();
  res.json({ ok: true, settings: db.data.settings });
});

// Create Stripe checkout session for plan -> returns session URL
// Expects body: { priceId: "pro" } or { priceId: "ultimate" }
app.post("/api/checkout", async (req, res) => {
  if (!stripe) return res.status(500).json({ error: "Stripe not configured on server." });

  const { priceId } = req.body || {};
  // We'll map friendly priceId to actual Stripe Price IDs or to inline amounts.
  // Use your real Stripe Price IDs (recommended) or use amount and currency.
  // Here we create Checkout session with fixed amounts (in USD cents)
  const plans = {
    pro: { price: 2500, name: "Pro", currency: "usd" },       // $25.00
    ultimate: { price: 4500, name: "Ultimate", currency: "usd" } // $45.00
  };
  const plan = plans[priceId];
  if (!plan) return res.status(400).json({ error: "Unknown plan" });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: plan.currency,
            product_data: { name: `InteGen — ${plan.name}` },
            recurring: { interval: "month" },
            unit_amount: plan.price
          },
          quantity: 1
        }
      ],
      // success/cancel URLs should point to your frontend routes
      success_url: `${req.headers.origin || `http://localhost:${PORT}`}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || `http://localhost:${PORT}`}/cancel.html`,
      metadata: { plan: priceId }
    });

    return res.json({ url: session.url, id: session.id });
  } catch (err) {
    console.error("Stripe create session error:", err);
    return res.status(500).json({ error: "stripe_error", details: String(err) });
  }
});

// Minimal webhook endpoint to capture checkout.session.completed
// Must use raw body for signature verification
app.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    console.warn("Webhook received but Stripe or webhook secret not configured.");
    return res.status(400).send("webhook not configured");
  }
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event types
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout session completed:", session.id, session.metadata);

    // Store payment/subscription record in DB
    await db.read();
    db.data.payments = db.data.payments || [];
    db.data.payments.push({
      id: nanoid(),
      stripeSessionId: session.id,
      customer: session.customer,
      plan: session.metadata?.plan || null,
      status: "completed",
      createdAt: new Date().toISOString()
    });
    await db.write();
  }

  // respond 200
  res.json({ received: true });
});

// Simple chat proxy endpoint (demonstration).
// If OPENAI_API_KEY is set, this can forward to OpenAI (or other adapters).
app.post("/api/chat", async (req, res) => {
  const { prompt, model } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "prompt required" });

  // If OpenAI key present, forward (example with fetch to OpenAI API).
  if (OPENAI_API_KEY) {
    try {
      const fetchRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: model || "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500
        })
      });
      const data = await fetchRes.json();
      // Save message to DB
      db.data.messages = db.data.messages || [];
      db.data.messages.push({ id: nanoid(), prompt, response: data, createdAt: new Date().toISOString() });
      await db.write();
      return res.json({ ok: true, ai: data });
    } catch (err) {
      console.error("OpenAI proxy error:", err);
      return res.status(500).json({ error: "openai_error", details: String(err) });
    }
  }

  // If no OpenAI key present — return a friendly placeholder
  db.data.messages = db.data.messages || [];
  const placeholderResponse = `InteGen offline demo answer for: "${prompt}". Set OPENAI_API_KEY to enable real responses.`;
  db.data.messages.push({ id: nanoid(), prompt, response: placeholderResponse, createdAt: new Date().toISOString() });
  await db.write();
  return res.json({ ok: true, ai: { text: placeholderResponse } });
});

// Fallback - serve index.html for SPA-like routes (if you use hash-routing)
app.get("*", (req, res) => {
  // Only serve files that exist in public; otherwise serve index.html
  const possible = path.join(process.cwd(), "public", req.path.replace(/^\//, ""));
  if (fs.existsSync(possible) && fs.statSync(possible).isFile()) {
    return res.sendFile(possible);
  }
  return res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log("✅ LowDB ready");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
