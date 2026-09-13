'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAcademicStore } from '@/lib/store';
import type { Task, TaskPriority, TaskType } from '@/lib/types';
import { formatDateInput } from '@/lib/utils';

const TYPES: TaskType[] = ['TP', 'TD', 'Examen', 'Projet', 'Devoir'];
const PRIORITES: TaskPriority[] = ['Haute', 'Moyenne', 'Basse'];

interface TaskFormProps {
  tacheAModifier?: Task | null;
  ouvert?: boolean;
  onOuvertChange?: (ouvert: boolean) => void;
  /** Si absent, le formulaire affiche son propre bouton déclencheur "+" */
  masquerDeclencheur?: boolean;
}

const ETAT_INITIAL = {
  titre: '',
  matiereId: '' as string,
  type: 'Devoir' as TaskType,
  dateLimite: '',
  priorite: 'Moyenne' as TaskPriority,
};

export function TaskForm({ tacheAModifier, ouvert, onOuvertChange, masquerDeclencheur }: TaskFormProps) {
  const { subjects, addTask, updateTask } = useAcademicStore();
  const [interneOuvert, setInterneOuvert] = useState(false);
  const [form, setForm] = useState(ETAT_INITIAL);
  const [erreur, setErreur] = useState<string | null>(null);

  const estControle = ouvert !== undefined;
  const estOuvert = estControle ? ouvert : interneOuvert;
  const setOuvert = estControle ? onOuvertChange! : setInterneOuvert;

  useEffect(() => {
    if (!estOuvert) return;
    if (tacheAModifier) {
      setForm({
        titre: tacheAModifier.titre,
        matiereId: tacheAModifier.matiereId ?? '',
        type: tacheAModifier.type,
        dateLimite: formatDateInput(tacheAModifier.dateLimite),
        priorite: tacheAModifier.priorite,
      });
    } else {
      setForm(ETAT_INITIAL);
    }
    setErreur(null);
  }, [estOuvert, tacheAModifier]);

  function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titre.trim()) {
      setErreur('Le titre est obligatoire.');
      return;
    }

    const donnees = {
      titre: form.titre.trim(),
      matiereId: form.matiereId || null,
      type: form.type,
      dateLimite: form.dateLimite ? new Date(form.dateLimite).toISOString() : null,
      priorite: form.priorite,
    };

    if (tacheAModifier) {
      updateTask(tacheAModifier.id, donnees);
    } else {
      addTask(donnees);
    }

    setOuvert(false);
  }

  return (
    <Dialog open={estOuvert} onOpenChange={setOuvert}>
      {!masquerDeclencheur && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tacheAModifier ? 'Modifier la tâche' : 'Ajouter une tâche'}</DialogTitle>
          <DialogDescription>
            Renseignez les informations de votre {form.type.toLowerCase()} pour ne rien oublier.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={soumettre} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="titre">Titre</Label>
            <Input
              id="titre"
              placeholder="Ex : Rendu TP Réseau"
              value={form.titre}
              onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Matière</Label>
              <Select
                value={form.matiereId || '__aucune__'}
                onValueChange={(v) => setForm((f) => ({ ...f, matiereId: v === '__aucune__' ? '' : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucune" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__aucune__">Aucune</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as TaskType }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date_limite">Date limite (heure optionnelle)</Label>
              <Input
                id="date_limite"
                type="datetime-local"
                value={form.dateLimite}
                onChange={(e) => setForm((f) => ({ ...f, dateLimite: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Priorité</Label>
              <Select
                value={form.priorite}
                onValueChange={(v) => setForm((f) => ({ ...f, priorite: v as TaskPriority }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {erreur && <p className="text-sm text-destructive">{erreur}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOuvert(false)}>
              Annuler
            </Button>
            <Button type="submit">{tacheAModifier ? 'Enregistrer' : 'Ajouter la tâche'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
