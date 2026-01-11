import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Music.css'

function Music() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const releases = [
    { title: 'UNTITLED RELEASE 001', year: '2025', type: 'EP' },
    { title: 'DEMO 2024', year: '2024', type: 'DEMO' },
    { title: 'LIVE SESSION 01', year: '2024', type: 'LIVE' },
  ]

  const platforms = [
    { name: 'SPOTIFY', url: '#' },
    { name: 'APPLE MUSIC', url: '#' },
    { name: 'BANDCAMP', url: '#' },
    { name: 'YOUTUBE', url: '#' },
    { name: 'SOUNDCLOUD', url: '#' },
  ]

  const releaseVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  const platformVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.6 + i * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <section id="music" className="music section" ref={ref}>
      <div className="container">
        <h2 className="music-title">MUSIC</h2>

        <div className="releases-grid">
          {releases.map((release, i) => (
            <motion.div
              key={release.title}
              className="release-card"
              custom={i}
              variants={releaseVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ scale: 1.03 }}
            >
              <div className="release-artwork">
                <span className="release-type">{release.type}</span>
              </div>
              <h3 className="release-title">{release.title}</h3>
              <p className="release-year">{release.year}</p>
            </motion.div>
          ))}
        </div>

        <div className="platforms">
          <h3 className="platforms-title">LISTEN NOW</h3>
          <div className="platforms-list">
            {platforms.map((platform, i) => (
              <motion.a
                key={platform.name}
                href={platform.url}
                className="platform-link"
                custom={i}
                variants={platformVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                whileHover={{ scale: 1.05, x: 10 }}
              >
                {platform.name} →
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Music
