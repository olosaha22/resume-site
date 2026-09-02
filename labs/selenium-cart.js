/* =========================================================
   SELENIUM CART AUTOMATION LAB
========================================================= */


/* -------------------------
   Elements
-------------------------- */

const productCards =
    document.querySelectorAll(".product-card");

const addProductButtons =
    document.querySelectorAll(".add-product-button");

const cartButton =
    document.getElementById("cartButton");

const cartCount =
    document.getElementById("cartCount");

const cartPanel =
    document.getElementById("cartPanel");

const closeCartButton =
    document.getElementById("closeCartButton");

const emptyCart =
    document.getElementById("emptyCart");

const cartContents =
    document.getElementById("cartContents");

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");


let cart = [];


/* =========================================================
   HELPERS
========================================================= */

function seleniumSleep(milliseconds) {

    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });

}


function seleniumConsoleLine(
    text,
    className = ""
) {

    const line =
        document.createElement("div");

    line.className =
        `console-line ${className}`;

    line.textContent = text;

    seleniumConsole.appendChild(line);

}


function seleniumAssert(
    condition,
    message
) {

    if (!condition) {
        throw new Error(message);
    }

}


/* =========================================================
   DEMO APPLICATION
========================================================= */

function resetStore() {

    cart = [];

    renderCart();

    cartPanel.classList.add("hidden");

    productCards.forEach(card => {

        card.classList.remove(
            "selenium-highlight",
            "product-added"
        );

    });

}


function addProduct(productId) {

    const productCard =
        document.querySelector(
            `[data-product-id="${productId}"]`
        );


    if (!productCard) {
        return;
    }


    const name =
        productCard.dataset.productName;

    const price =
        Number(
            productCard.dataset.productPrice
        );


    const existingItem =
        cart.find(
            item =>
                item.id === productId
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: productId,
            name,
            price,
            quantity: 1
        });

    }


    productCard.classList.add(
        "product-added"
    );


    setTimeout(() => {

        productCard.classList.remove(
            "product-added"
        );

    }, 350);


    renderCart();

}


function removeProduct(productId) {

    cart =
        cart.filter(
            item =>
                item.id !== productId
        );

    renderCart();

}


function changeQuantity(
    productId,
    amount
) {

    const item =
        cart.find(
            item =>
                item.id === productId
        );


    if (!item) {
        return;
    }


    item.quantity += amount;


    if (item.quantity <= 0) {

        removeProduct(productId);

        return;
    }


    renderCart();

}


function getCartItemCount() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}


function calculateCartTotal() {

    return cart.reduce(
        (total, item) =>
            total +
            (
                item.price *
                item.quantity
            ),
        0
    );

}


function renderCart() {

    const itemCount =
        getCartItemCount();


    cartCount.textContent =
        String(itemCount);


    if (itemCount === 0) {

        emptyCart.classList.remove(
            "hidden"
        );

        cartContents.classList.add(
            "hidden"
        );

        cartItems.innerHTML = "";

        cartTotal.textContent =
            "$0.00";

        return;
    }


    emptyCart.classList.add(
        "hidden"
    );

    cartContents.classList.remove(
        "hidden"
    );


    cartItems.innerHTML = "";


    cart.forEach(item => {

        const row =
            document.createElement("div");


        row.className =
            "dynamic-cart-item";


        const lineTotal =
            item.price *
            item.quantity;


        row.innerHTML = `
            <div class="cart-item-info">

                <strong>
                    ${item.name}
                </strong>

                <small>
                    $${item.price.toFixed(2)} each
                </small>

                <div class="cart-line-total">
                    $${lineTotal.toFixed(2)}
                </div>

            </div>

            <div class="cart-item-controls">

                <button
                    class="quantity-button decrease-item"
                    type="button"
                    data-product-id="${item.id}"
                    aria-label="Decrease ${item.name} quantity"
                >
                    −
                </button>

                <span class="cart-quantity-value">
                    ${item.quantity}
                </span>

                <button
                    class="quantity-button increase-item"
                    type="button"
                    data-product-id="${item.id}"
                    aria-label="Increase ${item.name} quantity"
                >
                    +
                </button>

                <button
                    class="remove-cart-item"
                    type="button"
                    data-product-id="${item.id}"
                >
                    Remove
                </button>

            </div>
        `;


        cartItems.appendChild(row);

    });


    cartTotal.textContent =
        `$${calculateCartTotal().toFixed(2)}`;

}


