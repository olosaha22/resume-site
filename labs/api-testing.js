/* =========================================================
   API TESTING LAB
========================================================= */

const apiMethod =
    document.getElementById("apiMethod");

const apiEndpoint =
    document.getElementById("apiEndpoint");

const apiRequestBody =
    document.getElementById("apiRequestBody");

const sendApiRequestButton =
    document.getElementById("sendApiRequestButton");

const apiResponseStatus =
    document.getElementById("apiResponseStatus");

const apiResponseTime =
    document.getElementById("apiResponseTime");

const apiContentType =
    document.getElementById("apiContentType");

const apiResponseBody =
    document.getElementById("apiResponseBody");

const runApiSuiteButton =
    document.getElementById("runApiSuiteButton");

const resetApiButton =
    document.getElementById("resetApiButton");

const apiTestStatus =
    document.getElementById("apiTestStatus");

const apiTestConsole =
    document.getElementById("apiTestConsole");

const downloadApiReportButton =
    document.getElementById("downloadApiReportButton");

let apiReport = null;


/* =========================================================
   FAKE API
========================================================= */

function apiSleep(ms) {

    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });

}


function createApiResponse(
    status,
    body,
    delay = 120
) {

    return {
        status,
        body,
        headers: {
            "content-type":
                "application/json"
        },
        delay
    };

}


async function fakeApiRequest(
    endpoint,
    method,
    body
) {

    const start =
        performance.now();


    await apiSleep(
        120 + Math.random() * 180
    );


    let response;


    /* LOGIN */

    if (
        endpoint === "login" &&
        method === "POST"
    ) {

        if (
            !body.username ||
            !body.password
        ) {

            response =
                createApiResponse(
                    400,
                    {
                        error:
                            "username and password are required"
                    }
                );

        } else if (
            body.username ===
                "demo_user" &&
            body.password ===
                "secure_password"
        ) {

            response =
                createApiResponse(
                    200,
                    {
                        token:
                            "demo-access-token",
                        userId:
                            42,
                        role:
                            "customer"
                    }
                );

        } else {

            response =
                createApiResponse(
                    401,
                    {
                        error:
                            "invalid credentials"
                    }
                );
        }

    }


    /* USER */

    else if (
        endpoint === "user" &&
        method === "GET"
    ) {

        response =
            createApiResponse(
                200,
                {
                    id: 42,
                    name:
                        "Demo User",
                    email:
                        "demo@example.com",
                    active:
                        true
                }
            );

    }


    /* CREATE ORDER */

    else if (
        endpoint === "order" &&
        method === "POST"
    ) {

        if (
            !Array.isArray(
                body.items
            ) ||
            body.items.length === 0
        ) {

            response =
                createApiResponse(
                    400,
                    {
                        error:
                            "order items are required"
                    }
                );

        } else {

            response =
                createApiResponse(
                    201,
                    {
                        orderId:
                            123,
                        status:
                            "created",
                        itemCount:
                            body.items.length,
                        total:
                            219.98
                    }
                );
        }

    }


    /* ORDER LOOKUP */

    else if (
        endpoint ===
            "orderLookup" &&
        method === "GET"
    ) {

        response =
            createApiResponse(
                200,
                {
                    orderId:
                        123,
                    status:
                        "created",
                    currency:
                        "CAD",
                    total:
                        219.98
                }
            );

    }


    else {

        response =
            createApiResponse(
                404,
                {
                    error:
                        "endpoint not found"
                }
            );
    }


    const duration =
        Math.round(
            performance.now() -
            start
        );


    return {
        ...response,
        duration
    };

}


/* =========================================================
   REQUEST UI
========================================================= */

const endpointDefaults = {

    login: {
        method:
            "POST",
        body: {
            username:
                "demo_user",
            password:
                "secure_password"
        }
    },

    user: {
        method:
            "GET",
        body: {}
    },

    order: {
        method:
            "POST",
        body: {
            items: [
                {
                    productId:
                        "headphones",
                    quantity:
                        1
                },
                {
                    productId:
                        "keyboard",
                    quantity:
                        1
                }
            ]
        }
    },

    orderLookup: {
        method:
            "GET",
        body: {}
    }

};


function loadEndpointDefaults() {

    const config =
        endpointDefaults[
            apiEndpoint.value
        ];


    apiMethod.value =
        config.method;


    apiRequestBody.value =
        JSON.stringify(
            config.body,
            null,
            4
        );

}


