
mapModule.controller("MapController", function($scope, PoiMarkerLayer, PoiHeatMapLayer, TwitterMarkerLayer,
                                               TwitterHeatMapLayer, $location, $translate) {

    $translate(['MENU.LAYER_POI', 'MENU.HEAT_MAP', 'MENU.TWEETS', 'MENU.TWEETS_CONCENTRATION']).then(function (translations) {
        $scope.headline = translations.HEADLINE;
        $scope.paragraph = translations.PARAGRAPH;
        $scope.namespaced_paragraph = translations['NAMESPACE.PARAGRAPH'];

        $scope.layers = [{
            label: translations['MENU.LAYER_POI'],
            dataLayer: PoiMarkerLayer.dataLayer
        },{
            label: translations['MENU.HEAT_MAP'],
            dataLayer: PoiHeatMapLayer.dataLayer
        },{
            label: translations['MENU.TWEETS'],
            dataLayer: TwitterMarkerLayer.dataLayer
        },{
            label: translations['MENU.TWEETS_CONCENTRATION'],
            dataLayer: TwitterHeatMapLayer.dataLayer
        }];
    });



    $scope.$watch('gMap', function(newValue) {
        PoiMarkerLayer.initialize($scope.gMap);
        PoiHeatMapLayer.initialize($scope.gMap);
        TwitterMarkerLayer.initialize($scope.gMap);
        TwitterHeatMapLayer.initialize($scope.gMap);
    });


    $scope.showMap = function() {
        if ($location.url() != "/") {
            $location.url("/");
        }
    };

    $scope.changeVisibility = function(dataLayer) {
        if (dataLayer.getMap() == null) {
            dataLayer.setMap($scope.gMap);
        } else {
            dataLayer.setMap(null);
        }
    };
});