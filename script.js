/* -------------------------
   Background particles
-------------------------- */

const particleContainer = document.getElementById("particles");

const particleCount = 28;

for (let i = 0; i < particleCount; i++) {

    const particle = document.createElement("span");

    particle.classList.add("particle");

    const leftPosition = Math.random() * 100;
    const topPosition = Math.random() * 100;

    const size = Math.random() * 2 + 1;

    const duration = Math.random() * 10 + 12;
    const delay = Math.random() * -20;

    particle.style.left = `${leftPosition}%`;
    particle.style.top = `${topPosition}%`;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    particleContainer.appendChild(particle);
}
/* =========================================================
   AUTOMATION LAB TEST SUITE
========================================================= */

const runSuiteButton = document.getElementById("runSuiteButton");
const resetTestButton = document.getElementById("resetTestButton");

const testConsole = document.getElementById("testConsole");
const testStatus = document.getElementById("testStatus");

const usernameInput = document.getElementById("demoUsername");
const passwordInput = document.getElementById("demoPassword");

const demoLoginButton = document.getElementById("demoLoginButton");
const demoLogoutButton = document.getElementById("demoLogoutButton");

const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");

const loginError = document.getElementById("loginError");
const downloadReportButton = document.getElementById("downloadReportButton");

let latestTestReport = null;

function sleep(milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}


function addConsoleLine(text, className = "") {
    const line = document.createElement("div");

    line.className = `console-line ${className}`;
    line.textContent = text;

    testConsole.appendChild(line);
}


function clearAppState() {
    usernameInput.value = "";
    passwordInput.value = "";

    usernameInput.classList.remove("active-field");
    passwordInput.classList.remove("active-field");

    loginError.textContent = "";
    loginError.classList.add("hidden");

    loginScreen.classList.remove("hidden");
    dashboardScreen.classList.add("hidden");
}


function performLogin() {

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    loginError.classList.add("hidden");
    loginError.textContent = "";

    if (!username || !password) {
        loginError.textContent = "Username and password are required.";
        loginError.classList.remove("hidden");
        return false;
    }

    if (
        username !== "demo_user" ||
        password !== "secure_password"
    ) {
        loginError.textContent = "Invalid username or password.";
        loginError.classList.remove("hidden");
        return false;
    }

    loginScreen.classList.add("hidden");
    dashboardScreen.classList.remove("hidden");

    return true;
}


function performLogout() {
    clearAppState();
}


function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}


async function runTest(name, testFunction) {

    const start = performance.now();

    addConsoleLine(
        `> ${name}`,
        "console-command"
    );

    await sleep(350);

    try {

        await testFunction();

        const duration = Math.round(
            performance.now() - start
        );

        addConsoleLine(
            `✓ ${name} — ${duration}ms`,
            "console-success"
        );

        return true;

    } catch (error) {

        addConsoleLine(
            `✗ ${name}`,
            "console-error"
        );

        addConsoleLine(
            `  ${error.message}`,
            "console-error"
        );

        return false;
    }
}


/* =========================================================
   TEST CASES
========================================================= */

async function successfulLoginTest() {

    clearAppState();

    await sleep(300);

    usernameInput.classList.add("active-field");
    usernameInput.value = "demo_user";

    await sleep(300);

    usernameInput.classList.remove("active-field");

    passwordInput.classList.add("active-field");
    passwordInput.value = "secure_password";

    await sleep(300);

    passwordInput.classList.remove("active-field");

    performLogin();

    await sleep(400);

    assert(
        !dashboardScreen.classList.contains("hidden"),
        "Expected dashboard to be visible."
    );

    assert(
        dashboardScreen.textContent.includes("Login successful"),
        "Expected success message was not found."
    );
}


async function invalidPasswordTest() {

    clearAppState();

    usernameInput.value = "demo_user";
    passwordInput.value = "wrong_password";

    await sleep(400);

    performLogin();

    await sleep(350);

    assert(
        !loginError.classList.contains("hidden"),
        "Expected an authentication error."
    );

    assert(
        loginError.textContent === "Invalid username or password.",
        "Incorrect error message was displayed."
    );

    assert(
        dashboardScreen.classList.contains("hidden"),
        "Dashboard should not be visible."
    );
}


