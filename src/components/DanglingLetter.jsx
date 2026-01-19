import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import './DanglingLetter.css'

// Physics constants (tunable)
const PHYSICS = {
  // Gravity
  gravity: 0.5,
  gravityMobile: 0.35,

  // Air resistance (1 = no damping, 0 = instant stop)
  airDamping: 0.995,
  airDampingMobile: 0.98,

  // String behavior
  stringStiffness: 0.08,
  stringDamping: 0.7,

  // Velocity limits
  maxVelocity: 30,
  maxVelocityMobile: 15,

  // Magnetic repulsion
  repulsionStrength: 800,
  repulsionStrengthMobile: 400,
  repulsionRange: 150,
  repulsionRangeMobile: 80,

  // Click/tap impulse
  clickImpulseY: -12,
  clickImpulseYMobile: -10,
  clickJitterX: 6,
  clickJitterXMobile: 4,
}

const DanglingLetter = forwardRef(function DanglingLetter(
  {
    letter,
    anchorX,
    anchorY,
    stringLength,
    index,
    letterPositionsRef,
    onPositionUpdate,
    windowWidth,
    windowHeight,
    isMobile,
  },
  ref
) {
  // Physics state stored in ref to avoid re-renders
  // Start at anchor point (top) - letters will drop down on mount
  const physicsRef = useRef({
    x: anchorX,
    y: anchorY + 20, // Start just below anchor, will fall with gravity
    vx: 0,
    vy: 0,
  })

  // Motion values for rendering only
  const motionX = useMotionValue(anchorX)
  const motionY = useMotionValue(anchorY + 20)

  // Create explicit transform string for Firefox compatibility
  const motionTransform = useTransform(
    [motionX, motionY],
    ([x, y]) => `translate(${x}px, ${y}px) translate(-50%, 0%)`
  )

  // Multi-segment string points for rope simulation
  const NUM_SEGMENTS = isMobile ? 5 : 8
  const stringPointsRef = useRef([])

  // Initialize string points
  useEffect(() => {
    const points = []
    for (let i = 0; i <= NUM_SEGMENTS; i++) {
      const t = i / NUM_SEGMENTS
      points.push({
        x: anchorX,
        y: anchorY + t * stringLength,
        oldX: anchorX,
        oldY: anchorY + t * stringLength,
      })
    }
    stringPointsRef.current = points
  }, [anchorX, anchorY, stringLength, NUM_SEGMENTS])

  // Get physics constants based on device
  const getPhysics = () => ({
    gravity: isMobile ? PHYSICS.gravityMobile : PHYSICS.gravity,
    airDamping: isMobile ? PHYSICS.airDampingMobile : PHYSICS.airDamping,
    maxVelocity: isMobile ? PHYSICS.maxVelocityMobile : PHYSICS.maxVelocity,
    repulsionStrength: isMobile ? PHYSICS.repulsionStrengthMobile : PHYSICS.repulsionStrength,
    repulsionRange: isMobile ? PHYSICS.repulsionRangeMobile : PHYSICS.repulsionRange,
    clickImpulseY: isMobile ? PHYSICS.clickImpulseYMobile : PHYSICS.clickImpulseY,
    clickJitterX: isMobile ? PHYSICS.clickJitterXMobile : PHYSICS.clickJitterX,
  })

  // Expose applyImpulse method for chain reactions
  useImperativeHandle(ref, () => ({
    applyImpulse: (impulseX, impulseY) => {
      const physics = getPhysics()
      physicsRef.current.vx += impulseX
      physicsRef.current.vy += impulseY
      // Clamp velocity
      physicsRef.current.vx = Math.max(
        -physics.maxVelocity,
        Math.min(physics.maxVelocity, physicsRef.current.vx)
      )
      physicsRef.current.vy = Math.max(
        -physics.maxVelocity,
        Math.min(physics.maxVelocity, physicsRef.current.vy)
      )
    },
    getPosition: () => ({
      x: physicsRef.current.x,
      y: physicsRef.current.y,
    }),
  }))

  // Staggered drop animation on mount - letters fall from top with bounce
  useEffect(() => {
    // Stagger based on index for wave effect
    const staggerDelay = index * 80 + Math.random() * 100

    setTimeout(() => {
      // Give initial downward velocity for dramatic drop
      physicsRef.current.vy = 2 + Math.random() * 3
      // Small horizontal jitter
      physicsRef.current.vx = (Math.random() - 0.5) * 2
    }, staggerDelay)
  }, [index])

  // Main physics loop
  useEffect(() => {
    const physics = getPhysics()

    // Letter dimensions for boundary calculations
    const letterHalfWidth = isMobile ? 20 : 40

    // Boundaries - account for letter width so letters don't get cut off
    // Right padding larger to account for string attachment offset (letterSize * 0.25)
    const stringOffset = isMobile ? 12 : 30
    const leftPadding = isMobile ? 55 : 115
    const rightPadding = leftPadding + stringOffset
    const minX = leftPadding
    const maxX = windowWidth - rightPadding
    const minY = anchorY + 15
    const maxY = anchorY + stringLength + 30

    let animationId

    const physicsLoop = () => {
      const state = physicsRef.current

      // 1. Apply gravity
      state.vy += physics.gravity

      // 2. Apply magnetic repulsion from other letters
      const allLetters = letterPositionsRef?.current || []
      allLetters.forEach((other, i) => {
        if (i === index || !other) return

        const dx = state.x - other.x
        const dy = state.y - other.y

        // Early exit for distant letters
        if (Math.abs(dx) > physics.repulsionRange || Math.abs(dy) > physics.repulsionRange) return

        const distance = Math.hypot(dx, dy)

        if (distance < physics.repulsionRange && distance > 0) {
          // Inverse-square repulsion with smooth falloff
          const normalizedDist = distance / physics.repulsionRange
          const falloff = 1 - normalizedDist
          const force = (physics.repulsionStrength / (distance * distance)) * falloff

          // Apply force as velocity change (normalized direction)
          const nx = dx / distance
          const ny = dy / distance
          state.vx += nx * force * 0.01
          state.vy += ny * force * 0.01
        }
      })

      // 3. Apply air damping
      state.vx *= physics.airDamping
      state.vy *= physics.airDamping

      // 4. Clamp velocity
      state.vx = Math.max(-physics.maxVelocity, Math.min(physics.maxVelocity, state.vx))
      state.vy = Math.max(-physics.maxVelocity, Math.min(physics.maxVelocity, state.vy))

      // 5. Integrate velocity -> position
      state.x += state.vx
      state.y += state.vy

      // 6. String constraint (Verlet-style correction)
      const dx = state.x - anchorX
      const dy = state.y - anchorY
      const distanceFromAnchor = Math.hypot(dx, dy)

      if (distanceFromAnchor > stringLength) {
        // Calculate how much we're over
        const angle = Math.atan2(dy, dx)

        // Pull back to string length
        state.x = anchorX + Math.cos(angle) * stringLength
        state.y = anchorY + Math.sin(angle) * stringLength

        // Dampen radial velocity (bounce effect)
        const radialVelocity =
          (state.vx * Math.cos(angle) + state.vy * Math.sin(angle)) * PHYSICS.stringDamping
        state.vx -= radialVelocity * Math.cos(angle)
        state.vy -= radialVelocity * Math.sin(angle)
      }

      // 7. Boundary enforcement with bounce
      // Higher damping = more energy retained on bounce
      const boundaryDamping = 0.5

      if (state.x < minX) {
        state.x = minX
        state.vx = Math.abs(state.vx) * boundaryDamping // bounce right
      } else if (state.x > maxX) {
        state.x = maxX
        state.vx = -Math.abs(state.vx) * boundaryDamping // bounce left
      }

      if (state.y < minY) {
        state.y = minY
        state.vy = Math.abs(state.vy) * boundaryDamping // bounce down
      } else if (state.y > maxY) {
        state.y = maxY
        state.vy = -Math.abs(state.vy) * boundaryDamping // bounce up
      }

      // 8. Update string points (Verlet integration for rope)
      updateStringPoints(state)

      // 9. Update motion values for rendering
      motionX.set(state.x)
      motionY.set(state.y)

      // 10. Report position for collision detection
      if (onPositionUpdate) {
        onPositionUpdate(index, {
          x: state.x,
          y: state.y,
          vx: state.vx,
          vy: state.vy,
        })
      }

      animationId = requestAnimationFrame(physicsLoop)
    }

    // Verlet integration for rope segments
    const updateStringPoints = (letterState) => {
      const points = stringPointsRef.current
      if (!points.length) return

      const segmentLength = stringLength / NUM_SEGMENTS
      const ropeGravity = physics.gravity * 0.3

      // Letter dimensions based on font-size-h1 (120px desktop, 48px mobile)
      // Letters are roughly square for most characters
      const letterSize = isMobile ? 48 : 120

      // String attachment point: top-center of the letter
      // Offset to align with visual glyph center (glyphs aren't centered in em-square)
      let attachX = letterState.x + letterSize * 0.25
      let attachY = letterState.y + letterSize * 0.12 // extend slightly into letter top

      // Special case for W (index 5) - the middle dips down, so attach lower
      if (index === 5) {
        attachY = letterState.y + letterSize * 0.35 // attach much lower for W's dip
      }

      // Update positions with Verlet integration
      for (let i = 1; i < points.length; i++) {
        const p = points[i]
        const vx = (p.x - p.oldX) * 0.98 // damping
        const vy = (p.y - p.oldY) * 0.98 + ropeGravity

        p.oldX = p.x
        p.oldY = p.y
        p.x += vx
        p.y += vy
      }

      // Pin first point to anchor
      points[0].x = anchorX
      points[0].y = anchorY
      points[0].oldX = anchorX
      points[0].oldY = anchorY

      // Pin last point to letter attachment point
      const lastIdx = points.length - 1
      points[lastIdx].x = attachX
      points[lastIdx].y = attachY

      // Apply distance constraints (multiple iterations for stiffness)
      const iterations = 3
      for (let iter = 0; iter < iterations; iter++) {
        // First point stays at anchor
        points[0].x = anchorX
        points[0].y = anchorY

        // Last point stays at letter attachment
        points[lastIdx].x = attachX
        points[lastIdx].y = attachY

        // Constrain segments
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i]
          const p2 = points[i + 1]

          const dx = p2.x - p1.x
          const dy = p2.y - p1.y
          const dist = Math.hypot(dx, dy)

          if (dist > 0) {
            const diff = (dist - segmentLength) / dist
            const offsetX = dx * diff * 0.5
            const offsetY = dy * diff * 0.5

            // Don't move first point (anchored)
            if (i > 0) {
              p1.x += offsetX
              p1.y += offsetY
            }
            // Don't move last point (attached to letter)
            if (i < points.length - 2) {
              p2.x -= offsetX
              p2.y -= offsetY
            }
          }
        }
      }
    }

    animationId = requestAnimationFrame(physicsLoop)
    return () => cancelAnimationFrame(animationId)
  }, [
    index,
    anchorX,
    anchorY,
    stringLength,
    letterPositionsRef,
    onPositionUpdate,
    windowWidth,
    windowHeight,
    isMobile,
    NUM_SEGMENTS,
  ])

  // Track last interaction time to prevent double-firing
  const lastInteractionRef = useRef(0)

  // Click/tap handler - applies impulse and triggers tap burst
  const handleLetterInteraction = (event) => {
    // Prevent double-firing from touch + click events
    const now = Date.now()
    if (now - lastInteractionRef.current < 100) return
    lastInteractionRef.current = now

    event.preventDefault()
    event.stopPropagation()

    const physics = getPhysics()

    // Apply upward impulse with random horizontal jitter
    physicsRef.current.vy += physics.clickImpulseY
    physicsRef.current.vx += (Math.random() - 0.5) * physics.clickJitterX * 2

    // Clamp velocity
    physicsRef.current.vx = Math.max(
      -physics.maxVelocity,
      Math.min(physics.maxVelocity, physicsRef.current.vx)
    )
    physicsRef.current.vy = Math.max(
      -physics.maxVelocity,
      Math.min(physics.maxVelocity, physicsRef.current.vy)
    )

    // Create tap burst element at letter position
    const burst = document.createElement('div')
    burst.className = 'tap-burst'
    burst.style.left = `${physicsRef.current.x}px`
    burst.style.top = `${physicsRef.current.y}px`
    document.body.appendChild(burst)

    // Remove after animation
    setTimeout(() => {
      burst.remove()
    }, 400)
  }

  // Generate SVG path for multi-segment string using Catmull-Rom spline
  const stringPath = useTransform(motionX, () => {
    const points = stringPointsRef.current
    if (!points || points.length < 2) {
      return `M ${anchorX} ${anchorY} L ${motionX.get()} ${motionY.get()}`
    }

    // Build Catmull-Rom spline path
    let d = `M ${points[0].x} ${points[0].y}`

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[Math.min(points.length - 1, i + 2)]

      // Catmull-Rom to Bezier conversion
      const tension = 0.5
      const cp1x = p1.x + ((p2.x - p0.x) * tension) / 3
      const cp1y = p1.y + ((p2.y - p0.y) * tension) / 3
      const cp2x = p2.x - ((p3.x - p1.x) * tension) / 3
      const cp2y = p2.y - ((p3.y - p1.y) * tension) / 3

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }

    return d
  })

  return (
    <>
      {/* SVG String - Multi-segment rope with Catmull-Rom spline */}
      <svg
        className="dangling-string-svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 999,
        }}
      >
        <motion.path
          d={stringPath}
          stroke="var(--color-black)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      {/* Letter */}
      <motion.div
        className="dangling-letter"
        style={{
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
          transform: motionTransform,
          WebkitTransform: motionTransform,
        }}
        whileHover={{
          scale: 1.1,
          color: 'var(--color-accent)',
          transition: { duration: 0.15 },
        }}
        whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
        onClick={handleLetterInteraction}
        onTouchEnd={handleLetterInteraction}
      >
        {letter}
      </motion.div>
    </>
  )
})

export default DanglingLetter
