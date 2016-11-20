function loadLocations() {
    const locationsUrl = 'https://baas.kinvey.com/appdata/kid_HJiZXC6bx/locations',
        articlesUrl = 'https://baas.kinvey.com/appdata/kid_HJiZXC6bx/articles',
        username = 'test',
        password = 'test',
        base64auth = btoa(`${username}:${password}`),
        authHeaders = {"Authorization": "Basic " + base64auth},
        locationsList = $('#locations-list'),
        articleHolder = $('#article-holder'),
        locationSelectDropDown = $('#article-selector'),
        trailImagesCropSize = 40;

    locationsList.on('click', '.location-item', listArticlesOptions);
    locationSelectDropDown.on('change', loadArticle);

    function requestLocations() {
        $.get({
            url: locationsUrl,
            headers: authHeaders
        })
            .then(appendLocations)
            .catch(handleError)
    }

    function appendLocations(locationsArray) {
        locationsArray.forEach(location => {
            let newLocation = $('<li>')
                .append($('<a>')
                    .attr('href', '#')
                    .addClass('location-item')
                    .text(location.locationName)
                    .attr('location_id', location._id));
            locationsList.append(newLocation);
        })
    }

    function handleError(error) {
        console.log(`Error: ${error.status} (${error.statusText})`);
    }

    function listArticlesOptions() {
        articleHolder.empty();
        let location_id = $(this).attr('location_id');

        $.get({
            url: articlesUrl + `?query={"location_id":"${location_id}"}`,
            headers: authHeaders
        })
            .then(appendArticleTitlesAsOptions)
            .catch(handleError);
    }

    function appendArticleTitlesAsOptions(articles) {
        locationSelectDropDown.empty();
        let defaultOption = $('<option>')
            .val('#')
            .attr('selected', 'true')
            .attr('disabled', 'disabled'),
            len = articles.length;

        if (len) {
            defaultOption.text(`Select article: ${len} results`);
        } else {
            defaultOption.text('No Articles Found');
        }

        locationSelectDropDown.append(defaultOption);

        for (let article of articles) {
            locationSelectDropDown.append($('<option>')
                .val(article._id)
                .text(article.title)
            );
        }
    }

    function loadArticle() {
        let selectedArticleId = $(this).find(':selected').val();

        $.get({
            url: articlesUrl + `?query={"_id":"${selectedArticleId}"}`,
            headers: authHeaders
        })
            .then(drawArticle)
            .catch(handleError);
    }

    function drawArticle(article) {
        articleHolder.empty();
        article = article[0];
        let articleHTML = $('<article>')
            .attr('article_id', String(article._id));
        articleHTML
            .append($('<h1>')
                .addClass('article-header')
                .text(article.title))
            .append($('<img>')
                    .addClass('lead-image')
                    .attr('src', article.leading_image_url)
                .attr('alt','No Image'))
            .append($('<p>')
                .addClass('article-description')
                .text(article.description))
            .append($('<p>')
                .addClass('article-main-text')
                .text(article.text));

        let imageLocations = article.trailing_images.split(',');
        imageLocations.forEach((img_link) => {
            articleHTML.append($('<div class="image-wrapper">').append($('<img>')
                .addClass('trail-image')
                .attr('src', img_link)
                .attr('alt', 'No Image'))
                .on('click', imageResizeOnClick));
        });

        articleHolder.append(articleHTML);
    }

    function imageResizeOnClick() {
        let imageWrapper = $(this);
        if(imageWrapper.width() === trailImagesCropSize) {
            imageWrapper
                .css('width', '90%')
                .css('height', 'auto')
                .css('margin-left', 'auto')
                .css('margin-right', 'auto')
                .css('display', 'inherit');
        } else {
            imageWrapper
                .css('width', '40px')
                .css('height', '40px')
                .css('margin-left', '10px')
                .css('margin-right', '10px')
                .css('display', 'inline-table');
        }


    }

    requestLocations();
}
