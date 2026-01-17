import { Locator, Page } from '@playwright/test';

export class NavigationPage {

    readonly page: Page
    readonly formLayoutsMenuItem: Locator
    readonly datepickerMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly treeGridMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator

    constructor(page: Page) {
        this.page = page
        this.formLayoutsMenuItem = page.getByText('Form Layouts')
        this.datepickerMenuItem = page.getByText('Datepicker')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.treeGridMenuItem = page.getByText('Tree Grid')
        this.toastrMenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')
    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        // await this.page.waitForTimeout(2000)
        await this.formLayoutsMenuItem.click()
    }

    async datepickerPage() {
        // await this.page.waitForTimeout(500)
        await this.selectGroupMenuItem('Forms')
        // await this.page.waitForTimeout(2000)
        await this.datepickerMenuItem.click()
    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()
    }

    async treeGridPage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.treeGridMenuItem.click()
    }

    async toastrPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()
    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == "false")
            // await groupMenuItem.hover()
            await groupMenuItem.click()
    }
}


// A JavaScript constructor is a special function used to create and initialize objects with predefined properties and methods. It acts as a blueprint, allowing developers to create multiple instances of a specific object type efficiently. 
// In JavaScript, constructors are implemented in two primary ways:
// 1. Using ES6 Classes 
// With the introduction of ES6, the class syntax provides a cleaner, more intuitive way to work with constructors. The constructor() method within a class is automatically called when a new object instance is created using the new keyword. 
// Syntax:
// javascript
// class Person {
//   constructor(name, age) {
//     this.name = name; // 'this' refers to the new object instance
//     this.age = age;
//   }

//   introduce() {
//     console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
//   }
// }

// const person1 = new Person("John", 30);
// person1.introduce(); // Output: Hello, my name is John and I am 30 years old.
// Key Points:
// A class can only have one method named constructor().
// If you don't define a constructor, JavaScript adds an invisible, empty one by default.
// The super() method is used inside a child class's constructor to call the parent class's constructor when dealing with inheritance. 
// 2. Using Constructor Functions (Pre-ES6)
// Before ES6 classes, developers used regular functions as constructors. This approach is still valid in modern JavaScript. 
// Syntax:
// javascript
// function Car(make, model) {
//   this.make = make;
//   this.model = model;
// }

// // Methods can be added to the prototype for memory efficiency
// Car.prototype.getDetails = function() {
//   console.log(`This car is a ${this.make} ${this.model}.`);
// };

// const myCar = new Car("Toyota", "Corolla");
// myCar.getDetails(); // Output: This car is a Toyota Corolla.
// Key Points:
// Constructor functions should be named with an uppercase first letter as a common convention to distinguish them from regular functions.
// They are invoked using the new operator, which creates a new object and binds the this keyword to that object.
// Properties and methods can be assigned using this.propertyName.
// For shared methods, defining them on the constructor's prototype is more memory efficient than defining them inside the function itself. 
// In essence, constructors simplify the creation of multiple similar objects and are fundamental to object-oriented programming in JavaScript. More information is available on MDN Web Docs and W3Schools. 

// 'function' instead a 'class'
// 0 upvotes
// Danylo · Lecture 46 · 2 years ago
// Hi!
// Can we use a 'function' approach instead of a 'class' approach?
// For example:

// export function NavigationFormPages(page: Page) {
 
//     const formLayoutsPage = async () => {
//         await page.getByText('Forms').click()
//         await page.getByText('Form Layouts').click()
//     }
 
//     return {
//         formLayoutsPage: formLayoutsPage,
//     }
// }
// Because in this lesson I can`t get what "readonly page: Page" does?
// It`s part of typescript synthesis to set 'type' to property 'page'?
// Help please and thank you!

// 1 reply

// Artem — Instructor
// 1 upvote
// 2 years ago
// Probably you can, but it's not how Playwright recommends to work with Page objects.

// readonly page: Page - is a field of the class. You assign the value of the page instance to this field in the constrictor. Then use this field in the page object methods.

// Yes, the assignment of the type is required by TypeScript.


// Readonly keyword
// 0 upvotes
// Anonymized · Lecture 46 · 1 year ago
// I was wondering why we need to declare attribute with keyword readonly
// readonly page: Page

// Is that access modifier like private, public, protected?

// Is there any other keyword that can be used when we declare class attributes?

// 1 reply

// Artem — Instructor
// 1 upvote
// 1 year ago
// Yes, it's a king of protection so the field value can't be changed outside of the class.


// read only
// 0 upvotes
// Jim · Lecture 46 · 1 year ago
// In section 6: Page Object Model / First Page Object, a "readonly  page" is used inside the class. What is this for? 

// 1 reply

// Artem — Instructor
// 0 upvotes
// 1 year ago
// This is a declaration of the field that the page fixture is assigned in the constructor.


// G
// Please think about updating this course with latest POM trends as, it will also help in interviews.
// 0 upvotes
// Gaurav · Lecture 46 · 2 months ago
// Artem I think cypress course is more advanced and updated with latest POM trends, you use beautiful segregation of locators and also exported class objects not classes. I think you should also update this course a bit with the latest POM trends. Its just a humble request.  take your time but please think about this. As this is an amazing course overall.

// 2 replies

// Artem — Instructor
// 0 upvotes
// 2 months ago
// POM in Cypress is easier because you don't need to worry about the instance of the browser page, unlike in Playwright with page fixture. That's why in Playwright setup, I export the Class, so I can then create the constructor and pass the page fixture into the class. In Cypress, you don't need to do it, because "cy" is a global object.

// G
// Gaurav
// 0 upvotes
// 2 months ago
// yes, I researched and studied a bit on chatgpt...and exactly what you said... Thanks !