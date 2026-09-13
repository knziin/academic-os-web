export type TaskType = 'TP' | 'TD' | 'Examen' | 'Projet' | 'Devoir';
export type TaskPriority = 'Basse' | 'Moyenne' | 'Haute';
export type TaskStatus = 'a_faire' | 'terminee';

export interface Subject {
  id: string;
  nom: string;
  couleur: string; // couleur hex, ex: '#818cf8'
  professeur?: string;
}

export interface Task {
  id: string;
  titre: string;
  matiereId: string | null;
  type: TaskType;
  dateLimite: string | null; // ISO string, peut inclure une heure
  priorite: TaskPriority;
  statut: TaskStatus;
  creeLe: string; // ISO string
  termineLe?: string | null;
}

export interface Grade {
  id: string;
  matiereId: string;
  intitule: string; // ex: "Contrôle continu 1"
  note: number; // sur 20
  coefficient: number;
}

export const TASK_TYPE_COLORS: Record<TaskType, string> = {
  TP: 'bg-success/15 text-success border-success/30',
  TD: 'bg-primary/15 text-primary border-primary/30',
  Examen: 'bg-destructive/15 text-destructive border-destructive/30',
  Projet: 'bg-warning/15 text-warning border-warning/30',
  Devoir: 'bg-secondary text-secondary-foreground border-border',
};

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  Haute: 0,
  Moyenne: 1,
  Basse: 2,
};

export const SUBJECT_COLOR_PRESETS = [
  '#818cf8', // indigo
  '#34d399', // vert
  '#f472b6', // rose
  '#fbbf24', // ambre
  '#60a5fa', // bleu
  '#f87171', // rouge
  '#a78bfa', // violet
  '#2dd4bf', // teal
];
