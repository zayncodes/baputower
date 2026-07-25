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
- All Bapu Tower photography is the site owner's own:
  - `assets/img/bapu-tower-copper.jpg` — hero panel (the copper crown at golden hour)
  - `assets/img/bapu-tower-landmark.jpg` — "The Address" section background (the tower over the Gardanibagh lawns)
  - `assets/img/bapu-tower-night.jpg` — "Our Story" ambient background art (tower lit at night)
- The contact section embeds a live Google Map of the real Bapu Tower, Gardanibagh.
- The reservation form is a front-end demo; wire it to a booking backend
  (or a service like SevenRooms/Resy) for production.
