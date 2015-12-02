/**
 * Module declaration
 */
var authModule = angular.module("authModule", []);

/**
 * Routes definition for module
 */
authModule.config(function ($routeProvider) {
	$routeProvider
		.otherwise({ redirectTo: "/" });
});
