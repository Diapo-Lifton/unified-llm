// lang.js - multilingual strings and dynamic content updates
const translations = {
  en: {
    title: "All AI Models. One Place.",
    subtitle: "InteGen AI — combining leading AI models into a single platform that delivers realistic, trusted, combined answers from multiple sources.",
    start: "Get Started",
    plans: "View Plans",
    aboutHeading: "About InteGen",
    aboutText: "InteGen AI combines top-performing models (OpenAI GPT, Google Gemini, Anthropic Claude and more) into one platform to give you super-realistic, consolidated responses sourced from trusted global sources. Built by SlimTech Service.",
    contactPhone1: "+27 11 021 0680",
    contactPhone2: "+27 79 066 8838",
    contactEmail: "contact@integen.ai",
    features: [
      {title:"Unified Chat", text:"Route queries to multiple models and aggregate the best response."},
      {title:"Real-time Sources", text:"Fetch and summarise trusted content from news, journals and datasets."},
      {title:"GPT-level Quality", text:"Offer quality comparable to state-of-the-art multi-turn models."},
      {title:"Advanced Gemini Support", text:"Access Google Gemini capabilities when available."},
      {title:"Multilingual", text:"Full language switching across the entire UI."},
      {title:"Secure & Compliant", text:"Encrypted sessions, safe billing and GDPR-aware data handling."}
    ]
  },
  fr: {
    title: "Tous les modèles d'IA. Un seul endroit.",
    subtitle: "InteGen AI — combine les meilleurs modèles d'IA dans une plate-forme unique offrant des réponses consolidées et réalistes.",
    start: "Commencer",
    plans: "Voir les formules",
    aboutHeading: "À propos d'InteGen",
    aboutText: "InteGen AI combine des modèles performants (OpenAI GPT, Google Gemini, Anthropic Claude et plus) pour fournir des réponses consolidées et fiables, issues de sources mondiales. Construit par SlimTech Service.",
    contactPhone1: "+27 11 021 0680",
    contactPhone2: "+27 79 066 8838",
    contactEmail: "contact@integen.ai",
    features: [
      {title:"Chat unifié", text:"Dirigez les requêtes vers plusieurs modèles et agrégez la meilleure réponse."},
      {title:"Sources en temps réel", text:"Récupérez et résumez du contenu fiable (presse, revues, datasets)."},
      {title:"Qualité GPT", text:"Qualité comparable aux meilleurs modèles multi-tours."},
      {title:"Support Gemini", text:"Accès aux capacités de Google Gemini quand disponible."},
      {title:"Multilingue", text:"Changement de langue sur toute l'interface."},
      {title:"Sécurisé", text:"Sessions chiffrées et conformité RGPD."}
    ]
  },
  es: {
    title: "Todos los modelos de IA. Un solo lugar.",
    subtitle: "InteGen AI — combinando modelos líderes para ofrecer respuestas realistas y consolidadas de fuentes fiables.",
    start: "Comenzar",
    plans: "Ver Planes",
    aboutHeading: "Acerca de InteGen",
    aboutText: "InteGen AI combina modelos de alto rendimiento (OpenAI GPT, Google Gemini, Anthropic Claude y más) para dar respuestas consolidadas y confiables, construidas por SlimTech Service.",
    contactPhone1: "+27 11 021 0680",
    contactPhone2: "+27 79 066 8838",
    contactEmail: "contact@integen.ai",
    features: [
      {title:"Chat Unificado", text:"Enruta consultas a múltiples modelos y agrega la mejor respuesta."},
      {title:"Fuentes en tiempo real", text:"Recopila y resume contenido de prensa, revistas y datasets."},
      {title:"Calidad GPT", text:"Calidad comparable a los modelos multi-turno de vanguardia."},
      {title:"Soporte Gemini", text:"Acceso a las capacidades de Google Gemini cuando estén disponibles."},
      {title:"Multilingüe", text:"Soporte de idioma en toda la interfaz."},
      {title:"Seguro", text:"Sesiones cifradas y cumplimiento regulatorio."}
    ]
  }
};

function applyLanguage(lang='en'){
  const t = translations[lang] || translations.en;
  // hero
  document.getElementById('title').textContent = t.title;
  document.getElementById('subtitle').textContent = t.subtitle;
  document.getElementById('start').textContent = t.start;
  document.getElementById('plans').textContent = t.plans;

  // about content
  const aboutHead = document.getElementById('aboutHeading');
  if(aboutHead) aboutHead.textContent = t.aboutHeading;
  const aboutText = document.getElementById('aboutText');
  if(aboutText) aboutText.textContent = t.aboutText;

  // contact
  const p1 = document.querySelectorAll('.contact-phone')[0];
  const p2 = document.querySelectorAll('.contact-phone')[1];
  const em = document.querySelectorAll('.contact-email')[0];
  if(p1) p1.textContent = t.contactPhone1;
  if(p2) p2.textContent = t.contactPhone2;
  if(em) em.textContent = t.contactEmail;

  // features
  const featureCards = document.querySelectorAll('.feature-card');
  if(featureCards.length && t.features){
    featureCards.forEach((card,i)=>{
      const f = t.features[i] || {title:'', text:''};
      card.querySelector('h3').textContent = f.title;
      card.querySelector('p').textContent = f.text;
    });
  }

  // footer
  const footer = document.querySelector('.footer .left');
  if(footer) footer.textContent = t.contactEmail + " • " + t.contactPhone1;
}

// initialize language on load
document.addEventListener('DOMContentLoaded', ()=>{ 
  const sel = document.getElementById('language');
  if(sel){ sel.addEventListener('change', ()=> applyLanguage(sel.value)); }
  applyLanguage('en');
});
