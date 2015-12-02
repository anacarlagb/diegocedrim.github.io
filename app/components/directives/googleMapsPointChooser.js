/**
 * This diretive renders a open layers map with open street map layer as default one.
 * It worth to mention that always that this directive is used, a ol.Map object
 * is injected at the local scope named olMap
 *
 * In this way, the controller of the page where the open-layers-map directive was
 * inserted gets a ol.Map object to change its behaviour in any way
 */

dengueWebApp.directive('googleMapsPointChooser', function ($timeout) {
    var element = null;
    var link = function (scope, iElement, iAttrs) {
        element = iElement;
        var mapOptions = {
            zoom: 4,
            panControl: true,
            rotateControl: false,
            streetViewControl: false,
            disableDefaultUI: true,
            zoomControl:true
        };
        var map = new google.maps.Map(document.getElementById("map-point-chooser"),mapOptions);
        map.setCenter(new google.maps.LatLng(-13.732375711100312,-50.80131249999999));
        var elementScope = angular.element(element).scope();

        if (iAttrs.insertOnMyScope === "true") {
            elementScope.gMap = map;
        } else {
            elementScope.$parent.gMap = map;
        }

    };

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div id="map-point-chooser"></div>',
        link: link
    };
});
