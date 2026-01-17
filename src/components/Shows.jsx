import { motion } from 'framer-motion'
import './Shows.css'

function Shows() {
  const shows = [
    {
      date: '2025-08-17',
      venue: 'OUTER LIMITS',
      location: 'DETROIT, MI',
      with: 'SHADY COVE, NANCY FRIDAY, ARLO BETLEY',
    },
    {
      date: '2025-08-25',
      venue: 'GINGKO RECORDS',
      location: 'DETROIT, MI',
      with: 'CASSIE RAMONE, CHLOE DRALLOS',
    },
    {
      date: '2025-10-24',
      venue: 'PARIS BAR',
      location: 'DETROIT, MI',
      with: 'STEF CHURA, MIRROR MASK, PRETTY ISLANDS',
    },
    {
      date: '2025-11-19',
      venue: 'WCBN LOCAL MUSIC SHOW',
      location: 'ANN ARBOR, MI',
    },
    {
      date: '2025-12-22',
      venue: 'BOWLERO LOUNGE',
      location: 'ROYAL OAK, MI',
      with: 'DEADBEAT BEAT',
    },
    {
      date: '2026-01-16',
      venue: 'MOONDOG CAFE',
      location: 'DETROIT, MI',
      with: 'MODERN NATURE, BRIGID DAWSON & THE MOTHERS NETWORK',
    },
  ]

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
                <div className="show-info">
                  <span className="show-date">{show.date}</span>
                  <span className="show-venue">{show.venue}</span>
                  <span className="show-location">{show.location}</span>
                  {show.with && <span className="show-with">WITH {show.with}</span>}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Shows
