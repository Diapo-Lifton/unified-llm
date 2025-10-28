// scripts.js
const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_faq: "FAQ",
    nav_contact: "Contact",
    nav_subscription: "Subscription",
    hero_title: "All AI models. One platform.",
    hero_desc: "InteGen combines multiple top LLMs into a single platform for accurate, real-time responses.",
    start_chat: "Start Chatting",
    learn_more: "Learn More",
    pricing_title: "Choose a plan",
    pricing_sub: "Flexible monthly subscriptions for individuals and teams — billed in USD. Cancel anytime.",
    pro_title: "Pro",
    pro_price: "$25 / month",
    pro_features: ["Access to GPT, Gemini & Claude", "Realtime global sources", "Priority query processing"],
    ultimate_title: "Ultimate",
    ultimate_price: "$45 / month",
    ultimate_features: ["All Pro features + advanced AIs", "Web + academic integrations", "Unlimited requests"],
    enterprise_title: "Enterprise",
    enterprise_price: "Contact Sales",
    enterprise_features: ["Custom infrastructure", "Private deployment", "Team tools"],
    subscribe_cta: "Subscribe",
    contact_sales: "Contact Sales",
    footer_contact: "contact@integen.ai • +27 11 021 0680 • +27 79 066 8838",
    open_chat: "Open Chat"
  },
  fr: {
    nav_home: "Accueil",
    nav_about: "À propos",
    nav_faq: "FAQ",
    nav_contact: "Contact",
    nav_subscription: "Abonnement",
    hero_title: "Tous les modèles d'IA. Une seule plateforme.",
    hero_desc: "InteGen combine plusieurs LLM de premier plan en une seule plateforme pour des réponses précises en temps réel.",
    start_chat: "Commencer à chatter",
    learn_more: "En savoir plus",
    pricing_title: "Choisissez un plan",
    pricing_sub: "Abonnements mensuels flexibles pour les particuliers et les équipes — facturés en USD. Annulez à tout moment.",
    pro_title: "Pro",
    pro_price: "$25 / month",
    pro_features: ["Accès à GPT, Gemini & Claude", "Sources mondiales en temps réel", "Traitement prioritaire des requêtes"],
    ultimate_title: "Ultime",
    ultimate_price: "$45 / month",
    ultimate_features: ["Toutes les fonctions Pro + IA avancées", "Intégrations web et académiques", "Requêtes illimitées"],
    enterprise_title: "Entreprise",
    enterprise_price: "Contactez-nous",
    enterprise_features: ["Infrastructure personnalisée", "Déploiement privé", "Outils de collaboration en équipe"],
    subscribe_cta: "S'abonner",
    contact_sales: "Contacter les ventes",
    footer_contact: "contact@integen.ai • +27 11 021 0680 • +27 79 066 8838",
    open_chat: "Ouvrir le chat"
  },
  es: {
    nav_home: "Inicio",
    nav_about: "Acerca de",
    nav_faq: "FAQ",
    nav_contact: "Contacto",
    nav_subscription: "Suscripción",
    hero_title: "Todos los modelos de IA. Una plataforma.",
    hero_desc: "InteGen combina múltiples LLM líderes en una única plataforma para respuestas precisas en tiempo real.",
    start_chat: "Iniciar Chat",
    learn_more: "Saber más",
    pricing_title: "Elige un plan",
    pricing_sub: "Suscripciones mensuales flexibles para individuos y equipos — facturación en USD. Cancela en cualquier momento.",
    pro_title: "Pro",
    pro_price: "$25 / month",
    pro_features: ["Acceso a GPT, Gemini & Claude", "Fuentes globales en tiempo real", "Procesamiento prioritario de consultas"],
    ultimate_title: "Ultimate",
    ultimate_price: "$45 / month",
    ultimate_features: ["Todas las funciones Pro + AIs avanzadas", "Integraciones web y académicas", "Solicitudes ilimitadas"],
    enterprise_title: "Empresa",
    enterprise_price: "Contáctenos",
    enterprise_features: ["Infraestructura personalizada", "Despliegue privado", "Herramientas de colaboración"],
    subscribe_cta: "Suscribirse",
    contact_sales: "Contactar ventas",
    footer_contact: "contact@integen.ai • +27 11 021 0680 • +27 79 066 8838",
    open_chat: "Abrir Chat"
  },
  zh: { /* simplified Chinese */
    nav_home:"首页",nav_about:"关于",nav_faq:"常见问题",nav_contact:"联系",nav_subscription:"订阅",
    hero_title:"所有 AI 模型。一个平台。",
    hero_desc:"InteGen 将多款顶级 LLM 整合到单一平台，实时提供准确回复。",
    start_chat:"开始聊天",learn_more:"了解更多",
    pricing_title:"选择方案",pricing_sub:"为个人与团队提供灵活的月付订阅 — 以美元计费，随时取消。",
    pro_title:"Pro",pro_price:"$25 / month",
    pro_features:["访问 GPT、Gemini 与 Claude","实时全球来源","优先查询处理"],
    ultimate_title:"Ultimate",ultimate_price:"$45 / month",
    ultimate_features:["包含 Pro 的全部功能 + 高级 AI","网页与学术整合","无限请求"],
    enterprise_title:"企业版",enterprise_price:"联系我们",
    enterprise_features:["定制基础设施","私有部署","团队协作工具"],
    subscribe_cta:"订阅",contact_sales:"联系销售",
    footer_contact:"contact@integen.ai • +27 11 021 0680 • +27 79 066 8838",open_chat:"打开聊天"
  },
  ar: { /* Arabic (RTL display note: our demo will not flip layout for RTL; for production consider full RTL support) */
    nav_home:"الرئيسية",nav_about:"حول",nav_faq:"الأسئلة",nav_contact:"اتصل",nav_subscription:"الاشتراك",
    hero_title:"جميع نماذج الذكاء الاصطناعي. منصة واحدة.",
    hero_desc:"InteGen يجمع أفضل نماذج LLM في منصة واحدة لإجابات فورية دقيقة.",
    start_chat:"ابدأ الدردشة",learn_more:"اعرف المزيد",
    pricing_title:"اختر خطة",pricing_sub:"اشتراكات شهرية مرنة للأفراد والفرق — بالفولار الأمريكي. إلغاء في أي وقت.",
    pro_title:"Pro",pro_price:"$25 / month",
    pro_features:["الوصول إلى GPT، Gemini و Claude","مصادر عالمية في الوقت الفعلي","معالجة استعلامات ذات أولوية"],
    ultimate_title:"Ultimate",ultimate_price:"$45 / month",
    ultimate_features:["كل ميزات Pro + AIs متقدمة","تكاملات الويب والأكاديمية","طلبات غير محدودة"],
    enterprise_title:"Enterprise",enterprise_price:"اتصل بنا",
    enterprise_features:["بنية تحتية مخصصة","نشر خاص","أدوات تعاون الفريق"],
    subscribe_cta:"اشترك",contact_sales:"اتصل بالمبيعات",
    footer_contact:"contact@integen.ai • +27 11 021 0680 • +27 79 066 8838",open_chat:"افتح الدردشة"
  },
  pt: { /* Portuguese */
    nav_home:"Início",nav_about:"Sobre",nav_faq:"FAQ",nav_contact:"Contato",nav_subscription:"Assinatura",
    hero_title:"Todos os modelos de IA. Uma plataforma.",
    hero_desc:"InteGen combina múltiplos LLMs em uma plataforma única para respostas em tempo real.",
    start_chat:"Iniciar Chat",learn_more:"Saiba mais",
    pricing_title:"Escolha um plano",pricing_sub:"Assinaturas mensais flexíveis para indivíduos e equipes — faturadas em USD. Cancele a qualquer momento.",
    pro_title:"Pro",pro_price:"$25 / month",
    pro_features:["Acesso a GPT, Gemini & Claude","Fontes globais em tempo real","Processamento prioritário"],
    ultimate_title:"Ultimate",ultimate_price:"$45 / month",
    ultimate_features:["Todos os recursos Pro + AIs avançadas","Integrações web e acadêmicas","Requisições ilimitadas"],
    enterprise_title:"Empresa",enterprise_price:"Entre em contato",
    enterprise_features:["Infraestrutura personalizada","Implantação privada","Ferramentas de colaboração"],
    subscribe_cta:"Assinar",contact_sales:"Contato de Vendas",
    footer_contact:"contact@integen.ai • +27 11 021 0680 • +27 79 066 8838",open_chat:"Abrir Chat"
  },
  hi: { /* Hindi */
    nav_home:"होम",nav_about:"बारे में",nav_faq:"सवाल",nav_contact:"संपर्क",nav_subscription:"सब्सक्रिप्शन",
    hero_title:"सभी AI मॉडल। एक प्लेटफ़ॉर्म।",
    hero_desc:"InteGen कई शीर्ष LLMs को एक प्लेटफ़ॉर्म में समाहित करता है, वास्तविक समय में सटीक उत्तर देता है।",
    start_chat:"चैट शुरू करें",learn_more:"और जानें",
    pricing_title:"एक योजना चुनें",pricing_sub:"व्यक्तियों और टीमों के लिए लचीले मासिक सब्सक्रिप्शन — USD में बिल। किसी भी समय रद्द करें।",
    pro_title:"Pro",pro_price:"$25 / month",
    pro_features:["GPT, Gemini और Claude तक पहुंच","रीयलटाइम वैश्विक स्रोत","प्राथमिकता क्वेरी प्रोसेसिंग"],
    ultimate_title:"Ultimate",ultimate_price:"$45 / month",
    ultimate_features:["सभी Pro फीचर + उन्नत AIs","वेब + अकादमिक इंटीग्रेशन","अनलिमिटेड अनुरोध"],
    enterprise_title:"Enterprise",enterprise_price:"संपर्क करें",
    enterprise_features:["कस्टम इन्फ्रास्ट्रक्चर","प्राइवेट डिप्लॉयमेंट","टीम सहयोग उपकरण"],
    subscribe_cta:"सब्सक्राइब",contact_sales:"सेल्स से संपर्क",footer_contact:"contact@integen.ai • +27 11 021 0680 • +27 79 066 8838",open_chat:"चैट खोलें"
  },
  ru: {
    nav_home:"Домой",nav_about:"О нас",nav_faq:"Вопросы",nav_contact:"Контакт",nav_subscription:"Подписка",
    hero_title:"Все AI-модели. Одна платформа.",
    hero_desc:"InteGen объединяет лучшие LLM в одной платформе для точных ответов в реальном времени.",
    start_chat:"Начать чат",learn_more:"Узнать больше",
    pricing_title:"Выберите план",pricing_sub:"Гибкие ежемесячные подписки для частных лиц и команд — оплата в USD. Отмена в любой момент.",
    pro_title:"Pro",pro_price:"$25 / month",
    pro_features:["Доступ к GPT, Gemini и Claude","Глобальные источники в реальном времени","Приоритетная обработка запросов"],
    ultimate_title:"Ultimate",ultimate_price:"$45 / month",
    ultimate_features:["Все возможности Pro + продвинутые AI","Веб + академические интеграции","Неограниченные запросы"],
    enterprise_title:"Enterprise",enterprise_price:"Свяжитесь с нами",
    enterprise_features:["Пользовательская инфраструктура","Частное развёртывание","Инструменты командного сотрудничества"],
    subscribe_cta:"Подписаться",contact_sales:"Связаться с продажами",footer_contact:"contact@integen.ai • +27 11 021 0680 • +27 79 066 8838",open_chat:"Открыть чат"
  },
  ja: {
    nav_home:"ホーム",nav_about:"概要",nav_faq:"よくある質問",nav_contact:"連絡先",nav_subscription:"サブスクリプション",
    hero_title:"すべてのAIモデル。ひとつのプラットフォーム。",
    hero_desc:"InteGenは複数のトップLLMを一つのプラットフォームに統合し、リアルタイムで正確な応答を提供します。",
    start_chat:"チャットを始める",learn_more:"詳しく見る",
    pricing_title:"プランを選択",
    pricing_sub:"個人・チーム向けの柔軟な月額サブスクリプション — USD請求。いつでも解約可能。",
    pro_title:"Pro",pro_price:"$25 / month",pro_features:["GPT、Gemini、Claudeにアクセス","リアルタイムグローバルソース","優先クエリ処理"],
    ultimate_title:"Ultimate",ultimate_price:"$45 / month",ultimate_features:["Pro機能すべて + 高度なAI","ウェブ＋学術統合","無制限リクエスト"],
    enterprise_title:"Enterprise",enterprise_price:"お問い合わせ",enterprise_features:["カスタムインフラ","プライベート展開","チーム協業ツール"],
    subscribe_cta:"購読",contact_sales:"営業に連絡",footer_contact:"contact@integen.ai • +27 11 021 0680 • +27 79 066 8838",open_chat:"チャットを開く"
  }
};

