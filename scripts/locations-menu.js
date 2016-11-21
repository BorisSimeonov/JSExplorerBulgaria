function loadLocations() {
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_HJiZXC6bx',
        mountainsUrl = baseUrl + '/locations',
        municipalityUrl = baseUrl + '/municipality',
        articlesUrl = baseUrl + '/articles',
        username = 'test',
        password = 'test',
        base64auth = btoa(`${username}:${password}`),
        authHeaders = {"Authorization": "Basic " + base64auth},
        mainList = $('#main-locations'),
        mountainLocationsListId = 'mountain-locations-list',
        mountainList = $(`#${mountainLocationsListId}`),
        municipalityLocationsListId = 'village-locations-list',
        municipalityList = $(`#${municipalityLocationsListId}`),
        articleHolder = $('#article-holder'),
        locationSelectDropDown = $('#article-selector'),
        trailImagesCropSize = 40;


    mainList.on('click', '.location-item', listArticlesOptions);
    mainList.on('click', 'img', toggleDOMElements);
    locationSelectDropDown.on('change', loadArticle);

    function requestLocations(tableUrl, destinationList) {
        $.get({
            url: tableUrl,
            headers: authHeaders
        })
            .then((locationArray) =>
                appendLocationItem.call(this, locationArray, destinationList))
            .catch(handleError)
    }

    function appendLocationItem(locationsArray, destination) {
        locationsArray.forEach(location => {
            if (checkIfLocationExists(location._id, destination)) {
                let newLocation = $('<li>')
                    .append($('<a>')
                        .attr('href', '#')
                        .addClass('location-item')
                        .text(location.locationName)
                        .attr('location_id', location._id));
                destination.append(newLocation);
            }
        })
    }

    function checkIfLocationExists(id, target) {
        let idCount = target
            .children(`li:has(a[location_id="${id}"])`).length;
        return idCount ? false : true;
    }

    function handleError(error) {
        console.log(`Error: ${error.status} (${error.statusText})`);
    }

    function listArticlesOptions(event) {
        articleHolder.empty();
        let location_id = $(this).attr('location_id');
        $.get({
            url: articlesUrl + `?query={"location_id":"${location_id}"}`,
            headers: authHeaders
        })
            .then(appendArticleTitlesAsOptions)
            .catch(handleError);
        event.stopPropagation();
        event.preventDefault();
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
                .attr('alt', 'No Image'))
            .append($('<p>')
                .addClass('article-description')
                .text(article.description))
            .append($('<p>')
                .addClass('article-main-text')
                .text(article.text));

        let imageLocations = article.trailing_images
            .split(',')
            .filter(linkString => linkString);
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
        if (imageWrapper.width() === trailImagesCropSize) {
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

    function toggleDOMElements() {
        let targetIDArray = $(this).attr('relatedNodeID');
        targetIDArray = targetIDArray.split(',');

        for (let targetId of targetIDArray) {
            let targetNode = $(`#${targetId}`);
            if (!targetNode.find('li').length) {
                switch (targetId) {
                    case mountainLocationsListId:
                        requestLocations(mountainsUrl, mountainList);
                        break;
                    case municipalityLocationsListId:
                        requestLocations(municipalityUrl, municipalityList);
                        break;
                }
            }

            targetNode
                .toggle();
        }
    }
}
