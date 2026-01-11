# Complete Implementation Plan - Rat Paws Website

## Overview

Build an experimental, brutalist single-page website for the band "Rat Paws" inspired by sites like mirelleborra.com, 56.digital, anorakfilm.com, and eilidhduffy.com. The site will feature bold black/white design, oversized typography, asymmetrical layouts, and thoughtful animations/transitions.

## Requirements Summary

- **Layout**: Single-page with experimental section transitions and expansion animations
- **Sections**: About/Bio & Music, Shows & Events, Media Gallery, Contact & Merch
- **Design**: Brutalist aesthetic - high contrast black/white, bold typography, raw structural honesty
- **Content**: Placeholder content (to be replaced later)
- **Tech Stack**: React + Vite + Framer Motion
- **Deployment**: GitHub Pages with automated build via GitHub Actions

## Tech Stack Details

**Frontend Framework:**
- **React 18** - Component architecture and state management
- **Vite** - Fast build tool and dev server, optimized for GitHub Pages deployment
- **Framer Motion** - Production-ready animation library for smooth transitions and section expansions

**Styling:**
- **CSS Modules** or **Styled Components** - Scoped styling approach
- Custom CSS for brutalist aesthetic - no UI component libraries (raw, experimental design)

**Build & Deployment:**
- **GitHub Actions** - Automated build and deployment pipeline
- **GitHub Pages** - Free static hosting
- Modified workflow to: install deps → build React app → deploy dist folder

**Optional Enhancements:**
- **GSAP** - For advanced scroll animations if Framer Motion is insufficient
- **React Intersection Observer** - Trigger animations on scroll
- **React Router** - For hash-based routing between sections (optional)

## Critical Files

**New Files to Create:**
- `package.json` - Project dependencies and scripts
- `vite.config.js` - Vite configuration for GitHub Pages base path
- `src/App.jsx` - Main React component
- `src/main.jsx` - React entry point
- `src/components/` - Individual section components
- `src/styles/` - Global CSS and variables
- `.github/workflows/deploy.yml` - Modified deployment workflow (update existing)

**Files to Modify/Replace:**
- `index.html` - Will become Vite's HTML template (minimal, loads React bundle)
- `.github/workflows/deploy.yml` - Add build step before deployment

**Files to Keep:**
- `README.md` - Update with new tech stack info
- `CLAUDE.md` - Update deployment instructions

## Implementation Plan

### Phase 1: Project Setup & Infrastructure

#### 1.1 Initialize React + Vite Project

**Create**: Project structure

- Run `npm create vite@latest . -- --template react` in project root
- Install core dependencies:
  - `framer-motion` - Animation library
  - Development dependencies for linting/formatting (optional)
- Configure `vite.config.js` for GitHub Pages:
  - Set `base: '/rat-paws/'` (or repo name)
  - Configure build output to `dist/`
- Create project structure:
  ```
  src/
    components/
      Hero.jsx
      About.jsx
      Music.jsx
      Shows.jsx
      Gallery.jsx
      Contact.jsx
      Navigation.jsx
    styles/
      global.css
      variables.css
    App.jsx
    main.jsx
  ```

#### 1.2 Update GitHub Actions Workflow

**Modify**: `.github/workflows/deploy.yml`

- Add Node.js setup step (v18 or v20)
- Add build steps:
  ```yaml
  - npm ci
  - npm run build
  ```
- Deploy `dist/` folder instead of repository root
- Ensure proper permissions for GitHub Pages deployment

#### 1.3 Update Project Documentation

**Modify**: `README.md`, `CLAUDE.md`

- Document new tech stack (React, Vite, Framer Motion)
- Update local development instructions (`npm run dev`)
- Update deployment process (automatic on push to main)
- Note build requirements

### Phase 2: Brutalist Design System

#### 2.1 Global Styles & CSS Variables

**Create**: `src/styles/global.css`, `src/styles/variables.css`

Implement brutalist design foundations:

**Color Palette:**
- Pure black: `#000000` (primary text, backgrounds)
- Pure white: `#FFFFFF` (backgrounds, text on black)
- Accent color: Bold, high-contrast color (suggest: `#FF0000` red or `#AD34E5` purple like Mirelle Borra)
- No grays, no gradients - stark contrast only

**Typography:**
- Large, oversized headings:
  - H1: 100px+ desktop, 48px mobile (band name)
  - H2: 60-80px desktop, 36px mobile (section titles)
  - H3: 40-50px desktop, 24px mobile
