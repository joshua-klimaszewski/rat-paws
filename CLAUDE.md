# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **brutalist, experimental band website** for Rat Paws, built with React + Vite and deployed to GitHub Pages via GitHub Actions.

**Design Philosophy:**

- High contrast black/white color scheme with strategic accent color
- Oversized, bold typography (100px+ headings)
- Asymmetrical, experimental layouts
- Raw structural honesty - no rounded corners, shadows, or gradients
- Custom cursor and thoughtful animations using Framer Motion
- Section expansion/transition animations on scroll

**Inspired by:** mirelleborra.com, 56.digital, anorakfilm.com, eilidhduffy.com

## Tech Stack

- **React 18** - Component architecture
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library for smooth transitions
- **CSS Modules** - Component-scoped styling
- **GitHub Actions** - Automated build and deployment
- **GitHub Pages** - Static hosting

## Development

### Local Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build locally
```

### Project Structure

```
src/
  components/
    Hero.jsx           - Full-viewport hero with massive typography
    About.jsx          - Band bio and member cards
    Music.jsx          - Discography and streaming links
    Shows.jsx          - Tour dates table
    ShowJournal.jsx    - Individual show journal page
    showsData.js       - Shared show data for Shows and ShowJournal
    Gallery.jsx        - Photo/video grid with fullscreen expansion
    Contact.jsx        - Contact info and merch links
    Navigation.jsx     - Fixed navigation with smooth scroll
    CustomCursor.jsx   - Custom cursor component
  styles/
    global.css         - Global brutalist styles
    variables.css      - CSS variables (colors, spacing, typography)
  App.jsx              - Main app component
  main.jsx             - React entry point
```

## Page Architecture

### Routes

- `/` - Hero page
- `/about` - Band bio
- `/music` - Discography
- `/shows` - All shows list
- `/shows/:slug` - Individual show journal page
- `/gallery` - Photo/video gallery

### Adding a New Show

1. **Add to shows array** in `src/components/showsData.js`:

   ```js
   {
     date: 'YYYY-MM-DD',
     venue: 'VENUE NAME',
     location: 'CITY, STATE',
     with: 'OTHER ACTS',  // optional
     slug: 'venue-name',  // lowercase, hyphenated
   }
   ```

2. **For past shows with photos**, add journal data:

   ```js
   journal: {
     blurb: 'Show recap text...',
     photoCredit: { name: '@photographer', url: 'https://...' },
     photos: ['1.jpg', '2.jpg', '3.jpg']
   }
   ```

3. **Add images** to `/public/[slug]/` folder (e.g., `/public/paris-bar/`)

### Show Journal Page Behavior

- Past shows without journals show "NO PHOTOS YET" placeholder
- Past shows with journals show blurb + photo grid with lightbox
- Future shows are not clickable (no journal pages)

## Deployment

- Deployment is **automatic** on every push to the `main` branch via GitHub Actions workflow at [.github/workflows/deploy.yml](.github/workflows/deploy.yml)
- The workflow:
  1. Sets up Node.js (v20)
  2. Runs `npm ci` to install dependencies
  3. Runs `npm run build` to create production bundle
  4. Deploys `dist/` folder to GitHub Pages
- Can also be triggered manually via workflow_dispatch
- GitHub Pages must be configured in repository Settings → Pages with source set to "GitHub Actions"

## Design System

### Color Palette

- **Black**: `#000000` - Primary text, backgrounds
- **White**: `#FFFFFF` - Backgrounds, text on black
- **Accent**: `#AD34E5` (purple) or `#FF0000` (red) - Interactive elements, highlights

### Typography

- **H1**: 100px+ desktop, 48px mobile (band name)
- **H2**: 60-80px desktop, 36px mobile (section titles)
- **H3**: 40-50px desktop, 24px mobile
- **Body**: 16-18px
- **Font**: System sans-serif (Helvetica, Arial) or custom web font

### Layout Principles

- NO rounded corners - sharp, 90-degree angles only
- NO shadows - flat, 2D aesthetic
- NO gradients - solid colors only
- Large section padding: 120px+ desktop, 60px mobile
- Asymmetrical grids and spacing
- Content can overlap and bleed

### Animations (Framer Motion)

- Section entrance: Scale from 0.8 to 1, opacity 0 to 1
- Hover states: Scale 1.05 or color shift to accent
- Custom cursor: Follows mouse, reacts to hovers
- Gallery expansion: Fullscreen overlay with AnimatePresence
- Cubic-bezier easing: `cubic-bezier(0.22, 1, 0.36, 1)`

## Content Placeholders

All content uses brutalist-styled placeholders:

**Text:**

- Band bio: Provocative placeholder text (ALL CAPS)
- Members: "MEMBER 01", "MEMBER 02" or placeholder names
- Albums: "UNTITLED RELEASE 001", "DEMO 2025"
- Shows: Future dates (e.g., "2026-03-15")

**Visuals:**

- Member photos: Black rectangles with white text labels ("BASS", "DRUMS", "VOCALS")
- Album artwork: Black/accent-colored rectangles
- Gallery: Black rectangles labeled "PHOTO 01", "PHOTO 02"

**Links:**

- Social: Real platform URLs or `#` placeholders
- Email: `booking@ratpaws.com` (placeholder mailto)
- Merch: `#` placeholder links

## Custom Domain Setup

To configure a custom domain:

1. Create a `CNAME` file in the repository root containing only the domain name (e.g., `example.com` or `www.example.com`)
2. Configure DNS at the domain registrar:
   - For apex domains: Add 4 A records pointing to GitHub's IPs (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
   - For subdomains: Add CNAME record pointing to `<username>.github.io`
3. After deployment, configure the custom domain in GitHub Settings → Pages

## Accessibility

- Semantic HTML5 elements (header, nav, main, section, footer)
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text on all images/placeholders
- ARIA labels for navigation and interactive elements
- High color contrast (WCAG AAA - black/white 21:1 ratio)
- Keyboard navigation with visible focus indicators
- Respect `prefers-reduced-motion` media query
- Custom cursor disabled on touch devices

## Future Enhancements

- Real content (photos, album artwork, show dates)
- Contact form backend integration
- Music player embeds (Spotify, Bandcamp)
- Mailing list signup (Mailchimp)
- CMS integration for easy content updates
- Advanced animations with GSAP
- Three.js 3D elements (optional)
- Analytics integration

## Additional Documentation

For detailed implementation guides, see:

- **[Dangling Letters Feature Guide](docs/dangling-letters-guide.md)** - Step-by-step implementation of the interactive physics-based hero animation
- **[Complete Implementation Plan](docs/implementation-plan.md)** - Comprehensive plan for building the entire website from scratch
