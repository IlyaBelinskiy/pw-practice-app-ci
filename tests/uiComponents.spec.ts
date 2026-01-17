import { test, expect } from '@playwright/test'

// test.describe.configure({ mode: 'parallel' })

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Form layouts page', { tag: '@block' }, () => { // test.describe.parallel;  Form layouts page @block
    test.describe.configure({ retries: 0 })
    // test.describe.configure({ mode: 'serial' })

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input fields', async ({ page }, testInfo) => {
        if (testInfo.retry) {
            // Do something
        }
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })

        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com') //, { delay: 500 }

        // Generic assertions
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        // Locator assertions
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test('Radio buttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid" })
        // await usingTheGridForm.getByLabel('Option 1').check({ force: true })
        await usingTheGridForm.getByRole('radio', { name: "Option 1" }).check({ force: true })

        // Generic assertion
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: "Option 1" }).isChecked()
        await expect(usingTheGridForm).toHaveScreenshot({ maxDiffPixels: 250 })
        expect(radioStatus).toBeTruthy()

        // Locator assertion
        await expect(usingTheGridForm.getByRole('radio', { name: "Option 1" })).toBeChecked()

        // Generic assertion
        await usingTheGridForm.getByRole('radio', { name: "Option 2" }).check({ force: true })
        expect(await usingTheGridForm.getByRole('radio', { name: "Option 1" }).isChecked()).toBeFalsy()
        expect(await usingTheGridForm.getByRole('radio', { name: "Option 2" }).isChecked()).toBeTruthy()

        // Locator assertion
        await expect(usingTheGridForm.getByRole('radio', { name: "Option 1" })).toBeChecked({ checked: false })
    })

})

test('Checkboxes', { tag: '@smoke' }, async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', { name: "Hide on click" }).uncheck({ force: true }) // Method click() doesn't check the initial status of the pointed checkbox. Method check() (and uncheck()) looks at the initial status of the pointed checkbox.
    await page.getByRole('checkbox', { name: "Prevent arising of duplicate toast" }).check({ force: true })

    const allBoxes = page.getByRole('checkbox')

    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true })
        // expect(await box.isChecked()).toBeFalsy()
        await expect(box).toBeChecked({ checked: false })
    }
})

test('Lists and dropdowns', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list has LI tag

    // const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList.filter({ hasText: "Cosmic" }).click()
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        Light: "rgb(255, 255, 255)",
        Dark: "rgb(34, 43, 69)",
        Cosmic: "rgb(50, 50, 89)",
        Corporate: "rgb(255, 255, 255)"
    }

    await dropDownMenu.click()
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate")
            await dropDownMenu.click()
    }
})

test('Tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', { hasText: "Tooltip Placements" })
    await toolTipCard.getByRole('button', { name: "Top" }).hover()

    page.getByRole('tooltip') // If you have a role tooltip created
    // const tooltip = await page.locator('nb-tooltip').textContent()
    // expect(tooltip).toEqual('This is a tooltip')
    const tooltipLocator = page.locator('nb-tooltip')
    await expect(tooltipLocator).toHaveText('This is a tooltip')
})

test('Browser dialog boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // Adding event listener (subscribing for the event). It always before the action that produces the event
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept() // dialog.dismiss() by default in Playwright. SO that's why youu need to add event listener
    })

    await page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" }).locator('.nb-trash').click()
    const rows = page.locator('table tr')
    for (const row of await rows.all())
        await expect(row).not.toContainText('mdo@gmail.com')

    // await expect(page.locator('table tr').nth(2)).not.toContainText('mdo@gmail.com')
    // await expect(page.locator('tbody tr').first()).not.toContainText('mdo@gmail.com')
    // await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com') - Wrong variant that is giving a wrong true
})

