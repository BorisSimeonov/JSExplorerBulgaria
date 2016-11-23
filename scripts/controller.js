function controller() {
    const locationsUl = $('#main-locations'),
        asideMenuUL = $('#main-menu'),
        articleSelector = $('#article-selector'),
        mountainListId = 'mountain-locations-list',
        municipalityListId = 'village-locations-list',
        mountainList = $(`#${mountainListId}`),
        municipalityList = $(`#${municipalityListId}`);

    const model = createModel(),
        view = createView();

    locationsUl.on('click', 'img', handleMenuLocationOptionsDisplay);
    locationsUl.on('click', '.location-item', handleArticleVisualisation);
    asideMenuUL.on('click', '#search-icon, #comment-icon, #locations-icon',
        view.toggleSelectedSection);
    articleSelector.on('change', handleSelectedArticleLoading);


    function handleMenuLocationOptionsDisplay() {
        let targetIDArray = $(this).attr('relatedNodeID');
        targetIDArray = targetIDArray.split(',');
        for (let targetId of targetIDArray) {
            let targetNode = $(`#${targetId}`);
            if (!targetNode.find('li').length) {
                let locationsArray;
                switch (targetId) {
                    case mountainListId:
                        locationsArray = model.requestLocationsFromDB('mountain',
                            mountainList, view.appendLocationToMenu
                        );
                        break;
                    case municipalityListId:
                        locationsArray = model.requestLocationsFromDB('municipality',
                            municipalityList, view.appendLocationToMenu
                        );
                        break;
                }
            }

            targetNode
                .toggle();
        }
    }

    function handleArticleVisualisation(event) {
        let locationId = $(this).attr('location_id');
        view.clearArticles();
        model.requestArticlesFromDB(locationId,
            view.appendArticleTitlesAsOptions);
        event.stopPropagation();
        event.preventDefault();
    }

    function handleSelectedArticleLoading() {
        let selectedArticleId = $(this).find(':selected').val();
        model.requestFullArticleFromDB(selectedArticleId,
        view.drawArticleInDOM);
    }

}
