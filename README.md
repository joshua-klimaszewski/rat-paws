# RAT PAWS

An experimental brutalist band website built with React, Vite, and Framer Motion. Inspired by mirelleborra.com, 56.digital, anorakfilm.com, and eilidhduffy.com.

## Design Philosophy

- **High contrast** black/white color scheme with purple accent
- **Oversized typography** (100px+ headings)
- **Asymmetrical layouts** and experimental grids
- **Raw structural honesty** - no rounded corners, shadows, or gradients
- **Custom cursor** with thoughtful animations
- **Section expansion animations** using Framer Motion

## Tech Stack

- **React 18** - Component architecture
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Animation library
- **CSS Modules** - Component-scoped styling
- **GitHub Actions** - Automated deployment
- **GitHub Pages** - Static hosting

## Development

### Prerequisites

- Node.js 18+ or 20+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server will start at `http://localhost:5173`

### Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Project Structure

```
rat-paws/
├── src/
│   ├── components/
│   │   ├── Hero.jsx           # Full-viewport hero section
│   │   ├── About.jsx          # Band bio and member cards
│   │   ├── Music.jsx          # Discography and streaming links
│   │   ├── Shows.jsx          # Tour dates table
│   │   ├── Gallery.jsx        # Photo/video grid
│   │   ├── Contact.jsx        # Contact info and merch
│   │   ├── Navigation.jsx     # Fixed navigation
│   │   └── CustomCursor.jsx   # Custom cursor component
│   ├── styles/
│   │   ├── global.css         # Global styles
│   │   └── variables.css      # CSS variables
│   ├── App.jsx                # Main app component
│   └── main.jsx               # React entry point
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies
```

## Deployment

The site deploys automatically to GitHub Pages on every push to the `main` branch via GitHub Actions.

### Enabling GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings**
3. Navigate to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. Push your code to trigger the deployment

The deployment workflow:

1. Sets up Node.js
2. Installs dependencies with `npm ci`
3. Builds the app with `npm run build`
4. Deploys the `dist/` folder to GitHub Pages

## Content

All content currently uses brutalist-styled placeholders:

- Band bio and member info
- Album releases and streaming links
- Tour dates and venues
- Photo/video gallery
- Contact and social media links

Real content can be easily added by updating the component files.

## Design System

### Colors

- **Black**: `#000000` - Primary text, backgrounds
- **White**: `#FFFFFF` - Backgrounds, text on black
- **Accent**: `#AD34E5` - Purple for interactive elements

### Typography

- **H1**: 120px desktop, 48px mobile
- **H2**: 72px desktop, 36px mobile
- **H3**: 48px desktop, 24px mobile
- **Body**: 18px
- **Font**: System sans-serif stack

### Animations

- Section entrance: Scale + opacity with cubic-bezier easing
- Hover states: Scale 1.05 or color shift to accent
- Custom cursor: Follows mouse, reacts to hovers
- Gallery expansion: Fullscreen overlay with AnimatePresence

## Accessibility

- Semantic HTML5 elements
- Proper heading hierarchy
- Alt text on all images/placeholders
- ARIA labels for navigation and interactive elements
- High contrast (WCAG AAA - 21:1 ratio)
- Keyboard navigation support
- Respects `prefers-reduced-motion` media query
- Custom cursor disabled on touch devices

## Future Enhancements

- Real band content (photos, music, dates)
- Contact form backend
- Music player embeds (Spotify, Bandcamp)
- Mailing list integration
- CMS for easy content updates
- Advanced animations with GSAP
- Three.js 3D elements (optional)

## License

This project is for the band Rat Paws.
