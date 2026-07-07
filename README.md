# Ata Atelier — Sitio + Invitaciones RSVP (versión React, Cloudflare Workers)

Migración del sitio de HTML/JS plano a **React + Vite**, desplegado en el
plataforma unificada de **Cloudflare Workers** (no la versión clásica de
"Pages"). Se mantiene la misma idea central: cada invitación es una carpeta
de configuración bajo `public/events/`, sin tocar código para agregar un
evento nuevo.

## Importante: tu proyecto es un "Worker", no un "Pages" clásico

Si conectaste tu repo a Cloudflare y tu pantalla de Build muestra
`Deploy command: npx wrangler deploy` (en vez de opciones de "Framework
preset" y "Build output directory" en un menú desplegable), tu proyecto usa
la plataforma nueva unificada de Workers. Es totalmente normal — solo
significa que la configuración de dónde están tus archivos construidos vive
en un archivo `wrangler.jsonc` dentro del repo, en vez de en el dashboard.

Por eso este proyecto incluye:

- **`wrangler.jsonc`** — le dice a Cloudflare que los archivos estáticos
  están en `./dist` (lo que genera `npm run build`), y que las peticiones a
  `/rsvp` deben pasar primero por el Worker (`src/worker.js`) antes de
  servir el archivo estático.
- **`src/worker.js`** — reemplaza lo que antes era `functions/rsvp.js`. Hace
  exactamente lo mismo (inyectar los meta tags de WhatsApp/redes por
  evento), solo que escrito como un Worker script en vez de una Pages
  Function.

No necesitas tocar nada en el dashboard de Cloudflare más allá de lo que ya
configuraste (dominio, custom domain). El **Build command** que ya tienes
(`npm run build`) sigue siendo correcto — solo asegúrate de que exista este
`wrangler.jsonc` en la raíz del repo para que `npx wrangler deploy` sepa qué
desplegar.

## Qué cambió vs. la versión anterior

- El HTML/CSS/JS a mano ahora es una app de React con componentes reutilizables
  (`MusicChoiceScreen`, `LoadingScreen`, `InvitationCard`, `ActionButtons`,
  `RsvpForm`, etc.) — mucho más fácil de extender con formularios y diseños nuevos.
- Ahora hay un **paso de build** (`npm run build`) antes de desplegar.
- `functions/rsvp.js` (Pages Functions) fue reemplazado por `src/worker.js`
  (Worker script), configurado vía `wrangler.jsonc`.
- El sistema de "un evento = una carpeta + `config.json`" sigue funcionando igual.

## Estructura

```
ataatelier-site/
├── wrangler.jsonc               ← config del Worker: dónde están los assets, qué rutas pasan por el Worker
├── index.html                  ← entrada de la página principal (Vite)
├── rsvp/
│   └── index.html              ← entrada de la página de invitación (Vite)
├── src/
│   ├── worker.js                ← Worker script: inyecta meta tags de WhatsApp para /rsvp
│   ├── main.jsx                ← arranca la página principal
│   ├── rsvp-main.jsx           ← arranca la página de invitación
│   ├── Home.jsx
│   ├── RsvpPage.jsx            ← arma todos los pedazos de la invitación
│   ├── components/
│   │   ├── MusicChoiceScreen.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── ErrorScreen.jsx
│   │   ├── InvitationCard.jsx
│   │   ├── ActionButtons.jsx
│   │   ├── MusicToggle.jsx
│   │   └── RsvpForm.jsx        ← formulario de ejemplo, listo para extender
│   ├── hooks/
│   │   ├── useEventConfig.js   ← lee ?e= y carga events/<slug>/config.json
│   │   ├── useImagePreloader.js
│   │   └── useYoutubeMusic.js
│   └── styles/
│       ├── rsvp.css
│       └── home.css
├── public/
│   └── events/
│       └── fiesta-aura/
│           ├── config.json
│           ├── background.jpg
│           ├── invitation-image.png
│           └── loading-screen.jpg
├── vite.config.js
└── package.json
```

## Cómo agregar una invitación nueva

Igual que antes: crea una carpeta en `public/events/<slug>/` con sus imágenes
y un `config.json`:

```json
{
  "background": "background.jpg",
  "loadingScreen": "loading-screen.jpg",
  "invitationImage": "invitation-image.png",
  "pageTitle": "Boda María & José",
  "ogDescription": "¡Estás invitado/a a nuestra boda! Confirma tu asistencia aquí.",
  "confirmarLink": "https://wa.me/50600000000?text=Tu%20mensaje%20aqui",
  "ubicacionLink": "https://www.waze.com/es-419/live-map/directions?to=ll.LAT%2CLNG",
  "musicVideoId": "opcional-id-de-youtube"
}
```

Y quedará disponible en `ataatelier.com/rsvp?e=<slug>` después de tu próximo push.

## Formularios y diseños nuevos

`RsvpForm.jsx` es un punto de partida mínimo (nombre + número de invitados).
Para extenderlo:

- Agrega los campos que necesites (restricciones alimenticias, acompañantes,
  elección de menú, etc.) siguiendo el mismo patrón de `useState`.
- Si necesitas que las respuestas se guarden en algún lado (Google Sheets,
  Supabase), lo más limpio es crear otra Cloudflare Pages Function, por ejemplo
  `functions/rsvp-submit.js`, que reciba el POST del formulario y lo guarde —
  avísame cuando quieras avanzar con esa parte y lo armamos juntos.
- Si necesitas diseños/wireframes muy distintos entre eventos (no solo cambiar
  colores/imágenes), lo natural es agregar un campo `"layout"` al `config.json`
  de cada evento y renderizar un componente de layout distinto según ese valor
  dentro de `RsvpPage.jsx`.

## Desarrollo local

```bash
npm install
npm run dev
```

Esto levanta un servidor local (usualmente `http://localhost:5173`). Prueba:
- `http://localhost:5173/` → página principal
- `http://localhost:5173/rsvp/index.html?e=fiesta-aura` → invitación
  (en desarrollo local la URL incluye `/index.html`; en producción, gracias a
  Cloudflare, funciona como `/rsvp?e=fiesta-aura` sin esa parte)

## Desplegar (build + Cloudflare Workers)

1. Sube el proyecto a GitHub igual que antes:

```bash
git init
git add .
git commit -m "Migración a React + Vite + Cloudflare Workers"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/ataatelier-site.git
git push -u origin main
```

2. En tu Worker en Cloudflare (Workers & Pages → tu proyecto → **Settings > Build**),
   confirma que:
   - **Build command:** `npm run build`
   - **Deploy command:** `npx wrangler deploy` (probablemente ya está así por defecto)

   No hay que configurar "Framework preset" ni "Build output directory" en
   el dashboard — esa información ahora vive en `wrangler.jsonc`, que ya
   está incluido en este proyecto.

3. Guarda (si cambiaste algo) y espera el próximo build — Cloudflare instalará
   dependencias, correrá `npm run build`, leerá `wrangler.jsonc`, y desplegará
   `dist/` junto con `src/worker.js`. El dominio y el custom domain que ya
   configuraste siguen funcionando igual, no hay que tocarlos.

Cualquier `git push` a `main` vuelve a construir y desplegar automáticamente.
