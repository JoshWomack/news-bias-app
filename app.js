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
    $("body").html(STORE.startPage);
}

function renderResultsPage() {
    console.log("renderResultsPage ran");
    $("body").html(STORE.resultsPage);
}


function renderNoResultsPage() {
    console.log("renderNoResultsPage ran");
    $("body").html(STORE.noResultsPage);
}

function addEventListeners() {
    addFormSubmissionListener();
    addNewSearchButtonListener();

}

function addFormSubmissionListener() {
    $("body").on("submit", "#newsSearchForm", e => {
        e.preventDefault();
        updateSearchValues();
        const params = formatQueryParams(STORE.searchCriteria);
        getNewsData(params);
        console.log("Form Submitted");
        // if (result) {
        RENDER.startPage = false;
        RENDER.noResultsPage = false;
        RENDER.resultsPage = true;
        render();
        // } else {
        //     RENDER.startPage = false;
        //     RENDER.noResultsPage = true;
        //     RENDER.resultsPage = false;
        //     render();
        // }
    })
}

function getNewsData(params) {
    console.log("getNewsData ran")
    const url = 'https://newsapi.org/v2/everything?' + params
    fetch('news.json')
        .then(response => response.json())
        .then(response => {
            console.log(response)
            const transformedNewsArticles = transformNewsArticles(response.articles);
            postSentimentRequest(transformedNewsArticles);

            ;

            // const sources = response.articles.map(article => article.source.name);
            // const frequency = getFrequency(sources);
            // appendResults(frequency);
        })
}

function formatSourceName(object) {

    const returnObj = object.documents.map(document => {
        return {
            id: `${document.id.replace(/[0-9]/g,"")}`,
            score: `${document.score}`
        }
    })

    console.log(returnObj);
}

function postSentimentRequest(documents) {
    fetch("https://eastus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Ocp-Apim-Subscription-Key": "54e4071cbabc4bc89e65834ee3865d3a"
            },
            body: `${documents}`
        })
        .then(response => response.json())
        .then(response => formatSourceName(response));

}

function transformNewsArticles(articles) {
    console.log(articles);
    articlesObject = {
        documents: []
    };
    articles.forEach((article, index) => {
        console.log(index.toString());
        articlesObject.documents.push({
            language: "en",
            id: `${article.source.name + index.toString()}`,
            text: `${article.title}`
        })
    })
    return JSON.stringify(articlesObject);
}

function appendResults(sources) {
    Object.keys(sources).forEach(source => {
        $('.results-containers').append(`<div class="result-container">
        <div class="result">
            <div>
                <p class="news-source">${source}</p>
                <p class="article-count">${sources[source]}</p>
            </div>
            <div class="sent-circle">
                <p class="sentiment-score">88</p>
            </div>
        </div>
        </div>`)
    })
}

function getFrequency(arr) {
    freqObj = {}
    arr.forEach(item => {
        if (Object.keys(freqObj).some(property => property === item)) {
            freqObj[item]++
        } else {
            freqObj[item] = 1;
        }
    })
    return freqObj;
}




function formatQueryParams(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function updateSearchValues() {
    STORE.searchCriteria.q = $('#term-input').val();
    STORE.searchCriteria.pagesize = '100';
    STORE.displayContent = $('input:radio[name=display-option]:checked').val();
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