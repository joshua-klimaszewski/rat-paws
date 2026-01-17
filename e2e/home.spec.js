import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('loads and displays navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Navigate to RAT PAWS' })).toBeVisible()
  })

  test('dangling letters are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.dangling-letter')).toHaveCount(7)
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/')
    await page.click('text=SHOWS')
    await expect(page).toHaveURL(/\/shows/)
  })

  test('page has correct title structure', async ({ page }) => {
    await page.goto('/')
    // Check that the h1 exists (screen reader only)
    await expect(page.locator('h1')).toContainText('RAT PAWS')
  })
})