- Body text: 16-18px with tight letter-spacing
- Font stack: System sans-serif (Helvetica, Arial) or consider custom font (e.g., "Space Grotesk", "Bebas Neue")
- Font weights: Bold (700) for headings, Normal (400) for body
- Tight line-height (1.1-1.2) for headings, normal (1.5) for body

**Spacing System:**
- Large section padding: 120px+ desktop, 60px mobile
- Asymmetrical spacing (break conventional grid)
- Visible gutters and structural spacing
- Variable spacing based on content, not uniform

**Layout Principles:**
- NO rounded corners - sharp, 90-degree angles only
- NO shadows - flat, 2D aesthetic
- NO gradients - solid colors only
- Experimental, asymmetrical grids
- Content bleeds and overlaps encouraged
- Text breaking across multiple lines unconventionally

#### 2.2 Custom Cursor Implementation

**Create**: Custom cursor component/CSS

- Implement custom cursor (large dot or crosshair)
- Hide default cursor (`cursor: none` on body)
- Track mouse position with React state
- Animate cursor with Framer Motion
- Change cursor on hover states (scale up, change color)

### Phase 3: Core Components & Sections

#### 3.1 Navigation Component

**Create**: `src/components/Navigation.jsx`

Brutalist navigation approach:
- Minimal, text-only navigation (no icons unless brutalist style)
- Position: Fixed or absolute (experimental placement - top-right, vertical side, etc.)
- Large, bold typography for nav links
- No background - transparent or solid black/white bar
- Hover states: Color shift to accent color, scale animation
- Click triggers smooth scroll + section expansion animation
- Active section indicator (bold, underline, or accent color)
- Mobile: Keep same aesthetic, possibly overlay menu with full-screen takeover

#### 3.2 Hero Section

**Create**: `src/components/Hero.jsx`

Full-viewport hero with impact:
- Band name "RAT PAWS" in massive typography (100-150px)
- Fractured/broken text layout (each word on different line, asymmetrical)
- Consider text rotation or vertical text orientation
- Paw emoji (🐾) as large graphic element (200px+)
- Minimal additional content - just name and maybe one-line descriptor
- Background: Solid black or white (alternate based on mood)
- Entrance animation: Letters scale/fade in with Framer Motion stagger
- Scroll indicator (custom designed - simple arrow or text "SCROLL")

#### 3.3 About/Bio Section

**Create**: `src/components/About.jsx`

Raw, experimental layout:
- Section expansion animation on scroll (starts collapsed/scaled, expands into view)
- Band bio in large paragraph text (24px+)
- Member cards with brutalist aesthetic:
  - No photos initially, or black/white high-contrast photos
  - Solid color blocks as placeholders (black rectangles)
  - Names in huge text overlaying blocks
  - Instruments/roles in smaller text below
- Asymmetrical grid - members not evenly spaced
- Text elements overflow and overlap intentionally
- Hover on member: Section expands, color shift, or detail reveal

#### 3.4 Music Section

**Create**: `src/components/Music.jsx`

Discography as bold statement:
- Album "cards" are large, stark rectangles (black or accent color)
- Album titles in huge text (50px+)
- Release dates in small, mono-spaced font
- No album artwork images - abstract placeholder shapes or solid colors
- Streaming platform links as simple text list (huge font size):
  - SPOTIFY
  - APPLE MUSIC
  - BANDCAMP
  - YOUTUBE
  - SOUNDCLOUD
- Links hover: Color invert or accent color shift
- Grid layout: Asymmetrical, varied sizes
- Section entrance: Albums slide/scale in with stagger animation

#### 3.5 Shows & Events Section

**Create**: `src/components/Shows.jsx`

Table/list with structural honesty:
- Large table with visible borders (thick black lines)
- Columns: DATE | VENUE | LOCATION | TICKETS
- Typography: All caps, mono-spaced or bold sans-serif
- Rows: High contrast (alternate black/white backgrounds or just black borders)
- Placeholder shows (3-5 entries with future dates)
- Hover on row: Background color shift, text scale, or expand row height
- "GET TICKETS" button: Simple rectangle, inverted colors on hover
- Mobile: Stack into cards but maintain table aesthetic (visible structure)
- Entrance animation: Table rows fade/slide up sequentially

#### 3.6 Media Gallery Section

**Create**: `src/components/Gallery.jsx`

