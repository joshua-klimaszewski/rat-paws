import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { shows } from './showsData'
import './ShowJournal.css'

function ShowJournal() {
  const { slug } = useParams()
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const baseUrl = import.meta.env.BASE_URL

  const show = shows.find((s) => s.slug === slug)

  if (!show) {
    return (
      <section className="show-journal">
        <div className="container">
          <motion.div
            className="not-found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1>SHOW NOT FOUND</h1>
            <Link to="/shows" className="back-link">
              ← BACK TO SHOWS
            </Link>
          </motion.div>
        </div>
      </section>
    )
  }

  const hasJournal = show.journal && show.journal.photos && show.journal.photos.length > 0

  return (
    <section className="show-journal">
      <div className="container">
        <motion.header
          className="journal-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/shows" className="back-link">
            ← BACK TO SHOWS
          </Link>
          <span className="journal-date">{show.date}</span>
          <h1 className="journal-venue">{show.venue}</h1>
          <span className="journal-location">{show.location}</span>
          {show.with && <span className="journal-with">WITH {show.with}</span>}
        </motion.header>

        {hasJournal ? (
          <>
            {show.journal.blurb && (
              <motion.div
                className="journal-blurb"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <p>{show.journal.blurb}</p>
                {show.journal.photoCredit && (
                  <p className="photo-credit">
                    PHOTOS BY{' '}
                    <a
                      href={show.journal.photoCredit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {show.journal.photoCredit.name}
                    </a>
                  </p>
                )}
              </motion.div>
            )}

            <motion.div
              className="journal-photo-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {show.journal.photos.map((photo, i) => (
                <motion.div
                  key={photo}
                  className="photo-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                  onClick={() => setSelectedPhoto(i)}
                >
                  <img
                    src={`${baseUrl}${slug}/${photo}`}
                    alt={`${show.venue} photo ${i + 1}`}
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : null}
      </div>

      <AnimatePresence>
        {selectedPhoto !== null && hasJournal && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="lightbox-close"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <button
              className="lightbox-nav lightbox-prev"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto(
                  (selectedPhoto - 1 + show.journal.photos.length) % show.journal.photos.length
                )
              }}
              aria-label="Previous photo"
            >
              ←
            </button>
            <motion.img
              key={selectedPhoto}
              src={`${baseUrl}${slug}/${show.journal.photos[selectedPhoto]}`}
              alt={`${show.venue} photo ${selectedPhoto + 1}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="lightbox-nav lightbox-next"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedPhoto((selectedPhoto + 1) % show.journal.photos.length)
              }}
              aria-label="Next photo"
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default ShowJournal
