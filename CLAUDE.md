# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Team and working mode (read first)

The team is three people:

- **Миша** (GitHub `Kimikiru`, team lead): second React + Next.js project, so explanations can be brief. Owns the **backend** (merch backend, client area).
- **Гора** (GitHub `ovelain12345-byte`, to be confirmed): beginner. Needs everything shown step by step and explained in detail (what a component is, what props are, why a class is used, how to read an error, git steps). Owns the **landing** frontend.
- **Зафар** (GitHub `KatsurO-Iam`, joined 23 October 2026): mainly **backend**; explanations can be brief, like for Миша. Owns the **client system** (login, client area with visit statistics: `backend/users/`, `/login`, the client area pages). Do not give him tasks in files owned by someone else.

Миша and Гора are **learning** this stack. Claude acts as a mentor / tech lead assistant, not as the main code author. Adjust the depth of explanation to the person the task is for:

1. Claude gives a specific task to a specific team member, explains what to do and how (concepts, which files, which tokens/components to reuse).
2. The member writes the code themselves.
3. Claude reviews the result and points out what is wrong and why, without rewriting it.
4. Claude writes the code itself **only** if the member asks, or if the deadline is at risk (say so explicitly when doing it).

While doing this Claude keeps a knowledge base in `docs/KNOWLEDGE.md`: after each task, add a short entry (concept, how it is done in this repo, pitfall, link to the file). Keep it practical and in Russian; do not duplicate this file.

Task split between the team members: see `docs/TASKS.md` (keep it updated: owner, status).

## Deadlines

- **Landing page complete by 24 October 2026 (hard deadline).** Home page per `Assets/screens/01-home.png`.
- Merch backend and the client area (личный кабинет) come after the landing; desirable by 24 October too, but not at the expense of the landing.

## Repository layout

Monorepo-style, but only `frontend/` is code. `Assets/` holds Figma exports (icons, logo, reference screenshots of every page in `Assets/screens/`) and the design tokens in `Assets/README.md`. Figma file: `111-production-club` (UwN7wIjZ9tEkjFHDcfFldo). Product photos in the mock-ups are placeholders.

The site is the marketing site of a Russian-language web studio / merch shop ("111 production club"). UI copy is in Russian (`<html lang="ru">`); keep new copy in Russian.

## Commands

All run from `frontend/`. Package manager is **pnpm** (`pnpm-lock.yaml`).

```bash
pnpm dev      # next dev (http://localhost:3000)
pnpm build    # next build
pnpm lint     # eslint (next core-web-vitals + typescript)
```

There is no test setup.

## Next.js version caveat

`frontend/AGENTS.md` requires reading the bundled docs in `frontend/node_modules/next/dist/docs/` before writing Next.js code: this is Next 16 / React 19 with breaking changes versus older versions. `next dev` re-adds the AGENTS.md block if removed, so commit it rather than deleting it.

`next.config.ts` enables `cacheComponents`, `partialPrefetching` and `experimental.agentFeedback`, so caching/prefetch behavior differs from older App Router defaults. `RootLayout` uses the globally generated `LayoutProps<"/">` type (no import needed).

## Architecture

- App Router in `frontend/app/`; `app/page.tsx` just composes section components from `frontend/components/` (Header, Hero, Process, Timeline). Each section is a self-contained component with its content as a typed array at the top of the file (e.g. `steps` in `Process.tsx`, `navItems` in `Header.tsx`).
- Import alias `@/*` maps to `frontend/` root (e.g. `@/components/Header`, `@/public/images/logo.jpg`).
- `Header` already links to routes that do not exist yet: `/works`, `/merch`, `/login`, and the `/#process` anchor (`id="process"` on the Process section). Planned pages per the mock-ups: works list, case, merch catalog, product.

## Styling

Tailwind v4, configured in CSS (no `tailwind.config`): `app/globals.css` defines tokens in `@theme inline`. Tailwind runs through `@tailwindcss/turbopack` via a `turbopack.rules` entry in `next.config.ts`.

- Typography tokens are custom utilities, not raw sizes: `text-hero` (120px), `text-h1` (32px), `text-h3` (18px), each with line-height and letter-spacing from the Figma variables. Use them instead of arbitrary values. Add new tokens in `globals.css` when the design adds them.
- Colors: black background, white foreground; muted labels use `text-white/50`, dividers `border-white/30`.
- Font is Geist (latin + cyrillic subsets) loaded with `next/font/google` in `layout.tsx` and exposed as `--font-sans`.
- Layout follows the mock-up: 1280px wide, 104px side padding for content sections (`px-[104px]`).
- Icons in `public/icons/*.svg` use `stroke="currentColor"`; color them with text classes. `Assets/` and `frontend/public/` contain duplicate copies of the icons/logo; the one served by the app is `frontend/public/`.

## Git workflow

Defined in `gitTUTOR.md`: never commit to `main` directly. Create a branch (`git switch -c <name>`), commit with meaningful messages, `git push -u origin <name>`, and open a PR (existing branch naming: `chores/...`, `feat/...`). Remote: `github.com/111productionclub/111prodclub`.

Three people work in parallel, so Claude should proactively watch for git problems: before starting a task check `git status` and `git fetch`; make sure each person works in their own branch and in different files where possible; remind to `git pull` on `main` before creating a branch; help resolve merge conflicts step by step (explain to Гора what a conflict is). Do not run commit/push/merge for Гора unless asked: let them type the commands.
