/**
 * This code is written for PivotRoots Assignment.
 * @author Yash M Naik   
 * @date 25-12-2021 * 
 */


/**
 * This are global Variables
 */
let MONTHLYDATA = [];
let YEARLYDATA = [];
let GRADES = [];
let BOARDS = [];
let MONTHLYBOARDS = [];
let FILTEREDARRAYYEARLY = [];
let FILTEREDARRAYMONTHLY = [];

/**
 * Fetch data from the data.json file
 */
(async function () {
    const response = await fetch("./data.json");
    const data = await response.json();
    dataFromJSONFile(data[1].yearly, data[0].monthly)
    FILTEREDARRAYYEARLY = getFilteredDatabyGradeYear("Grade 6");
    FILTEREDARRAYMONTHLY = getFilteredDatabyGrade("Grade 6");
    yearlyDisplayView("CBSE");

})();



/* This function returns the data form the json to a global Array
*  based on Month and Year
*/
function dataFromJSONFile(year, month) {
    YEARLYDATA = year;
    MONTHLYDATA = month;
    renderBoardsByYear();
    generateGrades();
}

/* The generateGrades and renderGrades funtion is used to process the dropdown 
* with the values based on Grades from the monthly and yearly data.
*/
function generateGrades() {
    if (GRADES) {
        MONTHLYDATA.forEach(data => {
            GRADES.push(data.grade);
        });
    }
    renderGrades();
}

function renderGrades() {
    GRADES.forEach(grade => {
        $('#month-class').append(`<option value="${grade}">${grade}</option>`)
        $('#year-class').append(`<option value="${grade}">${grade}</option>`)
    })
}



/* Diaplay Data Based on Year  */


/* Filte the Data from parent array and store to a global array for year
 */
function getFilteredDatabyGradeYear(grade) {
    return YEARLYDATA.filter((item) => item.grade == grade);
}

function yearlyDisplayView(boardName) {
    let yearByBoard = FILTEREDARRAYYEARLY[0].boards[boardName];
    $('.main-content--year').text("");
    $('.syllabus-list').text("");
    $('#syllabus-topics-set1').text("");
    $('#syllabus-topics-set2').text("");
    $('#syllabus-topics-set3').text("");
    renderYearlyView(yearByBoard);
}

function renderYearlyView(data) {
    $('.main-content--year').append(`
    <div class="main-content-data">
        <h3>Total Sessions</h3>
        <h3>${data.total_sessions}</h3>
     </div>
    <div class="main-content-data">
        <h3>Online Pre Assignment</h3>
        <h3>${data.online_pre_assignments}</h3>
    </div>
    <div class="main-content-data">
        <h3>Online Post Assignment</h3>
        <h3>${data.online_post_assignments}</h3>
    </div>
    <div class="main-content-data">
        <h3>Online Assignments</h3>
        <h3>${data.online_assignments}</h3>
    </div>
    <div class="main-content-data">
        <h3>Online Test</h3>
        <h3>${data.online_tests}</h3>
    </div>
    <div class="main-content-data">
        <h3>Career Counselling Session with Edu Coach</h3>
        <h3>${data.career_counselling_sessions}</h3>
    </div>
    `)

    /** This variable can be replaced by the
     *  discounted price if the discount value is changed
     */

    let discountedPrice = calculatePercentage(`${data.discount}`, `${data.price}`);

    if (discountedPrice) {
        $('.course-price').text(discountedPrice);
    } else {
        $('.course-price').text(`${data.price}`);
    }


    $('.vacant-seat').text(`${data.seats} seats`);
    $('.per-class-price').text(data.per_class_price);

    let syllabusData = [];
    let subTopic = [];


    if (data.syllabus.length == 1) {
        let mainTopic = Object.keys(data.syllabus[0]);
        mainTopic.forEach((title, index) => {
            subTopic.push(data.syllabus[0][`${title}`].split("!"));

            $('.syllabus-list').append(`<ul id="syllabus-topics-set${index}">
            <li class="topic-heading">${title}</li>
            </ul>`);
        }

        )

        subTopic.forEach((subTopicdesc, index) => {
            subTopicdesc.forEach((subtopic) => {
                $(`#syllabus-topics-set${index}`).append(`
                <li>${subtopic}</li>
                `)
            })

        })



    } else {
        syllabusData = data.syllabus.split("!");
        $('.syllabus-list').append(`
        <ul id="syllabus-topics-set1">

        </ul>
        <ul id="syllabus-topics-set2">

        </ul>
        <ul id="syllabus-topics-set3">

        </ul>
        `);
        syllabusData.forEach((topic, index) => {
            if (index <= 4) {
                $('#syllabus-topics-set1').append(`
                <li class="syllabus-topics--list">${topic}</li>
                `)
            } else if (index > 4 && index <= 9) {
                $('#syllabus-topics-set2').append(`
                <li class="syllabus-topics--list">${topic}</li>
                `)
            } else if (index > 9 && index <= 14) {
                $('#syllabus-topics-set3').append(`
                <li class="syllabus-topics--list">${topic}</li>
                `)
            }
            else if (index > 14 && index <= 19) {
                $('#syllabus-topics-set4').append(`
                <li class="syllabus-topics--list">${topic}</li>
                `)
            } else {
                $('#syllabus-topics-set5').append(`
                <li class="syllabus-topics--list">${topic}</li>
                `)
            }

        })
    }
}

/**This function is written for calculating the
 * discount and displaying it in the footer section 
 * json Data is 0 
 */

