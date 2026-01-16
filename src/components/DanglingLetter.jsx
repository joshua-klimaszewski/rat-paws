import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import './DanglingLetter.css'

function DanglingLetter({
  letter,
  anchorX,
  anchorY,
  stringLength,
  index,
  letterPositionsRef,
  onPositionUpdate,
  windowWidth,
  windowHeight,
  isMobile
}) {
  // Direct position motion values (not angle-based)
  const targetX = useMotionValue(anchorX)
  const targetY = useMotionValue(anchorY + stringLength)

  // Velocity tracking for collision physics (computed from position delta)
  const velocityRef = useRef({ x: 0, y: 0 })
  const prevPosRef = useRef({ x: anchorX, y: anchorY + stringLength })

  // Softer spring config - bouncy and elastic like original
  const springConfig = {
    stiffness: isMobile ? 50 : 40,  // Low = bouncy
    damping: isMobile ? 8 : 6,      // Low = more oscillation
    mass: isMobile ? 2.0 : 2.5,     // Heavy = more momentum
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

  // Random drop animation on mount - gentle bounce within bounds
  useEffect(() => {
    const randomDelay = Math.random() * 800
    const maxSwingX = isMobile ? 20 : 50 // Swing within safe zone
    const maxBounceY = isMobile ? 40 : 80
    const randomSwingX = (Math.random() - 0.5) * (maxSwingX * 2)
    const randomBounceY = Math.random() * maxBounceY

    setTimeout(() => {
      // Clamp initial position to safe bounds
      const horizontalPadding = isMobile ? 15 : 30
      const minX = horizontalPadding
      const maxX = windowWidth - horizontalPadding

      const newX = Math.max(minX, Math.min(maxX, anchorX + randomSwingX))
      const newY = anchorY + stringLength - randomBounceY

      targetX.set(newX)
      targetY.set(newY)
    }, randomDelay)
  }, [])

  // Physics loop - boundary enforcement, collision detection, string constraint
  // Uses target-position based physics (works WITH springs, not against them)
  useEffect(() => {
    const letterRadius = isMobile ? 24 : 35

    // Tight boundaries - letters stay within hero container
    // Horizontal: small padding from edge (letters can swing but not escape)
    const horizontalPadding = isMobile ? 15 : 30
    const minX = horizontalPadding
    const maxX = windowWidth - horizontalPadding

    // Vertical: letters can swing within their string length
    const minY = anchorY + 15
    const maxY = anchorY + stringLength + 30

    const physicsLoop = () => {
      let currentX = x.get()
      let currentY = y.get()

      // HARD BOUNDARY ENFORCEMENT - clamp actual position immediately if outside
      // This prevents any visual escape from the container
      const clampedX = Math.max(minX, Math.min(maxX, currentX))
      const clampedY = Math.max(minY, Math.min(maxY, currentY))

      if (currentX !== clampedX || currentY !== clampedY) {
        // Position was outside bounds - force it back and set target inside
        x.jump(clampedX)
        y.jump(clampedY)
        targetX.set(clampedX)
        targetY.set(clampedY)
        currentX = clampedX
        currentY = clampedY
      }

      // Track velocity from position delta (for collision response)
      velocityRef.current = {
        x: currentX - prevPosRef.current.x,
        y: currentY - prevPosRef.current.y
      }
      prevPosRef.current = { x: currentX, y: currentY }

      let newTargetX = targetX.get()
      let newTargetY = targetY.get()
      let needsUpdate = false

      // String length constraint - keep letter within string reach
      const dx = newTargetX - anchorX
      const dy = newTargetY - anchorY
      const distanceFromAnchor = Math.hypot(dx, dy)

      if (distanceFromAnchor > stringLength) {
        const angle = Math.atan2(dx, dy)
        newTargetX = anchorX + Math.sin(angle) * stringLength
        newTargetY = anchorY + Math.cos(angle) * stringLength
        needsUpdate = true
      }

      // Always clamp target to bounds (prevents target from ever being outside)
      newTargetX = Math.max(minX, Math.min(maxX, newTargetX))
      newTargetY = Math.max(minY, Math.min(maxY, newTargetY))

      // Collision detection with other letters
      const allLetters = letterPositionsRef?.current || []

      allLetters.forEach((other, i) => {
        if (i === index || !other) return

        const colDx = currentX - other.x
        const colDy = currentY - other.y

        // Early exit for distant letters
        if (Math.abs(colDx) > 100 || Math.abs(colDy) > 100) return

        const distance = Math.hypot(colDx, colDy)
        const minDistance = letterRadius * 2

        if (distance < minDistance && distance > 0) {
          // Push direction (normalized)
          const nx = colDx / distance
          const ny = colDy / distance

          // Calculate push force based on overlap (smaller force to stay controlled)
          const overlap = minDistance - distance
          const pushForce = overlap * 0.8

          // Apply push to target position, then immediately clamp
          let pushedX = currentX + nx * pushForce
          let pushedY = currentY + ny * pushForce

          // Clamp collision response to bounds
          pushedX = Math.max(minX, Math.min(maxX, pushedX))
          pushedY = Math.max(minY, Math.min(maxY, pushedY))

          newTargetX = pushedX
          newTargetY = pushedY
          needsUpdate = true
        }
      })

      // Apply target updates (already clamped above)
      if (needsUpdate) {
        targetX.set(newTargetX)
        targetY.set(newTargetY)
      }

      // Report position and velocity
      if (onPositionUpdate) {
        onPositionUpdate(index, {
          x: currentX,
          y: currentY,
          vx: velocityRef.current.x,
          vy: velocityRef.current.y
        })
      }

      requestAnimationFrame(physicsLoop)
    }

    const animationId = requestAnimationFrame(physicsLoop)
    return () => cancelAnimationFrame(animationId)
  }, [index, x, y, targetX, targetY, anchorX, anchorY, stringLength, letterPositionsRef, onPositionUpdate, windowWidth, windowHeight, isMobile])

  // Click/tap handler - makes letter jump up with random jitter (within bounds)
  const handleLetterClick = (event) => {
    event.preventDefault()

    const currentY = y.get()
    const currentX = x.get()

    // Bounds for clamping
    const horizontalPadding = isMobile ? 15 : 30
    const minX = horizontalPadding
    const maxX = windowWidth - horizontalPadding
    const minY = anchorY + 15

    // Upward jump
    const jumpHeight = isMobile ? 60 : 100
    const newY = Math.max(minY, currentY - jumpHeight)

    // Random horizontal jitter, clamped to bounds
    const jitterX = (Math.random() - 0.5) * 50
    const newX = Math.max(minX, Math.min(maxX, currentX + jitterX))

    targetY.set(newY)
    targetX.set(newX)
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
              // Offset to connect at top-center of letter
              // Letter has transform: translate(-50%, 0%), shifting it left
              // So we need to shift string endpoint left by half letter width to match
              const letterWidth = isMobile ? 48 : 120 // approximate letter width (matches font size)
              const letterHeight = isMobile ? 48 : 120
              const stringEndX = endX + (letterWidth * 0.25) // offset to center of letter
              const stringEndY = endY + (letterHeight * 0.12) // extend into top of letter
              return `M ${anchorX} ${anchorY} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${stringEndX} ${stringEndY}`
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
          transform: 'translate(-50%, 0%)',
        }}
        whileHover={{
          scale: 1.1,
          color: 'var(--color-accent)',
          transition: { duration: 0.15 }
        }}
        whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
        onClick={handleLetterClick}
      >
        {letter}
      </motion.div>
    </>
  )
}

export default DanglingLetter
