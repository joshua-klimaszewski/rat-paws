import { useState, useEffect, useRef, useCallback } from 'react'
import DanglingLetter from './DanglingLetter'
import './Hero.css'

// Chain reaction constants
const CHAIN_REACTION = {
  propagationRange: 200,
  propagationRangeMobile: 120,
  forceMultiplier: 0.6, // Force falloff multiplier
}

function Hero() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const letterPositionsRef = useRef([])
  const letterRefsRef = useRef([])

  const letters = ['R', 'A', 'T', 'P', 'A', 'W', 'S']

  // Initialize letter refs array
  useEffect(() => {
    letterRefsRef.current = letterRefsRef.current.slice(0, letters.length)
  }, [letters.length])

  // Handle window resize (debounced)
  useEffect(() => {
    let resizeTimer
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setWindowWidth(window.innerWidth)
        setWindowHeight(window.innerHeight)
      }, 150)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  const isMobile = windowWidth <= 768

  // Calculate anchor positions with varied string lengths
  const getAnchorPositions = () => {
    // Nav height: padding + content + border (strings attach at bottom of nav)
    const navHeight = isMobile ? 46 : 61

    // Available vertical space (viewport minus nav and bottom padding)
    const bottomPadding = isMobile ? 100 : 120
    const availableHeight = windowHeight - navHeight - bottomPadding

    // Base string length - use ~40% of available height
    const baseLength = availableHeight * (isMobile ? 0.35 : 0.4)

    // Organic variation per letter - less uniform, more natural looking
    // RAT grouped together, PAWS grouped together
    // R: medium, A: slightly shorter, T: longer (end of word dip)
    // P: medium-long, A: short, W: longest (dramatic), S: medium
    const lengthVariations = [0.92, 0.85, 1.05, 0.95, 0.82, 1.12, 0.88]

    // Tight letter spacing within each word (smaller on mobile)
    const letterSpacing = isMobile ? 32 : 100

    // Large gap between RAT and PAWS
    const wordGap = isMobile ? 50 : 250

    // Calculate total width needed
    const ratWidth = letterSpacing * 2 // 2 gaps for R-A-T
    const pawsWidth = letterSpacing * 3 // 3 gaps for P-A-W-S
    const totalWidth = ratWidth + wordGap + pawsWidth

    // Center the whole thing in viewport
    const startX = (windowWidth - totalWidth) / 2

    const positions = letters.map((_, i) => {
      let x
      if (i < 3) {
        // RAT - left group, tightly spaced
        x = startX + letterSpacing * i
      } else {
        // PAWS - right group, after the gap
        x = startX + ratWidth + wordGap + letterSpacing * (i - 3)
      }

      return {
        x,
        y: navHeight,
        length: Math.round(baseLength * lengthVariations[i]),
      }
    })

    return positions
  }

  const anchorPositions = getAnchorPositions()

  // Track letter positions for collision detection (using ref to avoid re-renders)
  const handlePositionUpdate = (index, position) => {
    letterPositionsRef.current[index] = position
  }

  // Chain reaction: propagate force to nearby letters when one is clicked
  const propagateForce = useCallback(
    (clickedIndex, impulseX, impulseY) => {
      const clickedPos = letterPositionsRef.current[clickedIndex]
      if (!clickedPos) return

      const range = isMobile
        ? CHAIN_REACTION.propagationRangeMobile
        : CHAIN_REACTION.propagationRange

      letterRefsRef.current.forEach((letterRef, i) => {
        if (i === clickedIndex || !letterRef?.current) return

        const otherPos = letterPositionsRef.current[i]
        if (!otherPos) return

        const dx = otherPos.x - clickedPos.x
        const dy = otherPos.y - clickedPos.y
        const distance = Math.hypot(dx, dy)

        if (distance < range && distance > 0) {
          // Quadratic falloff with distance
          const normalizedDist = distance / range
          const falloff = (1 - normalizedDist) * (1 - normalizedDist)

          // Calculate impulse direction (away from clicked letter)
          const nx = dx / distance
          const ny = dy / distance

          // Apply scaled impulse
          const scaledImpulseX =
            impulseX * CHAIN_REACTION.forceMultiplier * falloff + nx * 3 * falloff
          const scaledImpulseY =
            impulseY * CHAIN_REACTION.forceMultiplier * falloff + ny * 2 * falloff

          letterRef.current.applyImpulse(scaledImpulseX, scaledImpulseY)
        }
      })
    },
    [isMobile]
  )

  // Enhanced position update that includes chain reaction trigger
  const handlePositionUpdateWithChain = useCallback(
    (index, position) => {
      const prevPos = letterPositionsRef.current[index]

      // Detect significant velocity change (click impulse)
      if (prevPos) {
        const prevVy = prevPos.vy || 0
        const currentVy = position.vy || 0

        // If velocity suddenly became very negative (upward), trigger chain reaction
        if (currentVy < -8 && prevVy > -4) {
          propagateForce(index, position.vx * 0.5, position.vy * 0.3)
        }
      }

      letterPositionsRef.current[index] = position
    },
    [propagateForce]
  )

  return (
    <section className="hero">
      <div className="hero-dangling-container">
        {letters.map((letter, index) => (
          <DanglingLetter
            key={index}
            ref={(el) => (letterRefsRef.current[index] = { current: el })}
            letter={letter}
            anchorX={anchorPositions[index].x}
            anchorY={anchorPositions[index].y}
            stringLength={anchorPositions[index].length}
            index={index}
            letterPositionsRef={letterPositionsRef}
            onPositionUpdate={handlePositionUpdateWithChain}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Screen reader only - semantic HTML */}
      <h1 className="sr-only">RAT PAWS</h1>
    </section>
  )
}

export default Hero
