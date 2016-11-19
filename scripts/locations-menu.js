function loadLocations() {
    const locationsUrl = 'https://baas.kinvey.com/appdata/kid_HJiZXC6bx/locations',
        articlesUrl = 'https://baas.kinvey.com/appdata/kid_HJiZXC6bx/articles',
        username = 'test',
        password = 'test',
        base64auth = btoa(`${username}:${password}`),
        authHeaders = {"Authorization": "Basic " + base64auth},
        locationsList = $('#locations-list'),
        articleContainer = $('#article-content'),
        selectContainer = $('#select-container');

    locationsList.on('click', '.location-item', displayArticles);

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

    function displayArticles() {
        articleContainer.empty();
        selectContainer.empty();
        let location_id = $(this).attr('location_id');

        $.get({
            url: articlesUrl + `?query={"location_id":"${location_id}"}`,
            headers: authHeaders
        })
            .then(appendArticleTitlesAsOptions)
            .catch(handleError);
    }

    function appendArticleTitlesAsOptions(articles) {
        let select = $('<select>')
            .attr('id', 'article-selector');
        select.append($('<option>')
            .val('#')
            .text('No selection')
            .attr('selected', 'true')
            .attr('disabled', 'disabled'));

        for(let article of articles) {
            select.append($('<option>')
                .val(article._id)
                .text(article.title)
            );
        }
        select.select(() => console.log('selected/changed'));
        selectContainer.append(select);
    }

    requestLocations();
}