Grid with visual impact:
- Photo grid: Varied sizes (masonry or CSS grid with different cell sizes)
- Placeholder images: Solid black rectangles with white text labels ("PHOTO 01", "PHOTO 02")
- No rounded corners, no shadows
- Grid gaps: Visible, consistent gutters (20-30px)
- Hover: Image scales slightly, or color overlay appears
- Click: Image expands to full-screen overlay (Framer Motion AnimatePresence)
- Video embeds: Large, prominent, black borders
- Entrance animation: Grid items stagger fade-in with scale

#### 3.7 Contact & Merch Section

**Create**: `src/components/Contact.jsx`

Raw information display:
- Split horizontally or vertically into CONTACT | MERCH subsections
- Large section titles (60px+)

**Contact:**
- Email in large text (30px+), clickable mailto link
- Social media as vertical or horizontal list:
  - Text-only links (no icons): "INSTAGRAM", "TIKTOK", "YOUTUBE", etc.
  - Hover: Accent color, underline, scale animation
- Mailing list: Simple text field + submit button (placeholder, note that backend needed)
  - Inputs: Black border, white background, large text
  - Submit: Black rectangle button, inverts on hover

**Merch:**
- "BUY MERCH" as huge headline
- Links to stores (BANDCAMP, CUSTOM STORE) in large text
- Placeholder merch items: Black rectangles with product names in white text
- Hover: Color shift or scale

#### 3.8 Footer

**Create**: Footer in `App.jsx` or separate component

Minimal footer:
- Black background, white text (or inverse)
- Copyright: "© 2026 RAT PAWS" in small text
- Social links repeated (small, text-only)
- "BACK TO TOP" link with smooth scroll
- Design credit (optional): "SITE BY [NAME]"

### Phase 4: Animation & Interaction Design

#### 4.1 Framer Motion Integration

Implement key animations using Framer Motion:

**Page Load:**
- Hero text staggers in (each letter or word)
- Navigation fades in
- Initial section reveals

**Section Transitions:**
- Intersection Observer triggers section entrance
- Scale transform: Sections start at `scale(0.8)` and animate to `scale(1)`
- Opacity: 0 → 1 transition
- Custom cubic-bezier easing: `cubic-bezier(0.22, 1, 0.36, 1)` (smooth, experimental)

**Hover States:**
- Scale animations on links/buttons: `scale(1.05)` or `scale(0.95)`
- Color transitions: `transition: color 0.3s ease`
- Custom cursor follows and reacts to hovers (scale up, color change)

**Click/Expansion:**
- Gallery images expand to fullscreen with AnimatePresence
- Navigation clicks trigger smooth scroll + section highlight animation
- Section expansion on click (optional): Click section title to expand/collapse details

**Scroll Effects (Optional):**
- Parallax on hero elements (subtle)
- Active section highlighting in navigation based on scroll position
- Progress indicator or scroll percentage display

#### 4.2 Experimental Interactions

Push brutalist boundaries:
- Glitch effects on hover (optional, text distortion)
- Cursor trail effect (fading dots following cursor)
- Text selection styling: Change background to accent color, white text
- Aggressive focus states (large outline, high contrast)
- Loading state: Simple text "LOADING..." in center, no spinners

### Phase 5: Responsiveness & Polish

#### 5.1 Mobile Responsive Design

Brutalist mobile approach:
- Same aesthetic, adjusted typography sizes
- Reduce heading sizes (H1: 48px, H2: 36px)
- Single-column layouts
- Navigation: Full-screen overlay menu or simple vertical list
- Touch targets: Minimum 44px
- Gallery: 1-2 columns instead of 3-4
- Tables: Stack into cards or horizontal scroll
- Custom cursor: Disable on mobile (touch devices)
- Maintain sharp aesthetics, no compromises

#### 5.2 Accessibility

Ensure brutalist design is accessible:
- Semantic HTML: header, nav, main, section, article, footer
- Heading hierarchy: Proper h1-h6 structure
- Alt text for all images (even placeholder boxes)
- ARIA labels for navigation, buttons, links
- Color contrast: Black/white already provides high contrast (WCAG AAA)
- Keyboard navigation: Visible focus indicators (thick accent color outline)
- Screen reader testing: Ensure content flow makes sense
- Reduced motion: Respect `prefers-reduced-motion` media query (disable animations)

#### 5.3 Performance Optimization

Keep site fast:
- Code splitting: Lazy load components if needed
- Image optimization: Use placeholder boxes (avoid large images initially)
- Minify CSS/JS in production build
- Font loading strategy: System fonts (no web fonts) or preload custom fonts
- Vite optimization: Automatic tree-shaking and minification
- Lighthouse audit: Aim for 90+ scores

