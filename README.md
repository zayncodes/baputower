# Beyond Dining — Pure Vegetarian Restaurant & Café · Bapu Tower, Patna

A premium single-page website for **Beyond Dining**, a 100% pure-vegetarian
fine-dining restaurant and artisan café at Bapu Tower, Patna. The brand line is
**"Where Patna meets the sky."**

## Running locally

Any static server works. With Node installed:

```sh
npx serve -l 4173 .
```

Then open http://localhost:4173.

## Structure

```
index.html      — all sections, semantic markup
css/style.css   — design system (palette, type, spacing) + section styles
js/main.js      — animation & interaction engine
```

## Stack

- **GSAP 3 + ScrollTrigger** (CDN) — preloader sequence, text reveals, image masks,
  parallax, counters, velocity-reactive marquee
- **Lenis** (CDN) — smooth scrolling
- **Fraunces + Manrope** via Google Fonts
- No build step; plain HTML/CSS/JS

## Notes

- All animations respect `prefers-reduced-motion`; the custom cursor only mounts on
  fine-pointer devices.
- Food/interior photography is representational placeholder imagery from Unsplash —
  replace with final brand photography before launch.
- Real Patna photography (hero + Bapu Tower section) is from Wikimedia Commons under
  CC BY-SA 3.0: "GOLGHAR AT SUNSET LIGHT" by Aryan ghosh and "View of the Ganges from
  top of Golghar" by Wikirapra. Attribution is in the site footer — keep it if you keep
  the photos.
- No freely-licensed photograph of Bapu Tower itself exists yet (news/Tripadvisor
  images are copyrighted). When you have your own shot of the tower, drop it in as
  `assets/img/patna-golghar-sunset.jpg`'s replacement and update the hero `<img>` src,
  alt, and caption in `index.html` — one tag, nothing else changes.
- The contact section embeds a live Google Map of the real Bapu Tower, Gardanibagh.
- The reservation form is a front-end demo; wire it to a booking backend
  (or a service like SevenRooms/Resy) for production.
