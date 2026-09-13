'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Trash2, Clock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskForm } from '@/components/tasks/task-form';
import { useAcademicStore } from '@/lib/store';
import type { Task } from '@/lib/types';
import { TASK_TYPE_COLORS } from '@/lib/types';
import { cn, dateRelativeLabel } from '@/lib/utils';

const URGENCE_STYLES: Record<string, string> = {
  retard: 'text-destructive',
  aujourdhui: 'text-warning',
  proche: 'text-primary',
  normale: 'text-muted-foreground',
  aucune: 'text-muted-foreground',
};

const PRIORITE_DOT: Record<Task['priorite'], string> = {
  Haute: 'bg-destructive',
  Moyenne: 'bg-warning',
  Basse: 'bg-muted-foreground',
};

export function TaskCard({ task }: { task: Task }) {
  const { subjects, setTaskStatus, removeTask } = useAcademicStore();
  const [modifierOuvert, setModifierOuvert] = useState(false);

  const matiere = subjects.find((s) => s.id === task.matiereId);
  const estTerminee = task.statut === 'terminee';
  const { label, urgence } = dateRelativeLabel(task.dateLimite);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12, transition: { duration: 0.18 } }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors',
        estTerminee && 'opacity-60'
      )}
    >
      <Checkbox
        checked={estTerminee}
        onCheckedChange={(v) => setTaskStatus(task.id, v ? 'terminee' : 'a_faire')}
        className="mt-0.5"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', PRIORITE_DOT[task.priorite])} title={`Priorité ${task.priorite}`} />
          <p className={cn('truncate text-sm font-medium', estTerminee && 'task-strike text-muted-foreground')}>
            {task.titre}
          </p>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge className={cn('border', TASK_TYPE_COLORS[task.type])}>{task.type}</Badge>

          {matiere && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: matiere.couleur }} />
              {matiere.nom}
            </span>
          )}

          {!estTerminee && (
            <span className={cn('inline-flex items-center gap-1 text-xs font-medium', URGENCE_STYLES[urgence])}>
              <Clock className="h-3 w-3" />
              {label}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setModifierOuvert(true)} title="Modifier">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:text-destructive"
          onClick={() => removeTask(task.id)}
          title="Supprimer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <TaskForm tacheAModifier={task} ouvert={modifierOuvert} onOuvertChange={setModifierOuvert} masquerDeclencheur />
    </motion.div>
  );
}
