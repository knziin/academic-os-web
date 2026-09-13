'use client';

import { AppShell } from '@/components/layout/app-shell';
import { GradeCalculator } from '@/components/grades/grade-calculator';

export default function NotesPage() {
  return (
    <AppShell title="Moyennes & notes" subtitle="Calculez vos moyennes par matière et votre moyenne générale">
      <div className="mx-auto max-w-5xl">
        <GradeCalculator />
      </div>
    </AppShell>
  );
}
