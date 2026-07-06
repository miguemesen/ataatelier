# Ata Atelier — Sitio + Invitaciones RSVP

Sitio estático (sin build step) que sirve `ataatelier.com` y un sistema reusable de invitaciones en `ataatelier.com/rsvp?e=<slug-del-evento>`.

## Cómo funciona

- `rsvp/index.html` es **una sola plantilla** para todas las invitaciones. Lee el parámetro `?e=` de la URL (ej. `?e=fiesta-aura`) y carga la configuración e imágenes desde `events/<slug>/`.
- Cada evento vive en su propia carpeta bajo `events/`, con sus propias imágenes y un `config.json` con los links de WhatsApp/Waze y qué imágenes usar.
- Para agregar una invitación nueva **no tocas código**: solo agregas una carpeta nueva en `events/`.

## Estructura

```
ataatelier-site/
├── index.html                     ← página principal de ataatelier.com
├── rsvp/
│   └── index.html                 ← plantilla reusable de invitación
└── events/
    └── fiesta-aura/
        ├── config.json
        ├── background.jpg
        ├── invitation-image.png
        └── loading-screen.jpg
```

## Agregar una nueva invitación

1. Crea una carpeta nueva dentro de `events/`, con un nombre corto (el "slug"), por ejemplo `events/boda-maria-jose/`.
2. Copia ahí tus 3 imágenes (background, invitation-image, loading-screen). Pueden tener cualquier nombre de archivo, mientras coincida con el `config.json`.
3. Crea un `config.json` dentro de esa carpeta, copiando y editando este formato:

```json
{
  "background": "background.jpg",
  "loadingScreen": "loading-screen.jpg",
  "invitationImage": "invitation-image.png",
  "pageTitle": "Boda María & José",
  "confirmarLink": "https://wa.me/50600000000?text=Tu%20mensaje%20aqui",
  "ubicacionLink": "https://www.waze.com/es-419/live-map/directions?to=ll.LAT%2CLNG"
}
```

4. Sube los cambios (`git add . && git commit -m "Nueva invitación: boda-maria-jose" && git push`).
5. La invitación queda disponible automáticamente en:
   `https://ataatelier.com/rsvp?e=boda-maria-jose`

No necesitas volver a configurar nada en Cloudflare — cada push a `main` redeploya el sitio completo.

## Recomendación de tamaño/formato de imágenes

Para que cargue rápido en celular:
- `background` y `loading-screen`: JPG, ancho máximo ~1200px, calidad ~80.
- `invitation-image`: PNG si necesita transparencia, ancho máximo ~1000px.

## 1. Subir a GitHub

```bash
git init
git add .
git commit -m "Sitio Ata Atelier + primera invitación"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/ataatelier-site.git
git push -u origin main
```

## 2. Desplegar en Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
2. Selecciona el repositorio `ataatelier-site`.
3. Configuración de build:
   - **Framework preset:** None
   - **Build command:** (vacío)
   - **Build output directory:** `/`
4. **Save and Deploy**. Te dará una URL `*.pages.dev` de prueba.

## 3. Conectar ataatelier.com

Como el dominio no apunta a nada todavía:

1. En Cloudflare, agrega `ataatelier.com` como sitio en tu cuenta (si aún no lo está) y actualiza los nameservers en tu registrador (GoDaddy, Namecheap, etc.) a los que Cloudflare te indique. Esto puede tardar unas horas en propagar.
2. Dentro del proyecto de Pages → pestaña **Custom domains** → **Set up a custom domain** → escribe `ataatelier.com` (y opcionalmente `www.ataatelier.com`).
3. Cloudflare configura el DNS y el certificado HTTPS automáticamente ya que el dominio está en su red.
4. Cuando propague, `https://ataatelier.com` mostrará la página principal, y `https://ataatelier.com/rsvp?e=fiesta-aura` mostrará la invitación de Aura.

## Actualizar el sitio después

Cualquier `git push` a `main` redeploya todo automáticamente.
