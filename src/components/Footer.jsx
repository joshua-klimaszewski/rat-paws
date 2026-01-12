import { motion } from 'framer-motion'
import './Footer.css'

function Footer() {
  const platforms = [
    { name: 'INSTAGRAM', url: 'https://www.instagram.com/rat_paws__/?hl=en' },
    { name: 'BOOKING', url: 'mailto:booking@ratpaws.com' },
    { name: 'BANDCAMP', url: 'https://ratpaws.bandcamp.com/' },
    { name: 'SPOTIFY', url: 'https://open.spotify.com/artist/0No4nBEVAkLGKj9BgrAUXJ' },
    // { name: 'APPLE MUSIC', url: 'https://music.apple.com/au/artist/rat-paws/1640040818' },
    // { name: 'SOUNDCLOUD', url: 'https://soundcloud.com/ratpawsboys' },
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          {platforms.map((platform, i) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              className="footer-link"
              target={platform.url.startsWith('mailto:') ? undefined : '_blank'}
              rel={platform.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              {platform.name}
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
