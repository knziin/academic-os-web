'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { generateId } from '@/lib/utils';
import type { Grade, Subject, Task, TaskStatus } from '@/lib/types';
import { SUBJECT_COLOR_PRESETS } from '@/lib/types';

// ---------------------------------------------------------------------------
// Données de démonstration (affichées seulement au tout premier lancement)
// ---------------------------------------------------------------------------
const MATIERES_DEMO: Subject[] = [
  { id: 'sub-reseaux', nom: 'Réseaux', couleur: '#818cf8', professeur: 'M. Bernard' },
  { id: 'sub-maths', nom: 'Mathématiques', couleur: '#34d399', professeur: 'Mme Petit' },
  { id: 'sub-dev', nom: 'Développement', couleur: '#f472b6', professeur: 'M. Nasser' },
];

function dansNJours(n: number, heure = '18:00'): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const [h, m] = heure.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

const TACHES_DEMO: Task[] = [
  {
    id: 'task-1',
    titre: 'Rendu TP Routage',
    matiereId: 'sub-reseaux',
    type: 'TP',
    dateLimite: dansNJours(1),
    priorite: 'Haute',
    statut: 'a_faire',
    creeLe: new Date().toISOString(),
  },
  {
    id: 'task-2',
    titre: 'Exercices série 4 — intégrales',
    matiereId: 'sub-maths',
    type: 'TD',
    dateLimite: dansNJours(3),
    priorite: 'Moyenne',
    statut: 'a_faire',
    creeLe: new Date().toISOString(),
  },
  {
    id: 'task-3',
    titre: 'Projet fil rouge — sprint 2',
    matiereId: 'sub-dev',
    type: 'Projet',
    dateLimite: dansNJours(6),
    priorite: 'Haute',
    statut: 'a_faire',
    creeLe: new Date().toISOString(),
  },
];

const NOTES_DEMO: Grade[] = [
  { id: 'grade-1', matiereId: 'sub-reseaux', intitule: 'CC1', note: 14.5, coefficient: 1 },
  { id: 'grade-2', matiereId: 'sub-maths', intitule: 'CC1', note: 11, coefficient: 2 },
];

// ---------------------------------------------------------------------------
// Contexte
// ---------------------------------------------------------------------------
interface AcademicStoreValue {
  subjects: Subject[];
  tasks: Task[];
  grades: Grade[];

  addSubject: (data: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, data: Partial<Omit<Subject, 'id'>>) => void;
  removeSubject: (id: string) => void;
  nextSubjectColor: () => string;

  addTask: (data: Omit<Task, 'id' | 'creeLe' | 'statut'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setTaskStatus: (id: string, statut: TaskStatus) => void;

  addGrade: (data: Omit<Grade, 'id'>) => void;
  updateGrade: (id: string, data: Partial<Omit<Grade, 'id'>>) => void;
  removeGrade: (id: string) => void;
}

const AcademicStoreContext = createContext<AcademicStoreValue | null>(null);

export function AcademicStoreProvider({ children }: { children: React.ReactNode }) {
  const [subjects, setSubjects] = useLocalStorage<Subject[]>('academic-os:subjects', MATIERES_DEMO);
  const [tasks, setTasks] = useLocalStorage<Task[]>('academic-os:tasks', TACHES_DEMO);
  const [grades, setGrades] = useLocalStorage<Grade[]>('academic-os:grades', NOTES_DEMO);

  const value = useMemo<AcademicStoreValue>(
    () => ({
      subjects,
      tasks,
      grades,

      addSubject: (data) => {
        setSubjects((prev) => [...prev, { ...data, id: generateId() }]);
      },
      updateSubject: (id, data) => {
        setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
      },
      removeSubject: (id) => {
        setSubjects((prev) => prev.filter((s) => s.id !== id));
        // Détache les tâches et notes liées plutôt que de les supprimer
        setTasks((prev) => prev.map((t) => (t.matiereId === id ? { ...t, matiereId: null } : t)));
        setGrades((prev) => prev.filter((g) => g.matiereId !== id));
      },
      nextSubjectColor: () => {
        const utilisees = new Set(subjects.map((s) => s.couleur));
        const libre = SUBJECT_COLOR_PRESETS.find((c) => !utilisees.has(c));
        return libre ?? SUBJECT_COLOR_PRESETS[subjects.length % SUBJECT_COLOR_PRESETS.length];
      },

      addTask: (data) => {
        setTasks((prev) => [
          ...prev,
          { ...data, id: generateId(), statut: 'a_faire', creeLe: new Date().toISOString() },
        ]);
      },
      updateTask: (id, data) => {
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
      },
      removeTask: (id) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
      },
      setTaskStatus: (id, statut) => {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, statut, termineLe: statut === 'terminee' ? new Date().toISOString() : null }
              : t
          )
        );
      },

      addGrade: (data) => {
        setGrades((prev) => [...prev, { ...data, id: generateId() }]);
      },
      updateGrade: (id, data) => {
        setGrades((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
      },
      removeGrade: (id) => {
        setGrades((prev) => prev.filter((g) => g.id !== id));
      },
    }),
    [subjects, tasks, grades, setSubjects, setTasks, setGrades]
  );

  return <AcademicStoreContext.Provider value={value}>{children}</AcademicStoreContext.Provider>;
}

export function useAcademicStore() {
  const ctx = useContext(AcademicStoreContext);
  if (!ctx) {
    throw new Error('useAcademicStore doit être utilisé à l\'intérieur de <AcademicStoreProvider>.');
  }
  return ctx;
}
