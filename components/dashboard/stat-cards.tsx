'use client';

import { useMemo } from 'react';
import { ListTodo, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAcademicStore } from '@/lib/store';

export function StatCards() {
  const { tasks } = useAcademicStore();

  const stats = useMemo(() => {
    const total = tasks.length;
    const terminees = tasks.filter((t) => t.statut === 'terminee').length;
    const enRetard = tasks.filter(
      (t) => t.statut === 'a_faire' && t.dateLimite && new Date(t.dateLimite) < new Date()
    ).length;
    const aFaire = total - terminees;
    const taux = total > 0 ? Math.round((terminees / total) * 100) : 0;

    return { total, terminees, enRetard, aFaire, taux };
  }, [tasks]);

  const cartes = [
    { label: 'À faire', valeur: stats.aFaire, icon: ListTodo, couleur: 'text-primary' },
    { label: 'Terminées', valeur: stats.terminees, icon: CheckCircle2, couleur: 'text-success' },
    { label: 'En retard', valeur: stats.enRetard, icon: AlertTriangle, couleur: 'text-destructive' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cartes.map((c) => (
        <Card key={c.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex h-9 w-9 items-center justify-center rounded-md bg-secondary ${c.couleur}`}>
              <c.icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold leading-none">{c.valeur}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              Progression
            </div>
            <span className="font-display text-sm font-semibold">{stats.taux}%</span>
          </div>
          <Progress value={stats.taux} />
        </CardContent>
      </Card>
    </div>
  );
}
