/**
 * This diretive renders a open layers map with open street map layer as default one.
 * It worth to mention that always that this directive is used, a ol.Map object
 * is injected at the local scope named olMap
 *
 * In this way, the controller of the page where the open-layers-map directive was
 * inserted gets a ol.Map object to change its behaviour in any way
 */

dengueWebApp.directive('googleMaps', function ($translate) {
    var map = null;
    var element = null;
    var updateMapBounds = function() {
        var newHeight = $(window).height() - $("#top-nav").height() - 1;
        $("#map").height(newHeight);
        google.maps.event.trigger(map, 'resize');
    };

    var createLegend = function(map) {
        $translate(['MAPS.SICKNESS', 'MAPS.FOCUS', 'MAPS.INFORMATION', 'MAPS.JOKE']).then(function (translations) {
            var styleIcon = [
                {icon:"img/markers-google/red-dot.png", name:translations['MAPS.SICKNESS']},
                {icon:"img/markers-google/yellow-dot.png", name:translations['MAPS.FOCUS']},
                {icon:"img/markers-google/green-dot.png", name:translations['MAPS.INFORMATION']},
                {icon:"img/markers-google/purple-dot.png", name:translations['MAPS.JOKE']}
            ];
            var legend = document.createElement('div');
            legend.className = 'maps-legend';
            for (var i in styleIcon) {
                var style = styleIcon[i];

                var div = document.createElement('div');
                if (i < styleIcon.length - 1) {
                    div.className = "legend-entry";
                }
                div.innerHTML = '<img width="20px" src="' + style.icon + '"> ' + style.name;
                legend.appendChild(div);
            }
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
        });
    };

    var initializeGoogleMaps = function() {
        var mapOptions = {
            zoom: 4,
            panControl: true,
            rotateControl: false,
            streetViewControl: false,
            disableDefaultUI: true,
            zoomControl:true
        };
        map = new google.maps.Map(document.getElementById('map'),mapOptions);
        updateMapBounds();
        createLegend(map);

        //listen for possible resizes in order to update maps canvas size
        $(window).resize(updateMapBounds);
        $("#menuToggle").click(updateMapBounds);
        $("#sizeToggle").click(updateMapBounds);
        map.setCenter(new google.maps.LatLng(-13.732375711100312,-50.80131249999999));
        var elementScope = angular.element(element).scope();
        elementScope.$parent.gMap = map;
    };

    var link = function (scope, iElement, iAttrs) {
        element = iElement;
        scope.$on('$viewContentLoaded', initializeGoogleMaps);
    };

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div id="map" ng-transclude></div>',
        link: link
    };
});