#### 5.4 Browser Testing

Cross-browser compatibility:
- Test in Chrome, Firefox, Safari, Edge
- Verify Framer Motion animations work consistently
- Check custom cursor implementation (may need fallbacks)
- Ensure black/white contrast renders correctly
- Mobile browser testing (iOS Safari, Chrome Mobile)

## Content Placeholders

All content will be brutalist-styled placeholders:

**Text Content:**
- Band bio: Provocative, bold placeholder text (not Lorem Ipsum - use band-themed copy)
- Member names: "MEMBER 01", "MEMBER 02", etc. or actual placeholder names
- Album titles: "UNTITLED RELEASE 001", "DEMO 2025", etc.
- Show venues: "VENUE NAME", "LOCATION CITY"
- All text should be ALL CAPS or bold to match brutalist aesthetic

**Visual Placeholders:**
- Member photos: Solid black rectangles with white text labels ("BASS", "DRUMS", "VOCALS")
- Album artwork: Black or accent-colored rectangles (no images)
- Gallery images: Black rectangles with "PHOTO 01", "PHOTO 02" labels in white
- Video placeholders: Black rectangles with "VIDEO" label

**Links:**
- Social media: Use real platform URLs (instagram.com, spotify.com) or `#` placeholders
- Email: `booking@ratpaws.com` placeholder (mailto link)
- Merch store: `#` placeholder links

**Data:**
- Show dates: 3-5 placeholder events with future dates (e.g., "2026-03-15")
- Release dates: Fictional dates for albums
- Copyright year: 2026

## Implementation Notes

**Architecture Decisions:**
- Use CSS Modules for component-scoped styling (preferred) or Styled Components
- State management: React useState and useContext (no Redux needed for simple site)
- Routing: Not required (single page) unless implementing hash-based section routing
- Custom cursor implemented as global context/provider component

**Code Organization:**
- One component per section (Hero, About, Music, etc.)
- Shared components folder for reusable elements (Button, CustomCursor, etc.)
- Global styles in `src/styles/global.css`
- CSS variables in `src/styles/variables.css` for colors, spacing, typography

**Build Configuration:**
- Vite base path must match GitHub repository name
- Build output to `dist/` directory
- GitHub Actions deploys `dist/` to `gh-pages` branch or direct Pages deployment
- Environment variables (if needed) via `.env` files

**Best Practices:**
- Component composition over prop drilling
- Framer Motion variants for consistent animations
- Intersection Observer for scroll-triggered effects
- Responsive design using CSS media queries and React hooks for screen size detection
- Accessibility-first approach (semantic HTML, ARIA labels, keyboard nav)

## Verification & Testing

### Local Development Testing

1. **Setup & Build:**
   ```bash
   npm install
   npm run dev
   ```
   - Verify Vite dev server starts on localhost:5173
   - Check for console errors in browser dev tools
   - Hot module replacement (HMR) should work

2. **Visual & Functional Check:**
   - All sections render correctly (Hero, About, Music, Shows, Gallery, Contact)
   - Navigation links scroll to correct sections smoothly
   - Custom cursor follows mouse and reacts to hovers
   - Framer Motion animations trigger on scroll (section entrances)
   - Hover states work (color shifts, scale animations)
   - Gallery image click expands to fullscreen
   - Typography sizes match brutalist spec (100px+ hero, etc.)
   - Black/white color scheme is consistent
   - No rounded corners or shadows anywhere

3. **Responsive Testing:**
   - Test in browser dev tools device emulation:
     - Mobile: 375px width (iPhone SE)
     - Tablet: 768px width (iPad)
     - Desktop: 1440px+ width
   - Verify typography scales down on mobile (H1: 48px)
   - Navigation adapts to mobile (overlay or vertical)
   - Gallery stacks to 1-2 columns on mobile
   - Shows table stacks or scrolls horizontally
   - Custom cursor disabled on touch devices
   - All touch targets minimum 44px

4. **Animation & Performance:**
   - Section entrance animations stagger smoothly
   - No jank or lag during scroll
   - Framer Motion animations use GPU acceleration (check in Performance tab)
   - Reduced motion preference respected (disable animations if user prefers)
   - Page load time under 2 seconds on fast connection

