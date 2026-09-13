import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Génère un identifiant simple, suffisant pour un usage 100% local. */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Renvoie une étiquette de date relative en français : "Aujourd'hui",
 * "Demain", "Dans 3 jours", "En retard de 2 jours", etc.
 */
export function dateRelativeLabel(iso: string | null): {
  label: string;
  urgence: 'retard' | 'aujourdhui' | 'proche' | 'normale' | 'aucune';
} {
  if (!iso) return { label: 'Sans échéance', urgence: 'aucune' };

  const cible = new Date(iso);
  const maintenant = new Date();

  const cibleJour = new Date(cible.getFullYear(), cible.getMonth(), cible.getDate());
  const jourActuel = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());

  const diffMs = cibleJour.getTime() - jourActuel.getTime();
  const diffJours = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const heureLabel = cible.getHours() !== 0 || cible.getMinutes() !== 0
    ? ` à ${cible.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    : '';

  if (diffJours < 0) {
    return {
      label: `En retard de ${Math.abs(diffJours)} j`,
      urgence: 'retard',
    };
  }
  if (diffJours === 0) {
    return { label: `Aujourd'hui${heureLabel}`, urgence: 'aujourdhui' };
  }
  if (diffJours === 1) {
    return { label: `Demain${heureLabel}`, urgence: 'proche' };
  }
  if (diffJours <= 6) {
    return { label: `Dans ${diffJours} j`, urgence: 'proche' };
  }
  return {
    label: cible.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) + heureLabel,
    urgence: 'normale',
  };
}

export function formatDateInput(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toISOString().slice(0, 16);
}
