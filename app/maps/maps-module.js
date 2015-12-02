/**
 * Module declaration
 */
var mapModule = angular.module("mapModule", []);

/**
 * Routes definition for module
 */
mapModule.config(function ($routeProvider) {
	$routeProvider
		.when("/",{
			controller: "MapController",
			templateUrl: "maps/map.html"
		})
		.otherwise({ redirectTo: "/" });
});
