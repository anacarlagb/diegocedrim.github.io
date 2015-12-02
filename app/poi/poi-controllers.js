poiModule.controller("PoiNewController", function (Upload, $scope, PointOfInterest, $location,
                                                   WizardService, GeocodingService, $http,
                                                   BaseSettings, $timeout) {

    $scope.wizard = WizardService;
    $scope.wizard.totalPages = 3;
    $scope.wizard.setPage(1);

    $scope.marker = null;
    $scope.isSaving = false;

    var isMarkerSet = false;

    var createMarker = function() {
        var marker = new google.maps.Marker({
            draggable: true,
            map: $scope.gMap,
            position: $scope.gMap.getCenter(),
            animation: google.maps.Animation.BOUNCE
        });
        $scope.marker = marker;

        google.maps.event.addDomListenerOnce(marker, 'dragstart', function() {
            marker.setAnimation(null);
            isMarkerSet = true;
        });
    };

    $scope.isValidPoi = function() {
        return !$scope.poiForm.$invalid && $scope.hasPictures && isMarkerSet;
    };

    $scope.setMarkerPosition = function(place) {
        $scope.poi.address = place.formatted_address;
        $scope.marker.setPosition(place.geometry.location);
        $scope.gMap.panTo(place.geometry.location);
        $scope.marker.setAnimation(null);
        isMarkerSet = true;
    };

    $scope.$watch('poi.type', function(newValue) {
        if (newValue) {
            $scope.poi.fieldValues = [];
            for (var i in newValue.fields) {
                var field = newValue.fields[i];
                $scope.poi.fieldValues.push({
                    field: {
                        id: field.id
                    },
                    value: ""
                });
            }
        }
    });

    $scope.$watch('gMap', function(newValue) {
        if (newValue) {
            createMarker();
        }
    });

    /**
     * Creates the ol-services service to use to choose the address
     * @type {GeocodingService|*}
     */
    $scope.geocoding = GeocodingService;
    $scope.geocoding.clearFields();
    $scope.geocoding.currentScope = $scope;


    $scope.poi = new PointOfInterest();
    /**
     * Send the point of interest to server
     */
    $scope.add = function () {
        $scope.isSaving = true;
        $scope.poi.type = {
            id: $scope.poi.type.id
        };
        var location = $scope.marker.getPosition();
        $scope.poi.location = {lat: location.lat(), lng: location.lng()};
        $scope.poi.pictures = getPicturesArray();
        $scope.poi.$save(function (obj) {
            var uri = "poi/" + obj.id + "/view";
            $location.path(uri);
        });
    };

    /**
     * Load the point of interest types
     */
    $http.get(BaseSettings.ApiBaseURL + "poi-type").success(function (data, status, headers, config) {
        $scope.poiTypes = data;
        $scope.poi.type = $scope.poiTypes[0];
    });


    /**
     * Handle the upload of a given files list
     * @param files array of files to be uploaded
     */
    $scope.hasPictures = false;
    $scope.files = [];
    $scope.picturesByFile = {};
    $scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: BaseSettings.ApiBaseURL + "picture/upload",
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    evt.config.file.progress = progressPercentage;
                }).success(function (data, status, headers, config) {
                    config.file.progress = 100;
                    $scope.picturesByFile[config.file.$$hashKey] = data;
                    $scope.hasPictures = true;
                }).error(function (data, status, headers, config) {
                    config.file.errorOnUpload = true;
                });
            }
        }
    };

    $scope.filesSelected = function (files) {
        $scope.files = $scope.files.concat(files);
        $scope.upload(files);
    };

    var findFileByHashId = function (hashId) {
        for (var i in $scope.files) {
            if ($scope.files[i].$$hashKey === hashId) {
                return i;
            }
        }
        return -1;
    };

    var getPicturesArray = function() {
        var docArray = [];
        for (var key in $scope.picturesByFile) {
            docArray.push($scope.picturesByFile[key]);
        }
        return docArray;
    };

    $scope.deleteFile = function(fileHashId) {
        var fileIndex = findFileByHashId(fileHashId);
        $scope.files.splice(fileIndex, 1);
    };

    $scope.deletePictureByFileHashId = function (fileHashId) {
        var doc = $scope.picturesByFile[fileHashId];
        $http.delete(BaseSettings.ApiBaseURL + "picture/" + doc.id)
            .success(function (data, status, headers, config) {
                var fileIndex = findFileByHashId(fileHashId);
                $scope.files.splice(fileIndex, 1);
                $scope.hasPictures = $scope.files.length > 0;
                delete $scope.picturesByFile[fileHashId];
            });
    };

    $scope.hasError = function(name) {
        if (!$scope.poiForm[name].$dirty) {
            return false;
        }
        for (var key in $scope.poiForm[name].$error) {
            if ($scope.poiForm[name].$error[key]) {
                return true;
            }
        }
        return false;
    };



});

