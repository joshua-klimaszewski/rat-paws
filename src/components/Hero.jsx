import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import DanglingLetter from './DanglingLetter'
import './Hero.css'

function Hero() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const letterPositionsRef = useRef([])

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
    // Nav height: padding + content + border (20px + ~20px + 20px + 1px ≈ 61px desktop, 15+15+15+1 ≈ 46px mobile)
    const navHeight = isMobile ? 46 : 61

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
          />
        ))}
      </div>

      {/* Screen reader only - semantic HTML */}
      <h1 className="sr-only">RAT PAWS</h1>
    </section>
  )
}

export default Hero
