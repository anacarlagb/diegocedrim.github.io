/**
 * Module declaration
 */
var userModule = angular.module("userModule", []);

/**
 * Routes definition for module
 */
userModule.config(function ($routeProvider) {
    $routeProvider
        .when("/user/new",{
            controller: "UserNewController",
            templateUrl: "user/new-user.html"
        })
        .when("/user/login",{
            controller: "AuthenticationController",
            templateUrl: "user/user-login.html"
        })
        .when("/user/created",{
            templateUrl: "user/user-created.html"
        });
});
