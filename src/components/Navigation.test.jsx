import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Navigation from './Navigation'

describe('Navigation', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    expect(screen.getByText('RAT PAWS')).toBeInTheDocument()
    expect(screen.getByText('SHOWS')).toBeInTheDocument()
    expect(screen.getByText('MUSIC')).toBeInTheDocument()
  })

  it('renders nav element', () => {
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    )

    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