poiModule.controller('PoiViewController', function ($scope, BaseSettings, $http, $routeParams, PoiVote, AuthService) {
    var url = BaseSettings.ApiBaseURL + "poi/";

    $scope.hasAuthenticatedUser = function() {
        return AuthService.hasAuthenticatedUser();
    };

    $scope.sendVote = function(isUp, poi) {
        $scope.vote = new PoiVote();
        $scope.vote.up = isUp;
        $scope.vote.poiId = poi.id;
        $scope.vote.$save(function (obj) {
            poi.upVoteCount = obj.poi.upVoteCount;
            poi.downVoteCount = obj.poi.downVoteCount;

            var currentVote = poi.userVote;
            if (currentVote && currentVote.up == isUp) {
                poi.userVote = null;
            } else {
                poi.userVote = obj;
            }
        });
    };

    var buildGalleryItems = function(pictures) {
        var items = [];
        for (var i in pictures) {
            var doc = pictures[i];
            items.push( {
                src: $scope.getPicUrl(doc),
                w: doc.width,
                h: doc.height
            });
        }
        return items;
    };

    $scope.$watch('gMap', function(newValue) {
        if (!newValue) {
            return;
        }
        loadData();
    });

    var loadData = function() {
        $http.get(url + $routeParams.id).success(function(response){
            $scope.poi = response;

            /**
             * Prepare gallery
             */
            $scope.items = buildGalleryItems($scope.poi.pictures);
            createMarkerAt($scope.poi.location);
        });
    };

    var createMarkerAt = function(location) {
        var markerLocation = new google.maps.LatLng(location.lat, location.lng);
        new google.maps.Marker({
            map: $scope.gMap,
            position: markerLocation,
            title: "Local da denúncia"
        });
        $scope.gMap.setCenter(markerLocation);
        $scope.gMap.setZoom(12);
    };

    $scope.getPicUrl = function(picture) {
        return BaseSettings.ApiBaseURL + "picture/" + picture.id + "/download";
    };

    $scope.getThumbUrl = function(picture, width) {
        return BaseSettings.ApiBaseURL + "picture/" + picture.id + "/thumb/" + width;
    };


    $scope.getPoiShareUrl = function(sharedPoi) {
        if (sharedPoi) {
            var url = BaseSettings.BaseShareURL + "poi/" + sharedPoi.id +  "/view/";
            return url;
        }
    };

    $scope.startGallery = function(startIndex) {
        var pswpElement = $('.pswp')[0];

        var options = {
            history: false,
            index: startIndex
        };

        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, $scope.items, options);
        gallery.init();
    };
});


poiModule.controller('PoiListController',function ($scope, $timeout, ngTableParams, PointOfInterest) {
    $scope.totalElements = null;
    $scope.tableParams = new ngTableParams({
        count: 10,
        sorting: {
            date: "desc"
        }
    }, {
        total: 0,
        getData: function($defer, params) {
            PointOfInterest.get(params.url(), function(data) {
                $timeout(function() {
                    $scope.totalElements = data.page.totalElements;
                    params.total(data.page.totalElements);
                    $defer.resolve(data.content);
                }, 500);
            });
        }
    });
});

poiModule.controller('PoiCommentController', function ($scope, BaseSettings, $http, $routeParams, Comment, Vote, AuthService) {
    var url = BaseSettings.ApiBaseURL + "poi/";

    AuthService.registerObserverCallback(loadComments);

    $scope.hasAuthenticatedUser = function() {
        return AuthService.hasAuthenticatedUser();
    };

    $scope.poiId = $routeParams.id;
    var loadComments = function() {
        $http.get(BaseSettings.ApiBaseURL + "poi/" + $scope.poiId + "/comment?sort=date,desc").success(function(response){
            $scope.comments = response.content;
        });
    };


    $scope.comment = new Comment();
    $scope.sendComment = function() {
        var text = $scope.comment.text;
        $scope.comment = new Comment();
        $scope.comment.text = text;
        $scope.comment.poiId = $scope.poiId;
        $scope.comment.$save(function (obj) {
            loadComments();
            $scope.comment = new Comment();
        });
    };

    $scope.sendVote = function(isUp, comment) {

        $scope.vote = new Vote();
        $scope.vote.up = isUp;
        $scope.vote.commentId = comment.id;
        $scope.vote.$save(function (obj) {
            comment.upVoteCount = obj.comment.upVoteCount;
            comment.downVoteCount = obj.comment.downVoteCount;

            var currentVote = comment.userVote;
            if (currentVote && currentVote.up == isUp) {
                comment.userVote = null;
            } else {
                comment.userVote = obj;
            }
        });
    };

    loadComments();
});