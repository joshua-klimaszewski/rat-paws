import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import './DanglingLetter.css'

function DanglingLetter({
  letter,
  anchorX,
  anchorY,
  stringLength,
  index,
  letterPositionsRef,
  onPositionUpdate
}) {
  // Pendulum angle in radians (0 = straight down, positive = clockwise)
  const angle = useMotionValue(0)

  // Spring physics configuration
  const springAngle = useSpring(angle, {
    stiffness: 80,    // String tension (reduced from 100)
    damping: 20,      // Air resistance (increased from 15)
    mass: 1.5,        // Letter weight (increased from 1.2)
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

  // Collision detection
  useEffect(() => {
    const checkCollisions = () => {
      const currentX = x.get()
      const currentY = y.get()
      const letterRadius = 35 // Reduced detection radius (was 60)

      // Read positions from ref to avoid re-renders
      const allLetters = letterPositionsRef?.current || []

      allLetters.forEach((otherLetter, i) => {
        if (i === index || !otherLetter) return // Skip self and undefined

        // Quick distance check (avoid expensive Math.hypot if far apart)
        const dx = currentX - otherLetter.x
        const dy = currentY - otherLetter.y

        // Early exit if obviously far apart (150px threshold, reduced from 200)
        if (Math.abs(dx) > 150 || Math.abs(dy) > 150) return

        const distance = Math.hypot(dx, dy)
        const minDistance = letterRadius * 2

        if (distance < minDistance && distance > 0) {
          // Collision detected! Apply very gentle push
          const collisionAngle = Math.atan2(dy, dx)
          const overlap = minDistance - distance

          // Very gentle push force (reduced from 0.02 to 0.003)
          const pushForce = overlap * 0.003
          const currentAngle = angle.get()
          const newAngle = currentAngle + pushForce * Math.sin(collisionAngle)

          // Clamp angle to keep letters below nav bar (max ±60 degrees)
          const clampedAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, newAngle))
          angle.set(clampedAngle)
        }
      })

      // Clamp angle to prevent going above nav bar
      const currentAngle = angle.get()
      if (currentAngle < -Math.PI / 3 || currentAngle > Math.PI / 3) {
        angle.set(Math.max(-Math.PI / 3, Math.min(Math.PI / 3, currentAngle)))
      }

      // Report position for other letters to check
      if (onPositionUpdate) {
        onPositionUpdate(index, { x: currentX, y: currentY })
      }

      requestAnimationFrame(checkCollisions)
    }

    const animationId = requestAnimationFrame(checkCollisions)
    return () => cancelAnimationFrame(animationId)
  }, [index, x, y, angle, letterPositionsRef, onPositionUpdate])

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
          lineHeight: 0.85,
          userSelect: 'none',
          cursor: 'grab',
          zIndex: 1000,
          transform: 'translate(-50%, -10%)',
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
