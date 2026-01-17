import { Page, expect } from '@playwright/test';
import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatepickerPage } from '../page-objects/datepickerPage'

export class PageManager {

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayoutsPage: FormLayoutsPage
    private readonly datepickerPage: DatepickerPage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayoutsPage = new FormLayoutsPage(this.page)
        this.datepickerPage = new DatepickerPage(this.page)
    }

    navigateTo() {
        return this.navigationPage
    }

    onFormLayoutsPage() {
        return this.formLayoutsPage
    }

    onDatepickerPage() {
        return this.datepickerPage
    }
}

// Student elegant variant

// Adding a simple keyword in every method like "get", will improve the readability of the code.
// Why is it better? Simple,  It's faster to write, and easier to read(because it works as an attribute now instead of a function).
// Also, these methods use the keyword "get" because it returns the attribute without other logic or parameters.
// So, is the Teacher's approach wrong? No.
// Enjoy the code!

    // get navigateTo() {
    //     return this.navigationPage
    // }

    // get onFormLayoutsPage() {
    //     return this.formLayoutsPage
    // }

    // get onDatepickerPage() {
    //     return this.datepickerPage
    // }


