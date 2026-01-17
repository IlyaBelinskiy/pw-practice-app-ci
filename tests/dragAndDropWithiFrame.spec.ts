import { expect } from '@playwright/test'
import { test } from '../test-options'

/**
 * This test works only if youtube unblocker starteds
 */
test('Drag and drop with iframe', { tag: '@flaky' }, async ({ page, globalsQaURL }) => {
    await page.goto(globalsQaURL, { waitUntil: "domcontentloaded" })

    // Using dragTo() method
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', { hasText: "High Tatras 2" }).dragTo(frame.locator('#trash'))

    // Using more precise hober() method and Mouse Class methods
    await frame.locator('li', { hasText: "High Tatras 4" }).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()
    
    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})
