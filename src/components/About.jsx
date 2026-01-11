import { motion } from 'framer-motion'
import './About.css'

function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08,
      },
    },
  }

  const lineVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  }

  const bioFragments = [
    'RAT PAWS IS AN',
    'EXPERIMENTAL SOUND COLLECTIVE',
    'PUSHING THE BOUNDARIES OF NOISE,',
    'RHYTHM, AND RAW ENERGY.',
    'FORMED IN THE DEPTHS',
    'OF THE UNDERGROUND SCENE,',
    'WE CREATE MUSIC THAT',
    'REFUSES TO COMPROMISE.',
  ]

  const members = [
    { role: 'VOCALS', name: 'MEMBER 01' },
    { role: 'GUITAR', name: 'MEMBER 02' },
    { role: 'BASS', name: 'MEMBER 03' },
    { role: 'DRUMS', name: 'MEMBER 04' },
  ]

  return (
    <section className="about">
      <div className="container">
        <motion.div
          className="about-bio"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {bioFragments.map((fragment, i) => (
            <motion.div key={i} variants={lineVariants} className="bio-fragment">
              <span>{fragment}</span>
              <div className="fragment-line" />
            </motion.div>
          ))}
        </motion.div>

        <div className="members-list">
          {members.map((member) => (
            <div key={member.role} className="member-item">
              <span className="member-role">{member.role}</span>
              <span className="member-divider">—</span>
              <span className="member-name">{member.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
