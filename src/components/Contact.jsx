import { motion } from 'framer-motion'
import './Contact.css'

function Contact() {
  const socialLinks = [
    { name: 'INSTAGRAM', url: 'https://www.instagram.com/rat_paws__/?hl=en' },
  ]

  return (
    <section className="contact">
      <div className="container">
        <div className="contact-email">
          <a href="mailto:booking@ratpaws.com" className="email-link">
            BOOKING@RATPAWS.COM
          </a>
        </div>

        <div className="social-links">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.url}
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              {link.name}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact
