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

---

# DANGLING LETTERS INTERACTIVE HERO - STEP-BY-STEP IMPLEMENTATION

## Feature Overview

Replace the static hero section with an interactive physics-based animation where each letter of "RAT PAWS" hangs from a visible string attached to the navigation bar. Each letter features:

- **Realistic pendulum physics** - Letters swing naturally with gravity and damping
- **Visible strings** - Thin black SVG lines (2px) connecting letters to nav bar
- **Collision detection** - Letters bounce off each other when they collide
- **Drag interaction** - Click and drag letters, release with momentum
- **Random drop animation** - Letters drop at random intervals on page load (0-1000ms stagger)
- **Full mobile support** - Touch drag works without interfering with page scroll
- **Accessibility** - Screen reader h1, reduced motion fallback

## Tech Stack

- **Framer Motion v11.15.0** - Spring physics, drag gestures, motion values
- **React hooks** - useState, useEffect for state management
- **SVG** - String line rendering
- **CSS transforms** - GPU-accelerated positioning
- **RequestAnimationFrame** - Collision detection loop

## Implementation Checklist

This is a **very complex feature** with advanced physics simulation. Implement incrementally and test thoroughly at each step.

### Task 1: Create DanglingLetter Component (Basic Rendering)

**Goal:** Create the component skeleton with basic rendering (no physics yet)

**Files to create:**
- `/src/components/DanglingLetter.jsx`
- `/src/components/DanglingLetter.css`

**Implementation:**

`DanglingLetter.jsx`:
```jsx
import { motion } from 'framer-motion'
import './DanglingLetter.css'

function DanglingLetter({ letter, anchorX, anchorY, stringLength, index }) {
  // For now, just render letter at anchor position (straight down)
  const x = anchorX
  const y = anchorY + stringLength

  return (
    <>
      {/* SVG String */}
      <svg
        className="dangling-string-svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 999
        }}
      >
        <line
          x1={anchorX}
          y1={anchorY}
          x2={x}
          y2={y}
          stroke="var(--color-black)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Letter */}
      <div
        className="dangling-letter"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          fontSize: 'var(--font-size-h1)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-black)',
          textTransform: 'uppercase',
          letterSpacing: '-0.05em',
          userSelect: 'none',
        }}
      >
        {letter}
      </div>
    </>
  )
}

export default DanglingLetter
```

`DanglingLetter.css`:
```css
.dangling-letter {
  will-change: transform;
  transform: translateZ(0); /* GPU acceleration */
  -webkit-transform: translateZ(0);
  cursor: grab;
}

.dangling-letter:active {
  cursor: grabbing;
}

.dangling-string-svg {
  will-change: auto;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .dangling-letter {
    animation: none !important;
  }
}
```

