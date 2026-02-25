# CV Interactif — Du Monolithe aux Microservices

CV en ligne interactif de **Pierre-Antoine Lefebvre** — Architecte SI & Manager.

> 💡 Une métaphore visuelle unique : transformer un monolithe en microservices, avec un parcours d'expériences façon workflow n8n. Une expérience interactive et immersive pour explorer une carrière IT.

## 🎯 Vue d'ensemble

Le CV se déploie en **3 étapes narratives** :

1. **Monolithe** : Vue d'accueil avec bloc centralisé (profil + bouton de déploiement)
2. **Microservices** : Menu éclaté en orbite (6 nœuds : About, Skills, Education, Languages, Experiences, Contact)
3. **Workflow n8n** : Parcours chronologique interactif des expériences professionnelles avec connexions animées

Chaque vue bénéficie d'**animations fluides**, d'une **typographie technique** (JetBrains Mono) et d'un **design dark tech**.

## 🛠️ Stack Technique

- **React 18** + **Vite** : Framework moderne avec bundling ultrarapide
- **Tailwind CSS** : Styling utilitaire + variables CSS personnalisées
- **CSS Animations** : Bézier curves, particles flow, morphing effects, dash animations
- **SVG** : Tracés paramétriques pour les connexions entre nœuds
- **Docker** + **Nginx** : Déploiement containerisé avec SPA routing
- **i18n** (Contexte React) : Basculement FR/EN sans rechargement

## 🚀 Démarrage rapide

### 💻 Développement local

```bash
# 1. Cloner le repo
git clone git@github.com:pierreantoinelefebvre/cv-pal.git
cd cv-pal/cv-interactive

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Accessible sur **`http://localhost:5173`** — rechargement à chaud (HMR) activé

### 📦 Build production

```bash
# Minifier et optimiser
npm run build

# Aperçu local de la build production
npm run preview
```

### 🐳 Docker (recommandé pour prod)

```bash
# Build + lancer avec Docker Compose
docker compose up -d --build

# Ou build manuel
docker build -t cv-interactive .
docker run -d -p 80:80 --name cv-pa-lefebvre cv-interactive
```

Accessible sur **`http://localhost`** (port 80)

**Note** : Le Dockerfile utilise une stratégie **multi-stage** :
1. Build Node.js → compilation React/Vite
2. Nginx → serveur production avec routing SPA configuré

## ⚙️ Configuration

### 📧 Formulaire de contact

