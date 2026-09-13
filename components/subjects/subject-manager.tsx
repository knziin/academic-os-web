'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useAcademicStore } from '@/lib/store';
import { SUBJECT_COLOR_PRESETS } from '@/lib/types';
import type { Subject } from '@/lib/types';
import { cn } from '@/lib/utils';

export function SubjectManager() {
  const { subjects, tasks, addSubject, updateSubject, removeSubject, nextSubjectColor } = useAcademicStore();
  const [ouvert, setOuvert] = useState(false);
  const [enEdition, setEnEdition] = useState<Subject | null>(null);
  const [form, setForm] = useState({ nom: '', professeur: '', couleur: '' });

  function ouvrirCreation() {
    setEnEdition(null);
    setForm({ nom: '', professeur: '', couleur: nextSubjectColor() });
    setOuvert(true);
  }

  function ouvrirEdition(s: Subject) {
    setEnEdition(s);
    setForm({ nom: s.nom, professeur: s.professeur ?? '', couleur: s.couleur });
    setOuvert(true);
  }

  function soumettre(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nom.trim()) return;

    const donnees = { nom: form.nom.trim(), professeur: form.professeur.trim() || undefined, couleur: form.couleur };
    if (enEdition) {
      updateSubject(enEdition.id, donnees);
    } else {
      addSubject(donnees);
    }
    setOuvert(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {subjects.length} matière{subjects.length > 1 ? 's' : ''} suivie{subjects.length > 1 ? 's' : ''}
        </p>
        <Button onClick={ouvrirCreation}>
          <Plus className="h-4 w-4" />
          Nouvelle matière
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
          <BookOpen className="h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Ajoutez votre première matière pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {subjects.map((s) => {
              const nbTaches = tasks.filter((t) => t.matiereId === s.id && t.statut === 'a_faire').length;
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="group relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: s.couleur }} />
                    <CardContent className="p-4 pl-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-display text-sm font-semibold">{s.nom}</p>
                          {s.professeur && <p className="mt-0.5 text-xs text-muted-foreground">{s.professeur}</p>}
                        </div>
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => ouvrirEdition(s)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:text-destructive"
                            onClick={() => removeSubject(s.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {nbTaches} tâche{nbTaches !== 1 ? 's' : ''} en cours
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={ouvert} onOpenChange={setOuvert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{enEdition ? 'Modifier la matière' : 'Nouvelle matière'}</DialogTitle>
            <DialogDescription>Associez une couleur pour la repérer facilement dans vos tâches.</DialogDescription>
          </DialogHeader>

          <form onSubmit={soumettre} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nom-matiere">Nom de la matière</Label>
              <Input
                id="nom-matiere"
                placeholder="Ex : Réseaux"
                value={form.nom}
                onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prof-matiere">Professeur (optionnel)</Label>
              <Input
                id="prof-matiere"
                placeholder="Ex : M. Bernard"
                value={form.professeur}
                onChange={(e) => setForm((f) => ({ ...f, professeur: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Couleur</Label>
              <div className="flex flex-wrap gap-2">
                {SUBJECT_COLOR_PRESETS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setForm((f) => ({ ...f, couleur: c }))}
                    className={cn(
                      'h-7 w-7 rounded-full transition-transform hover:scale-110',
                      form.couleur === c && 'ring-2 ring-ring ring-offset-2 ring-offset-surface'
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOuvert(false)}>
                Annuler
              </Button>
              <Button type="submit">{enEdition ? 'Enregistrer' : 'Créer la matière'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
