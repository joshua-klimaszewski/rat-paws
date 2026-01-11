import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './About.css'

function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const sectionVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const members = [
    { role: 'VOCALS', name: 'MEMBER 01' },
    { role: 'GUITAR', name: 'MEMBER 02' },
    { role: 'BASS', name: 'MEMBER 03' },
    { role: 'DRUMS', name: 'MEMBER 04' },
  ]

  const memberVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <motion.section
      id="about"
      className="about section"
      ref={ref}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="container">
        <h2 className="about-title">ABOUT</h2>

        <div className="about-bio">
          <p className="bio-text">
            RAT PAWS IS AN EXPERIMENTAL SOUND COLLECTIVE PUSHING THE BOUNDARIES OF
            NOISE, RHYTHM, AND RAW ENERGY. FORMED IN THE DEPTHS OF THE UNDERGROUND
            SCENE, WE CREATE MUSIC THAT REFUSES TO COMPROMISE.
          </p>
        </div>

        <div className="members-grid">
          {members.map((member, i) => (
            <motion.div
              key={member.role}
              className="member-card"
              custom={i}
              variants={memberVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ scale: 1.02 }}
              style={{ gridColumn: i % 2 === 0 ? '1' : '2' }}
            >
              <div className="member-block">
                <span className="member-role">{member.role}</span>
              </div>
              <h3 className="member-name">{member.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default About
