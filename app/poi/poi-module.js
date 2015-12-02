/**
 * Module declaration
 */
var poiModule = angular.module("poiModule", []);

/**
 * Routes definition for module
 */
poiModule.config(function ($routeProvider) {
    $routeProvider
        .when("/poi/new",{
            controller: "PoiNewController",
            templateUrl: "poi/new.html"
        })
        .when('/poi/:id/view/', {
            controller: "PoiViewController",
            templateUrl: "poi/view.html"
        })
        .when('/poi/list/', {
            controller: "PoiListController",
            templateUrl: "poi/list.html"
        });
});
