import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './CustomCursor.css'

function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    // Check if device supports hover (not touch device)
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouchDevice) return

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Track mouse movement
    window.addEventListener('mousemove', updateMousePosition)

    // Track hoverable elements
    const hoverElements = document.querySelectorAll('a, button, [role="button"]')
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      hoverElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  // Don't render on touch devices
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: none) and (pointer: coarse)').matches
  ) {
    return null
  }

  return (
    <motion.div
      className="custom-cursor"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    />
  )
}

export default CustomCursor
