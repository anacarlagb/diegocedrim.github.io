var mapModule = angular.module('mapModule');

mapModule.factory('PoiHeatMapLayer', function($http, BaseSettings, $compile, $rootScope, $timeout) {
    var self = this;
    var url = BaseSettings.ApiBaseURL + "poi/geojson?sort=date,desc&size=500";
    self.dataLayer = new google.maps.visualization.HeatmapLayer();
    self.map = null;

    self.initialize = function(map) {
        self.map = map;
        self.loadData();
    };

    self.loadData = function(filters) {
        $http.get(url).then(function(response) {
            var data = [];
            var geojson = response.data;
            for (var i in geojson.features) {
                var feature = geojson.features[i];
                var coordinates = feature.geometry.coordinates;
                var latLnt = new google.maps.LatLng(coordinates[1], coordinates[0]);
                data.push(latLnt);
            }
            self.dataLayer.setData(data);
        });
    };


    return self;
});









