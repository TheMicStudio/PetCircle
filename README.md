# PetCircle

> Réseau social photo — fil paginé, posts, commentaires, likes, abonnements et profils.
> Monorepo TypeScript strict : React 19 côté client, Express 5 + Prisma côté API.

[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## Sommaire

- [À propos](#à-propos)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Démarrage rapide](#démarrage-rapide)
- [Comptes de test](#comptes-de-test)
- [Tests et qualité](#tests-et-qualité)
- [Architecture](#architecture)
- [Flux de développement](#flux-de-développement)
- [Équipe](#équipe)

---

## À propos

PetCircle est un réseau social type Instagram développé en sprint fullstack de 3,5 jours
(ESIEE-IT, L3 / B3). Le sujet simule une arrivée en entreprise : un backend existant
généré par IA et mergé sans revue, dont l'équipe devient responsable comme si elle
l'avait écrit.

Le travail livré couvre :

- l'audit du backend fourni ([`AUDIT.md`](AUDIT.md)) — failles de sécurité, limites de
  volumétrie, plan de découpage ;
- le durcissement de l'API au fil des stories — autorisation vérifiée côté serveur,
  validation Zod, rate limiting ;
- un frontend React 19 couvrant les huit stories du socle, plus trois défis.

---

## Fonctionnalités

### Socle (S1 → S8)

| Domaine | Détail |
| --- | --- |
| **Comptes** | Inscription, connexion, session JWT persistante, routes protégées, déconnexion propre sur 401 |
| **Fil** | Pagination par curseur, tri antichronologique, états `loading` / `error` / `empty` / `success` |
| **Posts** | Création avec image et prévisualisation, page de détail accessible par URL, commentaires |
| **Likes** | Like / unlike optimiste, retour en arrière avec message si l'API échoue |
| **Profils** | Une page, deux contextes (le mien / un autre), actions réservées au propriétaire |
| **Suppression** | Posts et commentaires par leur auteur uniquement, vérifié côté API |

### Défis réalisés

- **Follow / unfollow et fil des abonnements** — relations entre utilisateurs, feed filtré côté API
- **Recherche pilotée par l'URL** — état synchronisé avec les `searchParams`, saisie débouncée
- **Version mobile responsive** — mise en page adaptée aux petits écrans
- **Suite e2e Playwright** — parcours complets (auth, feed, posts, likes, profils, suppression) avec mesure de couverture
- **CI GitHub Actions** — lint, build et e2e bloquants sur chaque PR, installs durcis contre les attaques supply-chain

---

## Stack technique

| Côté | Outils |
| --- | --- |
| **Frontend** | React 19, TypeScript 6, Vite 8, React Router 7, Astryx Design + StyleX |
| **Backend** | Node.js 22, Express 5, Prisma 5 (SQLite), Zod, JWT + bcrypt, Multer + Sharp |
| **Contrats** | `@petcircle/contracts` — types et schémas partagés entre le front et le back |
| **Qualité** | oxlint, Playwright + nyc, GitHub Actions, SonarCloud |
| **Déploiement** | Docker multi-stage, Nginx, docker compose |

---

## Démarrage rapide

### Prérequis

- Node.js 22 (`backend/.nvmrc`)
- npm 10+

### Installation

```bash
git clone https://github.com/TheMicStudio/PetCircle.git
cd PetCircle
npm install
```

### Backend (API)

```bash
cp backend/.env.example backend/.env
cd backend
npx prisma migrate dev
npm run seed
cd ..
npm run dev:backend      # API sur http://localhost:3000
```

### Frontend

```bash
npm run dev:frontend     # interface sur http://localhost:5173
```

Le front proxifie ses appels vers l'API (`vite.config.ts`) : aucune URL à configurer.

### Docker

```bash
cp .env.example .env     # définir JWT_SECRET
docker compose up --build
```

L'application complète est servie sur `http://localhost:8080`.

---

## Comptes de test

Le seed crée 50 utilisateurs et 500 posts. Comptes fixes, mot de passe commun
`password123` :

| Email | Rôle |
| --- | --- |
| `alice@test.com` | Utilisateur |
| `bob@test.com` | Utilisateur |
| `admin@test.com` | Admin |

---

## Tests et qualité

```bash
npm run lint             # oxlint sur tous les workspaces
npm run test:e2e         # suite Playwright (démarre l'API et le front)
npm run coverage:e2e     # rapport de couverture nyc
```

La CI rejoue lint, build et e2e sur chaque push et chaque PR ; le rapport Playwright
et la couverture sont publiés en artefacts.

---

## Architecture

```text
PetCircle/
├── backend/              API Express + Prisma, un module par domaine
├── frontend/             React 19, organisation par feature
├── packages/contracts/   types et schémas partagés front / back
├── e2e/                  tests Playwright
├── docker/               configuration Nginx
└── .github/workflows/    CI
```

Deux documents de référence :

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — où mettre chaque nouveau fichier, back comme front
- [`AUDIT.md`](AUDIT.md) — revue du backend fourni : failles, volumétrie, plan de découpage

---

## Flux de développement

1. Une branche par story : `feat/s3-feed`
2. Aucun commit direct sur `main` : toute PR est relue par un autre membre avant merge
3. La CI (lint + build + e2e) doit être verte avant merge

---

## Équipe

| Membre | GitHub |
| --- | --- |
| Mateis Bourlet | [@BourletMateis](https://github.com/BourletMateis) |
| Clément Le Goffic | [@Cl3m3nt03](https://github.com/Cl3m3nt03) |
| Mathys | [@zinackes](https://github.com/zinackes) |
| Inès | [@djelines](https://github.com/djelines) |

Projet réalisé à la Coding Factory (ESIEE-IT) — sujet de Thomas Diaconu.
