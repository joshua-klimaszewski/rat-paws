import { motion } from 'framer-motion'
import './Music.css'

function Music() {
  const releases = [
    { title: 'MUSTANG GIRL UNKNOWN', year: '2024', url: 'https://ratpaws.bandcamp.com/album/mustang-girl-unknown' },
    { title: 'TRITE YOU ARE', year: '2023', url: 'https://ratpaws.bandcamp.com/album/trite-you-are' },
    { title: "LET'S COOL", year: '2019', url: 'https://ratpaws.bandcamp.com/album/lets-cool' },
  ]

  return (
    <section className="music">
      <div className="container">
        <div className="releases-list">
          {releases.map((release, i) => (
            <motion.a
              key={release.title}
              href={release.url}
              target="_blank"
              rel="noopener noreferrer"
              className="release-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <span className="release-title">{release.title}</span>
              <span className="release-year">{release.year}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Music
