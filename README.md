# Portfolio website

A bilingual portfolio and blog built with Next.js, React, Tailwind CSS, and Sanity. The website runs on Cloudflare Workers through OpenNext.

[Live website](https://ardaabaci.com)

## Features

- English by default, with Turkish available under `/tr`.
- Profile, biography, skills, and project pages.
- Sanity-managed blog with custom content blocks and a table of contents.
- Homepage projects selected in Sanity or loaded from the five most recently updated public GitHub repositories.
- Recent GitHub activity across public repositories.
- Localized metadata, structured data, sitemap, and public content exports.

## Local development

Requires Node.js 22.12 or newer and npm.

```sh
npm install
npm install --prefix studio
```

Create `.env.local` using `.env.example`. Set the Sanity project ID and dataset to match the configuration in `studio/`. The GitHub token is optional.

Start the website at [localhost:3000](http://localhost:3000):

```sh
npm run dev
```

Start the standalone Sanity editor at [localhost:3333](http://localhost:3333):

```sh
npm run studio:dev
```

The editor requires a Sanity account with project access. Content is managed separately for English and Turkish.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run build` | Build the website |
| `npm start` | Serve the production build locally |
| `npm run lint` | Check code quality |
| `npm test` | Run tests |
| `npm run preview` | Preview the Cloudflare build |
| `npm run deploy` | Deploy the website to Cloudflare |
| `npm run studio:deploy` | Deploy the Sanity editor |

Website and Studio deployments are independent. See [Sanity setup](docs/sanity-setup.md) for content management, imports, environment variables, and publishing configuration.