async function requiredFieldsTest() {

    clearAppState();

    await sleep(350);

    performLogin();

    await sleep(350);

    assert(
        !loginError.classList.contains("hidden"),
        "Expected required-field validation."
    );

    assert(
        loginError.textContent ===
        "Username and password are required.",
        "Required-field message was incorrect."
    );
}


async function logoutTest() {

    clearAppState();

    usernameInput.value = "demo_user";
    passwordInput.value = "secure_password";

    performLogin();

    await sleep(350);

    assert(
        !dashboardScreen.classList.contains("hidden"),
        "Login failed before logout test."
    );

    performLogout();

    await sleep(350);

    assert(
        !loginScreen.classList.contains("hidden"),
        "Login page was not restored."
    );

    assert(
        dashboardScreen.classList.contains("hidden"),
        "Dashboard should be hidden after logout."
    );
}


/* =========================================================
   SUITE EXECUTION
========================================================= */

async function runAutomationSuite() {

    runSuiteButton.disabled = true;

    testConsole.innerHTML = "";

    testStatus.textContent = "RUNNING";
    testStatus.className = "test-status running";

    addConsoleLine(
        "$ playwright test login.spec.js",
        "console-command"
    );

    await sleep(600);

    const suiteStart = performance.now();

    let passed = 0;
    const testResults = [];

    const tests = [
        ["Successful login", successfulLoginTest],
        ["Invalid password rejected", invalidPasswordTest],
        ["Required fields validated", requiredFieldsTest],
        ["User can logout", logoutTest]
    ];

    for (const [name, testFunction] of tests) {

        const testStart = performance.now();

        const result = await runTest(
            name,
            testFunction
        );

        const testDuration = Math.round(
            performance.now() - testStart
        );

        if (result) {
            passed++;
        }

        testResults.push({
            name: name,
            passed: result,
            duration: testDuration
        });

        await sleep(450);
    }

    const totalDuration = Math.round(
        performance.now() - suiteStart
    );

    latestTestReport = {
        suite: "Authentication Regression",
        framework: "Playwright",
        environment: "Portfolio Demo Application",
        executedAt: new Date(),
        passed: passed,
        failed: tests.length - passed,
        total: tests.length,
        duration: totalDuration,
        tests: testResults
    };

    if (downloadReportButton) {
        downloadReportButton.disabled = false;
    }

    addConsoleLine("");

    addConsoleLine(
        `${passed} passed | ${tests.length - passed} failed`,
        passed === tests.length
            ? "console-success"
            : "console-error"
    );

    addConsoleLine(
        `Total duration: ${totalDuration}ms`,
        "console-muted"
    );

    if (passed === tests.length) {

        testStatus.textContent = "PASSED";
        testStatus.className = "test-status passed";

    } else {

        testStatus.textContent = "FAILED";
        testStatus.className = "test-status failed";
    }

    runSuiteButton.disabled = false;
}


function resetAutomationSuite() {

    clearAppState();

    testConsole.innerHTML = `
        <div class="console-line console-muted">
            $ ready to execute test suite
        </div>
    `;

    testStatus.textContent = "READY";
    testStatus.className = "test-status idle";

    runSuiteButton.disabled = false;

    latestTestReport = null;

    if (downloadReportButton) {
        downloadReportButton.disabled = true;
    }
}


/* =========================================================
   APP INTERACTION
========================================================= */

if (demoLoginButton) {
    demoLoginButton.addEventListener(
        "click",
        performLogin
    );
}

if (demoLogoutButton) {
    demoLogoutButton.addEventListener(
        "click",
        performLogout
    );
}

if (runSuiteButton) {
    runSuiteButton.addEventListener(
        "click",
        runAutomationSuite
    );
}

if (resetTestButton) {
    resetTestButton.addEventListener(
        "click",
        resetAutomationSuite
    );
}

/* =========================================================
   TEST CASE EXPLORER
========================================================= */

