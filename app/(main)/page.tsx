'use client';

import { AppShell } from '@/components/layout/app-shell';
import { StatCards } from '@/components/dashboard/stat-cards';
import { MiniAgenda } from '@/components/dashboard/mini-agenda';
import { TaskList } from '@/components/tasks/task-list';
import { TaskForm } from '@/components/tasks/task-form';

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard" subtitle="Vue d'ensemble de vos tâches et échéances">
      <div className="mx-auto max-w-6xl space-y-6">
        <StatCards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Restez au clair sur vos rendus, sans surprise.</p>
              <TaskForm />
            </div>
            <TaskList titre="À faire cette semaine" />
          </div>

          <div className="space-y-4">
            <MiniAgenda />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
