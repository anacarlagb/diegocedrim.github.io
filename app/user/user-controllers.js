userModule.controller("UserNewController", function ($scope, $location, User) {

    $scope.user = new User();

    $scope.add = function() {
        $scope.user.$save(function (obj) {
            $location.path("user/created");
        });
    };
});

userModule.controller("FacebookLoginController", function ($scope, $location, BaseSettings, $http, AuthService) {

    var createUser = function(accessToken) {
        var url = BaseSettings.ApiBaseURL + "auth/facebook";
        $http.get(url, {
            params: { accessToken: accessToken }
        }).success(function (data, status, headers, config) {
            AuthService.successfulAuthentication(data);
            $location.path(BaseSettings.DefaultLocation);
        });
    };


    $scope.facebookLogin = function() {
        FB.login(function(response){
            // The response object is returned with a status field that lets the
            // app know the current login status of the person.
            // Full docs on the response object can be found in the documentation
            // for FB.getLoginStatus().
            if (response.status === 'connected') {
                createUser(response.authResponse.accessToken);
            }
        }, {scope: 'public_profile,email'});
    };
});


