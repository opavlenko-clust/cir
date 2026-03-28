// tests/security/security.spec.ts
import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000'

// ── Auth ────────────────────────────────────────────────────
test.describe('Auth protection', () => {
  test('redirects unauthenticated user from /dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/sign-in/)
  })

  test('redirects non-admin from /admin', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/sign-in|dashboard/)
  })
})

// ── Security Headers ────────────────────────────────────────
test.describe('Security headers', () => {
  test('has required security headers', async ({ request }) => {
    const response = await request.get('/')
    const headers = response.headers()

    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['strict-transport-security']).toBeTruthy()
    expect(headers['content-security-policy']).toBeTruthy()
  })
})

// ── XSS ─────────────────────────────────────────────────────
test.describe('XSS protection', () => {
  const xssPayloads = [
    '<script>alert(1)</script>',
    '"><img src=x onerror=alert(1)>',
    "';alert(1);//",
  ]

  for (const payload of xssPayloads) {
    test(`blocks XSS payload: ${payload.substring(0, 20)}`, async ({ request }) => {
      const response = await request.post('/api/profile', {
        data: { name: payload },
      })
      // Має повертати 401 або 400, але не виконувати скрипт
      expect([400, 401, 403, 422]).toContain(response.status())
    })
  }
})

// ── SQL Injection ────────────────────────────────────────────
test.describe('SQL injection protection', () => {
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users;--",
    "1' UNION SELECT * FROM users--",
  ]

  for (const payload of sqlPayloads) {
    test(`blocks SQL injection: ${payload.substring(0, 20)}`, async ({ request }) => {
      const response = await request.post('/api/auth/sign-in', {
        data: { email: payload, password: 'test' },
      })
      expect([400, 401, 422]).toContain(response.status())
    })
  }
})

// ── Rate Limiting ────────────────────────────────────────────
test.describe('Rate limiting', () => {
  test('returns 429 after too many requests', async ({ request }) => {
    const requests = Array.from({ length: 65 }, () =>
      request.post('/api/auth/sign-in', {
        data: { email: 'test@test.com', password: 'wrong' },
      })
    )

    const responses = await Promise.all(requests)
    const tooManyRequests = responses.filter(r => r.status() === 429)
    expect(tooManyRequests.length).toBeGreaterThan(0)
  })
})
