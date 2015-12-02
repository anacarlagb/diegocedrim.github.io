/**
 * Resource definition
 */
poiModule.factory("User", function($resource, BaseSettings) {
    var url = BaseSettings.ApiBaseURL + "user/:id";
    return $resource(url, { id: "@id" }, {
        update: {
            method: "PUT"
        }
    });
});