test('Web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // 1 Get the row by any text in this row
    const targetRow = page.getByRole('row', { name: "twitter@outlook.com" })
    await targetRow.locator('.nb-edit').click()
    // await page.locator('input-editor').getByPlaceholder('Age').clear() // Tutor variant. Not necessary to clear() input field before fill() method
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()
    await expect(targetRow).toContainText('35')
    await expect(targetRow.locator('td').nth(6)).toHaveText('35')

    // 2 Get the row based on the value in the specific column
    // await page.locator('.ng2-smart-pagination-nav', { hasText: "2" }).click()
    // await page.getByRole('link', { name: "2"}).click()
    // await page.locator('.ng2-smart-pagination-nav').getByText('2').click() // Tutor variant
    await page.getByRole('link', { name: "Next" }).click()
    const targetRowById = page.getByRole('row', { name: "11" }).filter({ has: page.locator('td').nth(1).getByText('11') })
    await targetRowById.locator('.nb-edit').click()
    // await page.locator('input-editor').getByPlaceholder('E-mail').clear() // Tutor variant. Not necessary to clear() input field before fill() method
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    // 3 Test filter of the table (Age)
    const ages = ["20", "30", "40", "200"]

    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        // await page.locator('input-filter').getByPlaceholder('Age').fill(age) // Tutor variant
        // await page.waitForTimeout(500) // Tutor variant
        await page.locator('input-filter').getByPlaceholder('Age').pressSequentially(age, { delay: 500 })
        const ageRows = page.locator('tbody tr')

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent()  // row.locator() is for narrow search in the currentrow instead of in the whole page (page.locator). Test becomes more resilient

            if (age == "200") {
                // expect(await page.getByRole('table').textContent()).toContain('No data found') // Tutor variant
                // expect(cellValue).toContain('No data found') // Also working
                // expect(cellValue).toEqual(' No data found ') // Also working
                const informMessage = await page.getByRole('table').textContent()
                expect(informMessage).toContain('No data found')
                await page.locator('input-filter').getByPlaceholder('Age').clear()
            } else {
                expect(cellValue).toEqual(age)
            }
        }
    }

    // 4 Test filter of the table (E-mail)
    const emails = ["@gmail", "@yandex", "@outlook", "@xyz"]

    for (let email of emails) {
        await page.locator('input-filter').getByPlaceholder('E-mail').clear()
        // await page.locator('input-filter').getByPlaceholder('Age').fill(age) // Tutor variant
        // await page.waitForTimeout(500) // Tutor variant
        await page.locator('input-filter').getByPlaceholder('E-mail').pressSequentially(email, { delay: 300 })
        const emailRows = page.locator('tbody tr')

        for (let row of await emailRows.all()) {

            if (!(email == "@xyz")) {
                const cellValue = await row.locator('td').nth(5).textContent()
                expect(cellValue).toContain(email)
            } else {
                const informMessage = await page.getByRole('table').textContent()
                expect(informMessage).toContain('No data found')
                await page.locator('input-filter').getByPlaceholder('E-mail').clear()
            }
        }
    }
})

test('Datepickers', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()
    // await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', { exact: true }).click() // Tutor variant. It doesn't work wuth current date as it has different class value -> class="today day-cell ng-star-inserted"

    let currentDate = new Date()
    let chosenDate = new Date() // Date() is JS object that can perform different operations with the date and time
    chosenDate.setDate(chosenDate.getDate() + 500)
    const expectedDate = chosenDate.getDate().toString()
    // const expectedMonthShot = chosenDate.toLocaleString("en-US", { month: "short" })
    // const expectedMonthLong = chosenDate.toLocaleString("en-US", { month: "long" })
    // const expectedYear = date.getFullYear()
    // const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`
    let dateToAssert = chosenDate.toLocaleString("en-US", {  // Student variant with reducing number of variables: expectedMonthShot, expectedYear
        month: "short",
        day: "numeric",
        year: "numeric",
    })
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    // const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear} `
    const expectedMonthAndYear = chosenDate.toLocaleString("en-US", {  // Student variant with reducing number of const variables: expectedMonthLong, expectedYear
        month: "long",
        year: "numeric",
    })

    if (currentDate < chosenDate) {
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }
    } else if (currentDate > chosenDate) {
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await page.locator('nb-calendar-pageable-navigation [data-name="chevron-left"]').click()
            calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }
    }

    await page.locator('nb-calendar-day-cell:not(.bounding-month) .cell-content').getByText(expectedDate, { exact: true }).click() // Student variant. Also working with today's date
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('Sliders', async ({ page }) => {
    // Update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '228.585')
        node.setAttribute('cy', '228.585')
    })
    await tempGauge.click()
    await expect(page.locator('[class="value temperature h1"]')).toHaveText('30')

    await page.getByRole('link', { name: "Humidity" }).click()
    const humidGauge = page.locator('[tabtitle="Humidity"] ngx-temperature-dragger circle')
    await humidGauge.evaluate(node => {
        node.setAttribute('cx', '48.900')
        node.setAttribute('cy', '228.585')
    })
    await humidGauge.click()
    await expect(page.locator('[class="value humidity h1"]')).toHaveText('0')

    // Mouse movement
    await page.getByRole('link', { name: "Temperature" }).click()
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const tempBoundingBox = await tempBox.boundingBox()
    const xTemp = tempBoundingBox.x + tempBoundingBox.width / 2
    const yTemp = tempBoundingBox.y + tempBoundingBox.height / 2
    await page.mouse.move(xTemp, yTemp)
    await page.mouse.down()
    await page.mouse.move(xTemp - 100, yTemp)
    await page.mouse.move(xTemp - 100, yTemp + 120)
    await page.mouse.up()
    await expect(page.locator('[class="value temperature h1"]')).toHaveText('12')
    await expect(tempBox).toContainText('12')

    await page.getByRole('link', { name: "Humidity" }).click()
    const humidBox = page.locator('[tabtitle="Humidity"] ngx-temperature-dragger')
    await humidBox.scrollIntoViewIfNeeded()

    const humidBoundingBox = await humidBox.boundingBox()
    const xHumid = humidBoundingBox.x + humidBoundingBox.width / 2
    const yHumid = humidBoundingBox.y + humidBoundingBox.height / 2
    await page.mouse.move(xHumid, yHumid)
    await page.mouse.down()
    await page.mouse.move(xHumid + 100, yHumid)
    await page.mouse.move(xHumid + 100, yHumid + 120)
    await page.mouse.up()
    await expect(page.locator('[class="value humidity h1"]')).toHaveText('100')
    await expect(humidBox).toContainText('100')
})