5. **Accessibility:**
   - Keyboard navigation:
     - Tab through all links and buttons
     - Focus indicators visible (thick accent outline)
     - Enter key activates links/buttons
     - Escape closes expanded gallery images
   - Screen reader testing (macOS VoiceOver or NVDA):
     - All sections announced correctly
     - Headings navigable
     - Links descriptive
   - Color contrast:
     - Black on white: AAA (21:1 ratio)
     - Accent color on white/black: AA minimum (4.5:1)
   - Heading hierarchy check (h1 → h2 → h3, no skips)
   - Alt text present on all images/placeholders

6. **Browser Compatibility:**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest, especially test on macOS)
   - Edge (latest)
   - Mobile browsers: iOS Safari, Chrome Mobile
   - Check for CSS Grid/Flexbox support (should work in all modern browsers)
   - Verify Framer Motion animations render correctly across browsers

### Build & Deployment Testing

7. **Production Build:**
   ```bash
   npm run build
   ```
   - Build completes without errors
   - Check `dist/` folder contents:
     - `index.html` present
     - JS bundles in `assets/` folder
     - CSS files in `assets/` folder
   - Preview production build locally:
     ```bash
     npm run preview
     ```
   - Verify site works identically to dev mode

8. **GitHub Actions Deployment:**
   - Commit and push to `main` branch
   - Navigate to GitHub Actions tab in repository
   - Verify workflow runs successfully:
     - Node.js setup step passes
     - `npm ci` installs dependencies
     - `npm run build` completes
     - Deploy step pushes to GitHub Pages
   - Check for any errors in workflow logs

9. **Live Site Verification:**
   - Navigate to GitHub Pages URL (e.g., `https://username.github.io/rat-paws/`)
   - Verify all sections load correctly
   - Test navigation scrolling
   - Test all interactive elements (hovers, clicks, animations)
   - Test on mobile device (real phone, not just emulator)
   - Share link with others for feedback
   - Check browser console for any production errors

10. **Lighthouse Audit:**
    - Run Lighthouse in Chrome DevTools on live site
    - Target scores:
      - Performance: 90+
      - Accessibility: 95+
      - Best Practices: 90+
      - SEO: 90+
    - Address any critical issues flagged

## Future Enhancements (Not in Scope)

These can be added after initial launch:

**Content Integration:**
- Real band photos and member headshots
- Actual album artwork and release information
- Real show dates and ticket integration (e.g., Bandsintown API)
- Music player embeds (Spotify, Bandcamp players)

**Features:**
- Contact form backend (using Formspree, Netlify Forms, or custom API)
- Mailing list integration (Mailchimp embed or custom solution)
- Blog/news section for updates
- Press kit download page
- Music visualizer (Web Audio API + Canvas)

**Advanced Interactions:**
- GSAP-powered scroll animations (parallax, scroll-triggered reveals)
- Three.js 3D elements or background (if desired for extra experimentation)
- Page transitions between sections (expand/collapse animations)
- Sound effects on interactions (click sounds, hover sounds)
- WebGL shaders for glitch effects

**Backend/CMS:**
- Headless CMS integration (Contentful, Sanity, Strapi) for easy content updates
- Admin panel for updating shows, releases, photos
- Analytics dashboard (Google Analytics, Plausible)

**Optimization:**
- Image CDN for faster loading (Cloudinary, Imgix)
- Custom domain setup (CNAME file + DNS configuration)
- SEO optimization (meta tags, structured data, sitemap)
- Social media Open Graph images

**Experimental:**
- Generative art backgrounds
- Interactive audio-reactive visuals
- AR/VR experiences (WebXR)
- Blockchain integration for NFT merch or exclusives

## Project Summary

**Scope:**
- Single-page brutalist website with 6-7 main sections
- React + Vite + Framer Motion tech stack
- Black/white design with bold typography and experimental layouts
- Placeholder content throughout (easily replaceable)
- GitHub Pages deployment with automated build pipeline
- Mobile responsive and accessible
- Custom cursor and thoughtful hover/expansion animations

**Estimated Complexity:**
- Setup & Infrastructure: Medium (Vite config, GitHub Actions)
- Design System: High (custom brutalist aesthetic, no libraries)
- Components: Medium (7-8 components with animations)
- Animations: High (Framer Motion integration, custom cursor, scroll effects)
- Testing & Polish: Medium (cross-browser, accessibility, deployment)

**Key Inspirations:**
- mirelleborra.com (favorite) - Scale animations, custom cursor, purple accent
- 56.digital - Minimalist, text-heavy, asymmetrical layouts
- anorakfilm.com - Bold typography, structural honesty
- eilidhduffy.com - Fractured text, experimental grids
