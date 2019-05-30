/*stores booleans used in determining which view to render*/
const RENDER = {
    startPage: true,
    resultsPage: false,
    noResultsPage: false
}

/*checks values in RENDER to determine which view to render*/
function render() {
    if (RENDER.startPage) {
        renderStartPage();
    } else if (RENDER.resultsPage) {
        renderResultsPage();
    } else if (RENDER.noResultsPage) {
        renderNoResultsPage();
    }
}

/*renders home page*/
function renderStartPage() {
    $("body").html(STORE.startPage);
}

/*renders search results page*/
function renderResultsPage() {
    $("body").html(STORE.resultsPage);
}

/*renders message to indicated no results were returned from the search*/
function renderNoResultsPage() {
    $("body").html(STORE.noResultsPage);
}

/*calls functions that add event listners*/
function addEventListeners() {
    handleFormSubmission();
    handleNewSearchButtonClick();
    handleArticleLinkExpansion();
}


/*listens for submission of search form*/
function handleFormSubmission() {
    $("body").on("submit", "#newsSearchForm", e => {
        e.preventDefault();
        /*get and store values input in search form*/
        updateSearchValues();
        /*pass input values to a function that formarts them as pararemeters for fetch request*/
        const params = formatQueryParams(STORE.searchCriteria);
        /*passing formated parameters to function that calls the News API*/
        getNewsData(params);

        /*set render result page to true and other views to false in order to display results*/
        RENDER.startPage = false;
        RENDER.noResultsPage = false;
        RENDER.resultsPage = true;
        render();
    })
}

function handleNewSearchButtonClick() {
    $("body").on("click", ".new-search-btn", e => {
        RENDER.startPage = true;
        RENDER.resultsPage = false;
        RENDER.noResultsPage = false;
        render();
    })
}

function handleArticleLinkExpansion() {
    $("body").on("click", ".result-container", e => {
        $(e.currentTarget).children(':nth-child(2)').toggleClass("hidden");
    })
};


function getNewsData(params) {
    const url = 'https://newsapi.org/v2/everything?' + params
    fetch(url)
        .then(response => response.json())
        .then(response => {
            STORE.newsData = response;
            const transformedNewsArticles = transformNewsArticles(response.articles);
            postSentimentRequest(transformedNewsArticles);
        })

}

function formatSourceName(object) {

    const returnObj = object.documents.map(document => {
        return {
            id: `${document.id.replace(/[0-9]/g,"")}`,
            score: `${document.score}`
        }
    })

    return returnObj;
}

function postSentimentRequest(documents) {
    fetch("https://eastus.api.cognitive.microsoft.com/text/analytics/v2.1/sentiment", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Ocp-Apim-Subscription-Key": "5dd656b1577549979181960076a3ff8b"
            },
            body: `${documents}`
        })
        .then(response => response.json())
        .then(response => {
            const sentScoreSourcesArr = formatSourceName(response);
            const newsSources = getFrequency(sentScoreSourcesArr);
            const sourcesFinal = getAverageScore(newsSources);
            appendResults(sourcesFinal);

        });
}

function getAverageScore(newsSources) {
    newsSources.forEach(source => {
        source.averageScore = ((source.score / source.frequency) * 100).toFixed();
    })
    return newsSources;
}

function getFrequency(arr) {
    freqObj = {}
    arr.forEach(item => {
        if (Object.keys(freqObj).some(property => property === item.id)) {
            freqObj[item.id] = {
                'source': item.id,
                'score': parseFloat(item.score) + parseFloat(freqObj[item.id].score),
                'frequency': freqObj[item.id].frequency += 1
            }
        } else {
            freqObj[item.id] = {
                'source': item.id,
                'score': parseFloat(item.score),
                'frequency': 1
            }
        }
    })

    const freqArr = Object.keys(freqObj).map(key => {
        return freqObj[key];
    });

    return freqArr;
}

function transformNewsArticles(articles) {

    articlesObject = {
        documents: []
    };
    articles.forEach((article, index) => {

        articlesObject.documents.push({
            language: "en",
            id: `${article.source.name + index.toString()}`,
            text: `${STORE.displayContent === "headline" ? article.title : article.content}`
        })
    })
    return JSON.stringify(articlesObject);
}

function getArticlesForDisplay(source) {
    const articlesForLinks = STORE.newsData.articles.filter(article => {
        return article.source.name === source.source;
    });
    return articlesForLinks.map(article => {
        return `
            <p><a href="${article.url}" target="_blank">${article.title}</a></p>
        `
    }).join("");

}

function appendResults(sources) {
    sources.forEach(source => {

        let colorClass = "";
        if (source.averageScore <= 33) {
            colorClass = "red";
        } else if (source.averageScore <= 66) {
            colorClass = "yellow";
        } else {
            colorClass = "green";
        }

        $('.results-containers').append(`<div class="result-container">
        <div class="result">
            <div>
                <p class="news-source">${source.source}</p>
                <p class="article-count">${source.frequency}</p>
            </div>
            <div class="sent-circle">
                <p class="sentiment-score ${colorClass}">${source.averageScore}</p>
            </div>
        </div>
            <div class="article-links hidden">
                ${getArticlesForDisplay(source)}
            </div>
        </div>
        `)
    })
};


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


$(function () {
    addEventListeners();
    render();
})