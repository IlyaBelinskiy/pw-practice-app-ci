import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'


test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Navigate to form page', { tag: ['@smoke', '@regression'] }, async ({ page }) => {  // Older method of using tags in test titles: 'Navigate to form page @smoke @regression'
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().treeGridPage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('Parametrized methods', { tag: '@smoke' }, async ({ page }) => { // Older method of using tags in test titles: 'Parametrized methods @smoke'
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(/\s/g, '')}${faker.number.int(1000)}@test.com` // My variant that handles fullnames with whitespaces more than 1
    // const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com` // Tutor variant that handles only one whitespace in fullname

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 2')
    // await page.screenshot({ path: 'screenshots/formLayoutsPage.png' })
    // const buffer = await page.screenshot()
    // console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, false)
    // await page.locator('nb-card', { hasText: "Inline form" }).screenshot({ path: 'screenshots/inlineForm.png' })
    await pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatepickerDateFromToday(10)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 10)
})

test.only('Testing with Argos CI', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
})

// Student elegant variant:

// Adding a simple keyword in every method like "get", will improve the readability of the code.
// Why is it better? Simple,  It's faster to write, and easier to read(because it works as an attribute now instead of a function).
// Also, these methods use the keyword "get" because it returns the attribute without other logic or parameters.
// So, is the Teacher's approach wrong? No.
// Enjoy the code!

// test('Navigate to form page', async ({ page }) => {
//     const pm = new PageManager(page)
//     await pm.navigateTo.formLayoutsPage()
//     await pm.navigateTo.datepickerPage()
//     await pm.navigateTo.smartTablePage()
//     await pm.navigateTo.treeGridPage()
//     await pm.navigateTo.toastrPage()
//     await pm.navigateTo.tooltipPage()
// })

// test('Parametrized methods', async ({ page }) => {
//     const pm = new PageManager(page)
//     await pm.navigateTo.formLayoutsPage()
//     await pm.onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 2')
//     await pm.onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox('John Smith', 'John@test.com', false)
//     await pm.navigateTo.datepickerPage()
//     await pm.onDatepickerPage.selectCommonDatepickerDateFromToday(10)
//     await pm.onDatepickerPage.selectDatepickerWithRangeFromToday(6, 10)
