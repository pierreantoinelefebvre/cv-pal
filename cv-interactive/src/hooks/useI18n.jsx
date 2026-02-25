import { createContext, useContext, useState, useCallback } from "react";
import { CV_FR, UI_FR } from "../data/cv-fr";
import { CV_EN, UI_EN } from "../data/cv-en";

/**
 * I18nContext — Contexte pour la gestion des langues (FR/EN)
 * Fournit les données CV et textes UI dans la langue actuelle
 */
const I18nContext = createContext();

/**
 * I18nProvider — Provider qui gère l'état de la langue
 * À la racine de l'app (dans main.jsx)
 *
 * Expose :
 * - lang: "fr" ou "en" (langue actuelle)
 * - toggle: fn pour basculer la langue
 * - cv: Objet CV structuré (profil, expériences, skills, etc.)
 * - ui: Textes UI localisés (boutons, labels, etc.)
 */
export function I18nProvider({ children }) {
  // Langue par défaut : français
  const [lang, setLang] = useState("fr");

  // Basculer entre FR et EN
  const toggle = useCallback(() => {
    setLang((prev) => (prev === "fr" ? "en" : "fr"));
  }, []);

  // Sélectionner les données en fonction de la langue
  const cv = lang === "fr" ? CV_FR : CV_EN;
  const ui = lang === "fr" ? UI_FR : UI_EN;

  return (
    <I18nContext.Provider value={{ lang, toggle, cv, ui }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * useI18n — Hook pour accéder au contexte i18n
 * Doit être utilisé dans un composant enfant du I18nProvider
 *
 * Usage:
 *   const { lang, toggle, cv, ui } = useI18n();
 */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