function openCart() {

    cartPanel.classList.remove(
        "hidden"
    );

    renderCart();

}


addProductButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(
                        ".product-card"
                    );

                addProduct(
                    card.dataset.productId
                );

            }
        );

    }
);


cartItems.addEventListener(
    "click",
    event => {

        const productId =
            event.target.dataset.productId;


        if (!productId) {
            return;
        }


        if (
            event.target.classList.contains(
                "increase-item"
            )
        ) {

            changeQuantity(
                productId,
                1
            );

        }


        if (
            event.target.classList.contains(
                "decrease-item"
            )
        ) {

            changeQuantity(
                productId,
                -1
            );

        }


        if (
            event.target.classList.contains(
                "remove-cart-item"
            )
        ) {

            removeProduct(
                productId
            );

        }

    }
);


if (cartButton) {

    cartButton.addEventListener(
        "click",
        openCart
    );

}


if (closeCartButton) {

    closeCartButton.addEventListener(
        "click",
        () => {
            cartPanel.classList.add("hidden");
        }
    );

}

if (downloadSeleniumReportButton) {

    downloadSeleniumReportButton.addEventListener(
        "click",
        downloadSeleniumReport
    );

}


/* =========================================================
   TEST CASES
========================================================= */

async function addProductTest() {

    resetStore();

    const headphones =
        document.querySelector(
            `[data-product-id="headphones"]`
        );


    seleniumConsoleLine(
        "> driver.get('/products')",
        "console-command"
    );

    await seleniumSleep(350);


    headphones.classList.add(
        "selenium-highlight"
    );


    seleniumConsoleLine(
        "> locating Wireless Headphones",
        "console-command"
    );

    await seleniumSleep(350);


    seleniumAssert(
        headphones !== null,
        "Product was not found."
    );


    addProduct("headphones");

    await seleniumSleep(350);


    seleniumAssert(
        cart.length === 1,
        "Product was not added to cart."
    );


    seleniumConsoleLine(
        "✓ Product added to cart"
    );


    headphones.classList.remove(
        "selenium-highlight"
    );

}


async function correctProductTest() {

    resetStore();

    addProduct("headphones");

    openCart();

    await seleniumSleep(350);


    const item =
        cart.find(
            item =>
                item.id === "headphones"
        );


    seleniumAssert(
        item !== undefined,
        "Expected cart product was missing."
    );


    seleniumAssert(
        item.name ===
        "Wireless Headphones",
        "Incorrect product was added."
    );


    seleniumConsoleLine(
        '✓ "Wireless Headphones" verified'
    );

}


async function quantityTest() {

    resetStore();

    addProduct("headphones");
    addProduct("headphones");

    await seleniumSleep(350);


    const item =
        cart.find(
            item =>
                item.id === "headphones"
        );


    seleniumAssert(
        item.quantity === 2,
        "Expected quantity to equal 2."
    );


    seleniumAssert(
        getCartItemCount() === 2,
        "Cart badge did not update."
    );


    seleniumConsoleLine(
        "✓ Cart quantity = 2"
    );

}


async function totalTest() {

    resetStore();

    addProduct("headphones");
    addProduct("keyboard");

    openCart();

    await seleniumSleep(350);


    const expectedTotal =
        129.99 + 89.99;


    const actualTotal =
        calculateCartTotal();


    seleniumAssert(
        Math.abs(
            actualTotal -
            expectedTotal
        ) < 0.001,

        "Cart total is incorrect."
    );


    seleniumConsoleLine(
        `✓ Total validated: $${actualTotal.toFixed(2)}`
    );

}


/* =========================================================
   TEST RUNNER
========================================================= */

async function executeSeleniumTest(
    name,
    testFunction
) {

    const start =
        performance.now();


    seleniumConsoleLine(
        `> ${name}`,
        "console-command"
    );


    await seleniumSleep(300);


    try {

        await testFunction();


        const duration =
            Math.round(
                performance.now() - start
            );


        seleniumConsoleLine(
            `✓ ${name} — ${duration}ms`,
            "console-success"
        );


        return {
            name,
            passed: true,
            duration
        };


    } catch (error) {

        const duration =
            Math.round(
                performance.now() - start
            );


        seleniumConsoleLine(
            `✗ ${name}`,
            "console-error"
        );


        seleniumConsoleLine(
            `  ${error.message}`,
            "console-error"
        );


        return {
            name,
            passed: false,
            duration
        };

    }

}


