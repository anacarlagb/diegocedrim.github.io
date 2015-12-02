authModule.service('AuthService', function ($location, $window) {

    var storage = $window.localStorage;

    var self = this;

    var observerCallbacks = [];

    //register an observer
    this.registerObserverCallback = function(callback){
        observerCallbacks.push(callback);
    };

    //call this when you know 'foo' has been changed
    var notifyObservers = function(){
        angular.forEach(observerCallbacks, function(callback){
            if (typeof callback == 'function') {
                callback();
            }
        });
    };

    this.saveToken = function (hashedToken) {
        $window.localStorage["token"] = hashedToken;
    };

    this.getToken = function () {
        return $window.localStorage["token"];
    };

    this.saveUser = function (user) {
        $window.localStorage["user"] = JSON.stringify(user);
        notifyObservers();
    };

    /**
     * Save token and user data getting from a successful Authentication
     * json returne
     * @param data
     */
    this.successfulAuthentication = function(data){
        self.saveToken(data.hashedToken);
        self.saveUser(data.user);
    }

    this.getUser = function () {
        var userString = $window.localStorage["user"];
        try {
            return JSON.parse(userString);
        } catch (e) {
            return null;
        }
    };

    this.clearUserInfo = function () {
        $window.localStorage["token"] = "";
        $window.localStorage["name"] = "";
        $window.localStorage["user"] = "";
        notifyObservers();
    };

    this.hasAuthenticatedUser = function() {
        var token = self.getToken();
        return token && token.length > 0;
    };

});
