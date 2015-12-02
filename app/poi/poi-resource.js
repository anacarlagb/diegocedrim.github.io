/**
 * Resource definition
 */
poiModule.factory("PointOfInterest", function($resource, BaseSettings) {
    var url = BaseSettings.ApiBaseURL + "poi/:id";
    return $resource(url, { id: "@id" }, {
        update: {
            method: "PUT"
        }
    });
});

poiModule.factory("Comment", function($resource, BaseSettings) {
    var url = BaseSettings.ApiBaseURL + "poi/:poiId/comment";
    return $resource(url, { poiId: "@poiId" }, {
        update: {
            method: "PUT"
        }
    });
});

poiModule.factory("Vote", function($resource, BaseSettings) {
    var url = BaseSettings.ApiBaseURL + "comment/:commentId/vote";
    return $resource(url, { commentId: "@commentId" }, {
        update: {
            method: "PUT"
        }
    });
});

poiModule.factory("PoiVote", function($resource, BaseSettings) {
    var url = BaseSettings.ApiBaseURL + "poi/:poiId/vote";
    return $resource(url, { poiId: "@poiId" }, {
        update: {
            method: "PUT"
        }
    });
});

