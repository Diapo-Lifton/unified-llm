// app.js — frontend chat logic
document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  function appendUser(text) {
    const el = document.createElement("div");
    el.className = "bubble user";
    el.textContent = text;
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  function appendBot(text) {
    const el = document.createElement("div");
    el.className = "bubble bot";
    el.innerHTML = text.replace(/\n/g,'<br/>');
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
  function appendError(text) {
    const el = document.createElement("div");
    el.className = "bubble error";
    el.textContent = text;
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;
    appendUser(message);
    input.value = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const txt = await res.text();
        appendError("Server error: " + txt);
        return;
      }
      const data = await res.json();
      appendBot(data.reply || "No reply");
    } catch (err) {
      appendError("Cannot reach server");
      console.error("Fetch error:", err);
    }
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });

  // load recent messages (optional)
  (async function loadRecent() {
    try {
      const r = await fetch("/api/messages");
      if (r.ok) {
        const js = await r.json();
        (js.messages || []).forEach(m => {
          if (m.role === "user") appendUser(m.message);
          else appendBot(m.message);
        });
      }
    } catch (e) { /* ignore */ }
  })();
});