**Testing:**
- Import component in Hero.jsx (don't render yet)
- Verify no errors
- Component compiles successfully

---

### Task 2: Update Hero Component to Render Letters

**Goal:** Refactor Hero.jsx to render 7 DanglingLetter instances

**Files to modify:**
- `/src/components/Hero.jsx`
- `/src/components/Hero.css`

**Implementation:**

`Hero.jsx`:
```jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DanglingLetter from './DanglingLetter'
import './Hero.css'

function Hero() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const letters = ['R', 'A', 'T', 'P', 'A', 'W', 'S']

  // Handle window resize (debounced)
  useEffect(() => {
    let resizeTimer
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setWindowWidth(window.innerWidth)
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  // Calculate anchor positions
  const getAnchorPositions = () => {
    const isMobile = windowWidth <= 768
    const stringLength = isMobile ? 120 : 200
    const navHeight = isMobile ? 45 : 60

    // Distribute letters across viewport width
    const positions = [
      { x: windowWidth * 0.15, y: navHeight, length: stringLength }, // R
      { x: windowWidth * 0.25, y: navHeight, length: stringLength }, // A
      { x: windowWidth * 0.35, y: navHeight, length: stringLength }, // T
      { x: windowWidth * 0.5, y: navHeight, length: stringLength },  // P
      { x: windowWidth * 0.6, y: navHeight, length: stringLength },  // A
      { x: windowWidth * 0.7, y: navHeight, length: stringLength },  // W
      { x: windowWidth * 0.8, y: navHeight, length: stringLength },  // S
    ]

    return positions
  }

  const anchorPositions = getAnchorPositions()

  return (
    <section className="hero">
      <div className="hero-dangling-container">
        {letters.map((letter, index) => (
          <DanglingLetter
            key={index}
            letter={letter}
            anchorX={anchorPositions[index].x}
            anchorY={anchorPositions[index].y}
            stringLength={anchorPositions[index].length}
            index={index}
          />
        ))}
      </div>

      {/* Screen reader only - semantic HTML */}
      <h1 className="sr-only">RAT PAWS</h1>
    </section>
  )
}

export default Hero
```

`Hero.css`:
```css
.hero {
  min-height: calc(100vh - 60px);
  background-color: var(--color-white);
  padding: 60px 40px;
  position: relative;
  overflow: hidden; /* Prevent letters from escaping */
}

.hero-dangling-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px; /* Enough space for swinging letters */
}

/* Screen reader only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Mobile */
@media (max-width: 768px) {
  .hero {
    padding: 40px 20px;
    min-height: calc(100vh - 45px);
  }

  .hero-dangling-container {
    min-height: 450px;
  }
}

/* Reduced motion: Show static text */
@media (prefers-reduced-motion: reduce) {
  .hero-dangling-container {
    display: none;
  }

  .sr-only {
    /* Make h1 visible */
    position: static;
    width: auto;
    height: auto;
    clip: auto;
    font-size: var(--font-size-h1);
    font-weight: var(--font-weight-bold);
    color: var(--color-black);
    text-align: left;
    padding: 60px 0;
  }
}
```

**Testing:**
- Visit homepage (http://localhost:5173/)
- Should see 7 letters (R-A-T-P-A-W-S) hanging straight down
- Each letter connected to nav bar with visible black line
- Letters distributed across viewport width
- Resize browser - letters reposition correctly
- Check mobile (< 768px) - shorter strings, correct positioning

---

### Task 3: Add Pendulum Physics (Angle-Based Positioning)

**Goal:** Implement spring-based pendulum simulation using Framer Motion

**Files to modify:**
- `/src/components/DanglingLetter.jsx`

**Implementation:**

Update `DanglingLetter.jsx`:
```jsx
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import './DanglingLetter.css'

function DanglingLetter({ letter, anchorX, anchorY, stringLength, index }) {
  // Pendulum angle in radians (0 = straight down, positive = clockwise)
  const angle = useMotionValue(0)

  // Spring physics configuration
  const springAngle = useSpring(angle, {
    stiffness: 100,   // String tension
    damping: 15,      // Air resistance
    mass: 1.2,        // Letter weight
    restDelta: 0.001,
    restSpeed: 0.001
  })

  // Convert angle to x,y coordinates (circular arc around anchor)
  const x = useTransform(
    springAngle,
    (a) => anchorX + Math.sin(a) * stringLength
  )
  const y = useTransform(
    springAngle,
    (a) => anchorY + Math.cos(a) * stringLength
  )

  // Random drop animation on mount
  useEffect(() => {
    const randomDelay = Math.random() * 1000 // 0-1000ms random delay
    const randomSwing = (Math.random() - 0.5) * 0.5 // ±0.25 radians (±14°)

    setTimeout(() => {
      angle.set(randomSwing)
    }, randomDelay)
  }, [])

  return (
    <>
      {/* SVG String */}
      <svg
        className="dangling-string-svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 999
        }}
      >
        <motion.line
          x1={anchorX}
          y1={anchorY}
          x2={x}
          y2={y}
          stroke="var(--color-black)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Letter */}
      <motion.div
        className="dangling-letter"
        style={{
          x,
          y,
          position: 'absolute',
          fontSize: 'var(--font-size-h1)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-black)',
          textTransform: 'uppercase',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          userSelect: 'none',
          cursor: 'grab',
          zIndex: 1000,
          transform: 'translate(-50%, -50%)',
        }}
        whileHover={{
          scale: 1.05,
          color: 'var(--color-accent)',
          transition: { duration: 0.2 }
        }}
      >
        {letter}
      </motion.div>
    </>
  )
}

export default DanglingLetter
```

**Testing:**
- Reload page - letters should drop and swing like pendulums
- Each letter drops at different time (random stagger)
- Letters swing back and forth 2-3 times before settling
- String length stays constant during swing
- Hover letter - scales up and changes color
- Watch for 3-5 seconds - all letters should settle to rest

---

### Task 4: Add Drag Interaction

**Goal:** Enable click-and-drag with momentum on release

**Files to modify:**
- `/src/components/DanglingLetter.jsx`

**Implementation:**

Update `DanglingLetter.jsx` (add drag handlers):
```jsx
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'
import './DanglingLetter.css'

function DanglingLetter({ letter, anchorX, anchorY, stringLength, index }) {
  const [isDragging, setIsDragging] = useState(false)

  const angle = useMotionValue(0)

  const springAngle = useSpring(angle, {
    stiffness: 100,
    damping: 15,
    mass: 1.2,
    restDelta: 0.001,
    restSpeed: 0.001
  })

  const x = useTransform(
    springAngle,
    (a) => anchorX + Math.sin(a) * stringLength
  )
  const y = useTransform(
    springAngle,
    (a) => anchorY + Math.cos(a) * stringLength
  )

  // Random drop animation on mount
  useEffect(() => {
    const randomDelay = Math.random() * 1000
    const randomSwing = (Math.random() - 0.5) * 0.5

    setTimeout(() => {
      angle.set(randomSwing)
    }, randomDelay)
  }, [])

  // Drag handlers
  const handleDragStart = () => setIsDragging(true)

  const handleDrag = (event, info) => {
    // Calculate angle from anchor to drag position
    const dx = info.point.x - anchorX
    const dy = info.point.y - anchorY

    // Convert to angle (atan2 gives angle in radians)
    const dragAngle = Math.atan2(dx, dy)

    // Clamp to prevent dragging above anchor (-π to π range)
    const clampedAngle = Math.max(-Math.PI * 0.95, Math.min(Math.PI * 0.95, dragAngle))

    angle.set(clampedAngle)
  }

  const handleDragEnd = (event, info) => {
    setIsDragging(false)

    // Apply drag momentum as angular velocity
    const velocity = Math.hypot(info.velocity.x, info.velocity.y)
    const velocityAngle = Math.atan2(info.velocity.x, info.velocity.y)

    // Convert linear velocity to angular velocity
    const angularVelocity = (velocity / stringLength) * Math.sin(velocityAngle)
    angle.setVelocity(angularVelocity * 0.5) // Scale down for realistic swing
  }

  return (
    <>
      {/* SVG String */}
      <svg
        className="dangling-string-svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 999
        }}
      >
        <motion.line
          x1={anchorX}
          y1={anchorY}
          x2={x}
          y2={y}
          stroke="var(--color-black)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Letter */}
      <motion.div
        className="dangling-letter"
        style={{
          x,
          y,
          position: 'absolute',
          fontSize: 'var(--font-size-h1)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-black)',
          textTransform: 'uppercase',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 1000,
          transform: 'translate(-50%, -50%)',
        }}
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileHover={{
          scale: 1.05,
          color: 'var(--color-accent)',
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        {letter}
      </motion.div>
    </>
  )
}

export default DanglingLetter
```

**Testing:**
- Click and drag any letter
- Cursor changes to "grabbing" during drag
- Letter follows mouse cursor smoothly
- String maintains fixed length (circular arc constraint)
- Release letter - swings with momentum
- Fast drag creates bigger swing
- Letter cannot be dragged above nav bar (angle clamped)

---

### Task 5: Add Collision Detection

**Goal:** Detect when letters collide and make them bounce off each other

**Files to modify:**
- `/src/components/DanglingLetter.jsx`
- `/src/components/Hero.jsx`

**Implementation:**

Update `Hero.jsx` (add position tracking):
```jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DanglingLetter from './DanglingLetter'
import './Hero.css'

function Hero() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [letterPositions, setLetterPositions] = useState([])

  const letters = ['R', 'A', 'T', 'P', 'A', 'W', 'S']

  useEffect(() => {
    let resizeTimer
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setWindowWidth(window.innerWidth)
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  const getAnchorPositions = () => {
    const isMobile = windowWidth <= 768
    const stringLength = isMobile ? 120 : 200
    const navHeight = isMobile ? 45 : 60

    const positions = [
      { x: windowWidth * 0.15, y: navHeight, length: stringLength },
      { x: windowWidth * 0.25, y: navHeight, length: stringLength },
      { x: windowWidth * 0.35, y: navHeight, length: stringLength },
      { x: windowWidth * 0.5, y: navHeight, length: stringLength },
      { x: windowWidth * 0.6, y: navHeight, length: stringLength },
      { x: windowWidth * 0.7, y: navHeight, length: stringLength },
      { x: windowWidth * 0.8, y: navHeight, length: stringLength },
    ]

    return positions
  }

  const anchorPositions = getAnchorPositions()

  // Track letter positions for collision detection
  const handlePositionUpdate = (index, position) => {
    setLetterPositions(prev => {
      const updated = [...prev]
      updated[index] = position
      return updated
    })
  }

  return (
    <section className="hero">
      <div className="hero-dangling-container">
        {letters.map((letter, index) => (
          <DanglingLetter
            key={index}
            letter={letter}
            anchorX={anchorPositions[index].x}
            anchorY={anchorPositions[index].y}
            stringLength={anchorPositions[index].length}
            index={index}
            allLetters={letterPositions}
            onPositionUpdate={handlePositionUpdate}
          />
        ))}
      </div>

      <h1 className="sr-only">RAT PAWS</h1>
    </section>
  )
}

export default Hero
```

Update `DanglingLetter.jsx` (add collision detection):
```jsx
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useState, useEffect } from 'react'
import './DanglingLetter.css'

function DanglingLetter({
  letter,
  anchorX,
  anchorY,
  stringLength,
  index,
  allLetters = [],
  onPositionUpdate
}) {
  const [isDragging, setIsDragging] = useState(false)

  const angle = useMotionValue(0)

  const springAngle = useSpring(angle, {
    stiffness: 100,
    damping: 15,
    mass: 1.2,
    restDelta: 0.001,
    restSpeed: 0.001
  })

  const x = useTransform(
    springAngle,
    (a) => anchorX + Math.sin(a) * stringLength
  )
  const y = useTransform(
    springAngle,
    (a) => anchorY + Math.cos(a) * stringLength
  )

  // Random drop animation on mount
  useEffect(() => {
    const randomDelay = Math.random() * 1000
    const randomSwing = (Math.random() - 0.5) * 0.5

    setTimeout(() => {
      angle.set(randomSwing)
    }, randomDelay)
  }, [])

  // Collision detection
  useEffect(() => {
    const checkCollisions = () => {
      const currentX = x.get()
      const currentY = y.get()
      const letterRadius = 60 // Approximate letter width/2

      allLetters.forEach((otherLetter, i) => {
        if (i === index || !otherLetter) return // Skip self and undefined

        const dx = currentX - otherLetter.x
        const dy = currentY - otherLetter.y
        const distance = Math.hypot(dx, dy)
        const minDistance = letterRadius * 2

        if (distance < minDistance && distance > 0) {
          // Collision detected! Apply elastic bounce
          const collisionAngle = Math.atan2(dy, dx)
          const overlap = minDistance - distance

          // Push letters apart
          const pushForce = overlap * 0.1
          const currentAngle = angle.get()
          angle.set(currentAngle + pushForce * Math.sin(collisionAngle))

          // Apply velocity bounce (elastic collision with 70% energy retained)
          const velocity = angle.getVelocity()
          angle.setVelocity(velocity * -0.7)
        }
      })

      // Report position for other letters to check
      if (onPositionUpdate) {
        onPositionUpdate(index, { x: currentX, y: currentY })
      }

      requestAnimationFrame(checkCollisions)
    }

    const animationId = requestAnimationFrame(checkCollisions)
    return () => cancelAnimationFrame(animationId)
  }, [allLetters, index, x, y, angle, onPositionUpdate])

  // Drag handlers
  const handleDragStart = () => setIsDragging(true)

  const handleDrag = (event, info) => {
    const dx = info.point.x - anchorX
    const dy = info.point.y - anchorY
    const dragAngle = Math.atan2(dx, dy)
    const clampedAngle = Math.max(-Math.PI * 0.95, Math.min(Math.PI * 0.95, dragAngle))
    angle.set(clampedAngle)
  }

  const handleDragEnd = (event, info) => {
    setIsDragging(false)
    const velocity = Math.hypot(info.velocity.x, info.velocity.y)
    const velocityAngle = Math.atan2(info.velocity.x, info.velocity.y)
    const angularVelocity = (velocity / stringLength) * Math.sin(velocityAngle)
    angle.setVelocity(angularVelocity * 0.5)
  }

  return (
    <>
      <svg
        className="dangling-string-svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 999
        }}
      >
        <motion.line
          x1={anchorX}
          y1={anchorY}
          x2={x}
          y2={y}
          stroke="var(--color-black)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <motion.div
        className="dangling-letter"
        style={{
          x,
          y,
          position: 'absolute',
          fontSize: 'var(--font-size-h1)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-black)',
          textTransform: 'uppercase',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 1000,
          transform: 'translate(-50%, -50%)',
        }}
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        whileHover={{
          scale: 1.05,
          color: 'var(--color-accent)',
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
      >
        {letter}
      </motion.div>
    </>
  )
}

export default DanglingLetter
```

**Testing:**
- Drag one letter into another
- Letters should bounce off each other
- Bounce should look realistic (not sticky, not too elastic)
- Multiple letters can collide simultaneously
- Collisions don't cause letters to get stuck
- Performance: Check Chrome DevTools Performance tab - should stay at 60fps
- If frame drops occur, collision detection may need optimization

---

### Task 6: Mobile Touch Support

**Goal:** Enable touch drag on mobile without scroll conflicts

**Files to modify:**
- `/src/components/DanglingLetter.css`
- `/src/components/DanglingLetter.jsx` (adjust spring config for mobile)

**Implementation:**

Update `DanglingLetter.css`:
```css
.dangling-letter {
  will-change: transform;
  transform: translateZ(0); /* GPU acceleration */
  -webkit-transform: translateZ(0);
  cursor: grab;
  touch-action: none; /* Prevent scroll when touching letters */
}

.dangling-letter:active {
  cursor: grabbing;
}

.dangling-string-svg {
  will-change: auto;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .dangling-letter {
    animation: none !important;
  }
}
```

Update `DanglingLetter.jsx` (adjust spring for mobile):
```jsx
// Add this logic inside DanglingLetter component, before useMotionValue
const isMobile = window.innerWidth <= 768

const springConfig = {
  stiffness: isMobile ? 120 : 100,   // Faster settling on mobile
  damping: isMobile ? 20 : 15,        // Higher damping on mobile
  mass: isMobile ? 1 : 1.2,           // Lighter on mobile
  restDelta: 0.001,
  restSpeed: 0.001
}

// Then use springConfig in useSpring:
const springAngle = useSpring(angle, springConfig)
```

**Testing (requires real mobile device or emulator):**
- Test on iPhone/Android device
- Can drag letters without triggering page scroll
- Can still scroll page by swiping outside letters
- Touch feedback feels responsive
- Collision detection works on mobile
- Performance: 30+ fps on mobile (60fps ideal but not always achievable)

---

### Task 7: Performance Optimization

**Goal:** Ensure 60fps performance with GPU acceleration

**Files to modify:**
- `/src/components/DanglingLetter.css` (already done in Task 6)
- `/src/components/DanglingLetter.jsx` (add optimization)

**Implementation:**

Update `DanglingLetter.jsx` (optimize collision checks):
```jsx
// In checkCollisions function, add early exit optimization:
useEffect(() => {
  const checkCollisions = () => {
    const currentX = x.get()
    const currentY = y.get()
    const letterRadius = 60

    allLetters.forEach((otherLetter, i) => {
      if (i === index || !otherLetter) return

      // Quick distance check (avoid expensive Math.hypot if far apart)
      const dx = currentX - otherLetter.x
      const dy = currentY - otherLetter.y

      // Early exit if obviously far apart (200px threshold)
      if (Math.abs(dx) > 200 || Math.abs(dy) > 200) return

      const distance = Math.hypot(dx, dy)
      const minDistance = letterRadius * 2

      if (distance < minDistance && distance > 0) {
        const collisionAngle = Math.atan2(dy, dx)
        const overlap = minDistance - distance
        const pushForce = overlap * 0.1
        const currentAngle = angle.get()
        angle.set(currentAngle + pushForce * Math.sin(collisionAngle))
        const velocity = angle.getVelocity()
        angle.setVelocity(velocity * -0.7)
      }
    })

    if (onPositionUpdate) {
      onPositionUpdate(index, { x: currentX, y: currentY })
    }

    requestAnimationFrame(checkCollisions)
  }

  const animationId = requestAnimationFrame(checkCollisions)
  return () => cancelAnimationFrame(animationId)
}, [allLetters, index, x, y, angle, onPositionUpdate])
```

**Testing:**
- Open Chrome DevTools → Performance tab
- Start recording
- Drag letters and create collisions
- Stop recording after 10 seconds
- Check frame rate: Should be 60fps (green line at top)
- If below 55fps consistently, collision detection may need further optimization

---

### Task 8: Accessibility & Reduced Motion

**Goal:** Ensure screen reader support and reduced motion compliance

**Files already created:**
- `/src/components/Hero.css` (Task 2 already includes reduced motion styles)
- `/src/components/Hero.jsx` (Task 2 already includes sr-only h1)

**Testing:**

**Screen Reader Test:**
- macOS: Enable VoiceOver (Cmd+F5)
- Windows: Enable NVDA
- Tab to homepage
- Should announce "Heading level 1: RAT PAWS"
- Letters themselves should not be announced (decorative)

**Reduced Motion Test:**
- macOS: System Preferences → Accessibility → Display → Reduce Motion
- Windows: Settings → Ease of Access → Display → Show animations
- Reload page
- Dangling letters should be hidden
- Static "RAT PAWS" heading should be visible
- No animations should play

---

### Task 9: Cross-Browser Testing

**Goal:** Verify functionality across all major browsers

**Testing Checklist:**

**Chrome (Desktop):**
- [ ] Letters render correctly
- [ ] Physics behaves smoothly
- [ ] Drag interaction works
- [ ] Collision detection works
- [ ] Performance at 60fps

**Firefox (Desktop):**
- [ ] Letters render correctly
- [ ] Physics behaves smoothly
- [ ] Drag interaction works
- [ ] Collision detection works

**Safari (Desktop):**
- [ ] Letters render correctly
- [ ] Strings render without artifacts
- [ ] Physics behaves smoothly
- [ ] Drag interaction works

**Safari iOS (Mobile):**
- [ ] Touch drag works
- [ ] No scroll conflict
- [ ] Performance acceptable (30+ fps)
- [ ] Collision detection works

**Chrome Android (Mobile):**
- [ ] Touch drag works
- [ ] No scroll conflict
- [ ] Performance acceptable (30+ fps)

---

### Task 10: Final Polish & Edge Cases

**Goal:** Handle edge cases and add final touches

**Edge Cases to Test:**

1. **Window Resize During Drag:**
   - Drag a letter
   - Resize browser window while dragging
   - Letter should release gracefully (not break)

2. **Very Wide Screen (2000px+):**
   - Letters should not be too spread out
   - Adjust anchor percentages if needed

3. **Very Narrow Screen (320px):**
   - Letters should not overlap
   - May need tighter anchor positions or smaller font

4. **Rapid Navigation Away/Back:**
   - Navigate to another page
   - Hit back button immediately
   - Animation should re-trigger correctly

5. **Multiple Rapid Drags:**
   - Quickly drag multiple letters in succession
   - No memory leaks or performance degradation
   - Check Chrome DevTools Memory tab

**Final Visual Polish:**
- Hover effects smooth and subtle
- String lines always visible and crisp
- No visual glitches during collisions
- Letters don't escape viewport

---

## Performance Targets

- **Desktop (1440px):** 60fps with all 7 letters + collisions
- **Mobile (375px):** 30+ fps (60fps ideal)
- **Load Time:** Letters fully dropped and settled within 3 seconds
- **Lighthouse Score:**
  - Performance: 85+
  - Accessibility: 95+ (perfect with screen reader h1)
  - Best Practices: 90+

## Common Issues & Solutions

**Issue: Letters get stuck after collision**
- **Solution:** Increase `overlap * 0.1` to `overlap * 0.15` for stronger separation force

**Issue: Letters swing forever, never settle**
- **Solution:** Increase damping from 15 to 20-25

**Issue: Frame rate drops during collisions**
- **Solution:** Implement spatial partitioning or reduce collision check frequency

**Issue: Touch drag triggers page scroll on mobile**
- **Solution:** Ensure `touch-action: none` is applied to `.dangling-letter`

**Issue: Strings don't render in Safari**
- **Solution:** Check SVG syntax, ensure motion.line is used correctly

**Issue: Letters overlap on narrow screens**
- **Solution:** Adjust anchor position percentages or reduce font size on mobile

---

## Next Steps After Implementation

Once all 10 tasks are complete and tested:

1. **User Acceptance Testing**
   - Share with friends/bandmates for feedback
   - Gather impressions on "fun factor" and usability

2. **Performance Monitoring**
   - Monitor real-world performance with analytics
   - Check for any device-specific issues

3. **Potential Enhancements** (Future)
   - Wind effect (horizontal force based on scroll)
   - Sound effects on collision
   - Keyboard control (arrow keys apply force)
   - Variable string lengths for visual variety

4. **Move to Next Feature**
   - Implement dual-accent random color palette system (saved plan)
   - Add real content (photos, show dates, etc.)

---

# COMPLETE IMPLEMENTATION PLAN

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
