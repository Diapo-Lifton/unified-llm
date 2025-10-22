// app.js — frontend actions (auth, chat, providers, subscription)

// ---------- Configuration ----------
const PRICES = {
  basic: "prod_THWyzzBAwqSNYH",   // <-- replace with your Stripe price ID (price_xxx)
  pro:   "prod_THX5VHhNPHBc6Z"      // <-- replace with your Stripe price ID (price_xxx)
};

// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const authToken = () => localStorage.getItem("token") || null;
const setAuthToken = (t) => localStorage.setItem("token", t);

// ---------- Nav: show login modal or route ----------
document.addEventListener("click", (ev) => {
  const t = ev.target;
  if (t.matches("#navLogin, #navLogin2, #navLogin3, #navLogin4, #navLogin5, #navLogin6, #navLogin7")) {
    window.location.href = "/login.html";
  }
});

// Language selection (store simple choice)
["languageSelect","languageSelect2","languageSelect3","languageSelect4","languageSelect5","languageSelect6","languageSelect7"].forEach(id=>{
  const el = document.getElementById(id);
  if(!el) return;
  el.value = localStorage.getItem("language") || "en";
  el.addEventListener("change",(e)=>{ localStorage.setItem("language", e.target.value); alert("Language set: "+e.target.value); });
});

// ---------- Mini chat on index page ----------
const miniSend = document.getElementById("miniSend");
if (miniSend) {
  miniSend.addEventListener("click", async () => {
    const prompt = document.getElementById("miniPrompt").value.trim();
    if (!prompt) return alert("Type a message");
    // If the user is logged in, send to /api/chat; else show demo reply
    const token = authToken();
    if (!token) {
      alert("Demo reply: " + "This is a local demo. Please register/login to use real models.");
      return;
    }
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type":"application/json", "Authorization":"Bearer "+token }, body: JSON.stringify({ prompt, providers: ["all"] }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message || j.error || "Chat failed");
      alert("Reply: " + (j.fused || "No reply"));
    } catch (err) { alert("Chat error: " + err.message); }
  });
}

// ---------- Contact form ----------
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  contactForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    document.getElementById("contactMsg").textContent = "Message sent (demo). We will contact you.";
    contactForm.reset();
  });
}

// ---------- Auth page (login/register) ----------
const doLogin = document.getElementById("doLogin");
const doRegister = document.getElementById("doRegister");
if (doLogin || doRegister) {
  const emailEl = document.getElementById("authEmail");
  const passEl = document.getElementById("authPassword");
  const authMsg = document.getElementById("authMsg");

  if (doRegister) doRegister.addEventListener("click", async () => {
    const email = emailEl.value.trim(), password = passEl.value.trim();
    if (!email || !password) return authMsg.textContent = "Fill both fields";
    try {
      const res = await fetch("/api/register", { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ email, password }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message || JSON.stringify(j));
      authMsg.textContent = "Registered. Now login.";
      emailEl.value = ""; passEl.value = "";
    } catch (err) { authMsg.textContent = "Error: " + err.message; }
  });

  if (doLogin) doLogin.addEventListener("click", async () => {
    const email = emailEl.value.trim(), password = passEl.value.trim();
    if (!email || !password) return authMsg.textContent = "Fill both fields";
    try {
      const res = await fetch("/api/login", { method:"POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ email, password }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message || JSON.stringify(j));
      // API variant may return token in different fields — handle both
      const token = j.token || j.tokenString || j.accessToken || j.data?.token;
      if (token) {
        setAuthToken(token);
        authMsg.textContent = "Login successful";
        setTimeout(()=> window.location.href = "/ui", 700);
      } else {
        authMsg.textContent = "Login OK (no token returned)";
      }
    } catch (err) { authMsg.textContent = "Error: " + err.message; }
  });
}

// ---------- Subscribe buttons on subscribe.html ----------
document.querySelectorAll(".subscribe-btn").forEach(btn=>{
  btn.addEventListener("click", async (ev)=>{
    const plan = btn.dataset.plan;
    if (!PRICES[plan] || PRICES[plan].startsWith("REPLACE")) return alert("Admin: add Price IDs in app.js");
    const token = authToken();
    if (!token) {
      if (!confirm("You must login/register before subscribing. Go to login?")) return;
      window.location.href = "/login.html"; return;
    }
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type":"application/json", "Authorization":"Bearer "+token },
        body: JSON.stringify({ priceId: PRICES[plan] })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message || j.error || JSON.stringify(j));
      // redirect to Stripe Checkout URL
      window.location.href = j.url;
    } catch (err) { alert("Checkout error: "+err.message); }
  });
});

// ---------- Chat page logic (ui.html) ----------
if (document.getElementById("sendBtn")) {
  const chatBox = document.getElementById("chatBox");
  const sendBtn = document.getElementById("sendBtn");
  const input = document.getElementById("userInput");
  const providerSelect = document.getElementById("providerSelect");
  const quotaInfo = document.getElementById("quotaInfo");

  async function loadProviders(){
    try{
      const r = await fetch("/api/providers");
      const list = await r.json();
      providerSelect.innerHTML = '<option value="all">All</option>';
      list.forEach(p=>{
        const o = document.createElement("option"); o.value = p.id; o.textContent = p.name; providerSelect.appendChild(o);
      });
    }catch(e){ console.error(e); }
  }
  loadProviders();

  async function addBot(text){ const d=document.createElement("div"); d.className="bot-msg"; d.textContent=text; chatBox.appendChild(d); chatBox.scrollTop = chatBox.scrollHeight; }
  function addUser(text){ const d=document.createElement("div"); d.className="user-msg"; d.textContent=text; chatBox.appendChild(d); chatBox.scrollTop = chatBox.scrollHeight; }

  sendBtn.addEventListener("click", async ()=>{
    const prompt = input.value.trim(); if(!prompt) return;
    addUser(prompt); input.value="";
    addBot("⏳ Thinking...");
    const token = authToken();
    try{
      const res = await fetch("/api/chat", { method:"POST", headers: {"Content-Type":"application/json", "Authorization": token ? ("Bearer "+token) : "" }, body: JSON.stringify({ prompt, providers: [providerSelect.value] }) });
      const j = await res.json();
      // remove the thinking bubble
      const last = chatBox.querySelector(".bot-msg:last-child");
      if (last && last.textContent === "⏳ Thinking...") last.remove();
      if (!res.ok) {
        addBot("Error: " + (j.error || j.message || JSON.stringify(j)));
        if (j.error === "quota_exhausted") alert("Quota exhausted. Please subscribe.");
        return;
      }
      addBot(j.fused || "(no reply)");
    }catch(err){
      addBot("Chat failed: " + err.message);
    }
  });

  // show simple quota if logged in
  async function loadQuota(){
    const token = authToken();
    if (!token){ quotaInfo.textContent = "Not logged in"; return; }
    try {
      const rr = await fetch("/_debug/users");
      if (!rr.ok) { quotaInfo.textContent = "User info unavailable"; return; }
      const users = await rr.json();
      // attempt to find user by token (server doesn't expose token mapping here)
      quotaInfo.textContent = "Logged in (quota info shown on server debug)";
    } catch(e){ quotaInfo.textContent = "Error fetching user info"; }
  }
  loadQuota();
}

// ---------- Small helper for UI: redirect from nav mini login -->
const openLogin = document.getElementById("openLogin");
if (openLogin) openLogin.addEventListener("click", ()=> window.location.href="/login.html");
