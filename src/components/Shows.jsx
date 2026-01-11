import { motion } from 'framer-motion'
import './Shows.css'

function Shows() {
  const shows = [
    {
      date: '2026-03-15',
      venue: 'THE UNDERGROUND',
      location: 'NEW YORK, NY',
      tickets: '#',
    },
    {
      date: '2026-04-02',
      venue: 'BASEMENT COLLECTIVE',
      location: 'LOS ANGELES, CA',
      tickets: '#',
    },
    {
      date: '2026-04-20',
      venue: 'NOISE FACTORY',
      location: 'CHICAGO, IL',
      tickets: '#',
    },
    {
      date: '2026-05-10',
      venue: 'WAREHOUSE 23',
      location: 'BROOKLYN, NY',
      tickets: '#',
    },
  ]

  return (
    <section className="shows">
      <div className="container">
        <div className="shows-list">
          {shows.map((show, i) => (
            <motion.div
              key={show.date}
              className="show-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="show-info">
                <span className="show-date">{show.date}</span>
                <span className="show-venue">{show.venue}</span>
                <span className="show-location">{show.location}</span>
              </div>
              <a href={show.tickets} className="show-tickets">
                TICKETS
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Shows
