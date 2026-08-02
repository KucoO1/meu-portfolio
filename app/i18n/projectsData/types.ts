import type { StackGroup, ContentBlock } from "../../data/projects";

export interface ProjectTranslation {
  title: string;
  tagline: string;
  overview: string;
  problem: string;
  stack: StackGroup[];
  architecture: ContentBlock[];
  backend: ContentBlock[];
  features: string[];
  challenges: ContentBlock[];
  learnings: string[];
}

export type ProjectTranslationDict = Record<string, ProjectTranslation>;
