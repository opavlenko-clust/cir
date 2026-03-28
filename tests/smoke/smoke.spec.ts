// tests/smoke/smoke.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/.+/)
    expect((await page.content()).length).toBeGreaterThan(100)
  })

  test('sign-in page loads', async ({ page }) => {
    await page.goto('/sign-in')
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('API health check', async ({ request }) => {
    const response = await request.get('/api/health')
    expect(response.status()).toBe(200)
  })

  test('PWA manifest exists', async ({ request }) => {
    const response = await request.get('/manifest.json')
    expect(response.status()).toBe(200)
    const manifest = await response.json()
    expect(manifest.name).toBeTruthy()
  })
})
