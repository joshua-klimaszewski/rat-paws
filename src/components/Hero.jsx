import { useState, useEffect, useRef } from 'react'
import DanglingLetter from './DanglingLetter'
import './Hero.css'

function Hero() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)
  const letterPositionsRef = useRef([])

  const letters = ['R', 'A', 'T', 'P', 'A', 'W', 'S']

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

  // Calculate anchor positions with safe-zone for mobile
  const getAnchorPositions = () => {
    const isMobile = windowWidth <= 768
    // Longer strings to use more vertical space
    const stringLength = isMobile ? 180 : 350
    // Nav height: padding + content + border
    const navHeight = isMobile ? 46 : 61

    // Larger safe margins - anchors stay well inside so letters can swing without escaping
    const safeMargin = isMobile ? 80 : 180
    const availableWidth = windowWidth - (safeMargin * 2)
    const letterSpacing = availableWidth / 6 // 6 gaps for 7 letters

    // Distribute letters evenly within safe zone
    const positions = letters.map((_, i) => ({
      x: safeMargin + (letterSpacing * i),
      y: navHeight,
      length: stringLength
    }))

    return positions
  }

  const isMobile = windowWidth <= 768
  const anchorPositions = getAnchorPositions()

  // Track letter positions for collision detection (using ref to avoid re-renders)
  const handlePositionUpdate = (index, position) => {
    letterPositionsRef.current[index] = position
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
            letterPositionsRef={letterPositionsRef}
            onPositionUpdate={handlePositionUpdate}
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
