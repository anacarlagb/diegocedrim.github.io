/**
 * Controller responsible for authentication
 */
authModule.controller("AuthenticationController", function ($scope, $http, AuthService, BaseSettings, $location, $translate) {

    var updateUserInfo = function() {
        $scope.user = AuthService.getUser();
    };

    $scope.user = AuthService.getUser();
    AuthService.registerObserverCallback(updateUserInfo);

    var getRoles = function () {
        var roles = [];
        for (var i = 0; i < $scope.user.roles.length; i++) {
            roles.push($scope.user.roles[i].authority);
        }
        return roles;
    };

    var getResources = function () {
        var resources = [];
        for (var i = 0; i < $scope.user.resources.length; i++) {
            resources.push($scope.user.resources[i].uri);
        }
        return resources;
    };

    $scope.hasResource = function (resource) {
        var resources = getResources();
        return resources.indexOf(resource) != -1;
    };

    $scope.isRoot = function () {
        for (var i = 0; i < $scope.user.roles.length; i++) {
            if ($scope.user.roles[i].authority == "ROOT") {
                return true;
            }
        }
        return false;
    };

    $scope.hasConnectedUser = function() {
        return AuthService.getUser() != null;
    };

    var successfulLogin = function(data, status, headers, config) {
        AuthService.successfulAuthentication(data);
        $location.path(BaseSettings.DefaultLocation);
    };

    var errorOnLogin = function(data, status, headers, config) {
        $translate(['AUTH.WRONG_CREDENTIALS', 'AUTH.UNEXPECTED_PROBLEM']).then(function (translations) {
            if (status == 401) {
                $scope.loginError = translations['AUTH.WRONG_CREDENTIALS'];
            } else {
                $scope.loginError = translations['AUTH.UNEXPECTED_PROBLEM'];
            }
        });

    };


    $scope.login = function() {
        $scope.loginError = null;
        var username = $scope.username;
        var password = $scope.password;
        var credentials = btoa(username + ":" + password);
        $http({
            method: 'GET',
            url: BaseSettings.AuthBaseURL + 'auth',
            headers: {'Authorization': 'Basic ' + credentials},
        }).success(successfulLogin).
            error(errorOnLogin);
    };

    $scope.logout = function () {
        $scope.loginError = null;
        $http({
            method: 'DELETE',
            url: BaseSettings.AuthBaseURL + 'token'
        }).
        success(function (data, status, headers, config) {
            AuthService.clearUserInfo();
        });
    };
});
