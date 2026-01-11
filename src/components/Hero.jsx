import { motion } from 'framer-motion'
import './Hero.css'

function Hero() {
  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.2,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const pawVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -45 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        delay: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section id="hero" className="hero">
      <div className="hero-container">
        <motion.div
          className="hero-title"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={wordVariants} className="hero-word">
            RAT
          </motion.h1>
          <motion.h1 variants={wordVariants} className="hero-word hero-word-offset">
            PAWS
          </motion.h1>
        </motion.div>

        <motion.div
          className="hero-paw"
          variants={pawVariants}
          initial="hidden"
          animate="visible"
          aria-hidden="true"
        >
          🐾
        </motion.div>

        <motion.div
          className="hero-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span>SCROLL</span>
          <div className="scroll-arrow">↓</div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
