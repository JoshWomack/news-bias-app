const RENDER = {
    startPage: true,
    resultsPage: false,
    noResultsPage: false
}

function render() {
    if (RENDER.startPage) {
        renderStartPage();
    } else if (RENDER.resultsPage) {
        renderResultsPage();
    } else if (RENDER.noResultsPage) {
        renderNoResultsPage();
    }
}

function renderStartPage() {
    console.log("renderStartPage ran");
    $("body").html(TEMPLATES.startPage);
}

function renderResultsPage() {
    console.log("renderResultsPage ran");
    $("body").html(TEMPLATES.resultsPage);
}


function renderNoResultsPage() {
    console.log("renderNoResultsPage ran");
    $("body").html(TEMPLATES.noResultsPage);
}

function addEventListeners() {
    addFormSubmissionListener();
    addNewSearchButtonListener();

}

function addFormSubmissionListener() {
    $("body").on("submit", "#newsSearchForm", e => {
        e.preventDefault();
        console.log("Form Submitted");
        if (result) {
            RENDER.startPage = false;
            RENDER.noResultsPage = false;
            RENDER.resultsPage = true;
            render();
        } else {
            RENDER.startPage = false;
            RENDER.noResultsPage = true;
            RENDER.resultsPage = false;
            render();
        }
    })
}

function addNewSearchButtonListener() {
    $("body").on("click", ".new-search-btn", e => {
        RENDER.startPage = true;
        RENDER.resultsPage = false;
        RENDER.noResultsPage = false;
        render();
    })
}





$(function () {
    addEventListeners();
    render();
})