const testCases = {

    successfulLogin: {

        title: "Successful Login",

        type: "Positive",

        description:
            "Verify that a registered user can authenticate " +
            "with valid credentials and reach the application dashboard.",

        steps: [
            "Open the application login page.",
            "Enter a valid username.",
            "Enter the correct password.",
            "Click the Sign In button.",
            "Verify that the login page is no longer displayed.",
            "Verify that the user dashboard is visible.",
            'Verify that the message "Login successful" is displayed.'
        ],

        code:
`test("user can login successfully", async ({ page }) => {

    await page.goto("/login");

    await page
        .getByLabel("Username")
        .fill("demo_user");

    await page
        .getByLabel("Password")
        .fill("secure_password");

    await page
        .getByRole("button", { name: "Sign In" })
        .click();

    await expect(
        page.getByText("Login successful")
    ).toBeVisible();

});`
    },


    invalidPassword: {

        title: "Invalid Password Rejected",

        type: "Negative",

        description:
            "Verify that authentication is rejected when a valid " +
            "username is submitted with an incorrect password.",

        steps: [
            "Open the application login page.",
            "Enter a valid username.",
            "Enter an incorrect password.",
            "Click the Sign In button.",
            "Verify that the user remains on the login screen.",
            "Verify that the dashboard is not displayed.",
            'Verify that "Invalid username or password." is displayed.'
        ],

        code:
`test("invalid password is rejected", async ({ page }) => {

    await page.goto("/login");

    await page
        .getByLabel("Username")
        .fill("demo_user");

    await page
        .getByLabel("Password")
        .fill("wrong_password");

    await page
        .getByRole("button", { name: "Sign In" })
        .click();

    await expect(
        page.getByText("Invalid username or password.")
    ).toBeVisible();

    await expect(
        page.getByText("Login successful")
    ).not.toBeVisible();

});`
    },


    requiredFields: {

        title: "Required Fields Validated",

        type: "Validation",

        description:
            "Verify that the application prevents authentication " +
            "when required login fields are left blank.",

        steps: [
            "Open the application login page.",
            "Leave the username field blank.",
            "Leave the password field blank.",
            "Click the Sign In button.",
            "Verify that authentication does not occur.",
            'Verify that "Username and password are required." is displayed.'
        ],

        code:
`test("login fields are required", async ({ page }) => {

    await page.goto("/login");

    await page
        .getByRole("button", { name: "Sign In" })
        .click();

    await expect(
        page.getByText(
            "Username and password are required."
        )
    ).toBeVisible();

});`
    },


    logout: {

        title: "User Can Logout",

        type: "Session",

        description:
            "Verify that an authenticated user can end their session " +
            "and is returned to the login screen.",

        steps: [
            "Authenticate using valid credentials.",
            "Verify that the dashboard is displayed.",
            "Click the Sign Out button.",
            "Verify that the dashboard is no longer displayed.",
            "Verify that the login screen is displayed again.",
            "Verify that the previous credentials have been cleared."
        ],

        code:
`test("authenticated user can logout", async ({ page }) => {

    await page.goto("/login");

    await page
        .getByLabel("Username")
        .fill("demo_user");

    await page
        .getByLabel("Password")
        .fill("secure_password");

    await page
        .getByRole("button", { name: "Sign In" })
        .click();

    await expect(
        page.getByText("Login successful")
    ).toBeVisible();

    await page
        .getByRole("button", { name: "Sign Out" })
        .click();

    await expect(
        page.getByText("Welcome back")
    ).toBeVisible();

});`
    }

};


const testCaseButtons =
    document.querySelectorAll(".test-case-item");

const selectedTestTitle =
    document.getElementById("selectedTestTitle");

const selectedTestType =
    document.getElementById("selectedTestType");

const selectedTestDescription =
    document.getElementById("selectedTestDescription");

const testStepsList =
    document.getElementById("testStepsList");

const selectedTestCode =
    document.getElementById("selectedTestCode");

const stepsTab =
    document.getElementById("stepsTab");

const codeTab =
    document.getElementById("codeTab");

const testStepsView =
    document.getElementById("testStepsView");

const testCodeView =
    document.getElementById("testCodeView");



function displayTestCase(testKey) {

    const test = testCases[testKey];

    if (!test) {
        return;
    }


    selectedTestTitle.textContent =
        test.title;

    selectedTestType.textContent =
        test.type;

    selectedTestDescription.textContent =
        test.description;


    testStepsList.innerHTML = "";

    test.steps.forEach(step => {

        const listItem =
            document.createElement("li");

        listItem.textContent = step;

        testStepsList.appendChild(listItem);

    });


    selectedTestCode.textContent =
        test.code;


    testCaseButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.test === testKey
        );

    });

}


function showStepsView() {

    stepsTab.classList.add("active");
    codeTab.classList.remove("active");

    testStepsView.classList.remove("hidden");
    testCodeView.classList.add("hidden");

}


