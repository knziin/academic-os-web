'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GraduationCap, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAcademicStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const ETAT_INITIAL = { matiereId: '', intitule: '', note: '', coefficient: '1' };

function couleurNote(note: number): string {
  if (note >= 14) return 'text-success';
  if (note >= 10) return 'text-foreground';
  return 'text-destructive';
}

export function GradeCalculator() {
  const { subjects, grades, addGrade, removeGrade } = useAcademicStore();
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState(ETAT_INITIAL);
  const [erreur, setErreur] = useState<string | null>(null);

  const parMatiere = useMemo(() => {
    return subjects.map((s) => {
      const notesMatiere = grades.filter((g) => g.matiereId === s.id);
      const sommeCoef = notesMatiere.reduce((acc, g) => acc + g.coefficient, 0);
      const sommePonderee = notesMatiere.reduce((acc, g) => acc + g.note * g.coefficient, 0);
      const moyenne = sommeCoef > 0 ? sommePonderee / sommeCoef : null;
      return { matiere: s, notes: notesMatiere, moyenne };
    });
  }, [subjects, grades]);

  const moyenneGenerale = useMemo(() => {
    const sommeCoef = grades.reduce((acc, g) => acc + g.coefficient, 0);
    const sommePonderee = grades.reduce((acc, g) => acc + g.note * g.coefficient, 0);
    return sommeCoef > 0 ? sommePonderee / sommeCoef : null;
  }, [grades]);

  function ouvrirCreation() {
    setForm({ ...ETAT_INITIAL, matiereId: subjects[0]?.id ?? '' });
    setErreur(null);
    setOuvert(true);
  }

  function soumettre(e: React.FormEvent) {
    e.preventDefault();
    const note = parseFloat(form.note.replace(',', '.'));
    const coefficient = parseFloat(form.coefficient.replace(',', '.'));

    if (!form.matiereId) return setErreur('Choisissez une matière.');
    if (!form.intitule.trim()) return setErreur("Donnez un intitulé (ex : Contrôle continu 1).");
    if (Number.isNaN(note) || note < 0 || note > 20) return setErreur('La note doit être comprise entre 0 et 20.');
    if (Number.isNaN(coefficient) || coefficient <= 0) return setErreur('Le coefficient doit être supérieur à 0.');

    addGrade({ matiereId: form.matiereId, intitule: form.intitule.trim(), note, coefficient });
    setOuvert(false);
  }

  if (subjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
        <GraduationCap className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Créez d'abord une matière dans « Mes matières » pour pouvoir y ajouter des notes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Moyenne générale */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/15 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Moyenne générale du semestre</p>
              <p className="font-display text-2xl font-semibold">
                {moyenneGenerale !== null ? moyenneGenerale.toFixed(2) : '—'}
                <span className="text-sm font-normal text-muted-foreground"> / 20</span>
              </p>
            </div>
          </div>
          <div className="w-full sm:w-56">
            <Progress value={moyenneGenerale ? (moyenneGenerale / 20) * 100 : 0} />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold text-muted-foreground">Détail par matière</h2>
        <Button onClick={ouvrirCreation}>
          <Plus className="h-4 w-4" />
          Ajouter une note
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {parMatiere.map(({ matiere, notes, moyenne }) => (
          <Card key={matiere.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: matiere.couleur }} />
                <CardTitle>{matiere.nom}</CardTitle>
              </div>
              <span className={cn('font-display text-lg font-semibold', moyenne !== null && couleurNote(moyenne))}>
                {moyenne !== null ? moyenne.toFixed(2) : '—'}
              </span>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {notes.length === 0 ? (
                <p className="text-xs text-muted-foreground">Aucune note enregistrée.</p>
              ) : (
                <AnimatePresence initial={false}>
                  {notes.map((g) => (
                    <motion.div
                      key={g.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -8 }}
                      className="flex items-center justify-between rounded-md bg-secondary/60 px-3 py-2 text-sm"
                    >
                      <div>
                        <p className="font-medium">{g.intitule}</p>
                        <p className="text-xs text-muted-foreground">Coefficient {g.coefficient}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn('font-display text-sm font-semibold', couleurNote(g.note))}>
                          {g.note.toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:text-destructive"
                          onClick={() => removeGrade(g.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={ouvert} onOpenChange={setOuvert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une note</DialogTitle>
            <DialogDescription>Renseignez la note obtenue et son coefficient pour cette matière.</DialogDescription>
          </DialogHeader>

          <form onSubmit={soumettre} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Matière</Label>
              <Select value={form.matiereId} onValueChange={(v) => setForm((f) => ({ ...f, matiereId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="intitule">Intitulé</Label>
              <Input
                id="intitule"
                placeholder="Ex : Contrôle continu 1"
                value={form.intitule}
                onChange={(e) => setForm((f) => ({ ...f, intitule: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="note">Note / 20</Label>
                <Input
                  id="note"
                  inputMode="decimal"
                  placeholder="Ex : 14.5"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="coefficient">Coefficient</Label>
                <Input
                  id="coefficient"
                  inputMode="decimal"
                  placeholder="Ex : 2"
                  value={form.coefficient}
                  onChange={(e) => setForm((f) => ({ ...f, coefficient: e.target.value }))}
                />
              </div>
            </div>

            {erreur && <p className="text-sm text-destructive">{erreur}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOuvert(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
