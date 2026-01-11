import { motion } from 'framer-motion'
import './Music.css'

function Music() {
  const releases = [
    { title: 'UNTITLED RELEASE 001', year: '2025' },
    { title: 'DEMO 2024', year: '2024' },
    { title: 'LIVE SESSION 01', year: '2024' },
  ]

  const platforms = [
    { name: 'SPOTIFY', url: '#' },
    { name: 'APPLE MUSIC', url: '#' },
    { name: 'BANDCAMP', url: '#' },
    { name: 'YOUTUBE', url: '#' },
    { name: 'SOUNDCLOUD', url: '#' },
  ]

  return (
    <section className="music">
      <div className="container">
        <div className="releases-list">
          {releases.map((release, i) => (
            <motion.div
              key={release.title}
              className="release-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <span className="release-title">{release.title}</span>
              <span className="release-year">{release.year}</span>
            </motion.div>
          ))}
        </div>

        <div className="platforms">
          <div className="platforms-list">
            {platforms.map((platform, i) => (
              <motion.a
                key={platform.name}
                href={platform.url}
                className="platform-link"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              >
                {platform.name}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Music