function renderApiResponse(
    response
) {

    apiResponseStatus.textContent =
        response.status;


    apiResponseStatus.className =
        "api-response-status";


    if (
        response.status >= 200 &&
        response.status < 300
    ) {

        apiResponseStatus.classList.add(
            "success"
        );

    } else if (
        response.status >= 400 &&
        response.status < 500
    ) {

        apiResponseStatus.classList.add(
            "warning"
        );

    } else {

        apiResponseStatus.classList.add(
            "error"
        );

    }


    apiResponseTime.textContent =
        `${response.duration}ms`;


    apiContentType.textContent =
        response.headers[
            "content-type"
        ];


    apiResponseBody.textContent =
        JSON.stringify(
            response.body,
            null,
            4
        );

}


async function sendApiRequest() {

    let body = {};


    if (
        apiRequestBody.value.trim()
    ) {

        try {

            body =
                JSON.parse(
                    apiRequestBody.value
                );

        } catch {

            apiResponseStatus.textContent =
                "INVALID JSON";

            apiResponseStatus.className =
                "api-response-status error";

            return;
        }
    }


    sendApiRequestButton.disabled =
        true;


    const response =
        await fakeApiRequest(
            apiEndpoint.value,
            apiMethod.value,
            body
        );


    renderApiResponse(
        response
    );


    sendApiRequestButton.disabled =
        false;

}


if (apiEndpoint) {

    apiEndpoint.addEventListener(
        "change",
        loadEndpointDefaults
    );

}


if (sendApiRequestButton) {

    sendApiRequestButton.addEventListener(
        "click",
        sendApiRequest
    );

}


if (apiEndpoint) {

    loadEndpointDefaults();

}


/* =========================================================
   ASSERTIONS
========================================================= */

function apiAssert(
    condition,
    message
) {

    if (!condition) {
        throw new Error(message);
    }

}


function apiConsoleLine(
    text,
    className = ""
) {

    const line =
        document.createElement("div");

    line.className =
        `console-line ${className}`;

    line.textContent =
        text;

    apiTestConsole.appendChild(
        line
    );

}


/* =========================================================
   API TESTS
========================================================= */

async function successfulLoginApiTest() {

    const response =
        await fakeApiRequest(
            "login",
            "POST",
            {
                username:
                    "demo_user",
                password:
                    "secure_password"
            }
        );


    apiAssert(
        response.status === 200,
        "Expected status 200."
    );


    apiAssert(
        typeof response.body.token
            === "string",
        "Token was not returned."
    );


    apiAssert(
        typeof response.body.userId
            === "number",
        "userId must be numeric."
    );


    apiAssert(
        response.headers[
            "content-type"
        ] ===
            "application/json",

        "Unexpected Content-Type."
    );


    apiConsoleLine(
        "✓ Status code = 200"
    );

    apiConsoleLine(
        "✓ Authentication token returned"
    );

}


async function invalidLoginApiTest() {

    const response =
        await fakeApiRequest(
            "login",
            "POST",
            {
                username:
                    "demo_user",
                password:
                    "wrong_password"
            }
        );


    apiAssert(
        response.status === 401,
        "Expected status 401."
    );


    apiAssert(
        response.body.error ===
            "invalid credentials",

        "Unexpected error response."
    );


    apiConsoleLine(
        "✓ Invalid credentials rejected"
    );

}


async function requiredFieldsApiTest() {

    const response =
        await fakeApiRequest(
            "login",
            "POST",
            {}
        );


    apiAssert(
        response.status === 400,
        "Expected status 400."
    );


    apiAssert(
        response.body.error ===
        "username and password are required",

        "Validation error incorrect."
    );


    apiConsoleLine(
        "✓ Required field validation confirmed"
    );

}


async function createOrderApiTest() {

    const response =
        await fakeApiRequest(
            "order",
            "POST",
            {
                items: [
                    {
                        productId:
                            "headphones",
                        quantity:
                            1
                    }
                ]
            }
        );


    apiAssert(
        response.status === 201,
        "Expected status 201."
    );


    apiAssert(
        response.body.orderId === 123,
        "Expected order ID."
    );


    apiAssert(
        response.body.status ===
            "created",

        "Order status incorrect."
    );


    apiConsoleLine(
        "✓ Order created successfully"
    );

}


