// ---------------------------
// Unified LLM – Full Server (Deployment Ready)
// ---------------------------
import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import bodyParser from "body-parser";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------------------
// ⚙️ Express + Middleware
// ---------------------------
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------
// 🧠 Database (LowDB)
// ---------------------------

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const dbFile = path.join(dataDir, "users.json");
const adapter = new JSONFile(dbFile);
const defaultData = { users: [], logs: [] };
const db = new Low(adapter, defaultData);

async function initDB() {
  try {
    await db.read();
    if (!db.data || Object.keys(db.data).length === 0) {
      db.data = defaultData;
      await db.write();
    }
    console.log("✅ LowDB ready");
  } catch (err) {
    console.error("❌ Database corrupted or unreadable. Reinitializing...");
    fs.writeFileSync(dbFile, JSON.stringify(defaultData, null, 2));
    await db.read();
    console.log("✅ LowDB reset complete");
  }
}
await initDB();

// ---------------------------
// 🔐 JWT Secret
// ---------------------------
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ---------------------------
// 💳 Stripe Setup
// ---------------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ---------------------------
// 🧍 USER ROUTES
// ---------------------------

// Register user
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const existing = db.data.users.find((u) => u.email === email);
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: nanoid(), email, password: hashed, plan: "free" };
  db.data.users.push(newUser);
  await db.write();

  res.json({ message: "User registered successfully" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = db.data.users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ message: "Login successful", token, plan: user.plan });
});

// ---------------------------
// 💳 STRIPE CHECKOUT
// ---------------------------
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { plan, email } = req.body;
    const price =
      plan === "pro"
        ? process.env.STRIPE_PRICE_PRO
        : process.env.STRIPE_PRICE_BASIC;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [{ price, quantity: 1 }],
      success_url: `${process.env.BASE_URL}/success.html`,
      cancel_url: `${process.env.BASE_URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// 🧾 STRIPE WEBHOOK
// ---------------------------
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_email;
      const plan =
        session.metadata?.plan ||
        (session.amount_total === 1000 ? "basic" : "pro");

      const user = db.data.users.find((u) => u.email === email);
      if (user) {
        user.plan = plan;
        await db.write();
        console.log(`✅ Updated ${email} to plan: ${plan}`);
      }
    }

    res.json({ received: true });
  }
);

// ---------------------------
// 🌍 Routes & Static Pages
// ---------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/ui", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "ui.html"));
});

// ---------------------------
// 🚀 Start Server
// ---------------------------
const PORT = process.env.PORT || 3000;
app
  .listen(PORT, () => {
    console.log(`✅ Unified LLM server running at http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} already in use. Try another port.`);
      process.exit(1);
    } else {
      throw err;
    }
  });
