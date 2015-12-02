dengueWebApp.factory('userFactory', function($q, $http, BaseSettings) {
  return {
    tryUsername: function(username, id) {
    	
    	var deferred = $q.defer();
    	
		$http.get(BaseSettings.ApiBaseURL + "user/find-by-username?username=" + username).
		success(function(data) {
			if (!data) {
				 deferred.resolve();
			} else  {
				var user = data;
				if (id  && user.id === parseInt(id)) {
					deferred.resolve();
				} else {
					deferred.reject();
				}
			}
		});

      return deferred.promise;
    }
  }
});

dengueWebApp.directive('singleUsername', function($q, BaseSettings, $http, userFactory) {
	return {
	    restrict: 'A',
	    require: 'ngModel',
	    link: function(scope, element, attr, ngModelController) {
	      element.on('blur', function() {
	    	ngModelController.$setValidity('uniquePending', false);
	        if (ngModelController.$viewValue != '') {
	          userFactory.tryUsername(ngModelController.$viewValue, attr.userId)
	            .then(
	              function succcess(result) {
	                ngModelController.$setValidity('unique', true);
	                ngModelController.$setValidity('uniquePending', true);
	              },
	              function fail(result) {
	                ngModelController.$setValidity('unique', false);
	                ngModelController.$setValidity('uniquePending', true);
	              }
	            );
	        }
	      });
	    }
	  };
});
