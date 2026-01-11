# Dangling Letters Interactive Hero - Implementation Guide

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
