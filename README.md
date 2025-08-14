# Data Room Galian C

An interactive dashboard and data room for assembling a complete business plan for a quarry (known locally as *Galian C*). It allows you to track the readiness of key documents and datasets across geology, quality control, mine planning, plant design, operations, market analysis, finance, permits and governance. Users can upload evidence, link to source documents on Google Drive, simulate a simple financial model and visualise a Gantt‑style timeline.

## Getting Started

This project is built with [React](https://react.dev/) and [Vite](https://vitejs.dev/) and uses [Tailwind CSS](https://tailwindcss.com/) for styling. To work with this repository locally you will need Node.js ≥ 16.

### Installation

1. Clone the repository from GitHub:

   ```sh
   git clone https://github.com/your‑org/data-room-galian-c.git
   cd data-room-galian-c
   ```

2. Install the dependencies. All runtime packages (React, Recharts, Framer Motion, Lucide React, XLSX) and development tools (Vite, Tailwind CSS, TypeScript) are declared in `package.json`:

   ```sh
   npm install
   ```

### Development server

Start a development server with hot reloading:

```sh
npm run dev
```

Then open <http://localhost:5173> in your browser. Any changes you make to files in the `src` directory will automatically reload the page.

### Building for production

To create an optimised production build, run:

```sh
npm run build
```

This will emit a `dist` folder with static assets ready to be served. You can preview the production build locally using:

```sh
npm run preview
```

### Deployment

The project is a static site once built, so it can be hosted anywhere you would normally deploy a single‑page application (GitHub Pages, Vercel, Netlify, S3, etc.). A typical workflow for GitHub Pages might look like this:

```sh
npm run build
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh‑pages
```

Alternatively, configure your CI pipeline to run `npm run build` and publish the `dist` directory to your hosting provider.

## Structure

```
.
├── index.html              # Entry point for Vite
├── package.json            # Lists dependencies and scripts
├── postcss.config.js       # Config for Tailwind and autoprefixer
├── tailwind.config.js      # Tailwind theme and scanning paths
├── tsconfig.json           # TypeScript compiler options, including alias '@'
├── vite.config.ts          # Vite configuration (React plugin and path alias)
├── src/
│   ├── main.tsx            # Mounts the React application
│   ├── App.tsx             # Root component that renders the dashboard
│   ├── BisnisPlan.tsx      # The interactive dashboard ported from the provided TSX file
│   ├── index.css           # Tailwind directives
│   └── components/
│       └── ui/             # Minimal UI primitives used by the dashboard
│           ├── badge.tsx
│           ├── button.tsx
│           ├── card.tsx
│           ├── input.tsx
│           ├── select.tsx
│           ├── separator.tsx
│           └── switch.tsx
└── README.md
```

The large dashboard component from `bisnisplan.tsx` has been copied into `src/BisnisPlan.tsx` and minimally adapted for this project. It imports the UI primitives from `src/components/ui`. The alias `@/` points to the `src/` folder to keep import statements concise.

## Notes

* The UI components included here are simple wrappers around HTML elements with Tailwind utility classes. They do not implement all behaviours of the original ShadCN components but provide enough structure for the dashboard to render and be extended.
* If you wish to customise the look and feel further or swap out the UI primitives for a more fully featured library, adjust the files under `src/components/ui` accordingly.

Enjoy building and iterating on your quarry business plan dashboard!