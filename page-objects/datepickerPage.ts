import { Page, expect } from '@playwright/test';
import { HelperBase } from './helperBase';

export class DatepickerPage extends HelperBase { // Concept from Object Oriented programming called inheritance

    // private readonly page: Page

    constructor(page: Page) {
        // this.page = page
        super(page)  // page fixture from extended HelperBase class. In a Constructor: super() must be called in a derived class's constructor before you can use the this keyword. It initializes the this object by running the parent's initialization logic.
    }

    /**
     * This method selects a day from today in Common Datepicker
     * @param numberOfDaysFromToday - number of days from today
     */
    async selectCommonDatepickerDateFromToday(numberOfDaysFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    /**
     * This method selects a range of days from today in Datepicker With Range
     * @param startDayFromToday - start day from today in range
     * @param endDayFromToday - end day from today in range
     */
    async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number) {
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShot = date.toLocaleString('En-US', { month: 'short' })
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' })
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}`
        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        await this.page.locator('.day-cell:not(.bounding-month)').getByText(expectedDate, { exact: true }).click() 
        return dateToAssert
    }
}

// Students variant that solved the issue: 
// '.day-cell:not(.bounding-month)'

// Tutor variants:
// problem variant:
// await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).click() Issue is in finding two web elements (the same number) in Datapicker with range

// corrected variant
// after while loop and before return dateToAssert

// const dayCell = this.page.locator('[class="day-cell ng-star-inserted"]')
// const rangeCell = this.page.locator('[class="range-cell day-cell ng-star-inserted"]')
// if (await dayCell.first().isVisible()) {
//     await dayCell.getByText(expectedDate, { exact: true }).click()
// } else {
//     await rangeCell.getByText(expectedDate, { exact: true }).click()
// }