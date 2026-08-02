import { useMemo } from "react";
import type { ProjectData } from "../data/projects";
import { mergeProjectTranslation } from "../data/projects";
import { useLanguage } from "./LanguageContext";
import en from "./projectsData/en";
import fr from "./projectsData/fr";
import es from "./projectsData/es";
import de from "./projectsData/de";
import type { ProjectTranslationDict } from "./projectsData/types";

const dictionaries: Partial<Record<string, ProjectTranslationDict>> = {
  en,
  fr,
  es,
  de,
};

export function useTranslatedProject(project: ProjectData): ProjectData {
  const { locale } = useLanguage();
  return useMemo(() => {
    if (locale === "pt") return project;
    const dict = dictionaries[locale];
    const translation = dict?.[project.slug];
    return mergeProjectTranslation(project, translation);
  }, [project, locale]);
}
