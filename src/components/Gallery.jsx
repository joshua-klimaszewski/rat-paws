import { motion } from 'framer-motion'
import './Gallery.css'

function Gallery() {
  const images = [
    { id: 1, label: 'PHOTO 01' },
    { id: 2, label: 'PHOTO 02' },
    { id: 3, label: 'PHOTO 03' },
    { id: 4, label: 'PHOTO 04' },
    { id: 5, label: 'PHOTO 05' },
    { id: 6, label: 'PHOTO 06' },
  ]

  return (
    <section className="gallery">
      <div className="container">
        <div className="gallery-grid">
          {images.map((image, i) => (
            <motion.div
              key={image.id}
              className="gallery-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="gallery-placeholder">
                <span className="gallery-label">{image.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
