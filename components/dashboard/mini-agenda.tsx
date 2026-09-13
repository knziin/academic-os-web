'use client';

import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAcademicStore } from '@/lib/store';
import { dateRelativeLabel, cn } from '@/lib/utils';

export function MiniAgenda() {
  const { tasks, subjects } = useAcademicStore();

  const prochaines = useMemo(() => {
    return tasks
      .filter((t) => t.statut === 'a_faire' && t.dateLimite)
      .sort((a, b) => new Date(a.dateLimite!).getTime() - new Date(b.dateLimite!).getTime())
      .slice(0, 5);
  }, [tasks]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochaines échéances</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {prochaines.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucune échéance à venir.</p>
        )}
        {prochaines.map((t) => {
          const matiere = subjects.find((s) => s.id === t.matiereId);
          const { label, urgence } = dateRelativeLabel(t.dateLimite);
          return (
            <div key={t.id} className="flex items-start gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
              <span
                className="mt-1 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: matiere?.couleur ?? 'hsl(var(--muted-foreground))' }}
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{t.titre}</p>
                <p
                  className={cn(
                    'text-xs',
                    urgence === 'retard' && 'text-destructive',
                    urgence === 'aujourdhui' && 'text-warning',
                    urgence === 'proche' && 'text-primary',
                    (urgence === 'normale' || urgence === 'aucune') && 'text-muted-foreground'
                  )}
                >
                  {label} {matiere ? `· ${matiere.nom}` : ''}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
