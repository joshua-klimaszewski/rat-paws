import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import './Contact.css'

function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const socialLinks = [
    { name: 'INSTAGRAM', url: 'https://instagram.com' },
    { name: 'TIKTOK', url: 'https://tiktok.com' },
    { name: 'YOUTUBE', url: 'https://youtube.com' },
    { name: 'TWITTER', url: 'https://twitter.com' },
    { name: 'FACEBOOK', url: 'https://facebook.com' },
  ]

  const merchItems = [
    { name: 'T-SHIRT 001', price: '$30' },
    { name: 'HOODIE CLASSIC', price: '$60' },
    { name: 'POSTER SET', price: '$20' },
  ]

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3 + i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <section id="contact" className="contact section" ref={ref}>
      <div className="container">
        <div className="contact-grid">
          {/* Contact Section */}
          <div className="contact-section">
            <h2 className="section-title">CONTACT</h2>

            <div className="contact-email">
              <a href="mailto:booking@ratpaws.com" className="email-link">
                BOOKING@RATPAWS.COM
              </a>
            </div>

            <div className="social-links">
              <h3 className="subsection-title">FOLLOW US</h3>
              {socialLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  className="social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  {link.name} →
                </motion.a>
              ))}
            </div>

            <div className="mailing-list">
              <h3 className="subsection-title">MAILING LIST</h3>
              <p className="mailing-note">
                (COMING SOON - BACKEND INTEGRATION NEEDED)
              </p>
              <form className="mailing-form">
                <input
                  type="email"
                  placeholder="YOUR EMAIL"
                  className="email-input"
                  aria-label="Email address"
                />
                <button type="submit" className="submit-button">
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>

          {/* Merch Section */}
          <div className="merch-section">
            <h2 className="section-title">MERCH</h2>

            <div className="merch-cta">
              <h3 className="merch-headline">BUY MERCH</h3>
              <div className="merch-stores">
                <a
                  href="#"
                  className="store-link"
                  whileHover={{ scale: 1.05 }}
                >
                  BANDCAMP STORE →
                </a>
                <a
                  href="#"
                  className="store-link"
                  whileHover={{ scale: 1.05 }}
                >
                  CUSTOM STORE →
                </a>
              </div>
            </div>

            <div className="merch-items">
              <h3 className="subsection-title">FEATURED</h3>
              <div className="merch-grid">
                {merchItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    className="merch-item"
                    custom={i}
                    variants={itemVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="merch-placeholder">
                      <span className="merch-price">{item.price}</span>
                    </div>
                    <h4 className="merch-name">{item.name}</h4>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
