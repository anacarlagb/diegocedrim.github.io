angular.module('social').directive('tweet', [
    '$window', '$location',
    function ($window, $location) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('click', function(e) {
                    e.preventDefault();
                    var width  = 575,
                        height = 400,
                        left   = ($(window).width()  - width)  / 2,
                        top    = ($(window).height() - height) / 2,
                        url    = attrs.link,
                        opts   = 'status=1' +
                            ',width='  + width  +
                            ',height=' + height +
                            ',top='    + top    +
                            ',left='   + left;

                    window.open(url, 'twitter', opts);
                });

            }
        };
    }
])