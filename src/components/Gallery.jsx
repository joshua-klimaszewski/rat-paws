import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import './Gallery.css'

function Gallery() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedImage, setSelectedImage] = useState(null)

  const images = [
    { id: 1, label: 'PHOTO 01', size: 'large' },
    { id: 2, label: 'PHOTO 02', size: 'medium' },
    { id: 3, label: 'PHOTO 03', size: 'medium' },
    { id: 4, label: 'PHOTO 04', size: 'small' },
    { id: 5, label: 'PHOTO 05', size: 'large' },
    { id: 6, label: 'PHOTO 06', size: 'small' },
    { id: 7, label: 'VIDEO 01', size: 'medium', type: 'video' },
    { id: 8, label: 'PHOTO 07', size: 'medium' },
  ]

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <section id="gallery" className="gallery section" ref={ref}>
      <div className="container">
        <h2 className="gallery-title">GALLERY</h2>

        <div className="gallery-grid">
          {images.map((image, i) => (
            <motion.div
              key={image.id}
              className={`gallery-item gallery-item-${image.size}`}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedImage(image)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSelectedImage(image)
              }}
              aria-label={`View ${image.label}`}
            >
              <div className="gallery-placeholder">
                <span className="gallery-label">{image.label}</span>
                {image.type === 'video' && (
                  <span className="play-icon">▶</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="gallery-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen image view"
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-placeholder">
                <span className="modal-label">{selectedImage.label}</span>
                {selectedImage.type === 'video' && (
                  <span className="modal-play-icon">▶</span>
                )}
              </div>
              <button
                className="modal-close"
                onClick={() => setSelectedImage(null)}
                aria-label="Close fullscreen view"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Gallery