function showCodeView() {

    codeTab.classList.add("active");
    stepsTab.classList.remove("active");

    testCodeView.classList.remove("hidden");
    testStepsView.classList.add("hidden");

}


testCaseButtons.forEach(button => {

    button.addEventListener("click", () => {

        displayTestCase(
            button.dataset.test
        );

    });

});


if (stepsTab) {
    stepsTab.addEventListener(
        "click",
        showStepsView
    );
}


if (codeTab) {
    codeTab.addEventListener(
        "click",
        showCodeView
    );
}


/* Load first case automatically */

if (selectedTestTitle) {
    displayTestCase("successfulLogin");
}

function downloadTestReport() {

    if (!latestTestReport) {
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


    /* =====================================================
       DOCUMENT SETTINGS
    ===================================================== */

    const pageWidth = doc.internal.pageSize.getWidth();

    const margin = 18;

    const contentWidth =
        pageWidth - (margin * 2);

    let y = 0;


    /* =====================================================
       HEADER
    ===================================================== */

    doc.setFillColor(18, 22, 28);

    doc.rect(
        0,
        0,
        pageWidth,
        48,
        "F"
    );


    doc.setTextColor(255, 255, 255);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(18);

    doc.text(
        "DEMONSTRATION RUN",
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
        "Playwright Authentication Test Report",
        margin,
        37
    );


    y = 61;


    /* =====================================================
       EXECUTION DETAILS
    ===================================================== */

    const executionId =
        "LAB-" +
        latestTestReport.executedAt
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
            latestTestReport
                .executedAt
                .toLocaleString()
        ],

        [
            "Suite",
            latestTestReport.suite
        ],

        [
            "Framework",
            latestTestReport.framework
        ],

        [
            "Environment",
            latestTestReport.environment
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


            doc.setTextColor(
                35,
                41,
                48
            );

            doc.setFont(
                "helvetica",
                "bold"
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
                latestTestReport.passed /
                latestTestReport.total
            ) * 100
        );


    const metrics = [

        {
            label: "TOTAL",
            value:
                latestTestReport.total
        },

        {
            label: "PASSED",
            value:
                latestTestReport.passed
        },

        {
            label: "FAILED",
            value:
                latestTestReport.failed
        },

        {
            label: "PASS RATE",
            value:
                `${passRate}%`
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


            doc.setTextColor(
                104,
                113,
                124
            );

            doc.setFontSize(7);

            doc.setFont(
                "helvetica",
                "bold"
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
                latestTestReport.failed > 0
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
       RESULTS TABLE
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


    /* Table header */

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


    doc.setTextColor(
        73,
        82,
        92
    );

    doc.setFontSize(8);

    doc.setFont(
        "helvetica",
        "bold"
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


    latestTestReport.tests.forEach(
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


            doc.setFontSize(9);

            doc.setFont(
                "helvetica",
                "normal"
            );

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
       RUN INFORMATION
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
        `Total execution time: ${latestTestReport.duration} ms`,
        margin,
        y
    );


    y += 6;


    doc.text(
        "Target: Login Demo Application",
        margin,
        y
    );


    /* =====================================================
       FOOTER
    ===================================================== */

    const pageHeight =
        doc.internal
            .pageSize
            .getHeight();


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
        "Portfolio demonstration — Playwright Authentication Suite",
        margin,
        pageHeight - 9
    );


    /* =====================================================
       DOWNLOAD
    ===================================================== */

    const date =
        latestTestReport
            .executedAt
            .toISOString()
            .slice(0, 10);


    doc.save(
        `Shane-Sahatoo-Playwright-Test-Report-${date}.pdf`
    );

}
if (downloadReportButton) {

    downloadReportButton.addEventListener(
        "click",
        downloadTestReport
    );

}

const emberContainer =
    document.querySelector(".campfire-embers");

if (emberContainer) {

    for (let i = 0; i < 18; i++) {

        const ember =
            document.createElement("span");

        ember.className =
            "campfire-ember";


        ember.style.left =
            `${47 + Math.random() * 6}%`;


        ember.style.bottom =
            `${5 + Math.random() * 5}%`;


        ember.style.animationDelay =
            `${Math.random() * 7}s`;


        ember.style.animationDuration =
            `${5 + Math.random() * 5}s`;


        ember.style.opacity =
            `${0.2 + Math.random() * 0.45}`;


        emberContainer.appendChild(
            ember
        );
    }

}