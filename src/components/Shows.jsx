import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { shows } from './showsData'
import './Shows.css'

function Shows() {
  const isShowPast = (showDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const show = new Date(showDate)
    return show < today
  }

  const sortedShows = [...shows].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    const isPastA = isShowPast(a.date)
    const isPastB = isShowPast(b.date)

    // If one is past and one is future, future comes first
    if (isPastA !== isPastB) {
      return isPastA ? 1 : -1
    }

    // If both are future, sort ascending (soonest first)
    if (!isPastA) {
      return dateA - dateB
    }

    // If both are past, sort descending (most recent first)
    return dateB - dateA
  })

  const ShowContent = ({ show }) => (
    <div className="show-info">
      <span className="show-date">{show.date}</span>
      <span className="show-venue">{show.venue}</span>
      <span className="show-location">{show.location}</span>
      {show.with && <span className="show-with">WITH {show.with}</span>}
    </div>
  )

  return (
    <section className="shows">
      <div className="container">
        <div className="shows-list">
          {sortedShows.map((show, i) => {
            const isPast = isShowPast(show.date)
            return (
              <motion.div
                key={show.date}
                className={`show-item ${isPast ? 'past-show' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                {isPast ? (
                  <Link to={`/shows/${show.slug}`} className="show-link">
                    <ShowContent show={show} />
                  </Link>
                ) : (
                  <ShowContent show={show} />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Shows
