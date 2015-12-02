var mapModule = angular.module('mapModule');

mapModule.factory('TwitterMarkerLayer', function($http, BaseSettings, $compile, $rootScope, $timeout) {
    var self = this;
    var url = BaseSettings.ApiBaseURL + "tweet/geojson?sort=createdAt,desc&size=500";
    self.dataLayer = new google.maps.Data();
    self.map = null;

    self.initialize = function(map) {
        self.map = map;
        self.loadMarkers();
    };

    self.loadMarkers = function(filters) {
        self.dataLayer.loadGeoJson(url);
    };

    var openInfoWindow = function(response) {
        var element = $("#infoboxContent");
        element.html(response.data);
        $compile(element.contents())($rootScope);

        /**
         * Wait until the current digest cycle finish
         */
        $timeout(function() {
            var info = new google.maps.InfoWindow({
                pixelOffset: new google.maps.Size(0, -24)
            });
            console.log($rootScope.tweet);
            info.setPosition(new google.maps.LatLng($rootScope.tweet.geolocation.lat, $rootScope.tweet.geolocation.lng));
            info.setContent($("#infoboxContent").html());
            info.open(self.map);
        });
    };

    var handleMarkerClick = function(event) {
        var feature = event.feature;
        /**
         * Exports this feature as geogson in order to get access
         * to whole properties object
         */
        feature.toGeoJson(function(geojson){
            var tweet = geojson.properties;
            $rootScope.tweet = tweet;

            /**
             * Renders the info window content
             */
            $http.get("components/partials/tweet-popup-content.html").then(openInfoWindow);
        });
    };

    /**
     * It maps a PoiType id to a icon style
     * @type {{1, 2}}
     */
    var styleIconMap = {
        1: "img/markers-google/green-dot.png",
        2: "img/markers-google/purple-dot.png",
        3: "img/markers-google/yellow-dot.png",
        4: "img/markers-google/red-dot.png",
    };

    /**
     * Returns a style object based on a specific feature property
     */
    self.dataLayer.setStyle(function(feature) {
        return {
            icon: styleIconMap[feature.getProperty("classification").id]
        };
    });

    /**
     * Listen clicks on features of this layer.
     */
    self.dataLayer.addListener('click', handleMarkerClick);

    return self;
});