async function responseSchemaTest() {

    const response =
        await fakeApiRequest(
            "user",
            "GET",
            {}
        );


    const user =
        response.body;


    apiAssert(
        typeof user.id ===
            "number",
        "id must be numeric."
    );


    apiAssert(
        typeof user.name ===
            "string",
        "name must be a string."
    );


    apiAssert(
        typeof user.email ===
            "string",
        "email must be a string."
    );


    apiAssert(
        typeof user.active ===
            "boolean",
        "active must be boolean."
    );


    apiConsoleLine(
        "✓ Response schema validated"
    );

}


/* =========================================================
   SUITE
========================================================= */

async function executeApiTest(
    name,
    testFunction
) {

    const start =
        performance.now();

    apiConsoleLine(
        `> ${name}`,
        "console-command"
    );

    await apiSleep(250);

    try {

        await testFunction();

        const duration =
            Math.round(
                performance.now() - start
            );

        apiConsoleLine(
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

        apiConsoleLine(
            `✗ ${name}`,
            "console-error"
        );

        apiConsoleLine(
            `  ${error.message}`,
            "console-error"
        );

        return {
            name,
            passed: false,
            duration,
            error: error.message
        };
    }
}


async function runApiSuite() {



        runApiSuiteButton.disabled = true;

        if (downloadApiReportButton) {
            downloadApiReportButton.disabled = true;
        }

        apiTestConsole.innerHTML = "";


        apiTestStatus.textContent =
            "RUNNING";

        apiTestStatus.className =
            "test-status running";


        apiConsoleLine(
            "$ mvn test -Dtest=ApiTests",
            "console-command"
        );

        await apiSleep(500);


        const tests = [

            [
                "Successful Login API",
                successfulLoginApiTest
            ],

            [
                "Invalid credentials return 401",
                invalidLoginApiTest
            ],

            [
                "Missing fields return 400",
                requiredFieldsApiTest
            ],

            [
                "Create order returns 201",
                createOrderApiTest
            ],

            [
                "Response schema validated",
                responseSchemaTest
            ]

        ];


        /*
            Track total execution time for the suite.
        */

        const suiteStart =
            performance.now();


        /*
            Store each individual test result here.
        */

        const results = [];


        /*
            Execute each test one at a time.
        */

        for (
            const [name, testFunction]
            of tests
        ) {

            const result =
                await executeApiTest(
                    name,
                    testFunction
                );


            results.push(result);


            await apiSleep(350);

        }


        /*
            Calculate results.
        */

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


        /*
            This is the console summary section
            I referred to earlier.
        */

        apiConsoleLine("");


        apiConsoleLine(
            `${passed} passed | ${failed} failed`,
            failed === 0
                ? "console-success"
                : "console-error"
        );


        apiConsoleLine(
            `Total duration: ${duration}ms`,
            "console-muted"
        );


        /*
            Save all of the execution information
            so the PDF generator can use it.
        */

        apiReport = {

            suite:
                "Authentication & Orders API Regression",

            framework:
                "REST Assured + Java",

            environment:
                "Portfolio Demo REST API",

            contentType:
                "application/json",

            executedAt:
                new Date(),

            passed:
                passed,

            failed:
                failed,

            total:
                results.length,

            duration:
                duration,

            tests:
                results

        };


        /*
            Update test status.
        */

        if (failed === 0) {

            apiTestStatus.textContent =
                "PASSED";

            apiTestStatus.className =
                "test-status passed";

        } else {

            apiTestStatus.textContent =
                "FAILED";

            apiTestStatus.className =
                "test-status failed";

        }


        /*
            PDF download is now available because
            apiReport contains the completed run.
        */

        if (downloadApiReportButton) {
            downloadApiReportButton.disabled = false;
        }


        runApiSuiteButton.disabled = false;



}


/* =========================================================
   RESET
========================================================= */

function resetApiLab() {

    apiReport = null;

    if (downloadApiReportButton) {
        downloadApiReportButton.disabled = true;
    }

    loadEndpointDefaults();


    apiResponseStatus.textContent =
        "—";

    apiResponseStatus.className =
        "api-response-status";


    apiResponseTime.textContent =
        "—";

    apiContentType.textContent =
        "—";


    apiResponseBody.textContent =
`{
    "message": "Send a request to begin."
}`;


    apiTestConsole.innerHTML =
`<div class="console-line console-muted">
    $ ready to execute API suite
</div>`;


    apiTestStatus.textContent =
        "READY";


    apiTestStatus.className =
        "test-status idle";

}


if (runApiSuiteButton) {

    runApiSuiteButton.addEventListener(
        "click",
        runApiSuite
    );

}

if (downloadApiReportButton) {

    downloadApiReportButton.addEventListener(
        "click",
        downloadApiReport
    );

}


if (resetApiButton) {

    resetApiButton.addEventListener(
        "click",
        resetApiLab
    );

}


/* =========================================================
   TEST EXPLORER
========================================================= */

const apiTestCases = {

    successfulLogin: {

        title:
            "Successful Login API",

        type:
            "Positive",

        description:
            "Verify that valid credentials return a successful response and authentication token.",

        steps: [
            "Send POST /api/login.",
            "Provide a valid username and password.",
            "Verify HTTP status is 200.",
            "Verify an authentication token is returned.",
            "Verify userId is numeric.",
            "Verify Content-Type is application/json."
        ],

        code:
`@Test
public void successfulLoginReturnsToken() {

    given()
        .contentType(ContentType.JSON)
        .body(loginRequest)
    .when()
        .post("/api/login")
    .then()
        .statusCode(200)
        .contentType(ContentType.JSON)
        .body("token", notNullValue())
        .body("userId", isA(Integer.class));

}`
    },


    invalidLogin: {

        title:
            "Invalid Credentials Return 401",

        type:
            "Negative",

        description:
            "Verify that incorrect login credentials are rejected with an HTTP 401 response.",

        steps: [
            "Send POST /api/login.",
            "Provide a valid username and incorrect password.",
            "Verify HTTP status is 401.",
            "Verify error message states invalid credentials.",
            "Verify no authentication token is returned."
        ],

        code:
`@Test
public void invalidCredentialsReturn401() {

    given()
        .contentType(ContentType.JSON)
        .body(invalidLoginRequest)
    .when()
        .post("/api/login")
    .then()
        .statusCode(401)
        .body(
            "error",
            equalTo("invalid credentials")
        );

}`
    },


    requiredFields: {

        title:
            "Missing Fields Return 400",

        type:
            "Validation",

        description:
            "Verify that the API rejects login requests that omit required fields.",

        steps: [
            "Send POST /api/login.",
            "Submit an empty request body.",
            "Verify HTTP status is 400.",
            "Verify a required-field validation message is returned."
        ],

        code:
`@Test
public void missingLoginFieldsReturn400() {

    given()
        .contentType(ContentType.JSON)
        .body("{}")
    .when()
        .post("/api/login")
    .then()
        .statusCode(400)
        .body(
            "error",
            containsString("required")
        );

}`
    },


    createOrder: {

        title:
            "Create Order Returns 201",

        type:
            "Creation",

        description:
            "Verify that a valid order request creates a new resource and returns HTTP 201.",

        steps: [
            "Send POST /api/orders.",
            "Include at least one valid product.",
            "Verify HTTP status is 201.",
            "Verify orderId is returned.",
            "Verify order status is created."
        ],

        code:
`@Test
public void createOrderReturns201() {

    given()
        .contentType(ContentType.JSON)
        .body(orderRequest)
    .when()
        .post("/api/orders")
    .then()
        .statusCode(201)
        .body("orderId", notNullValue())
        .body(
            "status",
            equalTo("created")
        );

}`
    },


    schema: {

        title:
            "Response Schema Validated",

        type:
            "Contract",

        description:
            "Verify that the user response contains the expected fields and data types.",

        steps: [
            "Send GET /api/users/42.",
            "Verify HTTP status is 200.",
            "Verify id is numeric.",
            "Verify name is a string.",
            "Verify email is a string.",
            "Verify active is boolean."
        ],

        code:
`@Test
public void userResponseMatchesSchema() {

    given()
    .when()
        .get("/api/users/42")
    .then()
        .statusCode(200)
        .body("id", isA(Integer.class))
        .body("name", isA(String.class))
        .body("email", isA(String.class))
        .body("active", isA(Boolean.class));

}`
    }

};


const apiCaseButtons =
    document.querySelectorAll(
        ".api-test-case-item"
    );

const apiSelectedTitle =
    document.getElementById(
        "apiSelectedTitle"
    );

const apiSelectedType =
    document.getElementById(
        "apiSelectedType"
    );

const apiSelectedDescription =
    document.getElementById(
        "apiSelectedDescription"
    );

const apiStepsList =
    document.getElementById(
        "apiStepsList"
    );

const apiSelectedCode =
    document.getElementById(
        "apiSelectedCode"
    );

const apiStepsTab =
    document.getElementById(
        "apiStepsTab"
    );

const apiCodeTab =
    document.getElementById(
        "apiCodeTab"
    );

const apiStepsView =
    document.getElementById(
        "apiStepsView"
    );

const apiCodeView =
    document.getElementById(
        "apiCodeView"
    );


function displayApiTestCase(
    key
) {

    const test =
        apiTestCases[key];


    if (!test) {
        return;
    }


    apiSelectedTitle.textContent =
        test.title;


    apiSelectedType.textContent =
        test.type;


    apiSelectedDescription.textContent =
        test.description;


    apiStepsList.innerHTML =
        "";


    test.steps.forEach(step => {

        const item =
            document.createElement(
                "li"
            );

        item.textContent =
            step;

        apiStepsList.appendChild(
            item
        );

    });


    apiSelectedCode.textContent =
        test.code;


    apiCaseButtons.forEach(
        button => {

            button.classList.toggle(
                "active",

                button.dataset.apiTest ===
                key
            );

        }
    );

}


apiCaseButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                displayApiTestCase(
                    button.dataset.apiTest
                );

            }
        );

    }
);