// apply translations by scanning data-i18n attributes
function applyLanguage(lang) {
  const t = translations[lang] || translations.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    // support arrays for features
    const value = t[key];
    if (Array.isArray(value)) {
      if (el.tagName === "UL") {
        el.innerHTML = value.map(i => `<li>${i}</li>`).join("");
      } else {
        el.innerHTML = value.join("<br/>");
      }
    } else {
      el.innerText = value ?? el.innerText;
    }
  });
}

// language selector
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      applyLanguage(e.target.value);
    });
    // try detect or default to en
    const preferred = (navigator.language || "en").slice(0,2);
    langSelect.value = translations[preferred] ? preferred : "en";
    applyLanguage(langSelect.value);
  }

  // hook up pricing buttons
  document.querySelectorAll("[data-plan]").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const plan = btn.getAttribute("data-plan");
      // ask for email quickly (simple prompt)
      const email = prompt("Enter your email for the subscription (receipt will be sent):");
      if (!email) return alert("Email required to subscribe.");
      try {
        btn.disabled = true;
        btn.innerText = "Redirecting...";
        const resp = await fetch("/create-checkout-session", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ plan, email })
        });
        const data = await resp.json();
        if (data.url) {
          window.location = data.url;
        } else {
          alert("Subscription failed: " + (data.error || "unknown error"));
          btn.disabled = false;
        }
      } catch (err) {
        alert("Network or server error.");
        console.error(err);
        btn.disabled = false;
      }
    });
  });

  // open chat button - link to chat page
  document.getElementById("openChatBtn")?.addEventListener("click", () => {
    window.location = "chat.html";
  });
});