function calculatePercentage(number, price) {
    return (number / 100) * price;
}


/* Display Data Based on Month */

function getFilteredDatabyGrade(grade) {
    return MONTHLYDATA.filter((item) => item.grade == grade);
}


function monthlyDisplayView(boardName) {
    $('#monthlySessionPackage').text(" ");
    let filteredBoardsData = Object.values(FILTEREDARRAYMONTHLY[0].boards[boardName]);
    filteredBoardsData.forEach((sessionData, index) => renderSession(sessionData, index));
    $('#monthlyPack0').attr("checked", "checked");
}

function renderSession(sessionData, index) {
    $('#monthlySessionPackage').append(`
    <label for="monthlyPack${index}">
                                        <input type="radio" name="monthly-packages" id="monthlyPack${index}">
                                        <div class="packages-duration">
                                            <h2 class="package-time">${sessionData.valid}</h2>
                                            <p class="duration-desc">${sessionData.refund}</p>
                                        </div>
                                        <div class="packages-cost">
                                            <h2 class="package-time"><span>&#8377 </span>${sessionData.per_class_price * sessionData.total_sessions} <span class="original-cost"><span>&#8377 </span>${sessionData.price}</span></h2>
                                            <p class="duration-desc">${sessionData.discount}% off</p>
                                        </div>
                                        <div class="packages-cps">
                                            <h2 class="package-time"><span>&#8377 </span>${sessionData.per_class_price} per session</h2>
                                            <p class="duration-desc">${sessionData.total_sessions} sessions</p>
                                        </div>
                                    </label>
    `)
}



/* There are different boards eg. CBSE ICSE based on the grade selected
* So both the month and year are seperately rendered the 
*   function renderBoardsByMonth renders boards in month
*   function renderBoards renders the boards in year
*/
function renderBoardsByMonth() {
    $('.boards-select-month').text("");
    MONTHLYBOARDS = Object.keys(FILTEREDARRAYMONTHLY[0].boards);
    MONTHLYBOARDS.forEach((board, index) => {
        if (board != "general") {
            $('.boards-select-month').append(`<li class="boards-tabs-month" data-tab-index="${index}" aria-selected="false">
        <a href="javascript:" class="boards-menu-anchor">${board}</a>
    </li>`)
        }

    })

    $('.boards-tabs-month:first-child').addClass("active");
    $('.boards-tabs-month:first-child').attr("aria-selected", "true");
    selectBoards();
}

function renderBoardsByYear() {
    let boards;
    if (FILTEREDARRAYYEARLY.length) {
        boards = FILTEREDARRAYYEARLY[0].boards;
    } else {
        boards = YEARLYDATA[0].boards;
    }
    $('.boards-select').text("");
    BOARDS = Object.keys(boards);
    BOARDS.forEach((board, index) => {
        $('.boards-select').append(`<li class="boards-tabs" data-tab-index="${index}" aria-selected="false">
        <a href="javascript:" class="boards-menu-anchor">${board}</a>
    </li>`)
    })

    $('.boards-tabs:first-child').addClass("active");
    $('.boards-tabs:first-child').attr("aria-selected", "true")
    selectBoards();
}


/**
 * The functions below are used for DOM Manupulation
 * and fetching data from events
 *  
 */

function callbackMonth(event) {
    FILTEREDARRAYMONTHLY = getFilteredDatabyGrade(event.target.value);
    renderBoardsByMonth();
    if (MONTHLYBOARDS.includes("CBSE")) {
        monthlyDisplayView(MONTHLYBOARDS[0]);
    } else {
        monthlyDisplayView("general");
    }
}


$("#month-class").change(callbackMonth);

$("#year-class").change((event) => {
    FILTEREDARRAYYEARLY = getFilteredDatabyGradeYear(event.target.value);
    renderBoardsByYear();
    yearlyDisplayView("CBSE");
});


$(".duration-tabs").on('click', function (event) {
    let currentSelected = $(this).attr("class");
    if (!$(this).hasClass("active")) {
        if (currentSelected) {
            $(".duration-tabs.active").removeClass('active');
            $(".duration-tabs").attr("aria-selected", "false");
            $(this).addClass("active");
            $(this).attr("aria-selected", "true");
            callbackMonth({ target: { value: "Grade 6" } });
        }

        let selectedTabIndex = $(this).data("tab-index");
        $('.duration-content-panel').hide();
        $('.duration-content-panel').each(function () {
            $(`.duration-content-panel[data-tab-index=${selectedTabIndex}]`).show();
        });
    }

})

function selectBoards() {

    $('.boards-tabs').on('click', function (event) {
        let currentSelectedBoard = $(this).attr("class");
        if (!$(this).hasClass("active")) {
            if (currentSelectedBoard) {
                $(".boards-tabs.active").removeClass('active');
                $(".boards-tabs").attr("aria-selected", "false");
                $(this).addClass("active");
                $(this).attr("aria-selected", "true");
            }
            yearlyDisplayView($(this).text().trim());

        }

    })

    $('.boards-tabs-month').on('click', function (event) {
        let currentSelectedBoardMonth = $(this).attr("class");
        if (!$(this).hasClass("active")) {
            if (currentSelectedBoardMonth) {
                $(".boards-tabs-month.active").removeClass('active');
                $(".boards-tabs-month").attr("aria-selected", "false");
                $(this).addClass("active");
                $(this).attr("aria-selected", "true");
            }
            monthlyDisplayView($(this).text().trim());
        }

    })
}


