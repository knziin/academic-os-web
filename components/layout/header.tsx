'use client';

import { Moon, Sun, Flame, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/lib/theme-provider';
import { useAcademicStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

function debutSemaine(): Date {
  const d = new Date();
  const jour = d.getDay(); // 0 = dimanche
  const decalage = jour === 0 ? -6 : 1 - jour; // lundi comme premier jour
  const lundi = new Date(d);
  lundi.setDate(d.getDate() + decalage);
  lundi.setHours(0, 0, 0, 0);
  return lundi;
}

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { tasks } = useAcademicStore();

  const seuil = debutSemaine();
  const termineesCetteSemaine = tasks.filter(
    (t) => t.statut === 'terminee' && t.termineLe && new Date(t.termineLe) >= seuil
  ).length;

  const enRetard = tasks.filter(
    (t) => t.statut === 'a_faire' && t.dateLimite && new Date(t.dateLimite) < new Date()
  ).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
      <div>
        <h1 className="font-display text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-4 rounded-md border border-border bg-surface px-3 py-1.5 sm:flex">
          <div className="flex items-center gap-1.5 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span className="font-medium">{termineesCetteSemaine}</span>
            <span className="text-muted-foreground">terminées cette semaine</span>
          </div>
          {enRetard > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <Flame className="h-3.5 w-3.5 text-destructive" />
              <span className="font-medium text-destructive">{enRetard}</span>
              <span className="text-muted-foreground">en retard</span>
            </div>
          )}
        </div>

        <Button variant="outline" size="icon" onClick={toggleTheme} title="Changer de thème">
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
