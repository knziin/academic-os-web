'use client';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAcademicStore } from '@/lib/store';

export type FiltreStatut = 'toutes' | 'a_faire' | 'terminees' | 'retard';
export type FiltrePeriode = 'tout' | 'aujourdhui' | 'semaine';

export interface TaskFiltersState {
  matiereId: string; // '' = toutes
  statut: FiltreStatut;
  periode: FiltrePeriode;
}

export function TaskFilters({
  filtres,
  onChange,
}: {
  filtres: TaskFiltersState;
  onChange: (f: TaskFiltersState) => void;
}) {
  const { subjects } = useAcademicStore();

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={filtres.matiereId || '__toutes__'} onValueChange={(v) => onChange({ ...filtres, matiereId: v === '__toutes__' ? '' : v })}>
        <SelectTrigger className="h-8 w-[150px] text-xs">
          <SelectValue placeholder="Matière" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__toutes__">Toutes les matières</SelectItem>
          {subjects.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.nom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filtres.statut} onValueChange={(v) => onChange({ ...filtres, statut: v as FiltreStatut })}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="toutes">Tous statuts</SelectItem>
          <SelectItem value="a_faire">À faire</SelectItem>
          <SelectItem value="terminees">Terminées</SelectItem>
          <SelectItem value="retard">En retard</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filtres.periode} onValueChange={(v) => onChange({ ...filtres, periode: v as FiltrePeriode })}>
        <SelectTrigger className="h-8 w-[130px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tout">Toute période</SelectItem>
          <SelectItem value="aujourdhui">Aujourd'hui</SelectItem>
          <SelectItem value="semaine">Cette semaine</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