Le formulaire utilise **[Formspree](https://formspree.io)** (service gratuit de formulaire sans backend).

#### Setup Formspree

1. Aller sur [formspree.io](https://formspree.io) et créer un formulaire
2. Copier l'ID du formulaire (`/f/VOTRE_ID`)
3. Créer un fichier `.env` à la racine du projet :

```env
VITE_FORMSPREE_URL=https://formspree.io/f/xxxxxxx
```

4. Redémarrer le serveur de dev

#### Sans Formspree

Si la variable d'env n'est pas définie, le formulaire se replie sur un lien `mailto:` qui ouvre le client email par défaut.

### 🌍 Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_FORMSPREE_URL` | Endpoint Formspree pour le contact | `https://formspree.io/f/xyz` |

**Note** : Les variables commençant par `VITE_` sont exposées au client (consultable dans le bundle).

## 📁 Structure du projet

```
cv-interactive/
├── src/
│   ├── components/               # Composants React réutilisables
│   │   ├── MonolithView.jsx      # 📦 Vue 1 : Monolithe (landing)
│   │   │                         #   - Affiche le profil centralisé
│   │   │                         #   - Bouton de "déploiement" vers microservices
│   │   │                         #   - Animations pulse + hover effects
│   │   │
│   │   ├── MicroservicesView.jsx # 🌐 Vue 2 : Menu en orbite
│   │   │                         #   - 6 nœuds en orbite autour du profil
│   │   │                         #   - Connexions animées (dash flow)
│   │   │                         #   - Clics pour explorer chaque section
│   │   │
│   │   ├── CanvasView.jsx        # 🔗 Vue 3 : Workflow n8n (expériences)
│   │   │                         #   - Canvas scrollable avec grille de nœuds
│   │   │                         #   - Connexions Bezier entre expériences
│   │   │                         #   - Groupes (Codeploy, freelance, etc.)
│   │   │                         #   - Particles animés qui "coulent" sur connexions
│   │   │
│   │   ├── ExperienceDrawer.jsx  # 📋 Tiroir d'expérience (modal coulissante)
│   │   │                         #   - Affiche input/processing/output (payload)
│   │   │                         #   - Métadonnées (rôle, period, company)
│   │   │                         #   - Animations fadeIn pour le contenu
│   │   │
│   │   ├── SectionPanel.jsx      # ℹ️  Panneaux informatifs (About, Skills, etc.)
│   │   │                         #   - Modales pour chaque section
│   │   │                         #   - Support du contenu structuré (listes, etc.)
│   │   │
│   │   ├── ContactForm.jsx       # ✉️  Formulaire de contact
│   │   │                         #   - Intégration Formspree
│   │   │                         #   - Validation basique des champs
│   │   │                         #   - Feedback visuel (loading, success, error)
│   │   │
│   │   └── LangSwitch.jsx        # 🌐 Bouton basculeur FR/EN
│   │                             #   - Fixed en top-right (z-index élevé)
│   │                             #   - Hover effects sur les estados
│   │
│   ├── data/
│   │   ├── cv-fr.js              # 🇫🇷 Données complètes du CV en français
│   │   │                         #   - Profile, about, skills, education
│   │   │                         #   - experienceGroups (8 expériences)
│   │   │                         #   - UI labels en français
│   │   │
│   │   ├── cv-en.js              # 🇬🇧 Traductions anglaises (idem structure)
│   │   │
│   │   └── constants.js          # 🎨 Types de nœuds (trigger, loop, etc.)
│   │                             #   - Couleurs, bordures, labels pour chaque type
│   │
│   ├── hooks/
│   │   ├── useI18n.jsx           # 🌍 Context i18n (FR/EN)
│   │   │                         #   - I18nProvider (wrapper)
│   │   │                         #   - useI18n hook (consumer)
│   │   │
│   │   └── useWindowSize.js      # 📐 Hook responsive
│   │                             #   - Dimensions écran (w, h)
│   │                             #   - Breakpoints (isMobile, isTablet)
│   │
│   ├── styles/
│   │   └── globals.css           # 🎨 Styles globaux + animations
│   │                             #   - Themes (light/dark, accent colors)
│   │                             #   - Animations CSS (pulse, dash-flow, particles)
│   │                             #   - Utilities (backdrop, glassmorphism)
│   │
│   ├── App.jsx                   # 🎭 Orchestrateur principal
│   │                             #   - Gestion d'état des vues
│   │                             #   - Routage interne (monolith → microservices → canvas)
│   │                             #   - Montage des modales
│   │
│   └── main.jsx                  # 🔌 Point d'entrée React
│                                 #   - I18nProvider wrapper
│                                 #   - Rendu ReactDOM
│
├── Dockerfile                    # 🐳 Build multi-stage Node + Nginx
├── docker-compose.yml            # Orchestration conteneur
├── nginx.conf                    # 🌐 Config Nginx SPA (rewrites)
├── .dockerignore
├── .gitignore
├── package.json                  # Dépendances + scripts
├── vite.config.js               # Config bundler Vite
├── tailwind.config.js           # Config Tailwind
├── postcss.config.js            # PostCSS + autoprefixer
└── index.html                   # HTML entry point
```

## ✏️ Modifier le contenu

### Ajouter/modifier des expériences

Les données du CV sont dans **`src/data/cv-fr.js`** et **`src/data/cv-en.js`**.

#### Structure d'une expérience

```js
{
  id: "node_example",           // Identifiant unique
  type: "trigger",              // Type de nœud : trigger | transform | router | loop
  icon: "⚡",                    // Emoji représentatif
  title: "Nom du projet",
  role: "Rôle/Poste",
  period: "MM.YYYY – MM.YYYY",  // Format : 01.2020 – 12.2021
  company: "Entreprise",
  input: "Contexte/Besoin",      // Partie INPUT du payload
  processing: "Actions/Archi",   // Partie PROCESSING
  output: "Résultats/Valeur",    // Partie OUTPUT
}
```

#### Grouper des expériences

Pour regrouper plusieurs expériences sous une même entité (ex: missions chez le même client) :

```js
{
  id: "group_codeploy",
  isGroup: true,                 // Flag groupe
  label: "Missions Consultant — Codeploy Sàrl, Lausanne",
  period: "09.2019 – Actuellement",
  children: [
    { id: "node_exp1", ... },
    { id: "node_exp2", ... },
  ],
}
```

**Les boîtes englobantes sont générées automatiquement** autour des expériences enfants.

### Modifier les sections (About, Skills, etc.)

Toutes les sections sont définies dans les mêmes fichiers `cv-fr.js` et `cv-en.js` :

```js
export const CV_FR = {
  profile: { ... },
  about: { summary: "...", highlights: [...] },
  skills: { "Catégorie": ["skill1", "skill2"], ... },
  education: [...],
  languages: [...],
  experienceGroups: [...],
};
```

Modifier les champs et les changements sont appliqués instantanément au reload.

### Ajouter une langue

1. Dupliquer `cv-fr.js` vers `cv-new.js`
2. Traduire tous les champs
3. Importer dans `useI18n.jsx` : `import { CV_NEW, UI_NEW } from "../data/cv-new"`
4. Ajouter au toggle (modifier pour 3+ langues)

## 📱 Responsive Design

| Breakpoint | Condition | Adaptation |
|-----------|-----------|------------|
| **Desktop** | ≥1024px | 2 colonnes, nœuds 240×100, gap 140px |
| **Tablette** | 640–1024px | 2 colonnes, nœuds réduits, gap modéré |
| **Mobile** | <640px | 1 colonne, nœuds 200×90, gap 80px |

Les dimensions sont calculées via le hook `useWindowSize()` et appliquées au CanvasView et MicroservicesView.

## 🎨 Guide des animations

### CSS Animations

Toutes les animations sont définies dans **`src/styles/globals.css`** :

| Animation | Durée | Effect | Utilisée où |
|-----------|-------|--------|-------------|
| `pulse-glow` | 3s ease-in-out ∞ | Glow pulsant | MonolithView (bloc principal) |
| `dash-flow` | 1.5s–2s linear ∞ | SVG stroke animation | Connexions, lignes orbite |
| `particle-flow` | 2-3s ease-in-out ∞ | Offset-path particle | Nœuds circulants sur paths |
| `fadeIn` | 0.4s ease both | Opacité 0→1 | Contenu ExperienceDrawer |

### Courbes Bezier

Les chemins de connexion utilisent des courbes **Bezier cubiques** pour un aspect fluide :

```
M${x1},${y1} C${midX},${y1} ${midX},${y2} ${x2},${y2}
```

Contrôle de point au milieu = transition linéaire lisse entre nœuds.

## 🔧 Débogage & Troubleshooting

### Le formulaire de contact ne fonctionne pas

**Vérifier** :
- ✅ La variable d'env `VITE_FORMSPREE_URL` est définie dans `.env`
- ✅ Le serveur de dev a été redémarré après la création du `.env`
- ✅ L'ID Formspree est correct (URL doit être `https://formspree.io/f/xxxxxx`)
- ✅ Le compte Formspree n'a pas expiré

**Fallback** : Sans Formspree, un lien `mailto:` est affiché

### Le switch FR/EN ne fonctionne pas

**Vérifier** :
- ✅ Le I18nProvider enveloppe bien l'App dans `main.jsx`
- ✅ Les boutons ont `pointerEvents: auto` dans les vues avec position fixed
- ✅ Pas de z-index plus élevé que 200 qui recouvrirait le LangSwitch

### Les animations ne s'affichent pas

**Vérifier** :
- ✅ Les CSS animations dans `globals.css` ne sont pas commentées
- ✅ Pas de conflit avec `animation: none` ailleurs
- ✅ Support du navigateur pour `offset-path` (moderne, mais pas IE)

### Le canvas scroll ne fonctionne pas

**Vérifier** :
- ✅ `containerRef` est bien assigné au div `canvas-container`
- ✅ `.canvas-container` a `overflow: auto` dans globals.css
- ✅ Pas de `pointer-events: none` qui bloquerait le scroll

## 🚀 Optimisations

### Lighthouse / Performance

- ✅ Vite : bundling optimisé, tree-shaking
- ✅ Tailwind : PurgeCSS → CSS minimal en prod
- ✅ Image inlining : SVGs dans le JSX (pas d'appels réseau)
- ✅ Code splitting : Composants lazily loaded possibles avec `React.lazy()`

### SEO

- ℹ️ SPA sans SSR : Contenu visible en client-side. Pour SEO : ajouter [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) en build.

## 📚 Ressources & Liens

- [React 18 Docs](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [CSS Animations MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)
- [Formspree](https://formspree.io) — Service de formulaires gratuit

## 📝 Licence & Attribution

**Usage** : Personnel — Pierre-Antoine Lefebvre
**Repo** : [github.com/pierreantoinelefebvre/cv-pal](https://github.com/pierreantoinelefebvre/cv-pal)

---

**Dernière mise à jour** : 2025-02-25
**Version** : 1.0.0
