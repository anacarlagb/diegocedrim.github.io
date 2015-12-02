dengueWebApp.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                    $("#" + attrs.id).attr("src", attrs.errSrc);
                }
            });
        }
    }
});