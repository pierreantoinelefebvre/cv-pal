import { useState } from "react";
import LangSwitch from "./components/LangSwitch";
import ThemeSwitch from "./components/ThemeSwitch";
import MonolithView from "./components/MonolithView";
import MicroservicesView from "./components/MicroservicesView";
import CanvasView from "./components/CanvasView";
import SectionPanel from "./components/SectionPanel";
import ExperienceModal from "./components/ExperienceModal";
import ContactForm from "./components/ContactForm";

/**
 * App — Orchestrateur principal du CV interactif
 *
 * Architecture du flux de navigation :
 * - monolith    : Vue d'accueil (bloc centralisé avec info personnelle)
 * - microservices : Menu éclaté en orbite (6 services : about, skills, education, languages, experiences, contact)
 * - canvas      : Workflow n8n style (parcours chronologique des expériences)
 *
 * Le composant gère les transitions entre vues et l'affichage des modales
 * (détails d'expérience, formulaires, panneaux d'information)
 */
export default function App() {
  // État de la vue actuelle (navigation principale)
  const [view, setView] = useState("monolith");

  // État de la section active dans le menu (about | skills | education | languages)
  const [activeSection, setActiveSection] = useState(null);

  // Expérience sélectionnée pour affichage du tiroir (drawer)
  const [selectedExperience, setSelectedExperience] = useState(null);

  // Affichage du formulaire de contact
  const [showContact, setShowContact] = useState(false);

  // Transition monolithe → microservices (click sur le bloc principal)
  const handleDeploy = () => setView("microservices");

  // Gestion des clics sur les nœuds du menu éclaté
  const handleSelectNode = (nodeId) => {
    if (nodeId === "experiences") {
      setView("canvas"); // Afficher le workflow des expériences
    } else if (nodeId === "contact") {
      setShowContact(true); // Afficher le formulaire de contact
    } else {
      setActiveSection(nodeId); // Afficher un panneau d'info (about, skills, etc.)
    }
  };

  // Retour au menu éclaté et fermeture du tiroir d'expérience
  const handleBackToMenu = () => {
    setView("microservices");
    setSelectedExperience(null);
  };

  return (
    <>
      <div className="grid-bg" />
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 200,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ThemeSwitch />
        <LangSwitch />
      </div>

      {view === "monolith" && <MonolithView onDeploy={handleDeploy} />}

      {view === "microservices" && (
        <>
          <MicroservicesView onSelectNode={handleSelectNode} />
          <button
            onClick={() => setView("monolith")}
            style={{
              position: "fixed",
              top: 20,
              left: 20,
              zIndex: 20,
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              color: "var(--text-secondary)",
              padding: "8px 16px",
              borderRadius: 8,
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Monolithe
          </button>
        </>
      )}

      {view === "canvas" && (
        <CanvasView
          onBack={handleBackToMenu}
          onSelectExperience={(exp) => setSelectedExperience(exp)}
        />
      )}

      {activeSection && (
        <SectionPanel section={activeSection} onClose={() => setActiveSection(null)} />
      )}

      {selectedExperience && (
        <ExperienceModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}

      {showContact && <ContactForm onClose={() => setShowContact(false)} />}
    </>
  );
}
