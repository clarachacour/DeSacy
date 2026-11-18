# De Sacy – site

Site de De Sacy Artwork et De Sacy Studio, construit avec [Astro](https://astro.build) et hébergé sur Vercel.

## Ajouter ou modifier une œuvre

Le plus simple : se connecter sur https://app.pagescms.org avec le compte GitHub et ouvrir le dépôt `desacy` (configuration dans `.pages.yml`).

À la main :


1. Mettre la photo dans `src/assets/artworks/` (JPG, fond blanc pour la photo principale).
2. Créer ou modifier un fichier dans `src/content/artworks/`, par exemple `la-surfeuse.md` :

```md
---
title: "La surfeuse"
series: "Life in movement"   # ou "Nature"
order: 2                     # position dans la galerie
year: 2026
width: 80
height: 80
depth: 12
medium: "Powder-coated steel"
edition: "Edition of 20"     # facultatif
status: "available"          # facultatif : available, sold ou commissioned
image: "../../assets/artworks/la-surfeuse.jpg"
room: "../../assets/artworks/room-la-surfeuse.jpg"   # facultatif
featured: true               # facultatif : affichée dans « Recent works »
---
Description de l'œuvre.
```

Le nom du fichier devient l'adresse de la page : `/artwork/la-surfeuse`.

## Formulaires (Brevo)

Les formulaires envoient les demandes par email avec Brevo. Dans Vercel, Settings → Environment Variables, renseigner les variables listées dans `.env.example`.

## Commandes

- `npm install` puis `npm run dev` : site en local sur http://localhost:4321
- `npm run build` : construit le site
