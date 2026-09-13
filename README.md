# Academic OS — Dashboard académique (Next.js)

Clone moderne d'"Academic OS" : gestion de tâches, matières et moyennes pour le BUT Informatique. React (Next.js App Router) + Tailwind CSS + composants façon shadcn/ui + Framer Motion, avec persistance **localStorage**.

## 🚀 Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

Pour un build de production :
```bash
npm run build
npm start
```

## 📁 Structure des fichiers

```
academic-os-web/
├── app/
│   ├── layout.tsx                # Layout racine (thème, providers, HTML/body)
│   ├── globals.css               # Tokens de design (couleurs dark/light, animations)
│   └── (main)/                   # Groupe de routes de l'application
│       ├── page.tsx              # Dashboard (vue d'ensemble)
│       ├── matieres/page.tsx     # Mes matières
│       ├── calendrier/page.tsx   # Emploi du temps / agenda
│       └── notes/page.tsx        # Calculateur de moyennes
│
├── components/
│   ├── ui/                       # Primitives façon shadcn/ui (Button, Card, Dialog, Select...)
│   ├── layout/                   # Sidebar, Header, navigation mobile, AppShell
│   ├── tasks/                    # TaskForm, TaskCard, TaskList, TaskFilters
│   ├── subjects/                 # SubjectManager (CRUD matières + couleurs)
│   ├── grades/                   # GradeCalculator (moyennes pondérées)
│   ├── dashboard/                # StatCards, MiniAgenda
│   └── calendar/                 # WeekView (vue agenda groupée par jour)
│
├── lib/
│   ├── types.ts                  # Types partagés (Task, Subject, Grade...)
│   ├── utils.ts                  # cn(), dateRelativeLabel(), generateId()...
│   ├── store.tsx                 # Context React : état global + persistance
│   └── theme-provider.tsx        # Contexte dark/light
│
└── hooks/
    └── use-local-storage.ts      # Hook générique de persistance localStorage
```

## 🧠 Architecture des données (pensée pour évoluer vers une vraie base)

Toute la logique de lecture/écriture passe par `lib/store.tsx` (`useAcademicStore()`), qui expose des fonctions comme `addTask`, `updateTask`, `setTaskStatus`, `addSubject`, `addGrade`, etc. Les composants n'accèdent **jamais** directement à `localStorage`.

Pour brancher une vraie base de données plus tard (Supabase, SQLite via Prisma...), il suffit de :
1. Remplacer le contenu de `lib/store.tsx` par des appels réseau (fetch vers une API Route Next.js, ou des Server Actions) tout en gardant la même interface (`AcademicStoreValue`).
2. Aucun composant n'a besoin d'être modifié, puisqu'ils ne consomment que le hook `useAcademicStore()`.

## ✨ Fonctionnalités

- **Tâches** : création/édition (titre, matière, type, date + heure, priorité), case à cocher avec animation, tri automatique par urgence, filtres par matière/statut/période, badges colorés par type.
- **Matières** : CRUD complet avec choix de couleur, compteur de tâches actives par matière.
- **Calendrier** : vue agenda groupée par jour (Aujourd'hui / Demain / dates), cases à cocher directement dans la vue.
- **Notes** : saisie note/coefficient par matière, moyenne pondérée par matière, moyenne générale pondérée sur l'ensemble des notes.
- **Thème** : dark mode par défaut, bascule dark/light persistée, responsive (sidebar desktop → navigation basse sur mobile).

## ⚠️ Note sur les polices

Le projet utilise des **piles de polices système** (`--font-display` / `--font-body` dans `app/globals.css`) plutôt que `next/font/google`, pour fonctionner sans accès réseau à Google Fonts. Si votre environnement de développement a accès à Internet, vous pouvez réactiver `next/font/google` (Space Grotesk + Inter) dans `app/layout.tsx` pour un rendu typographique identique sur toutes les machines.

## 🔌 Prochaines étapes suggérées

- Remplacer `lib/store.tsx` par une intégration Supabase/Prisma pour une persistance multi-appareils.
- Ajouter l'authentification si l'app doit être utilisée par plusieurs étudiants.
- Étendre le calculateur de notes avec des semestres multiples et une pondération par UE (BUT).
