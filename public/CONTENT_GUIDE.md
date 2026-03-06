# Content & Assets Guide

Add your images and logos here. The site reads from Supabase (when configured) or falls back to `src/content/site-content.ts`.

**Edit content via the CMS:** Sign in at `/cms` (see `docs/CMS_SETUP.md`).

## Folder Structure

```
public/
├── images/
│   ├── hero/           Hero background slideshow (landscape, ~2000px wide)
│   │   ├── hero-1.jpg
│   │   ├── hero-2.jpg
│   │   └── ...
│   ├── services/       Service card images
│   │   ├── led-walls.jpg
│   │   ├── lighting.jpg
│   │   ├── stage.jpg
│   │   └── audio.jpg
│   └── work/           Featured project images
│       ├── project-1.jpg
│       ├── project-2.jpg
│       └── ...
└── logos/
    ├── company/        Your brand logo (SVG or PNG)
    │   ├── logo.svg
    │   └── logo-dark.svg   (optional, for dark backgrounds)
    └── clients/       Client logos for Work section marquee
        ├── client-1.svg
        ├── client-2.png
        └── ...
```

All image paths are configured in `src/content/site-content.ts`. Add files to the folders above, then update the paths in that file.

## Quick Reference

| Asset           | Location              | Recommended Size      |
|----------------|----------------------|------------------------|
| Hero images    | `images/hero/`       | 1920×1080 or larger   |
| Service images | `images/services/`  | 1200×800 landscape    |
| Project images | `images/work/`       | 800×600 or 1200×800   |
| Company logo   | `logos/company/`     | SVG or PNG, ~200px     |
| Client logos   | `logos/clients/`      | SVG or PNG, ~120px h   |

## Enabling Your Company Logo

Edit `src/content/site-content.ts`:

```ts
brand: {
  logo: '/logos/company/logo.svg',
  logoDark: '/logos/company/logo-dark.svg',  // optional
  ...
}
```

## Adding Project / Work Images

In `site-content.ts` → `work.projects`, set each project's `image` to your local path:

```ts
{
  id: 1,
  title: 'Your Project Name',
  category: 'Category label',
  image: '/images/work/project-1.jpg',  // add file to public/images/work/
  size: 'col-span-1 md:col-span-2',
}
```

## Adding Client Logos

In `site-content.ts`, replace text entries with logo objects:

```ts
clients: [
  { type: 'logo', src: '/logos/clients/acme.svg', alt: 'Acme Corp' },
  { type: 'text', value: 'OTHER_CLIENT' },  // text fallback
  ...
]
```
