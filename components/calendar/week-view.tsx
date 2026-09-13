'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAcademicStore } from '@/lib/store';
import { TASK_TYPE_COLORS } from '@/lib/types';
import { cn } from '@/lib/utils';

function cleJour(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function libelleJour(date: Date): string {
  const maintenant = new Date();
  const jourActuel = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
  const diff = Math.round((date.getTime() - jourActuel.getTime()) / 86400000);

  if (diff === 0) return "Aujourd'hui";
  if (diff === 1) return 'Demain';
  if (diff === -1) return 'Hier';

  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function WeekView() {
  const { tasks, subjects } = useAcademicStore();

  const groupes = useMemo(() => {
    const avecDate = tasks.filter((t) => t.dateLimite);
    const map = new Map<string, typeof tasks>();

    avecDate.forEach((t) => {
      const d = new Date(t.dateLimite!);
      const jour = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const cle = cleJour(jour);
      if (!map.has(cle)) map.set(cle, []);
      map.get(cle)!.push(t);
    });

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([cle, taches]) => ({
        date: new Date(cle),
        taches: taches.sort((a, b) => new Date(a.dateLimite!).getTime() - new Date(b.dateLimite!).getTime()),
      }));
  }, [tasks]);

  const { setTaskStatus } = useAcademicStore();

  if (groupes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
        <CalendarClock className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Aucune échéance planifiée pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupes.map(({ date, taches }) => {
        const enRetard = date < new Date(new Date().setHours(0, 0, 0, 0));
        return (
          <div key={date.toISOString()}>
            <div className="mb-2 flex items-center gap-2">
              <h3 className={cn('font-display text-sm font-semibold capitalize', enRetard && 'text-destructive')}>
                {libelleJour(date)}
              </h3>
              <span className="text-xs text-muted-foreground">
                {date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
            </div>

            <div className="space-y-2">
              {taches.map((t) => {
                const matiere = subjects.find((s) => s.id === t.matiereId);
                const heure = new Date(t.dateLimite!).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                return (
                  <motion.div
                    layout
                    key={t.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border border-border bg-card p-3',
                      t.statut === 'terminee' && 'opacity-60'
                    )}
                  >
                    <Checkbox
                      checked={t.statut === 'terminee'}
                      onCheckedChange={(v) => setTaskStatus(t.id, v ? 'terminee' : 'a_faire')}
                    />
                    <span className="w-14 shrink-0 text-xs tabular-nums text-muted-foreground">{heure}</span>
                    <p className={cn('flex-1 truncate text-sm font-medium', t.statut === 'terminee' && 'task-strike text-muted-foreground')}>
                      {t.titre}
                    </p>
                    <Badge className={cn('border shrink-0', TASK_TYPE_COLORS[t.type])}>{t.type}</Badge>
                    {matiere && (
                      <span className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: matiere.couleur }} />
                        {matiere.nom}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
