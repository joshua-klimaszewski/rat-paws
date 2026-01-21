import { test, expect } from '@playwright/test'

test.describe('Show Journal Pages', () => {
  test.describe('Paris Bar (with journal)', () => {
    test('displays show metadata', async ({ page }) => {
      await page.goto('/rat-paws/shows/paris-bar-2025-10-24')

      await expect(page.locator('.journal-venue')).toContainText('PARIS BAR')
      await expect(page.locator('.journal-date')).toContainText('2025-10-24')
      await expect(page.locator('.journal-location')).toContainText('DETROIT, MI')
      await expect(page.locator('.journal-with')).toContainText(
        'WITH STEF CHURA, MIRROR MASK, PRETTY ISLANDS'
      )
    })

    test('displays blurb and photo credit', async ({ page }) => {
      await page.goto('/rat-paws/shows/paris-bar-2025-10-24')

      await expect(page.locator('.journal-blurb p').first()).toBeVisible()
      await expect(page.locator('.photo-credit')).toContainText('PHOTOS BY')
      await expect(page.locator('.photo-credit a')).toHaveAttribute(
        'href',
        'https://www.instagram.com/katandmaus_'
      )
    })

    test('displays photo grid with images', async ({ page }) => {
      await page.goto('/rat-paws/shows/paris-bar-2025-10-24')

      const photos = page.locator('.journal-photo-grid .photo-item')
      await expect(photos).toHaveCount(12)

      // Verify first image loads correctly
      const firstImg = photos.first().locator('img')
      await expect(firstImg).toHaveAttribute('src', /paris-bar-2025-10-24\/DSCF0625\.jpg/)
    })

    test('opens lightbox on photo click', async ({ page }) => {
      await page.goto('/rat-paws/shows/paris-bar-2025-10-24')

      // Click first photo
      await page.locator('.photo-item').first().click()

      // Lightbox should be visible
      await expect(page.locator('.lightbox')).toBeVisible()
      await expect(page.locator('.lightbox img')).toBeVisible()
      await expect(page.locator('.lightbox-close')).toBeVisible()
    })

    test('lightbox navigation works', async ({ page }) => {
      await page.goto('/rat-paws/shows/paris-bar-2025-10-24')

      await page.locator('.photo-item').first().click()
      await expect(page.locator('.lightbox')).toBeVisible()

      // Get initial image src
      const initialSrc = await page.locator('.lightbox img').getAttribute('src')

      // Click next
      await page.locator('.lightbox-next').click()
      const nextSrc = await page.locator('.lightbox img').getAttribute('src')
      expect(nextSrc).not.toBe(initialSrc)

      // Click prev to go back
      await page.locator('.lightbox-prev').click()
      const prevSrc = await page.locator('.lightbox img').getAttribute('src')
      expect(prevSrc).toBe(initialSrc)
    })

    test('lightbox closes on X click', async ({ page }) => {
      await page.goto('/rat-paws/shows/paris-bar-2025-10-24')

      await page.locator('.photo-item').first().click()
      await expect(page.locator('.lightbox')).toBeVisible()

      await page.locator('.lightbox-close').click()
      await expect(page.locator('.lightbox')).not.toBeVisible()
    })

    test('lightbox closes on overlay click', async ({ page }) => {
      await page.goto('/rat-paws/shows/paris-bar-2025-10-24')

      await page.locator('.photo-item').first().click()
      await expect(page.locator('.lightbox')).toBeVisible()

      // Click the overlay (not the image)
      await page.locator('.lightbox').click({ position: { x: 10, y: 10 } })
      await expect(page.locator('.lightbox')).not.toBeVisible()
    })
  })

  test.describe('Show without journal', () => {
    test('displays show metadata without photo grid', async ({ page }) => {
      await page.goto('/rat-paws/shows/outer-limits-2025-08-17')

      await expect(page.locator('.journal-venue')).toContainText('OUTER LIMITS')
      await expect(page.locator('.journal-date')).toContainText('2025-08-17')
      await expect(page.locator('.journal-photo-grid')).not.toBeVisible()
    })
  })

  test.describe('Non-existent show', () => {
    test('displays not found message', async ({ page }) => {
      await page.goto('/rat-paws/shows/fake-show')

      await expect(page.locator('.not-found h1')).toContainText('SHOW NOT FOUND')
      await expect(page.locator('.back-link')).toBeVisible()
    })
  })

  test.describe('Navigation', () => {
    test('back link returns to shows list', async ({ page }) => {
      await page.goto('/rat-paws/shows/paris-bar-2025-10-24')

      await page.locator('.back-link').click()
      await expect(page).toHaveURL(/\/shows$/)
    })

    test('past shows on shows page link to journal', async ({ page }) => {
      await page.goto('/rat-paws/shows')

      // Find a past show and click it
      const parisBarLink = page.locator('.show-link', { hasText: 'PARIS BAR' })
      await parisBarLink.click()

      await expect(page).toHaveURL(/\/shows\/paris-bar-2025-10-24/)
      await expect(page.locator('.journal-venue')).toContainText('PARIS BAR')
    })
  })
})
