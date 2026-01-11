import { motion } from 'framer-motion'
import './Hero.css'

function Hero() {
  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  }

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  return (
    <section className="hero">
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
      </div>
    </section>
  )
}

export default Hero
