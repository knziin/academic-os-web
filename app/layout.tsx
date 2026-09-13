import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/lib/theme-provider';
import { AcademicStoreProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'Academic OS',
  description: 'Votre tableau de bord académique — tâches, matières et notes du BUT Informatique.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <AcademicStoreProvider>{children}</AcademicStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