async function runSeleniumSuite() {

    runSeleniumSuiteButton.disabled = true;

    downloadSeleniumReportButton.disabled = true;


    seleniumConsole.innerHTML = "";


    seleniumStatus.textContent =
        "RUNNING";

    seleniumStatus.className =
        "test-status running";


    seleniumConsoleLine(
        "$ mvn test -Dtest=CartTests",
        "console-command"
    );


    await seleniumSleep(500);


    seleniumConsoleLine(
        "> Starting ChromeDriver...",
        "console-command"
    );


    await seleniumSleep(600);


    seleniumConsoleLine(
        "✓ ChromeDriver initialized"
    );


    await seleniumSleep(400);


    const suiteStart =
        performance.now();


    const tests = [

        [
            "Add product to cart",
            addProductTest
        ],

        [
            "Correct product added",
            correctProductTest
        ],

        [
            "Cart quantity updated",
            quantityTest
        ],

        [
            "Cart total calculated",
            totalTest
        ]

    ];


    const results = [];


    for (
        const [name, testFunction]
        of tests
    ) {

        const result =
            await executeSeleniumTest(
                name,
                testFunction
            );

        results.push(result);

        await seleniumSleep(400);

    }


    const passed =
        results.filter(
            result => result.passed
        ).length;


    const failed =
        results.length - passed;


    const duration =
        Math.round(
            performance.now() -
            suiteStart
        );


    seleniumConsoleLine("");


    seleniumConsoleLine(
        `${passed} passed | ${failed} failed`,
        failed === 0
            ? "console-success"
            : "console-error"
    );


    seleniumConsoleLine(
        `Total duration: ${duration}ms`,
        "console-muted"
    );


    seleniumReport = {

        suite:
            "E-Commerce Cart Regression",

        framework:
            "Selenium WebDriver + Java",

        browser:
            "Chrome",

        environment:
            "Portfolio Demo Store",

        executedAt:
            new Date(),

        passed,

        failed,

        total:
            results.length,

        duration,

        tests:
            results

    };


    if (failed === 0) {

        seleniumStatus.textContent =
            "PASSED";

        seleniumStatus.className =
            "test-status passed";

    } else {

        seleniumStatus.textContent =
            "FAILED";

        seleniumStatus.className =
            "test-status failed";

    }


    downloadSeleniumReportButton.disabled =
        false;

    runSeleniumSuiteButton.disabled =
        false;

}


/* =========================================================
   RESET
========================================================= */

function resetSeleniumSuite() {

    resetStore();


    seleniumConsole.innerHTML = `
        <div class="console-line console-muted">
            $ ready to execute Selenium suite
        </div>
    `;


    seleniumStatus.textContent =
        "READY";

    seleniumStatus.className =
        "test-status idle";


    seleniumReport = null;


    downloadSeleniumReportButton.disabled =
        true;

    runSeleniumSuiteButton.disabled =
        false;

}


if (runSeleniumSuiteButton) {

    runSeleniumSuiteButton.addEventListener(
        "click",
        runSeleniumSuite
    );

}


if (resetSeleniumButton) {

    resetSeleniumButton.addEventListener(
        "click",
        resetSeleniumSuite
    );

}


/* =========================================================
   TEST CASE EXPLORER
========================================================= */

