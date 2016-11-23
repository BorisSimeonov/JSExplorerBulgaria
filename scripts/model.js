function createModel() {
    //Backend hyperlink constants
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_HJiZXC6bx',
        mountainsUrl = baseUrl + '/locations',
        municipalityUrl = baseUrl + '/municipality',
        articlesUrl = baseUrl + '/articles',
        baseImageUrl = 'https://baas.kinvey.com/blob/kid_HJiZXC6bx?query=';
    //User credentials constants
    const username = 'guest',
        password = 'guest',
        authHeaders = {"Authorization": "Basic " + btoa(`${username}:${password}`)};

    function requestLocationsFromDB(tableName, destination, viewFunctionReference) {
        let tableUrl = parseTableNameToURL(tableName);
        $.get({
            url: tableUrl,
            headers: authHeaders
        })
            .then((foundLocationsArr) => {
                viewFunctionReference(
                    foundLocationsArr,
                    destination);
            })
            .catch(handleError);
    }

    function parseTableNameToURL(tableName) {
        switch (tableName) {
            case 'mountain':
                return mountainsUrl;
                break;
            case 'municipality':
                return municipalityUrl;
                break;
            default:
                throw new TypeError('Model/RequestLocations: Unknown tableName ' + tableName);
        }
    }

    function requestArticlesFromDB(locationId, listArticlesTitlesFunction) {
        $.get({
            url: articlesUrl + `?query={"location_id":"${locationId}"}`,
            headers: authHeaders
        })
            .then((articlesArray) => {
                listArticlesTitlesFunction(articlesArray);
            })
            .catch(handleError);
    }

    function requestFullArticleFromDB(selectedArticleId, articleDrawerFunction) {
        let loadArticleData = $.get({
                url: articlesUrl + `?query={"_id":"${selectedArticleId}"}`,
                headers: authHeaders
            }),
            loadArticleLeadImage = $.get({
                url: baseImageUrl + `{"article_id": "${selectedArticleId}", "type":"lead"}`,
                headers: authHeaders
            }),
            loadArticleTrailImages = $.get({
                url: baseImageUrl + `{"article_id": "${selectedArticleId}", "type":"trail"}`,
                headers: authHeaders
            });

        Promise.all([loadArticleData,
            loadArticleLeadImage, loadArticleTrailImages])
            .then(articleDrawerFunction)
            .catch(handleError);
    }


    function handleError(error) {
        console.log(`Model Error: ${error.status} (${error.statusText})`);
    }


    return {
        requestLocationsFromDB,
        requestArticlesFromDB,
        requestFullArticleFromDB
    }
}
