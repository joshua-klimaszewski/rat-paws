import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
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
  // Direct position motion values (not angle-based)
  const targetX = useMotionValue(anchorX)
  const targetY = useMotionValue(anchorY + stringLength)

  // Yo-yo style spring physics - very bouncy and elastic
  const springConfig = {
    stiffness: 40,     // Lower = more bouncy (reduced from 60)
    damping: 6,        // Lower = more oscillation (reduced from 8)
    mass: 2.5,         // Heavier = more momentum (increased from 2)
  }

  const x = useSpring(targetX, springConfig)
  const y = useSpring(targetY, springConfig)

  // Two control points for more dramatic S-curve (cubic bezier)
  const control1X = useTransform([x, targetX], ([currentX, targetXVal]) => {
    const oneThirdX = anchorX + (currentX - anchorX) * 0.33
    const velocityOffset = (currentX - targetXVal) * 1.2 // Much more dramatic
    return oneThirdX + velocityOffset
  })

  const control1Y = useTransform([y, targetY], ([currentY, targetYVal]) => {
    const oneThirdY = anchorY + (currentY - anchorY) * 0.33
    const velocityOffset = Math.abs(currentY - targetYVal) * 0.8
    return oneThirdY + velocityOffset + 40 // More droop
  })

  const control2X = useTransform([x, targetX], ([currentX, targetXVal]) => {
    const twoThirdX = anchorX + (currentX - anchorX) * 0.67
    const velocityOffset = (currentX - targetXVal) * -0.8 // Opposite direction for S-curve
    return twoThirdX + velocityOffset
  })

  const control2Y = useTransform([y, targetY], ([currentY, targetYVal]) => {
    const twoThirdY = anchorY + (currentY - anchorY) * 0.67
    const velocityOffset = Math.abs(currentY - targetYVal) * 0.5

    // Add slack when letter is moving up (string bunches up)
    const verticalMotion = currentY - targetYVal
    const slackAmount = verticalMotion < 0 ? Math.abs(verticalMotion) * 2 : 0

    return twoThirdY + velocityOffset + slackAmount + 30
  })

  // Random drop animation on mount - yo-yo style bounce
  useEffect(() => {
    const randomDelay = Math.random() * 1000 // 0-1000ms random delay
    const randomSwingX = (Math.random() - 0.5) * 150 // More horizontal swing
    const randomBounceY = Math.random() * 80 // Bigger initial bounce

    setTimeout(() => {
      targetX.set(anchorX + randomSwingX)
      targetY.set(anchorY + stringLength - randomBounceY)
    }, randomDelay)
  }, [])

  // Physics loop - collision detection + string constraint
  useEffect(() => {
    const physicsLoop = () => {
      const currentX = x.get()
      const currentY = y.get()
      const letterRadius = 35

      // Constrain to string length (yo-yo can't extend beyond max length)
      const dx = currentX - anchorX
      const dy = currentY - anchorY
      const distanceFromAnchor = Math.hypot(dx, dy)

      if (distanceFromAnchor > stringLength) {
        // Pull back to max string length
        const angle = Math.atan2(dx, dy)
        targetX.set(anchorX + Math.sin(angle) * stringLength)
        targetY.set(anchorY + Math.cos(angle) * stringLength)
      }

      // Keep letters below nav bar
      if (currentY < anchorY + 50) {
        targetY.set(anchorY + 50)
      }

      // Collision detection
      const allLetters = letterPositionsRef?.current || []

      allLetters.forEach((otherLetter, i) => {
        if (i === index || !otherLetter) return

        const dx = currentX - otherLetter.x
        const dy = currentY - otherLetter.y

        if (Math.abs(dx) > 150 || Math.abs(dy) > 150) return

        const distance = Math.hypot(dx, dy)
        const minDistance = letterRadius * 2

        if (distance < minDistance && distance > 0) {
          // Push away to create string motion
          const pushAngle = Math.atan2(dy, dx)
          const overlap = minDistance - distance
          const pushForce = overlap * 1.5 // Stronger push creates more string bend

          const newX = currentX + Math.cos(pushAngle) * pushForce
          const newY = currentY + Math.sin(pushAngle) * pushForce

          targetX.set(newX)
          targetY.set(newY)
        }
      })

      // Report position
      if (onPositionUpdate) {
        onPositionUpdate(index, { x: currentX, y: currentY })
      }

      requestAnimationFrame(physicsLoop)
    }

    const animationId = requestAnimationFrame(physicsLoop)
    return () => cancelAnimationFrame(animationId)
  }, [index, x, y, targetX, targetY, anchorX, anchorY, stringLength, letterPositionsRef, onPositionUpdate])

  // Click/tap handler - makes letter jump up with random jitter
  const handleLetterClick = (event) => {
    event.preventDefault()

    // Get current positions
    const currentY = y.get()
    const currentX = x.get()

    // Upward jump (90px)
    const jumpHeight = 90
    targetY.set(currentY - jumpHeight)

    // Random horizontal jitter (±30px)
    const jitterX = (Math.random() - 0.5) * 60
    targetX.set(currentX + jitterX)
  }

  return (
    <>
      {/* SVG String - Curved like a yo-yo string with dramatic bending */}
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
        <motion.path
          d={useTransform(
            [x, y, control1X, control1Y, control2X, control2Y],
            (latest) => {
              const [endX, endY, ctrl1X, ctrl1Y, ctrl2X, ctrl2Y] = latest
              // Cubic bezier curve: M (start) C (control1) (control2) (end)
              // This allows for S-curves and loops
              return `M ${anchorX} ${anchorY} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${endX} ${endY}`
            }
          )}
          stroke="var(--color-black)"
          strokeWidth="2"
          fill="none"
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
        whileTap={{ scale: 0.95 }}
        onClick={handleLetterClick}
      >
        {letter}
      </motion.div>
    </>
  )
}

export default DanglingLetter
