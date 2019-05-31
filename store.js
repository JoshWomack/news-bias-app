const STORE = {
    startPage: `
    <div class="container-startpage">
        <header role="header">
            <h1>Slanted<br>Headlines</h1>
            <p>
            Ever wonder if a news source's headlines or content express a positive or negative sentiment for a given topic? Input a search term to find out.
            </p>
            <p>
            Using headlines and content returned from News API and text analysis performed by Microsoft's sentiment analysis API, Slanted Headlines displays the average topic specific sentiment score of each news source.
            </p>
            <p>
            Ranging from 1 to 100, a low score is negative, a high score is positive, and 50 is neutral.
            </p>
            <p>
            Sentiment is defined as a thought, view, or attitude that is based on emotion. Sentiment analysis is the process of determining whether a piece of writing expresses a positive, negative or neutral sentiment.
            </p>

        </header> 
        <main role="main">
            <section class="form-section" role="region">
                <form id="newsSearchForm">
                    <h2>Search For News</h2>
                    <ul class="flex-outer">
                        <li>
                            <label for="term-input">Search Term:</label>
                            <input type="text" name="term-input" id="term-input" placeholder="Search Term" required>
                        </li>
                        <li>
                            <ul class="flex-inner">
                                <p>Return Sentiment For:</p>
                                <li>
                                    <label for="headline" class="radio">
                                    <input type="radio" name="display-option" id="headline" 
                                    checked
                                    value="headline" class="hidden" required><span class="label"></span>
                                    Article Headline</label>
                                </li>
                                <li>
                                    <label for="content" class="radio">
                                    <input type="radio" name="display-option" id="content" value="content" class="hidden" required><span class="label"></span>Article Content</label>
                                </li>

                                
                            </ul>
                        </li>
                    </ul>
                    <button type="submit">Search News</button>
                </form>
            </section> 
            </main>
        </div>`,
    resultsPage: `
        <main>
        <section>
            <div class="results-top-return">
                <div class="top-bar">
                <h3>Slanted Headlines</h3>
                <button class="new-search-btn">New Search</button>
                </div>
            </div>
        </section>
        <section>
            <div class="results-containers">
                
            </div>
        </section>
    </main>`,
    noResultsPage: `
    <div class="no-results">
    <p>No Search Results Found</p>
    <button class="new-search-btn">New Search</button>
</div>`,
    searchCriteria: {
        apiKey: 'e5709737585b4dde9087c53a6f445c8a',
    },
    displayContent: ''
}

// <div class="headlines-dropdown">
//                         <a href="#">GOP rep: Dissemination of doctored Pelosi videos "concerning"</a>
//                         <a href="#">Tornado in Oklahoma kills at least two, damages property</a>
//                         <a href="#">GOP Senator Splits With Trump On North Korea: 'Those Strikes Are Disturbing'</a>
//                         <a href="#">One thing the Cannes Film Festival jury got right: Bong Joon-ho's 'Parasite'
//                             victory</a>
//                     </div>