if (apiStepsTab) {

    apiStepsTab.addEventListener(
        "click",
        () => {

            apiStepsTab.classList.add(
                "active"
            );

            apiCodeTab.classList.remove(
                "active"
            );

            apiStepsView.classList.remove(
                "hidden"
            );

            apiCodeView.classList.add(
                "hidden"
            );

        }
    );

}


if (apiCodeTab) {

    apiCodeTab.addEventListener(
        "click",
        () => {

            apiCodeTab.classList.add(
                "active"
            );

            apiStepsTab.classList.remove(
                "active"
            );

            apiCodeView.classList.remove(
                "hidden"
            );

            apiStepsView.classList.add(
                "hidden"
            );

        }
    );

}


if (apiSelectedTitle) {

    displayApiTestCase(
        "successfulLogin"
    );

}

function downloadApiReport() {

    if (!apiReport) {
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
        pageWidth - margin * 2;

    let y = 0;


    /* HEADER */

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
        "API TESTING DEMO",
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
        "REST API Test Report",
        margin,
        37
    );

    y = 61;


    /* EXECUTION DETAILS */

    const executionId =
        "API-" +
        apiReport.executedAt
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
            apiReport.executedAt
                .toLocaleString()
        ],

        [
            "Suite",
            apiReport.suite
        ],

        [
            "Framework",
            apiReport.framework
        ],

        [
            "Environment",
            apiReport.environment
        ],

        [
            "Content-Type",
            apiReport.contentType
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


    /* SUMMARY */

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
                apiReport.passed /
                apiReport.total
            ) * 100
        );

    const metrics = [

        {
            label: "TOTAL",
            value: apiReport.total
        },

        {
            label: "PASSED",
            value: apiReport.passed
        },

        {
            label: "FAILED",
            value: apiReport.failed
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
                apiReport.failed > 0
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


    /* RESULTS TABLE */

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

    apiReport.tests.forEach(
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


    /* EXECUTION NOTES */

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
        `Total execution time: ${apiReport.duration} ms`,
        margin,
        y
    );

    y += 6;

    doc.text(
        "Coverage: Authentication, validation, resource creation and response contracts",
        margin,
        y
    );


    /* DISCLAIMER */

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
        "This interactive browser project simulates REST API responses and",
        margin + 5,
        y + 13
    );

    doc.text(
        "executes real client-side assertions against those response objects.",
        margin + 5,
        y + 17
    );


    /* FOOTER */

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
        "Generated from interactive Automation Lab.",
        margin,
        pageHeight - 14
    );

    doc.text(
        "REST Assured + Java — Authentication & Orders API Suite",
        margin,
        pageHeight - 9
    );


    /* SAVE */

    const date =
        apiReport.executedAt
            .toISOString()
            .slice(0, 10);

    doc.save(
        `API-Test-Report-${date}.pdf`
    );
}

