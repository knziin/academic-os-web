'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook de persistance localStorage, sûr pour le rendu côté serveur de Next.js.
 *
 * Architecture pensée pour être remplacée facilement par une vraie base de
 * données plus tard : chaque module (tasks, subjects, grades) consomme ce
 * hook via une petite façade dans `lib/store.tsx`. Pour brancher Supabase,
 * SQLite ou Prisma, il suffira de remplacer le contenu de ces façades par
 * des appels réseau (fetch / server actions) sans toucher aux composants.
 */
export function useLocalStorage<T>(cle: string, valeurInitiale: T) {
  const [valeur, setValeur] = useState<T>(valeurInitiale);
  const chargeDepuisStockage = useRef(false);

  // Chargement initial (uniquement côté client)
  useEffect(() => {
    try {
      const brut = window.localStorage.getItem(cle);
      if (brut !== null) {
        setValeur(JSON.parse(brut));
      }
    } catch (erreur) {
      console.error(`Erreur de lecture localStorage pour "${cle}" :`, erreur);
    } finally {
      chargeDepuisStockage.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cle]);

  // Sauvegarde à chaque changement (une fois le chargement initial fait,
  // pour ne pas écraser les données stockées avec la valeur par défaut)
  useEffect(() => {
    if (!chargeDepuisStockage.current) return;
    try {
      window.localStorage.setItem(cle, JSON.stringify(valeur));
    } catch (erreur) {
      console.error(`Erreur d'écriture localStorage pour "${cle}" :`, erreur);
    }
  }, [cle, valeur]);

  const mettreAJour = useCallback((nouvelleValeur: T | ((prec: T) => T)) => {
    setValeur(nouvelleValeur);
  }, []);

  return [valeur, mettreAJour] as const;
}
