import { useState, useEffect, useRef, useMemo, createContext, useContext, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// DATA — FR
// ═══════════════════════════════════════════════════════════════════════════
const UI_FR = {
  deploy: "Déployer l'architecture", deployHint: "Cliquez pour transformer le monolithe",
  back: "Retour", backMonolith: "Monolithe", workflowTitle: "workflow://career-pipeline",
  close: "Fermer", contactTitle: "// Formulaire de contact",
  contactSubtitle: "Envoyez-moi un message, je vous répondrai rapidement.",
  contactName: "Votre nom", contactEmail: "Votre email", contactMessage: "Votre message",
  contactSend: "Envoyer le message", contactSending: "Envoi en cours...",
  contactSuccess: "Message envoyé avec succès !",
  contactError: "Erreur. Contactez-moi directement.", contactDirect: "Ou contactez-moi directement :",
  sectionAbout: "// À propos", sectionSkills: "// Compétences techniques",
  sectionEducation: "// Formation & Certifications", sectionLanguages: "// Langues",
  sectionCertifications: "Certifications",
  inputLabel: "Input — Contexte & Besoin", processingLabel: "Processing — Actions & Architecture",
  outputLabel: "Output — Résultats & Valeur", rawPayload: "// raw payload",
  switchLang: "EN",
  menuNodes: { about: "À propos", skills: "Skills", education: "Études", languages: "Langues", experiences: "Expériences", contact: "Contact" },
};

const CV_FR = {
  profile: { name: "Pierre-Antoine Lefebvre", title: "Architecte SI & Manager", email: "pierreantoine.lefebvre@gmail.com", phone: "+41 76 395 59 53", location: "Lausanne, Suisse", linkedin: "https://linkedin.com/in/pierre-antoine-lefebvre/" },
  about: {
    summary: "Près de 15 ans d'expérience en IT en tant qu'Architecte (Solution, Entreprise, SI). Management d'équipe durant plus de 6 ans (jusqu'à 30 employés). Capacité à développer une stratégie d'architecture solution et à piloter des programmes de transformation digitale dans le secteur du luxe.",
    highlights: ["Architecture Solution & Entreprise", "Management d'équipe (jusqu'à 30 pers.)", "Cloud, Migration, SaaS", "Transformation digitale", "Formation technique", "Vision stratégique 360°"],
  },
  skills: {
    "E-commerce": ["Salesforce Commerce Cloud (SFCC)", "SCAPI / OCAPI", "Magento 2", "Global-e"],
    "ERP & Métier": ["SAP (ECC, AX)", "Odoo", "Cegid Y2", "Storeland"],
    "Intégration & Middleware": ["MuleSoft", "Talend", "Pentaho", "Stambia", "WSO2"],
    "PIM & Contenu": ["Akeneo"],
    "Dev & Frameworks": ["Java", "Python", "Vue.js Storefront"],
    "Bases de données": ["MySQL 8", "Elasticsearch", "Redis"],
    "DevOps": ["Docker", "Kubernetes (K8S)", "GitHub / GitLab"],
    "Solutions": ["ReachFive (CIAM)", "GA4 / Tag Manager", "Ingenico / Cybersource / Adyen", "Akamai / Cloudflare"],
  },
  education: [
    { degree: "BAC+2 Service et Réseau de Communication", school: "IUT de Lens, France", year: "2008 - 2010", equiv: "Diplôme ES" },
    { degree: "Baccalauréat STI", school: "LICP Tourcoing, France", year: "2005", equiv: "Maturité professionnelle" },
  ],
  certifications: ["Salesforce Certified B2C Commerce Cloud Developer (2016)", "Salesforce Certified B2C Commerce Cloud Architect (2016)"],
  languages: [{ lang: "Français", level: "Langue maternelle", pct: 100 }, { lang: "Anglais", level: "Avancé (C1)", pct: 85 }],
  experienceGroups: [
    { id: "group_codeploy", isGroup: true, label: "Missions Consultant — Codeploy Sàrl, Lausanne", period: "09.2019 – Actuellement", children: [
      { id: "n1", type: "trigger", icon: "⚡", title: "Celine.com – LVMH", role: "Architecte SI", period: "03.2025 – Actuellement", company: "Codeploy Sàrl → Celine.com (LVMH)", input: "Besoin de migrer vers une architecture hybride composable pour le site Celine.com du groupe LVMH.", processing: "Accompagnement et formation des équipes techniques. Définition des principes d'intégration et des flux inter-applicatifs.", output: "Architecture hybride composable opérationnelle. Équipes formées et autonomes." },
      { id: "n2", type: "transform", icon: "🔄", title: "SDG Distribution", role: "Architecte d'Entreprise", period: "06.2024 – 01.2025", company: "Codeploy Sàrl → SDG Distribution", input: "SI vieillissant nécessitant une refonte complète.", processing: "Refonte du SI, cible d'architecture, flux inter-applicatifs, API + ETL (Pentaho), pilotage équipe dev.", output: "Nouveau SI structuré et scalable. Flux automatisés." },
      { id: "n3", type: "router", icon: "🔀", title: "LVMH Beauty Tech", role: "Architecte SI", period: "12.2022 – 08.2025", company: "Codeploy Sàrl → LVMH Beauty Tech", input: "Silos entre Maisons (Dior, Guerlain, Benefit, MUFE). Besoin de standardisation.", processing: "Audit SFCC, architectures solutions transverses, suivi Beauty Tech Core, roadmap technique.", output: "Solutions e-commerce standardisées. Briques communes déployées." },
      { id: "n4", type: "loop", icon: "🔁", title: "Tag Heuer", role: "Architecte Solution", period: "01.2021 – 12.2022", company: "Codeploy Sàrl → Tag Heuer", input: "Plateforme SFCC nécessitant audit et stratégie d'architecture.", processing: "Suivi développeurs + lead devs. Stratégie d'architecture SFCC. Audit complet.", output: "Stratégie définie. Équipe structurée. Plateforme auditée." },
      { id: "n5", type: "transform", icon: "📦", title: "La Grande Épicerie", role: "Architecte Solution", period: "01.2021 – 01.2022", company: "Codeploy Sàrl → La Grande Épicerie", input: "Migration des sites depuis SiteGenesis.", processing: "Migration SFRA, chiffrage 'Listes d'exception', PSP Ingenico.", output: "Sites migrés SFRA. PSP intégré." },
      { id: "n6", type: "router", icon: "🌐", title: "Happychic Group", role: "Architecte d'Entreprise", period: "09.2019 – 12.2020", company: "Codeploy Sàrl → Happychic (Fashion Cube)", input: "Transformation digitale Fashion Cube (Jules, Brice, Bizzbee).", processing: "Refonte SI, plateforme API, ERP Storeland + WSO2, migration SFRA + Core Model.", output: "Transformation digitale réalisée. Core Model déployé." },
    ]},
    { id: "n7", type: "loop", icon: "💊", title: "Pierre Fabre", role: "Architecte SI", period: "06.2018 – 08.2019", company: "Pierre Fabre Group, France", input: "Nouveau site e-commerce Pologne + programme de fidélité.", processing: "Gestion équipes dev, SFCC Dermo Cosme Shop, fidélité Python sur K8S.", output: "Site déployé. Fidélité opérationnel sur K8S." },
    { id: "n8", type: "transform", icon: "🔧", title: "OSF Group", role: "Architecte Solution", period: "06.2016 – 06.2018", company: "OSF Group, France", input: "Développement Celine.com, besoin PIM et interfaçage ERP.", processing: "Suivi dev Celine.com, PIM Excel macros XML SFCC, specs Cegid Y2.", output: "Site opérationnel. PIM fonctionnel." },
    { id: "n9", type: "trigger", icon: "🏢", title: "Capgemini", role: "Architecte Solution", period: "05.2016 – 05.2017", company: "Capgemini, France", input: "Offre SFCC chez Capgemini. TMA Yellowkorner.com.", processing: "Optimisation TMA, offre SFCC, cartridge CIAM ReachFive.", output: "Offre structurée. Cartridge certifiée." },
    { id: "n10", type: "trigger", icon: "🚀", title: "Itelios", role: "Développeur SFCC", period: "01.2014 – 05.2016", company: "Itelios, France", input: "Début de carrière SFCC.", processing: "Développement SFCC, montée en compétences, certifications.", output: "Double certification Salesforce B2C." },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// DATA — EN
// ═══════════════════════════════════════════════════════════════════════════
const UI_EN = {
  deploy: "Deploy architecture", deployHint: "Click to transform the monolith",
  back: "Back", backMonolith: "Monolith", workflowTitle: "workflow://career-pipeline",
  close: "Close", contactTitle: "// Contact form",
  contactSubtitle: "Send me a message, I'll get back to you shortly.",
  contactName: "Your name", contactEmail: "Your email", contactMessage: "Your message",
  contactSend: "Send message", contactSending: "Sending...",
  contactSuccess: "Message sent successfully!",
  contactError: "Error. Contact me directly.", contactDirect: "Or reach out directly:",
  sectionAbout: "// About me", sectionSkills: "// Technical skills",
  sectionEducation: "// Education & Certifications", sectionLanguages: "// Languages",
  sectionCertifications: "Certifications",
  inputLabel: "Input — Context & Need", processingLabel: "Processing — Actions & Architecture",
  outputLabel: "Output — Results & Value", rawPayload: "// raw payload",
  switchLang: "FR",
  menuNodes: { about: "About", skills: "Skills", education: "Education", languages: "Languages", experiences: "Experience", contact: "Contact" },
};

const CV_EN = {
  profile: { name: "Pierre-Antoine Lefebvre", title: "IT Architect & Manager", email: "pierreantoine.lefebvre@gmail.com", phone: "+41 76 395 59 53", location: "Lausanne, Switzerland", linkedin: "https://linkedin.com/in/pierre-antoine-lefebvre/" },
  about: {
    summary: "Nearly 15 years of IT experience as an Architect (Solution, Enterprise, IS). Team management for over 6 years (up to 30 employees). Proven ability to develop solution architecture strategy and lead digital transformation programs in the luxury sector.",
    highlights: ["Solution & Enterprise Architecture", "Team management (up to 30 people)", "Cloud, Migration, SaaS", "Digital transformation", "Technical training", "360° strategic vision"],
  },
  skills: {
    "E-commerce": ["Salesforce Commerce Cloud (SFCC)", "SCAPI / OCAPI", "Magento 2", "Global-e"],
    "ERP & Business": ["SAP (ECC, AX)", "Odoo", "Cegid Y2", "Storeland"],
    "Integration & Middleware": ["MuleSoft", "Talend", "Pentaho", "Stambia", "WSO2"],
    "PIM & Content": ["Akeneo"],
    "Dev & Frameworks": ["Java", "Python", "Vue.js Storefront"],
    "Databases": ["MySQL 8", "Elasticsearch", "Redis"],
    "DevOps": ["Docker", "Kubernetes (K8S)", "GitHub / GitLab"],
    "Solutions": ["ReachFive (CIAM)", "GA4 / Tag Manager", "Ingenico / Cybersource / Adyen", "Akamai / Cloudflare"],
  },
  education: [
    { degree: "Associate Degree in Communication Networks & Services", school: "IUT de Lens, France", year: "2008 - 2010", equiv: "ES Diploma" },
    { degree: "Baccalaureate in Industrial Sciences & Technologies", school: "LICP Tourcoing, France", year: "2005", equiv: "Professional Maturity" },
  ],
  certifications: ["Salesforce Certified B2C Commerce Cloud Developer (2016)", "Salesforce Certified B2C Commerce Cloud Architect (2016)"],
  languages: [{ lang: "French", level: "Native", pct: 100 }, { lang: "English", level: "Advanced (C1)", pct: 85 }],
  experienceGroups: [
    { id: "group_codeploy", isGroup: true, label: "Consultant Missions — Codeploy Sàrl, Lausanne", period: "09.2019 – Present", children: [
      { id: "n1", type: "trigger", icon: "⚡", title: "Celine.com – LVMH", role: "IS Architect", period: "03.2025 – Present", company: "Codeploy Sàrl → Celine.com (LVMH)", input: "Need to migrate to a composable hybrid architecture for Celine.com.", processing: "Training technical teams. Defining integration principles and inter-application flows.", output: "Operational composable hybrid architecture. Autonomous teams." },
      { id: "n2", type: "transform", icon: "🔄", title: "SDG Distribution", role: "Enterprise Architect", period: "06.2024 – 01.2025", company: "Codeploy Sàrl → SDG Distribution", input: "Aging IS requiring complete overhaul.", processing: "IS overhaul, target architecture, inter-app flows, API + ETL (Pentaho), dev team steering.", output: "New structured and scalable IS. Automated flows." },
      { id: "n3", type: "router", icon: "🔀", title: "LVMH Beauty Tech", role: "IS Architect", period: "12.2022 – 08.2025", company: "Codeploy Sàrl → LVMH Beauty Tech", input: "Silos between Houses (Dior, Guerlain, Benefit, MUFE). Standardization needed.", processing: "SFCC audit, cross-functional solution architectures, Beauty Tech Core supervision, technical roadmap.", output: "Standardized e-commerce solutions. Common components deployed." },
      { id: "n4", type: "loop", icon: "🔁", title: "Tag Heuer", role: "Solution Architect", period: "01.2021 – 12.2022", company: "Codeploy Sàrl → Tag Heuer", input: "SFCC platform requiring audit and architecture strategy.", processing: "Developer supervision. SFCC architecture strategy. Full platform audit.", output: "Strategy defined. Team structured. Platform audited." },
      { id: "n5", type: "transform", icon: "📦", title: "La Grande Épicerie", role: "Solution Architect", period: "01.2021 – 01.2022", company: "Codeploy Sàrl → La Grande Épicerie", input: "Site migration from SiteGenesis.", processing: "SFRA migration, 'Listes d'exception' scoping, Ingenico PSP.", output: "Sites migrated to SFRA. PSP integrated." },
      { id: "n6", type: "router", icon: "🌐", title: "Happychic Group", role: "Enterprise Architect", period: "09.2019 – 12.2020", company: "Codeploy Sàrl → Happychic (Fashion Cube)", input: "Digital transformation for Fashion Cube (Jules, Brice, Bizzbee).", processing: "IS overhaul, API platform, Storeland ERP + WSO2, SFRA migration + Core Model.", output: "Digital transformation achieved. Core Model deployed." },
    ]},
    { id: "n7", type: "loop", icon: "💊", title: "Pierre Fabre", role: "IS Architect", period: "06.2018 – 08.2019", company: "Pierre Fabre Group, France", input: "New e-commerce site for Poland + loyalty program.", processing: "Dev team management, SFCC Dermo Cosme Shop, Python loyalty on K8S.", output: "Site deployed. Loyalty program operational on K8S." },
    { id: "n8", type: "transform", icon: "🔧", title: "OSF Group", role: "Solution Architect", period: "06.2016 – 06.2018", company: "OSF Group, France", input: "Celine.com development, PIM need, ERP interfacing.", processing: "Celine.com supervision, Excel PIM macros for SFCC XML, Cegid Y2 specs.", output: "Operational site. Functional PIM." },
    { id: "n9", type: "trigger", icon: "🏢", title: "Capgemini", role: "Solution Architect", period: "05.2016 – 05.2017", company: "Capgemini, France", input: "SFCC offering at Capgemini. Yellowkorner.com TMA.", processing: "TMA optimization, SFCC offering, CIAM cartridge ReachFive.", output: "Structured offering. Certified cartridge." },
    { id: "n10", type: "trigger", icon: "🚀", title: "Itelios", role: "SFCC Developer", period: "01.2014 – 05.2016", company: "Itelios, France", input: "Career start in SFCC development.", processing: "SFCC development, skills growth, certifications.", output: "Dual Salesforce B2C certification." },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════
const NT = {
  trigger:  { color: "#10b981", label: "Trigger",   bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.4)" },
  loop:     { color: "#f59e0b", label: "Loop",      bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.4)" },
  transform:{ color: "#3b82f6", label: "Transform", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.4)" },
  router:   { color: "#a855f7", label: "Router",    bg: "rgba(168,85,247,0.12)",  border: "rgba(168,85,247,0.4)" },
};

// ═══════════════════════════════════════════════════════════════════════════
// i18n CONTEXT
// ═══════════════════════════════════════════════════════════════════════════
const I18nCtx = createContext();
function I18nProvider({ children }) {
  const [lang, setLang] = useState("fr");
  const toggle = useCallback(() => setLang(p => p === "fr" ? "en" : "fr"), []);
  const cv = lang === "fr" ? CV_FR : CV_EN;
  const ui = lang === "fr" ? UI_FR : UI_EN;
  return <I18nCtx.Provider value={{ lang, toggle, cv, ui }}>{children}</I18nCtx.Provider>;
}
function useI18n() { return useContext(I18nCtx); }

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════
function useWinSize() {
  const [s, setS] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const fn = () => setS({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { ...s, mob: s.w < 640, tab: s.w >= 640 && s.w < 1024 };
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
:root{--bg0:#0a0e17;--bg1:#111827;--bg2:#151c2c;--bg3:#1a2236;--bd0:rgba(255,255,255,0.06);--bd1:rgba(255,255,255,0.15);--t0:#e8ecf4;--t1:#8b95a8;--t2:#5a6478;--ac:#60a5fa;--gr:#10b981;--am:#f59e0b;--pu:#a855f7}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg0);color:var(--t0);font-family:'Outfit',sans-serif;overflow:hidden;height:100dvh;-webkit-font-smoothing:antialiased}
#root{width:100%;height:100%}
.gbg{position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
.gbg::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,transparent 0%,var(--bg0) 70%)}
.mono{font-family:'JetBrains Mono',monospace}
@keyframes pg{0%,100%{box-shadow:0 0 20px rgba(96,165,250,0.15),0 0 60px rgba(96,165,250,0.05)}50%{box-shadow:0 0 30px rgba(96,165,250,0.25),0 0 80px rgba(96,165,250,0.1)}}
@keyframes df{to{stroke-dashoffset:-20}}
@keyframes pf{0%{offset-distance:0%;opacity:0}10%{opacity:1}90%{opacity:1}100%{offset-distance:100%;opacity:0}}
@keyframes fi{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fo{from{opacity:0}to{opacity:1}}
@keyframes sr{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes si{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}
::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--bd1);border-radius:3px}
.cc{width:100vw;height:100dvh;overflow:auto;cursor:grab;position:relative}.cc:active{cursor:grabbing}
.dov{position:fixed;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:100;animation:fo .2s ease}
.drw{position:fixed;top:0;right:0;bottom:0;width:min(520px,92vw);background:var(--bg1);border-left:1px solid var(--bd0);z-index:101;overflow-y:auto;animation:sr .35s cubic-bezier(.16,1,.3,1)}
.sov{position:fixed;inset:0;z-index:50;display:flex;align-items:center;justify-content:center;background:rgba(10,14,23,0.92);backdrop-filter:blur(12px);animation:fo .25s ease;padding:20px}
.sct{width:min(700px,100%);max-height:85vh;overflow-y:auto;background:var(--bg2);border:1px solid var(--bd0);border-radius:16px;padding:32px;animation:si .35s cubic-bezier(.16,1,.3,1)}
@media(min-width:640px){.sct{padding:40px}}@media(max-width:639px){.sct{padding:24px 18px;border-radius:12px}}
.nh{transition:transform .25s,filter .25s}.nh:hover{transform:scale(1.05)!important;filter:brightness(1.15)}
.st{display:inline-block;padding:4px 12px;background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:6px;font-size:13px;color:var(--ac);margin:3px;transition:all .2s}.st:hover{background:rgba(96,165,250,0.15);border-color:rgba(96,165,250,0.4)}
.lb{height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;margin-top:6px}.lf{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.16,1,.3,1)}
.bbtn{position:fixed;top:20px;left:20px;z-index:50;background:var(--bg2);border:1px solid var(--bd0);color:var(--t1);padding:8px 16px;border-radius:8px;cursor:pointer;font-family:'JetBrains Mono',monospace;font-size:13px;transition:all .2s;display:flex;align-items:center;gap:6px}.bbtn:hover{background:var(--bg3);color:var(--t0);border-color:var(--bd1)}
`;

// ═══════════════════════════════════════════════════════════════════════════
// LANG SWITCH
// ═══════════════════════════════════════════════════════════════════════════
function LangSwitch() {
  const { ui, toggle } = useI18n();
  return (
    <button onClick={toggle} style={{ position:"fixed",top:20,right:20,zIndex:200,background:"var(--bg2)",border:"1px solid var(--bd0)",color:"var(--ac)",padding:"6px 14px",borderRadius:8,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,letterSpacing:"0.06em",transition:"all .2s",display:"flex",alignItems:"center",gap:6 }}>
      <span style={{fontSize:14}}>🌐</span>{ui.switchLang}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VUE 1 — MONOLITHE
// ═══════════════════════════════════════════════════════════════════════════
function MonolithView({ onDeploy }) {
  const [hov, setHov] = useState(false);
  const { cv, ui } = useI18n();
  const { mob } = useWinSize();
  return (
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:10,padding:20}}>
      <div onClick={onDeploy} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onDeploy()}
        style={{width:mob?300:360,maxWidth:"100%",padding:mob?"36px 28px":"48px 40px",background:hov?"linear-gradient(145deg,rgba(26,34,54,0.95),rgba(21,28,44,0.98))":"linear-gradient(145deg,rgba(21,28,44,0.95),rgba(17,24,39,0.98))",border:`1px solid ${hov?"rgba(96,165,250,0.3)":"var(--bd0)"}`,borderRadius:20,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:20,transition:"all .5s cubic-bezier(.16,1,.3,1)",transform:hov?"translateY(-6px) scale(1.02)":"translateY(0) scale(1)",animation:"pg 3s ease-in-out infinite",boxShadow:hov?"0 20px 60px rgba(96,165,250,0.15)":"0 10px 40px rgba(0,0,0,0.3)"}}>
        <div style={{width:mob?72:90,height:mob?72:90,borderRadius:"50%",background:"linear-gradient(135deg,#1e3a5f,#2d5a8e)",border:"2px solid rgba(96,165,250,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:mob?26:32,fontWeight:700,color:"var(--ac)"}}>PA</div>
        <div style={{textAlign:"center"}}>
          <h1 style={{fontSize:mob?19:22,fontWeight:700,letterSpacing:"-0.02em",marginBottom:6}}>{cv.profile.name}</h1>
          <p className="mono" style={{fontSize:mob?10:12,color:"var(--ac)",letterSpacing:"0.05em",textTransform:"uppercase"}}>{cv.profile.title}</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 20px",background:hov?"rgba(96,165,250,0.12)":"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.2)",borderRadius:10,transition:"all .3s"}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:"var(--gr)",boxShadow:"0 0 8px rgba(16,185,129,0.5)"}}/>
          <span className="mono" style={{fontSize:mob?11:12,color:"var(--ac)",fontWeight:500}}>{ui.deploy} →</span>
        </div>
      </div>
      <p className="mono" style={{marginTop:32,fontSize:11,color:"var(--t2)",letterSpacing:"0.1em",textTransform:"uppercase",textAlign:"center"}}>{ui.deployHint}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VUE 2 — MICROSERVICES
// ═══════════════════════════════════════════════════════════════════════════
const NODES = [
  { id:"about",icon:"👤",angle:-90 },{ id:"skills",icon:"⚙️",angle:-30 },
  { id:"education",icon:"🎓",angle:30 },{ id:"languages",icon:"🌍",angle:90 },
  { id:"experiences",icon:"🔗",angle:150 },{ id:"contact",icon:"✉️",angle:210 },
];

function MicroservicesView({ onSelectNode }) {
  const [on, setOn] = useState(false);
  const { ui } = useI18n();
  const { w, h, mob } = useWinSize();
  useEffect(() => { const t = setTimeout(()=>setOn(true),100); return ()=>clearTimeout(t); }, []);
  const r = mob ? 110 : 180;
  const cx = w/2, cy = h/2;
  return (
    <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10}}>
      <svg style={{position:"absolute",width:"100%",height:"100%",pointerEvents:"none"}}>
        {NODES.map((n,i)=>{const rd=(n.angle*Math.PI)/180;const nx=cx+r*Math.cos(rd);const ny=cy+r*Math.sin(rd);return <line key={n.id} x1={cx} y1={cy} x2={on?nx:cx} y2={on?ny:cy} stroke="rgba(96,165,250,0.15)" strokeWidth="1" strokeDasharray="6 4" style={{transition:`all .8s cubic-bezier(.16,1,.3,1) ${i*.08}s`,animation:on?"df 1.5s linear infinite":"none"}}/>})}
      </svg>
      <div style={{width:mob?56:72,height:mob?56:72,borderRadius:"50%",background:"linear-gradient(135deg,#1e3a5f,#2d5a8e)",border:"2px solid rgba(96,165,250,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:mob?18:24,fontWeight:700,color:"var(--ac)",zIndex:2,position:"relative",boxShadow:"0 0 30px rgba(96,165,250,0.15)",transition:"all .6s cubic-bezier(.16,1,.3,1)",transform:on?"scale(1)":"scale(1.4)",opacity:on?1:0}}>PA</div>
      {NODES.map((n,i)=>{const rd=(n.angle*Math.PI)/180;const x=r*Math.cos(rd);const y=r*Math.sin(rd);return(
        <div key={n.id} onClick={()=>onSelectNode(n.id)} className="nh" role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onSelectNode(n.id)}
          style={{position:"absolute",left:"50%",top:"50%",transform:on?`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`:"translate(-50%,-50%)",opacity:on?1:0,transition:`all .7s cubic-bezier(.16,1,.3,1) ${i*.1+.15}s`,cursor:"pointer",zIndex:3,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
          <div style={{width:mob?50:64,height:mob?50:64,borderRadius:mob?12:16,background:"var(--bg2)",border:"1px solid var(--bd0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:mob?20:26,boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}>{n.icon}</div>
          <span className="mono" style={{fontSize:mob?9:10,color:"var(--t1)",letterSpacing:"0.05em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{ui.menuNodes[n.id]}</span>
        </div>
      )})}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION PANELS
// ═══════════════════════════════════════════════════════════════════════════
function SectionPanel({ section, onClose }) {
  const { cv, ui } = useI18n();
  const titles = { about:ui.sectionAbout, skills:ui.sectionSkills, education:ui.sectionEducation, languages:ui.sectionLanguages };
  return (
    <div className="sov" onClick={onClose}>
      <div className="sct" onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
          <h2 className="mono" style={{fontSize:14,color:"var(--ac)",letterSpacing:"0.08em",textTransform:"uppercase"}}>{titles[section]}</h2>
          <button onClick={onClose} style={{background:"none",border:"1px solid var(--bd0)",color:"var(--t1)",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        {section==="about"&&<AboutC/>}{section==="skills"&&<SkillsC/>}{section==="education"&&<EduC/>}{section==="languages"&&<LangC/>}
      </div>
    </div>
  );
}

function AboutC(){const{cv}=useI18n();const{mob}=useWinSize();return(
  <div style={{animation:"fi .4s ease"}}>
    <p style={{fontSize:15,lineHeight:1.7,color:"var(--t1)",marginBottom:24}}>{cv.about.summary}</p>
    <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"1fr 1fr",gap:10}}>
      {cv.about.highlights.map((h,i)=><div key={i} style={{padding:"10px 14px",background:"rgba(96,165,250,0.05)",border:"1px solid rgba(96,165,250,0.1)",borderRadius:8,fontSize:13,animation:`fi .4s ease ${i*.05}s both`}}><span style={{color:"var(--gr)",marginRight:6}}>▸</span>{h}</div>)}
    </div>
    <div style={{marginTop:24,padding:16,background:"var(--bg3)",borderRadius:10,border:"1px solid var(--bd0)"}}>
      <p className="mono" style={{fontSize:12,color:"var(--t2)",marginBottom:8}}>// contact</p>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        <span style={{fontSize:13,color:"var(--t1)"}}>📧 {cv.profile.email}</span>
        <span style={{fontSize:13,color:"var(--t1)"}}>📞 {cv.profile.phone}</span>
        <span style={{fontSize:13,color:"var(--t1)"}}>📍 {cv.profile.location}</span>
        <a href={cv.profile.linkedin} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"var(--ac)",textDecoration:"none"}}>🔗 LinkedIn</a>
      </div>
    </div>
  </div>
)}

function SkillsC(){const{cv}=useI18n();return(
  <div style={{display:"flex",flexDirection:"column",gap:20}}>
    {Object.entries(cv.skills).map(([cat,items],ci)=><div key={cat} style={{animation:`fi .4s ease ${ci*.06}s both`}}>
      <p className="mono" style={{fontSize:11,color:"var(--t2)",marginBottom:8,letterSpacing:"0.06em",textTransform:"uppercase"}}>{cat}</p>
      <div style={{display:"flex",flexWrap:"wrap"}}>{items.map(i=><span key={i} className="st">{i}</span>)}</div>
    </div>)}
  </div>
)}

function EduC(){const{cv,ui}=useI18n();return(
  <div style={{display:"flex",flexDirection:"column",gap:20}}>
    {cv.education.map((e,i)=><div key={i} style={{padding:16,background:"var(--bg3)",border:"1px solid var(--bd0)",borderRadius:10,animation:`fi .4s ease ${i*.1}s both`}}>
      <p style={{fontSize:15,fontWeight:600,marginBottom:4}}>{e.degree}</p>
      <p style={{fontSize:13,color:"var(--t1)"}}>{e.school}</p>
      <div style={{display:"flex",gap:12,marginTop:8,flexWrap:"wrap"}}>
        <span className="mono" style={{fontSize:11,color:"var(--ac)"}}>{e.year}</span>
        <span className="mono" style={{fontSize:11,color:"var(--t2)"}}>≡ {e.equiv}</span>
      </div>
    </div>)}
    <div style={{marginTop:8}}>
      <p className="mono" style={{fontSize:11,color:"var(--t2)",marginBottom:12,letterSpacing:"0.06em",textTransform:"uppercase"}}>{ui.sectionCertifications}</p>
      {cv.certifications.map((c,i)=><div key={i} style={{padding:"10px 14px",marginBottom:8,background:"rgba(16,185,129,0.05)",border:"1px solid rgba(16,185,129,0.15)",borderRadius:8,fontSize:13,color:"var(--gr)",animation:`fi .4s ease ${(i+2)*.1}s both`}}>✓ {c}</div>)}
    </div>
  </div>
)}

function LangC(){const{cv}=useI18n();const[a,setA]=useState(false);useEffect(()=>{const t=setTimeout(()=>setA(true),200);return()=>clearTimeout(t)},[]);return(
  <div style={{display:"flex",flexDirection:"column",gap:20}}>
    {cv.languages.map((l,i)=><div key={i} style={{padding:16,background:"var(--bg3)",border:"1px solid var(--bd0)",borderRadius:10,animation:`fi .4s ease ${i*.1}s both`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <span style={{fontSize:15,fontWeight:600}}>{l.lang}</span>
        <span className="mono" style={{fontSize:12,color:"var(--ac)"}}>{l.level}</span>
      </div>
      <div className="lb"><div className="lf" style={{width:a?`${l.pct}%`:"0%",background:`linear-gradient(90deg,var(--ac),${l.pct===100?"var(--gr)":"var(--pu)"})`}}/></div>
    </div>)}
  </div>
)}

// ═══════════════════════════════════════════════════════════════════════════
// VUE 3 — CANVAS n8n
// ═══════════════════════════════════════════════════════════════════════════
function CanvasView({ onBack, onSelect }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const { cv, ui } = useI18n();
  const { mob } = useWinSize();

  useEffect(() => { setTimeout(()=>setOn(true),100); if(ref.current){ref.current.scrollLeft=0;ref.current.scrollTop=0;} }, []);

  const { nodes, groups } = useMemo(() => {
    const f=[];const g=[];
    cv.experienceGroups.forEach(item=>{
      if(item.isGroup){const si=f.length;item.children.forEach(c=>f.push(c));g.push({...item,startIdx:si,endIdx:f.length-1});}
      else f.push(item);
    });
    return{nodes:f,groups:g};
  },[cv.experienceGroups]);

  const nW=mob?200:240, nH=mob?90:100, gX=mob?80:140, gY=mob?140:180, sX=80, sY=120, cols=mob?1:2;
  const pos=i=>({x:sX+Math.floor(i/cols)*(nW+gX),y:sY+(i%cols)*(nH+gY)});
  const cW=Math.max(sX*2+Math.ceil(nodes.length/cols)*(nW+gX),800);
  const cH=sY*2+cols*(nH+gY)+60;

  const conns=[];
  for(let i=0;i<nodes.length-1;i++){const f=pos(i),t=pos(i+1);conns.push({x1:f.x+nW,y1:f.y+nH/2,x2:t.x,y2:t.y+nH/2});}

  const gRects=groups.map(g=>{const s=pos(g.startIdx),e=pos(g.endIdx);const p=24;const x=Math.min(s.x,e.x)-p;const y=Math.min(s.y,e.y)-p-32;return{...g,x,y,w:Math.max(s.x,e.x)+nW-x+p,h:Math.max(s.y,e.y)+nH-y+p+8}});

  return(
    <div style={{position:"fixed",inset:0,zIndex:10}}>
      <button className="bbtn" onClick={onBack}>← {ui.back}</button>
      <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:50,display:"flex",alignItems:"center",gap:10,padding:"8px 16px",background:"rgba(21,28,44,0.9)",border:"1px solid var(--bd0)",borderRadius:10,backdropFilter:"blur(8px)"}}>
        <span style={{width:8,height:8,borderRadius:"50%",background:"var(--gr)",boxShadow:"0 0 6px rgba(16,185,129,0.5)"}}/>
        <span className="mono" style={{fontSize:12,color:"var(--t1)"}}>{ui.workflowTitle}</span>
      </div>
      <div className="cc" ref={ref}>
        <div style={{width:cW,height:cH,position:"relative",minWidth:"100vw",minHeight:"100dvh",paddingTop:60}}>
          {gRects.map(g=><div key={g.id} style={{position:"absolute",left:g.x,top:g.y,width:g.w,height:g.h,border:"1px dashed rgba(96,165,250,0.18)",borderRadius:16,background:"rgba(96,165,250,0.02)",opacity:on?1:0,transition:"opacity .8s ease .1s",pointerEvents:"none"}}>
            <div style={{position:"absolute",top:8,left:16,display:"flex",alignItems:"center",gap:8}}>
              <span className="mono" style={{fontSize:11,color:"var(--ac)",opacity:.7}}>📂 {g.label}</span>
              <span className="mono" style={{fontSize:10,color:"var(--t2)"}}>{g.period}</span>
            </div>
          </div>)}
          <svg style={{position:"absolute",inset:0,width:cW,height:cH,pointerEvents:"none"}}>
            {conns.map((c,i)=>{const mx=(c.x1+c.x2)/2;const d=`M${c.x1},${c.y1} C${mx},${c.y1} ${mx},${c.y2} ${c.x2},${c.y2}`;return(
              <g key={i}>
                <path d={d} fill="none" stroke="rgba(96,165,250,0.12)" strokeWidth="2" style={{opacity:on?1:0,transition:`opacity .5s ease ${i*.08}s`}}/>
                <path d={d} fill="none" stroke="rgba(96,165,250,0.3)" strokeWidth="2" strokeDasharray="6 10" style={{opacity:on?1:0,animation:on?"df 2s linear infinite":"none",animationDelay:`${i*.15}s`,transition:`opacity .5s ease ${i*.08}s`}}/>
                {on&&<circle r="3" fill="var(--ac)" style={{offsetPath:`path("${d}")`,animation:`pf ${2+Math.random()}s ease-in-out infinite`,animationDelay:`${i*.4}s`,filter:"drop-shadow(0 0 4px rgba(96,165,250,0.6))"}}/>}
              </g>
            )})}
          </svg>
          {nodes.map((exp,i)=>{const p=pos(i);const nt=NT[exp.type];return(
            <div key={exp.id} className="nh" onClick={()=>onSelect(exp)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onSelect(exp)}
              style={{position:"absolute",left:p.x,top:p.y,width:nW,height:nH,background:"var(--bg2)",border:`1px solid ${nt.border}`,borderRadius:12,cursor:"pointer",opacity:on?1:0,transform:on?"scale(1)":"scale(0.8)",transition:`all .5s cubic-bezier(.16,1,.3,1) ${i*.06+.2}s`,overflow:"hidden",boxShadow:`0 4px 20px rgba(0,0,0,0.3),inset 0 1px 0 ${nt.bg}`}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:nt.color,borderRadius:"12px 12px 0 0"}}/>
              <div style={{padding:mob?"12px 14px":"14px 16px",height:"100%",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:mob?14:16}}>{exp.icon}</span>
                    <span style={{fontSize:mob?12:14,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{exp.title}</span>
                  </div>
                  <p className="mono" style={{fontSize:10,color:nt.color,letterSpacing:"0.04em"}}>{exp.role}</p>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span className="mono" style={{fontSize:10,color:"var(--t2)"}}>{exp.period}</span>
                  <span className="mono" style={{fontSize:9,padding:"2px 6px",background:nt.bg,color:nt.color,borderRadius:4,textTransform:"uppercase"}}>{nt.label}</span>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VUE 4 — DRAWER
// ═══════════════════════════════════════════════════════════════════════════
function Drawer({ exp, onClose }) {
  const { ui } = useI18n();
  const nt = NT[exp.type];
  const PB = ({label,color,content,delay}) => (
    <div style={{background:"var(--bg3)",border:"1px solid var(--bd0)",borderRadius:10,overflow:"hidden",animation:`fi .4s ease ${delay}s both`}}>
      <div style={{padding:"8px 14px",background:`${color}08`,borderBottom:"1px solid var(--bd0)",display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:6,height:6,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}60`}}/>
        <span className="mono" style={{fontSize:11,color,letterSpacing:"0.04em",textTransform:"uppercase",fontWeight:600}}>{label}</span>
      </div>
      <div style={{padding:14}}><p style={{fontSize:13.5,lineHeight:1.65,color:"var(--t1)"}}>{content}</p></div>
    </div>
  );
  return(
    <>
      <div className="dov" onClick={onClose}/>
      <div className="drw">
        <div style={{position:"sticky",top:0,zIndex:2,background:"var(--bg1)",borderBottom:"1px solid var(--bd0)",padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:22}}>{exp.icon}</span>
            <div><h3 style={{fontSize:16,fontWeight:700}}>{exp.title}</h3><span className="mono" style={{fontSize:11,color:nt.color}}>{nt.label.toUpperCase()} NODE</span></div>
          </div>
          <button onClick={onClose} style={{background:"var(--bg3)",border:"1px solid var(--bd0)",color:"var(--t1)",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,animation:"fi .4s ease both"}}>
            {[{t:exp.role,c:"var(--ac)",bg:"rgba(96,165,250,0.08)",bd:"rgba(96,165,250,0.2)"},{t:exp.period,c:"var(--t2)",bg:"var(--bg3)",bd:"var(--bd0)"},{t:exp.company,c:"var(--t2)",bg:"var(--bg3)",bd:"var(--bd0)"}].map((tg,i)=><span key={i} className="mono" style={{fontSize:11,padding:"4px 10px",background:tg.bg,border:`1px solid ${tg.bd}`,borderRadius:6,color:tg.c}}>{tg.t}</span>)}
          </div>
          <PB label={ui.inputLabel} color="#f59e0b" content={exp.input} delay={0.1}/>
          <PB label={ui.processingLabel} color="#3b82f6" content={exp.processing} delay={0.2}/>
          <PB label={ui.outputLabel} color="#10b981" content={exp.output} delay={0.3}/>
          <div style={{padding:14,background:"rgba(0,0,0,0.3)",border:"1px solid var(--bd0)",borderRadius:8,animation:"fi .4s ease .4s both"}}>
            <p className="mono" style={{fontSize:10,color:"var(--t2)",marginBottom:8}}>{ui.rawPayload}</p>
            <pre className="mono" style={{fontSize:10,color:"var(--t2)",lineHeight:1.5,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{`{\n  "id": "${exp.id}",\n  "type": "${exp.type}",\n  "status": "completed",\n  "role": "${exp.role}",\n  "period": "${exp.period}"\n}`}</pre>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════════════════════════════════
function ContactForm({ onClose }) {
  const { cv, ui } = useI18n();
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [status, setStatus] = useState("idle");
  const ch = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const send = () => {
    if(!form.name||!form.email||!form.message) return;
    const s=encodeURIComponent(`Contact CV — ${form.name}`);
    const b=encodeURIComponent(`Nom: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:${cv.profile.email}?subject=${s}&body=${b}`,"_blank");
    setStatus("success");
  };
  const is={width:"100%",padding:"10px 14px",background:"var(--bg3)",border:"1px solid var(--bd0)",borderRadius:8,color:"var(--t0)",fontSize:14,fontFamily:"'Outfit',sans-serif",outline:"none",transition:"border-color .2s"};
  const ls={fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"var(--t2)",letterSpacing:"0.04em",textTransform:"uppercase",marginBottom:6,display:"block"};
  return(
    <div className="sov" onClick={onClose}>
      <div className="sct" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <h2 className="mono" style={{fontSize:14,color:"var(--ac)",letterSpacing:"0.08em",textTransform:"uppercase"}}>{ui.contactTitle}</h2>
          <button onClick={onClose} style={{background:"none",border:"1px solid var(--bd0)",color:"var(--t1)",width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <p style={{fontSize:14,color:"var(--t1)",marginBottom:24,lineHeight:1.6}}>{ui.contactSubtitle}</p>
        {status==="success"?(
          <div style={{padding:20,background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:10,textAlign:"center",animation:"fi .4s ease"}}>
            <p style={{fontSize:18,marginBottom:8}}>✓</p>
            <p style={{color:"var(--gr)",fontSize:14,fontWeight:600}}>{ui.contactSuccess}</p>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><label style={ls}>{ui.contactName}</label><input type="text" name="name" value={form.name} onChange={ch} style={is} onFocus={e=>e.target.style.borderColor="var(--ac)"} onBlur={e=>e.target.style.borderColor="var(--bd0)"}/></div>
            <div><label style={ls}>{ui.contactEmail}</label><input type="email" name="email" value={form.email} onChange={ch} style={is} onFocus={e=>e.target.style.borderColor="var(--ac)"} onBlur={e=>e.target.style.borderColor="var(--bd0)"}/></div>
            <div><label style={ls}>{ui.contactMessage}</label><textarea name="message" value={form.message} onChange={ch} rows={5} style={{...is,resize:"vertical",minHeight:100}} onFocus={e=>e.target.style.borderColor="var(--ac)"} onBlur={e=>e.target.style.borderColor="var(--bd0)"}/></div>
            <button onClick={send} disabled={!form.name||!form.email||!form.message} style={{padding:"12px 24px",background:(!form.name||!form.email||!form.message)?"var(--bg3)":"var(--ac)",color:(!form.name||!form.email||!form.message)?"var(--t2)":"#0a0e17",border:"none",borderRadius:10,fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,cursor:(!form.name||!form.email||!form.message)?"not-allowed":"pointer",transition:"all .2s",letterSpacing:"0.04em"}}>{ui.contactSend}</button>
          </div>
        )}
        <div style={{marginTop:24,padding:16,background:"var(--bg3)",borderRadius:10,border:"1px solid var(--bd0)"}}>
          <p className="mono" style={{fontSize:11,color:"var(--t2)",marginBottom:8}}>{ui.contactDirect}</p>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <a href={`mailto:${cv.profile.email}`} style={{fontSize:13,color:"var(--ac)",textDecoration:"none"}}>📧 {cv.profile.email}</a>
            <a href={`tel:${cv.profile.phone}`} style={{fontSize:13,color:"var(--t1)",textDecoration:"none"}}>📞 {cv.profile.phone}</a>
            <a href={cv.profile.linkedin} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"var(--ac)",textDecoration:"none"}}>🔗 LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
function AppInner() {
  const [view, setView] = useState("monolith");
  const [sec, setSec] = useState(null);
  const [selExp, setSelExp] = useState(null);
  const [showContact, setShowContact] = useState(false);

  const onNode = id => {
    if (id === "experiences") setView("canvas");
    else if (id === "contact") setShowContact(true);
    else setSec(id);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="gbg"/>
      <LangSwitch/>
      {view==="monolith"&&<MonolithView onDeploy={()=>setView("microservices")}/>}
      {view==="microservices"&&<><MicroservicesView onSelectNode={onNode}/><button className="bbtn" onClick={()=>setView("monolith")} style={{zIndex:20}}>← Monolithe</button></>}
      {view==="canvas"&&<CanvasView onBack={()=>{setView("microservices");setSelExp(null);}} onSelect={e=>setSelExp(e)}/>}
      {sec&&<SectionPanel section={sec} onClose={()=>setSec(null)}/>}
      {selExp&&<Drawer exp={selExp} onClose={()=>setSelExp(null)}/>}
      {showContact&&<ContactForm onClose={()=>setShowContact(false)}/>}
    </>
  );
}

export default function App() {
  return <I18nProvider><AppInner/></I18nProvider>;
}
