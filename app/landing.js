/**
 * Created by diego on 01/12/15.
 */

var landingApp = angular.module("landingApp", [
    "pascalprecht.translate"
]);

landingApp.config(['$translateProvider', function ($translateProvider) {

    var getBrowserLanguage = function() {
        var userLang = navigator.language || navigator.userLanguage;
        var index = userLang.indexOf("-");
        if (index != -1) {
            userLang = userLang.substr(0, index);
        }
        return userLang;
    };

    var supportedLanguages = ["en",  "pt"];
    var userLanguage = getBrowserLanguage();
    if (supportedLanguages.indexOf(userLanguage) == -1) {
        userLanguage = "en";
    }

    // add translation table
    $translateProvider
        .translations('en', enTranslations)
        .translations('pt', ptTranslations)
        .preferredLanguage(userLanguage);
    $translateProvider.useSanitizeValueStrategy('escape');
}]);