const seleniumTestCases = {

    addProduct: {

        title:
            "Add Product to Cart",

        type:
            "Positive",

        description:
            "Verify that a customer can add an available product to the shopping cart.",

        steps: [

            "Open the product catalogue.",

            "Locate the Wireless Headphones product.",

            "Click the Add to Cart button.",

            "Verify that the cart badge changes from 0 to 1.",

            "Verify that the application records the product in the cart."

        ],

        code:
`@Test
public void userCanAddProductToCart() {

    driver.get(BASE_URL + "/products");

    WebElement product =
        driver.findElement(
            By.cssSelector(
                "[data-testid='wireless-headphones']"
            )
        );

    product.findElement(
        By.cssSelector(".add-to-cart")
    ).click();

    WebElement cartCount =
        driver.findElement(
            By.id("cart-count")
        );

    assertEquals(
        "1",
        cartCount.getText()
    );
}`
    },


    correctProduct: {

        title:
            "Correct Product Added",

        type:
            "Validation",

        description:
            "Verify that the product displayed in the cart matches the product selected by the customer.",

        steps: [

            "Add Wireless Headphones to the cart.",

            "Open the shopping cart.",

            "Locate the cart item name.",

            "Verify that the product name is Wireless Headphones.",

            "Verify that no unexpected product is displayed."

        ],

        code:
`@Test
public void correctProductAppearsInCart() {

    productPage
        .addProductToCart(
            "Wireless Headphones"
        );

    cartPage.open();

    assertEquals(
        "Wireless Headphones",
        cartPage.getProductName()
    );
}`
    },


    quantity: {

        title:
            "Cart Quantity Updated",

        type:
            "State",

        description:
            "Verify that adding one product correctly updates both the cart badge and item quantity.",

        steps: [

            "Start with an empty shopping cart.",

            "Add one product.",

            "Verify that the cart badge displays 1.",

            "Open the shopping cart.",

            "Verify that the product quantity displays 1."

        ],

        code:
`@Test
public void cartQuantityUpdates() {

    assertEquals(
        "0",
        header.getCartCount()
    );

    productPage.addToCart();

    assertEquals(
        "1",
        header.getCartCount()
    );

    cartPage.open();

    assertEquals(
        1,
        cartPage.getQuantity()
    );
}`
    },


    total: {

        title:
            "Cart Total Calculated",

        type:
            "Calculation",

        description:
            "Verify that the shopping cart total matches the price of the selected product.",

        steps: [

            "Identify the displayed product price.",

            "Add the product to the cart.",

            "Open the cart.",

            "Read the calculated cart total.",

            "Verify that the cart total equals the expected product price."

        ],

        code:
`@Test
public void cartTotalIsCorrect() {

    double productPrice =
        productPage.getProductPrice();

    productPage.addToCart();

    cartPage.open();

    double cartTotal =
        cartPage.getTotal();

    assertEquals(
        productPrice,
        cartTotal,
        0.01
    );
}`
    }

};


const seleniumCaseButtons =
    document.querySelectorAll(
        ".selenium-test-case-item"
    );


const seleniumSelectedTitle =
    document.getElementById(
        "seleniumSelectedTitle"
    );

const seleniumSelectedType =
    document.getElementById(
        "seleniumSelectedType"
    );

const seleniumSelectedDescription =
    document.getElementById(
        "seleniumSelectedDescription"
    );

const seleniumStepsList =
    document.getElementById(
        "seleniumStepsList"
    );

const seleniumSelectedCode =
    document.getElementById(
        "seleniumSelectedCode"
    );

const seleniumStepsTab =
    document.getElementById(
        "seleniumStepsTab"
    );

const seleniumCodeTab =
    document.getElementById(
        "seleniumCodeTab"
    );

const seleniumStepsView =
    document.getElementById(
        "seleniumStepsView"
    );

const seleniumCodeView =
    document.getElementById(
        "seleniumCodeView"
    );


function displaySeleniumTestCase(
    testKey
) {

    const test =
        seleniumTestCases[testKey];


    if (!test) {
        return;
    }


    seleniumSelectedTitle.textContent =
        test.title;

    seleniumSelectedType.textContent =
        test.type;

    seleniumSelectedDescription.textContent =
        test.description;


    seleniumStepsList.innerHTML = "";


    test.steps.forEach(step => {

        const item =
            document.createElement("li");

        item.textContent = step;

        seleniumStepsList.appendChild(item);

    });


    seleniumSelectedCode.textContent =
        test.code;


    seleniumCaseButtons.forEach(
        button => {

            button.classList.toggle(
                "active",

                button.dataset.seleniumTest ===
                testKey
            );

        }
    );

}


function showSeleniumSteps() {

    seleniumStepsTab.classList.add(
        "active"
    );

    seleniumCodeTab.classList.remove(
        "active"
    );

    seleniumStepsView.classList.remove(
        "hidden"
    );

    seleniumCodeView.classList.add(
        "hidden"
    );

}


function showSeleniumCode() {

    seleniumCodeTab.classList.add(
        "active"
    );

    seleniumStepsTab.classList.remove(
        "active"
    );

    seleniumCodeView.classList.remove(
        "hidden"
    );

    seleniumStepsView.classList.add(
        "hidden"
    );

}


seleniumCaseButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                displaySeleniumTestCase(
                    button.dataset.seleniumTest
                );

            }
        );

    }
);


if (seleniumStepsTab) {

    seleniumStepsTab.addEventListener(
        "click",
        showSeleniumSteps
    );

}


