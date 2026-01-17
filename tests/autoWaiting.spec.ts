import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout + 2000)
})

test('Auto waiting', { tag: '@slow' }, async ({ page }) => {
    const successButton = page.locator('.bg-success')

    // await successButton.click()

    // const text = await successButton.textContent()
    // expect(text).toEqual('Data loaded with AJAX get request.')

    // await successButton.waitFor({ state: "attached" })
    // const text = await successButton.allTextContents()
    // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })
})

test('Alternative waits', { tag: '@slow' }, async ({ page }) => {
    const successButton = page.locator('.bg-success')

    // ___ wait for element ('DISCOURAGED - NOT RECOMMENDED')
    // await page.waitForSelector('.bg-success')

    // ___ wait for particular response
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // ___ wait for network calls to be completed ('DISCOURAGED - NOT RECOMMENDED')
    // await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test('Timeouts', { tag: '@slow' }, async ({ page }) => {
    // test.setTimeout(10000)
    test.slow() // Easy way to triple the default timeout
    const successButton = page.locator('.bg-success')
    await successButton.click()
})
