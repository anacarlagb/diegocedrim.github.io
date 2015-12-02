/**
 * This diretive renders a open layers map with open street map layer as default one.
 * It worth to mention that always that this directive is used, a ol.Map object
 * is injected at the local scope named olMap
 *
 * In this way, the controller of the page where the open-layers-map directive was
 * inserted gets a ol.Map object to change its behaviour in any way
 */
dengueWebApp.directive('photoSwipeCanvas', function () {

    return {
        restrict: 'E',
        templateUrl: "components/partials/photoSwipeCanvas.html"
    };
});