if (seleniumCodeTab) {

    seleniumCodeTab.addEventListener(
        "click",
        showSeleniumCode
    );

}


if (seleniumSelectedTitle) {

    displaySeleniumTestCase(
        "addProduct"
    );

}

function downloadSeleniumReport() {

    if (!seleniumReport) {
        return;
    }

    if (!window.jspdf) {
        console.error("jsPDF was not loaded.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth =
        doc.internal.pageSize.getWidth();

    const pageHeight =
        doc.internal.pageSize.getHeight();

    const margin = 18;

    const contentWidth =
        pageWidth - (margin * 2);

    let y = 0;


    /* =====================================================
       HEADER
    ===================================================== */

    doc.setFillColor(
        18,
        22,
        28
    );

    doc.rect(
        0,
        0,
        pageWidth,
        48,
        "F"
    );


    doc.setTextColor(
        255,
        255,
        255
    );

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(18);

    doc.text(
        "SHANE SAHATOO",
        margin,
        18
    );


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(9);

    doc.setTextColor(
        160,
        171,
        184
    );

    doc.text(
        "AUTOMATION LAB",
        margin,
        25
    );


    doc.setFontSize(13);

    doc.setTextColor(
        225,
        229,
        235
    );

    doc.text(
        "Selenium E-Commerce Cart Test Report",
        margin,
        37
    );


    y = 61;


    /* =====================================================
       EXECUTION DETAILS
    ===================================================== */

    const executionId =
        "SEL-" +
        seleniumReport.executedAt
            .toISOString()
            .replace(/[-:.TZ]/g, "")
            .slice(0, 14);


    doc.setTextColor(
        90,
        100,
        112
    );

    doc.setFontSize(8);

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.text(
        "EXECUTION DETAILS",
        margin,
        y
    );

    y += 8;


    const details = [

        [
            "Execution ID",
            executionId
        ],

        [
            "Executed",
            seleniumReport
                .executedAt
                .toLocaleString()
        ],

        [
            "Suite",
            seleniumReport.suite
        ],

        [
            "Framework",
            seleniumReport.framework
        ],

        [
            "Browser",
            seleniumReport.browser
        ],

        [
            "Environment",
            seleniumReport.environment
        ]

    ];


    details.forEach(
        ([label, value]) => {

            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setTextColor(
                110,
                118,
                128
            );

            doc.setFontSize(9);

            doc.text(
                label,
                margin,
                y
            );


            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setTextColor(
                35,
                41,
                48
            );

            doc.text(
                String(value),
                margin + 38,
                y
            );

            y += 7;

        }
    );


    y += 7;


    /* =====================================================
       SUMMARY
    ===================================================== */

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(8);

    doc.setTextColor(
        90,
        100,
        112
    );

    doc.text(
        "EXECUTION SUMMARY",
        margin,
        y
    );

    y += 8;


    const passRate =
        Math.round(
            (
                seleniumReport.passed /
                seleniumReport.total
            ) * 100
        );


    const metrics = [

        {
            label: "TOTAL",
            value: seleniumReport.total
        },

        {
            label: "PASSED",
            value: seleniumReport.passed
        },

        {
            label: "FAILED",
            value: seleniumReport.failed
        },

        {
            label: "PASS RATE",
            value: `${passRate}%`
        }

    ];


    const metricGap = 4;

    const metricWidth =
        (
            contentWidth -
            metricGap * 3
        ) / 4;


    metrics.forEach(
        (metric, index) => {

            const x =
                margin +
                index *
                (
                    metricWidth +
                    metricGap
                );


            doc.setFillColor(
                246,
                247,
                249
            );

            doc.roundedRect(
                x,
                y,
                metricWidth,
                25,
                2,
                2,
                "F"
            );


            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setFontSize(7);

            doc.setTextColor(
                104,
                113,
                124
            );

            doc.text(
                metric.label,
                x + 4,
                y + 7
            );


            doc.setFontSize(15);


            if (
                metric.label ===
                "PASSED"
            ) {

                doc.setTextColor(
                    44,
                    144,
                    92
                );

            } else if (
                metric.label ===
                "FAILED" &&
                seleniumReport.failed > 0
            ) {

                doc.setTextColor(
                    190,
                    70,
                    70
                );

            } else {

                doc.setTextColor(
                    30,
                    35,
                    42
                );
            }


            doc.text(
                String(metric.value),
                x + 4,
                y + 18
            );

        }
    );


    y += 37;


    /* =====================================================
       TEST RESULTS
    ===================================================== */

    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(8);

    doc.setTextColor(
        90,
        100,
        112
    );

    doc.text(
        "TEST RESULTS",
        margin,
        y
    );

    y += 8;


    doc.setFillColor(
        235,
        238,
        242
    );

    doc.rect(
        margin,
        y,
        contentWidth,
        10,
        "F"
    );


    doc.setFontSize(8);

    doc.setTextColor(
        73,
        82,
        92
    );


    doc.text(
        "TEST CASE",
        margin + 4,
        y + 6.5
    );

    doc.text(
        "STATUS",
        margin + 112,
        y + 6.5
    );

    doc.text(
        "DURATION",
        margin + 143,
        y + 6.5
    );


    y += 10;


    seleniumReport.tests.forEach(
        (test, index) => {

            const rowHeight = 13;


            if (index % 2 === 0) {

                doc.setFillColor(
                    250,
                    250,
                    251
                );

                doc.rect(
                    margin,
                    y,
                    contentWidth,
                    rowHeight,
                    "F"
                );
            }


            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setFontSize(9);

            doc.setTextColor(
                42,
                48,
                55
            );


            doc.text(
                test.name,
                margin + 4,
                y + 8
            );


            doc.setFont(
                "helvetica",
                "bold"
            );


            if (test.passed) {

                doc.setTextColor(
                    44,
                    144,
                    92
                );

                doc.text(
                    "PASS",
                    margin + 112,
                    y + 8
                );

            } else {

                doc.setTextColor(
                    190,
                    70,
                    70
                );

                doc.text(
                    "FAIL",
                    margin + 112,
                    y + 8
                );
            }


            doc.setFont(
                "helvetica",
                "normal"
            );

            doc.setTextColor(
                90,
                99,
                110
            );

            doc.text(
                `${test.duration} ms`,
                margin + 143,
                y + 8
            );


            y += rowHeight;

        }
    );


    y += 12;


    /* =====================================================
       EXECUTION NOTES
    ===================================================== */

    doc.setDrawColor(
        225,
        228,
        232
    );

    doc.line(
        margin,
        y,
        pageWidth - margin,
        y
    );

    y += 10;


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setFontSize(8);

    doc.setTextColor(
        110,
        118,
        128
    );


    doc.text(
        `Total execution time: ${seleniumReport.duration} ms`,
        margin,
        y
    );

    y += 6;


    doc.text(
        "Target: Shane Sahatoo Portfolio Demo Store",
        margin,
        y
    );

    y += 6;


    doc.text(
        "Scenario: Product selection, cart state, quantity and pricing validation",
        margin,
        y
    );


    /* =====================================================
       DISCLAIMER
    ===================================================== */

    y += 15;


    doc.setFillColor(
        247,
        248,
        250
    );

    doc.roundedRect(
        margin,
        y,
        contentWidth,
        22,
        2,
        2,
        "F"
    );


    doc.setFont(
        "helvetica",
        "bold"
    );

    doc.setFontSize(7);

    doc.setTextColor(
        93,
        103,
        114
    );

    doc.text(
        "PORTFOLIO DEMONSTRATION",
        margin + 5,
        y + 7
    );


    doc.setFont(
        "helvetica",
        "normal"
    );

    doc.setTextColor(
        117,
        125,
        135
    );

    doc.text(
        "This interactive browser demo simulates Selenium WebDriver automation",
        margin + 5,
        y + 13
    );

    doc.text(
        "against a purpose-built portfolio application.",
        margin + 5,
        y + 17
    );


    /* =====================================================
       FOOTER
    ===================================================== */

    doc.setDrawColor(
        225,
        228,
        232
    );

    doc.line(
        margin,
        pageHeight - 22,
        pageWidth - margin,
        pageHeight - 22
    );


    doc.setFontSize(7);

    doc.setTextColor(
        135,
        143,
        152
    );


    doc.text(
        "Generated from Shane Sahatoo's interactive Automation Lab.",
        margin,
        pageHeight - 14
    );


    doc.text(
        "Selenium WebDriver + Java — E-Commerce Cart Suite",
        margin,
        pageHeight - 9
    );


    /* =====================================================
       SAVE
    ===================================================== */

    const date =
        seleniumReport.executedAt
            .toISOString()
            .slice(0, 10);


    doc.save(
        `Shane-Sahatoo-Selenium-Cart-Test-Report-${date}.pdf`
    );

}
