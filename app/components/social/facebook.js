/**
 * Share a link using FB.api. Can be used in any button!
 */
angular.module('social').directive('fbShare', [
    '$window', '$rootScope', function ($window, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function() {
                    FB.ui({
                        method: 'share',
                        href: attrs.link
                    });
                });
            }
        };
    }
]);