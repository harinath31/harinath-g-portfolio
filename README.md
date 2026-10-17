# Harinath G — Portfolio

An IDE-themed developer portfolio built with **Angular 19, TypeScript, RxJS and SCSS**, with dark and light themes.

Each section is a "file" in one of my languages:

| File | Section | Built with |
|---|---|---|
| `Harinath.cs` | Intro with a typing C# class | RxJS `interval` stream |
| `experience.sql` | Work timeline | Angular control flow |
| `skills.json` | Grouped skills | Data-driven chips |
| `projects.ts` | BoldDesk project | — |
| `main.dart` | Flutter snippet + interactive phone mockup | Angular signals |
| `api.http` | Postman-style playground returning my resume as JSON | RxJS `Subject` + `switchMap` |
| `contact.http` | Contact form | Netlify Forms + RxJS |
| Terminal | Commands: `help`, `ls`, `open <section>`, `resume`, `theme`, `contact`, `clear` | RxJS `scan` |

All resume content lives in **`src/app/data/resume.ts`**: edit it there and the whole site updates.

## Run locally

```bash
npm install
npm start          # http://localhost:4200
npm run build      # output: dist/harinath-portfolio/browser
```

## Deploy to Netlify

**Option A: Git (recommended, auto-deploys on every push)**
1. Push this folder to a GitHub repo.
2. Netlify → *Add new site* → *Import an existing project* → choose the repo.
3. Netlify reads `netlify.toml` (build `npm run build`, publish `dist/harinath-portfolio/browser`). Click **Deploy**.

**Option B: Drag and drop**
1. Run `npm run build`, or use the ready-made `harinath-portfolio-dist.zip`, unzipped.
2. Netlify → *Add new site* → *Deploy manually* → drag in the `browser` folder.

**Contact form:** after the first deploy, open *Site configuration → Forms* in Netlify and enable form detection. Messages then appear under *Forms → contact*. You can add an email notification there too.

## Update the resume PDF

Replace `public/Harinath_G_Resume.pdf`, keeping the same file name, and redeploy.
