'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ClipboardCheck } from 'lucide-react';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskFilters, type TaskFiltersState } from '@/components/tasks/task-filters';
import { useAcademicStore } from '@/lib/store';
import { PRIORITY_ORDER } from '@/lib/types';
import type { Task } from '@/lib/types';

function estDansPeriode(task: Task, periode: TaskFiltersState['periode']): boolean {
  if (periode === 'tout') return true;
  if (!task.dateLimite) return false;

  const cible = new Date(task.dateLimite);
  const maintenant = new Date();
  const cibleJour = new Date(cible.getFullYear(), cible.getMonth(), cible.getDate());
  const jourActuel = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
  const diffJours = Math.round((cibleJour.getTime() - jourActuel.getTime()) / 86400000);

  if (periode === 'aujourdhui') return diffJours === 0;
  if (periode === 'semaine') return diffJours >= 0 && diffJours <= 6;
  return true;
}

export function TaskList({ limite, titre = 'Tâches' }: { limite?: number; titre?: string }) {
  const { tasks } = useAcademicStore();
  const [filtres, setFiltres] = useState<TaskFiltersState>({ matiereId: '', statut: 'toutes', periode: 'tout' });

  const tachesFiltrees = useMemo(() => {
    const maintenant = new Date();

    let resultat = tasks.filter((t) => {
      if (filtres.matiereId && t.matiereId !== filtres.matiereId) return false;

      if (filtres.statut === 'a_faire' && t.statut !== 'a_faire') return false;
      if (filtres.statut === 'terminees' && t.statut !== 'terminee') return false;
      if (filtres.statut === 'retard') {
        const enRetard = t.statut === 'a_faire' && t.dateLimite && new Date(t.dateLimite) < maintenant;
        if (!enRetard) return false;
      }

      if (!estDansPeriode(t, filtres.periode)) return false;

      return true;
    });

    resultat = resultat.sort((a, b) => {
      // Les tâches à faire d'abord, puis les terminées
      if (a.statut !== b.statut) return a.statut === 'a_faire' ? -1 : 1;

      // Tri par urgence (date la plus proche en premier), sans date à la fin
      if (a.dateLimite && b.dateLimite) {
        const diff = new Date(a.dateLimite).getTime() - new Date(b.dateLimite).getTime();
        if (diff !== 0) return diff;
      } else if (a.dateLimite) {
        return -1;
      } else if (b.dateLimite) {
        return 1;
      }

      return PRIORITY_ORDER[a.priorite] - PRIORITY_ORDER[b.priorite];
    });

    return limite ? resultat.slice(0, limite) : resultat;
  }, [tasks, filtres, limite]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-sm font-semibold text-muted-foreground">
          {titre} <span className="text-muted-foreground/60">({tachesFiltrees.length})</span>
        </h2>
        <TaskFilters filtres={filtres} onChange={setFiltres} />
      </div>

      {tachesFiltrees.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-14 text-center">
          <ClipboardCheck className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Rien à faire ici. Ajoutez une tâche pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence initial={false} mode="popLayout">
            {tachesFiltrees.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
