var olModule = angular.module('olModule', []);

olModule.factory('GeocodingService', function($http) {
    return new GeocodingService($http);
});

function GeocodingService($http) {
    var self = this;

    var geocoder = new google.maps.Geocoder();

    /**
     * Places found by a geocoding query
     * @type {null}
     */
    this.placesFound = [];

    /**
     * Flag indicating whether the last geocoding query got results or not
     * @type {boolean}
     */
    this.noResults = false;

    this.errorMessage = null;

    this.currentScope = null;


    this.performQuery = function(place, callback) {
        self.noResults = false;
        self.errorMessage = null;
        geocoder.geocode( { 'address': place}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                self.placesFound = results;
            } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
                self.noResults = true;
            } else {
                self.placesFound = [];
                self.errorMessage = status;
            }
            self.currentScope.$apply();
        });
    };


    this.clearFields = function() {
        self.placesFound = [];
        self.key = null;
        self.noResults = false;
        self.currentScope = null;
        self.reverseGeocoded = null;
    };
}