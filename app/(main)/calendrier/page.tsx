'use client';

import { AppShell } from '@/components/layout/app-shell';
import { WeekView } from '@/components/calendar/week-view';
import { TaskForm } from '@/components/tasks/task-form';

export default function CalendrierPage() {
  return (
    <AppShell title="Emploi du temps" subtitle="Vos échéances regroupées par jour">
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="flex justify-end">
          <TaskForm />
        </div>
        <WeekView />
      </div>
    </AppShell>
  );
}
