'use client';

import { AppShell } from '@/components/layout/app-shell';
import { SubjectManager } from '@/components/subjects/subject-manager';

export default function MatieresPage() {
  return (
    <AppShell title="Mes matières" subtitle="Organisez vos modules du BUT et leurs couleurs">
      <div className="mx-auto max-w-6xl">
        <SubjectManager />
      </div>
    </AppShell>
  );
}
