angular.module('social').directive('googlePlus', [
    '$window', function ($window) {
        return {
            restrict: 'A',
            scope: {
                googlePlus: '=?'
            },
            link: function (scope, element, attrs) {
                if (!$window.gapi) {
                    // Load Google SDK if not already loaded
                    $.getScript('//apis.google.com/js/platform.js', function () {
                        renderPlusButton();
                    });
                } else {
                    renderPlusButton();
                }

                var watchAdded = false;
                function renderPlusButton() {
                    var url = attrs.url;
                    element.html('<div class="g-plusone" data-annotation="none" data-href="' + url +  '" data-size="medium"></div>');
                    $window.gapi.plusone.go(element.parent()[0]);
                }
            }
        };
    }
]);